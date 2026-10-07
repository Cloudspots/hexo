/**
 * hexo edit <博客 ID>
 *
 * 用 Sublime Text 打开 source/_posts/<ID>.md，同时把 frontmatter 里的
 * `updated` 字段更新成当前时间（字段不存在就补上，位置紧随 date）。
 *
 * 用法：
 *   hexo edit AtCoder-ABC209E-sol            打开并更新 updated
 *   hexo edit AtCoder-ABC209E-sol.md         同上（.md 可省）
 *   hexo edit AtCoder-ABC209E-sol --no-open  只更新 updated，不开编辑器
 *   hexo edit AtCoder-ABC209E-sol --dry-run  只打印将要做的改动
 *   hexo edit AtCoder-ABC209E-sol --editor code
 *
 * 编辑器命令默认是 subl，可用 --editor 或环境变量 HEXO_EDITOR 覆盖。
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const DEFAULT_EDITOR = process.env.HEXO_EDITOR || 'subl';
const POSTS_DIR_NAME = '_posts';

function pad(n) {
  return String(n).padStart(2, '0');
}

// 与现有 frontmatter 里 updated 的写法保持一致：YYYY-MM-DD HH:mm:ss（本地时间）
function formatNow(date = new Date()) {
  const ymd = [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join('-');
  const hms = [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(':');
  return `${ymd} ${hms}`;
}

const DELIMITER = /^-{3,}[ \t]*$/;

/**
 * 只动 frontmatter 里的 updated 一行，其余内容（包括换行符风格、BOM）原位保留。
 * 不用 hexo-front-matter 反序列化再序列化，避免整段 frontmatter 被重排。
 */
function setUpdated(rawText, timestamp) {
  const bom = rawText.charCodeAt(0) === 0xfeff ? '\ufeff' : '';
  const text = bom ? rawText.slice(1) : rawText;
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r\n|\n/);

  if (lines.length < 2 || !DELIMITER.test(lines[0])) {
    return { error: '文件开头没有 frontmatter（---）' };
  }

  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (DELIMITER.test(lines[i])) {
      end = i;
      break;
    }
  }
  if (end === -1) return { error: 'frontmatter 缺少收尾的 ---' };

  let index = -1;
  for (let i = 1; i < end; i++) {
    if (/^[ \t]*updated[ \t]*:/.test(lines[i])) {
      index = i;
      break;
    }
  }

  let action;
  if (index !== -1) {
    const line = `updated: ${timestamp}`;
    if (lines[index] === line) return { text: rawText, changed: false, action: 'unchanged' };
    lines[index] = line;
    action = 'replace';
  } else {
    // 没有 updated：优先插在 date 之后，其次 title 之后，最后放到收尾 --- 前
    let insertAt = end;
    for (const key of ['date', 'title']) {
      const i = lines.findIndex((line, idx) =>
        idx > 0 && idx < end && new RegExp(`^[ \\t]*${key}[ \\t]*:`).test(line)
      );
      if (i !== -1) {
        insertAt = i + 1;
        break;
      }
    }
    lines.splice(insertAt, 0, `updated: ${timestamp}`);
    action = 'insert';
  }

  return { text: bom + lines.join(eol), changed: true, action };
}

// 递归列出 _posts 下所有文章，返回相对 _posts 的 posix 路径（不含 .md）
function listPosts(postsDir) {
  const result = [];
  const walk = dir => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        result.push(path.relative(postsDir, full).replace(/\\/g, '/').slice(0, -3));
      }
    }
  };
  walk(postsDir);
  return result.sort();
}

function isFile(p) {
  try {
    return fs.statSync(p).isFile();
  } catch (e) {
    return false;
  }
}

// 支持直接粘贴 source/_posts/xxx.md 这类路径
function normalizeId(id) {
  let s = String(id).trim().replace(/^['"]|['"]$/g, '').replace(/\\/g, '/');
  for (const prefix of ['source/_posts/', './source/_posts/', '_posts/', './', '/']) {
    while (s.startsWith(prefix)) s = s.slice(prefix.length);
  }
  if (s.toLowerCase().endsWith('.md')) s = s.slice(0, -3);
  return s;
}

function resolvePost(hexo, id) {
  const postsDir = path.join(hexo.source_dir, POSTS_DIR_NAME);
  const normalized = normalizeId(id);
  if (!normalized) return { error: 'empty' };

  const exact = path.join(postsDir, normalized + '.md');
  if (isFile(exact)) return { file: exact };

  const all = listPosts(postsDir);
  const lower = normalized.toLowerCase();

  const ciMatches = all.filter(p => p.toLowerCase() === lower);
  if (ciMatches.length === 1) return { file: path.join(postsDir, ciMatches[0] + '.md') };
  if (ciMatches.length > 1) return { error: 'ambiguous', id: normalized, matches: ciMatches };

  const fuzzy = all.filter(p => p.toLowerCase().includes(lower)).slice(0, 10);
  return { error: 'notfound', id: normalized, matches: fuzzy };
}

function openEditor(editor, file, hexo) {
  const parts = editor.trim().split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1).concat([file]);

  let child;
  try {
    child = spawn(cmd, args, { detached: true, stdio: 'ignore' });
  } catch (e) {
    hexo.log.warn('打开编辑器失败：%s', e.message);
    return;
  }
  child.on('error', e => hexo.log.warn('打开编辑器失败（%s）：%s', cmd, e.message));
  child.unref();
}

function usage(hexo) {
  hexo.log.error('用法：hexo edit <博客 ID> [--editor <命令>] [--no-open] [--dry-run]');
  hexo.log.error('博客 ID 就是 source/_posts 下的文件名，可省略 .md，例如：');
  hexo.log.error('  hexo edit AtCoder-ABC209E-sol');
}

// 出错时只打印自己那条中文提示，不让 hexo 再吐一遍 FATAL + 调用栈；退出码置 1
function fail() {
  process.exitCode = 1;
  return Promise.resolve();
}

hexo.extend.console.register('edit', '打开文章（默认 Sublime Text）并更新 frontmatter 的 updated 时间', {
  arguments: [
    { name: 'id', desc: `文章 ID，即 ${POSTS_DIR_NAME} 下的文件名（可省略 .md）` }
  ],
  options: [
    { name: '--editor <command>', desc: `编辑器命令，默认 ${DEFAULT_EDITOR}（也可用环境变量 HEXO_EDITOR）` },
    { name: '--no-open', desc: '只更新 updated，不打开编辑器' },
    { name: '--dry-run', desc: '只打印将要做的改动，不写入、不打开编辑器' }
  ]
}, function (args) {
  const id = (args._ || []).join(' ').trim();
  if (!id) {
    usage(hexo);
    return fail();
  }

  const found = resolvePost(hexo, id);
  if (found.error === 'ambiguous') {
    hexo.log.error('ID「%s」匹配到多篇文章：', found.id);
    found.matches.forEach(m => hexo.log.error('  %s', m));
    return fail();
  }
  if (found.error === 'notfound') {
    hexo.log.error('找不到文章「%s」（%s/%s.md 不存在）', found.id, POSTS_DIR_NAME, found.id);
    if (found.matches.length) {
      hexo.log.info('你是不是想找：');
      found.matches.forEach(m => hexo.log.info('  %s', m));
    }
    return fail();
  }

  const file = found.file;
  const editor = args.editor || DEFAULT_EDITOR;
  const dryRun = !!args.dryRun;
  const shouldOpen = args.open !== false;
  const timestamp = formatNow();

  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch (e) {
    hexo.log.error('读取失败：%s', e.message);
    return fail();
  }

  const result = setUpdated(raw, timestamp);
  if (result.error) {
    hexo.log.error('%s：%s', path.relative(hexo.base_dir, file), result.error);
    return fail();
  }

  const relative = path.relative(hexo.base_dir, file);
  if (result.changed) {
    if (dryRun) {
      hexo.log.info('[dry-run] %s：updated -> %s（%s）', relative, timestamp,
        result.action === 'insert' ? '新增字段' : '覆盖字段');
    } else {
      // 先落盘再开编辑器，避免编辑器里的旧缓冲区覆盖这次修改
      fs.writeFileSync(file, result.text, 'utf8');
      hexo.log.info('%s：updated -> %s（%s）', relative, timestamp,
        result.action === 'insert' ? '新增字段' : '覆盖字段');
    }
  } else {
    hexo.log.info('%s：updated 已经是 %s，未改动', relative, timestamp);
  }

  if (dryRun) return Promise.resolve();
  if (shouldOpen) {
    openEditor(editor, file, hexo);
    hexo.log.info('已用 %s 打开 %s', editor, relative);
  }
  return Promise.resolve();
});
