/**
 * hexo sync_luogu <洛谷文章 ID>
 *
 * 从洛谷专栏抓一篇文章，落成 source/_posts/<文件名>.md。
 * 例：hexo sync_luogu 2c9ahe4w
 *
 * 数据来自文章页内嵌的 <script id="lentille-context"> JSON，里面有
 * title / category（数字分类）/ time（发布时间）/ solutionFor（题目 ID）/ content（markdown 原文）。
 *
 * 文件名：
 *   - 分类是「题解」且填了题目 ID 时，按现有风格自动生成，如
 *     P15093 -> Luogu-P15093-sol、CF1045D -> Codeforces-1045D-sol、AT_abc209_e -> AtCoder-ABC209E-sol
 *   - 其它情况（非题解 / 没填题目 ID / 题目 ID 前缀不认识）交互式询问文件名，
 *     也可以直接用 --name <文件名> 指定。
 *
 * frontmatter：
 *   title    洛谷文章标题
 *   date     洛谷发布时刻（按站点时区）
 *   updated  本次同步时刻
 *   categories  洛谷分类的官方英文名（映射表见 LUOGU_CATEGORIES）
 *   tags     题解带 Solution，并按题目 ID 前缀补 Luogu P / Luogu B / AtCoder / ... 标签
 *
 * 图片：正文里指向洛谷图床的图片会走同一个代理下到文章资源目录
 * （source/_posts/<文件名>/），并把 markdown 链接改写成裸文件名，和站内现有文章的
 * `![](XO-X.png)` 写法一致；站外图片保持原链接。--no-images 可关掉。
 *
 * 默认走代理 http://127.0.0.1:7890（不带代理部分文章会被洛谷拦），可用
 * --proxy <url> / --no-proxy / 环境变量 HEXO_LUOGU_PROXY 覆盖。
 *
 * 私有文章（洛谷匿名访问返回 401「没有权限请求此资源。」）需要登录态，也就是洛谷的
 * Cookie —— 由 _uid 和 __client_id 两个字段构成。Cookie 的处理：
 *   - 优先用 --cookie <串> / 环境变量 HEXO_LUOGU_COOKIE；
 *   - 其次用缓存 .cache/luogu-cookie.json（已在 .gitignore 里，文件权限 600）；
 *   - 都没有、或缓存里的已经失效（测试仍返回 401）时，才在终端里问你粘贴，
 *     粘贴后先拿这篇私有文章实测，可用才写进缓存；不可用则最多再问 3 次。
 *   - --forget-cookie 清掉缓存。
 * 公开文章永远先匿名抓，不碰 Cookie 缓存，所以缓存过期也不会影响正常同步。
 */

'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawnSync } = require('child_process');

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const DEFAULT_PROXY = 'http://127.0.0.1:7890';
const HOSTS = ['https://www.luogu.com', 'https://www.luogu.com.cn'];

// 洛谷登录态就这两个字段
const COOKIE_KEYS = ['_uid', '__client_id'];
const COOKIE_CACHE_DIR = '.cache';
const COOKIE_CACHE_NAME = 'luogu-cookie.json';
const POSTS_DIR = '_posts';

// 洛谷专栏分类编号 -> 洛谷国际站官方英文名
// 编号与 https://www.luogu.com/_lfe/config 里的 ArticleCategory 一致：
//   1 Personal 个人记录 / 2 Solution 题解 / 3 Technology 科技·工程 / 4 Theory 算法·理论
//   5 Life 生活·游记 / 6 K12Study 学习·文化课 / 7 Entertainment 休闲·娱乐 / 8 Gossip 闲话
const LUOGU_CATEGORIES = {
  1: 'Personal',
  2: 'Solution',
  3: 'Technology & Engineering',
  4: 'Algorithm & Theory',
  5: 'Life & Travel',
  6: 'K12 Study',
  7: 'Entertainment',
  8: 'Gossiping'
};

// 同上，ArticleStatus：0 封禁 / 1 私有 / 2 公开 / 3 已删除 / 4 永久删除
const ARTICLE_STATUS = {
  0: '封禁',
  1: '私有',
  2: '公开',
  3: '已删除',
  4: '永久删除'
};

const SOLUTION_CATEGORY = 2;

// 题目 ID 前缀 -> 文件名风格 / 标签
const FILENAME_RULES = [
  {
    test: /^P\d+$/i,
    name: pid => `Luogu-${pid.toUpperCase()}-sol`,
    tag: 'Luogu P Problem Solution'
  },
  {
    test: /^B\d+$/i,
    name: pid => `Luogu-${pid.toUpperCase()}-sol`,
    tag: 'Luogu B Problem Solution'
  },
  {
    test: /^CF(.+)$/i,
    name: (pid, m) => `Codeforces-${m[1].toUpperCase()}-sol`,
    tag: 'Codeforces Problem Solution'
  },
  {
    // AT_abc209_e -> AtCoder-ABC209E-sol；AT_abc441 -> AtCoder-ABC441-sol
    test: /^AT_(abc|arc|agc|ahc)(\d+)(?:_([a-z0-9]+))?$/i,
    name: (pid, m) => `AtCoder-${m[1].toUpperCase()}${m[2]}${m[3] ? m[3].toUpperCase() : ''}-sol`,
    tag: 'Atcoder Problem Solution'
  },
  {
    test: /^SP(\d+)$/i,
    name: (pid, m) => `SPOJ-${m[1]}-sol`,
    tag: 'SPOJ Problem Solution'
  },
  {
    test: /^UVA(\d+)$/i,
    name: (pid, m) => `UVA-${m[1]}-sol`,
    tag: 'UVA Problem Solution'
  }
];

// ---------------------------------------------------------------- 工具函数

function pad(n) {
  return String(n).padStart(2, '0');
}

// 按站点时区把 Date / unix 秒格式化成 YYYY-MM-DD HH:mm:ss
function formatTime(value, timezone) {
  const date = typeof value === 'number' ? new Date(value * 1000) : value;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  }).formatToParts(date);
  const get = type => parts.find(p => p.type === type).value;
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`;
}

function siteTimezone(hexo) {
  const configured = hexo.config.timezone;
  if (configured) return configured;
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

// 只在 YAML 会误解析时才加单引号，和站内现有写法保持一致
function yamlString(value) {
  const s = String(value);
  const needQuote =
    s === '' ||
    /^[\s\-?:,[\]{}#&*!|>'"%@`]/.test(s) ||
    /:\s/.test(s) || /:$/.test(s) ||
    /\s#/.test(s) || /#$/.test(s) ||
    /^\s|\s$/.test(s) ||
    /^(true|false|null|yes|no|on|off|~)$/i.test(s) ||
    /^[-+]?\d+(\.\d+)?$/.test(s);
  return needQuote ? `'${s.replace(/'/g, "''")}'` : s;
}

// 从任意形状的粘贴内容里抽出洛谷登录态的两个字段（整段 document.cookie、
// Cookie 请求头、或已经是 _uid=…; __client_id=… 都行），并重新拼成规范形式
function normalizeCookie(input) {
  const text = String(input || '').trim()
    .replace(/^cookie\s*:/i, '')
    .replace(/[\r\n]+/g, '; ');
  const found = {};
  for (const m of text.matchAll(/(?:^|;|\s)([A-Za-z0-9_]+)=([^;]*)/g)) {
    const key = m[1];
    if (COOKIE_KEYS.includes(key) && found[key] === undefined) found[key] = m[2].trim();
  }
  return {
    cookie: COOKIE_KEYS.filter(k => found[k]).map(k => `${k}=${found[k]}`).join('; '),
    missing: COOKIE_KEYS.filter(k => !found[k])
  };
}

function cookieCacheFile(hexo) {
  return process.env.HEXO_LUOGU_COOKIE_FILE ||
    path.join(hexo.base_dir, COOKIE_CACHE_DIR, COOKIE_CACHE_NAME);
}

// 默认位置在 .cache/ 里，是写进 .gitignore 的；自定义位置就不一定了
function cachePathNote(hexo, file) {
  const rel = path.relative(hexo.base_dir, file);
  return !rel.startsWith('..') && (rel === COOKIE_CACHE_DIR || rel.startsWith(COOKIE_CACHE_DIR + path.sep));
}

function readCookieCache(file, hexo) {
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    if (e.code !== 'ENOENT') hexo.log.warn('读 Cookie 缓存失败（%s）：%s', file, e.message);
    return null;
  }
  const { cookie, missing } = normalizeCookie(raw && raw.cookie);
  if (!cookie || missing.length) {
    hexo.log.warn('Cookie 缓存里缺少 %s，当作没有缓存。', (missing || COOKIE_KEYS).join(' / '));
    return null;
  }
  return { cookie, user: raw.user || null, savedAt: raw.savedAt || null };
}

function writeCookieCache(file, hexo, { cookie, user, lid }) {
  const data = {
    cookie,
    user: user ? { uid: user.uid, name: user.name } : null,
    testedOn: lid,
    testedAt: new Date().toISOString()
  };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { encoding: 'utf8', mode: 0o600 });
  fs.chmodSync(file, 0o600);
  return file;
}

function dropCookieCache(file, hexo) {
  try {
    fs.unlinkSync(file);
  } catch (e) {
    if (e.code !== 'ENOENT') hexo.log.warn('删除 Cookie 缓存失败：%s', e.message);
  }
}

// curl 的 -w 会把状态码追加在响应体后面，用这个标记切出来
const STATUS_MARK = '\n__CURL_HTTP_STATUS__:';

function httpGet(url, { proxy, cookie }) {
  const argv = [
    '-sS', '-L', '--compressed', '--max-time', '30',
    '-A', UA,
    '-H', 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    '-H', 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8'
  ];
  if (proxy) argv.push('-x', proxy);
  if (cookie) argv.push('-H', `Cookie: ${cookie}`);
  argv.push('-w', `${STATUS_MARK}%{http_code}`, url);

  const res = spawnSync('curl', argv, { encoding: 'utf8', maxBuffer: 96 * 1024 * 1024 });
  if (res.error) throw new Error(`无法执行 curl：${res.error.message}`);
  if (res.status !== 0) throw new Error(`curl 退出码 ${res.status}：${(res.stderr || '').trim()}`);

  const raw = res.stdout || '';
  const at = raw.lastIndexOf(STATUS_MARK);
  if (at === -1) return { status: 0, body: raw };
  return {
    status: Number(raw.slice(at + STATUS_MARK.length).trim()) || 0,
    body: raw.slice(0, at)
  };
}

function parseLentille(html) {
  const m = html.match(/<script id="lentille-context" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch (e) {
    return null;
  }
}

/**
 * 抓一次文章页。返回 { kind, article?, user?, message, url, status }
 *   ok       拿到文章（可能是别人的公开文章，也可能是自己带 Cookie 取的私有文章）
 *   auth     401/403，需要登录态（私有文章匿名访问就是这个）
 *   notfound 404，文章真的不存在
 *   error    网络/代理/安全访问中心等其它问题
 */
function requestArticle(lid, { proxy, cookie }) {
  const problems = [];
  for (const host of HOSTS) {
    const url = `${host}/article/${encodeURIComponent(lid)}`;
    let res;
    try {
      res = httpGet(url, { proxy, cookie });
    } catch (e) {
      problems.push(`${url}：${e.message}`);
      continue;
    }

    const data = parseLentille(res.body);
    if (data) {
      const payload = data.data || {};
      const article = payload.article;
      if (article && article.lid) {
        return { kind: 'ok', article, user: data.user || null, url, status: res.status };
      }
      const code = payload.errorCode || data.status || res.status;
      const message = payload.errorMessage || `HTTP ${res.status}`;
      if (code === 401 || code === 403) return { kind: 'auth', message, url, status: res.status };
      if (code === 404) return { kind: 'notfound', message, url, status: res.status };
      return { kind: 'error', message: `${message}（HTTP ${res.status}）`, url, status: res.status };
    }

    const blocked = res.body.includes('安全访问中心');
    problems.push(`${url}：${blocked
      ? '被洛谷安全访问中心拦截（确认代理可用，或换个代理）'
      : `页面里没有文章数据（HTTP ${res.status}）`}`);
  }
  return { kind: 'error', message: problems.join('\n    ') };
}

// 读取不想明文回显的输入（Cookie 是密码级凭据）。
// 这里自己开 raw mode、自己收字符，不用 readline：readline 每次刷新行都是
// 先 \x1b[2K 清掉整行再重画，而回显一旦被吞掉，敲个空格再退格就会把提示行一起擦没。
function readSecret(text) {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    if (!stdin.isTTY) {
      reject(new Error('当前不是终端，读不了 Cookie'));
      return;
    }
    const wasRaw = stdin.isRaw;
    let buffer = '';
    let escape = false;

    const stop = () => {
      stdin.removeListener('data', onData);
      stdin.setRawMode(wasRaw);
      stdin.pause();
    };
    const finish = (value, err) => {
      stop();
      process.stdout.write('\n');
      if (err) reject(err);
      else resolve(value);
    };

    const onData = chunk => {
      for (const ch of String(chunk)) {
        if (escape) {
          // 吃掉方向键、Delete、粘贴标记等转义序列
          if (ch >= '@' && ch <= '~') escape = false;
          continue;
        }
        if (ch === '\u001b') { escape = true; continue; }
        if (ch === '\r' || ch === '\n') return finish(buffer.trim());
        if (ch === '\u0003' || ch === '\u0004') return finish(null, new Error('已取消'));
        if (ch === '\u007f' || ch === '\b') {
          if (buffer) {
            buffer = buffer.slice(0, -1);
            process.stdout.write('\b \b');
          }
          continue;
        }
        if (ch < ' ') continue; // 其它控制字符丢掉
        buffer += ch;
        process.stdout.write('*'); // 只给个「收到了」的反馈，不显示内容
      }
    };

    process.stdout.write(text);
    stdin.setEncoding('utf8');
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on('data', onData);
  });
}

/**
 * 先匿名抓；被拒（私有文章）再走 Cookie：--cookie / 环境变量 -> 缓存 -> 交互询问。
 * 询问得到的 Cookie 会先用这篇私有文章实测，可用才写缓存。
 */
async function fetchWithAuth(hexo, args, lid, proxy) {
  const anon = requestArticle(lid, { proxy });
  if (anon.kind === 'ok') return { attempt: anon, cookieNote: null };

  if (anon.kind === 'notfound') {
    throw new Error(`洛谷说「${anon.message}」（HTTP ${anon.status}）：文章不存在或已被删除。`);
  }
  if (anon.kind === 'error') throw new Error(anon.message);

  hexo.log.info('匿名访问被拒（%s），这篇是私有文章，需要洛谷 Cookie。', anon.message);

  const cacheFile = cookieCacheFile(hexo);
  const cacheName = path.relative(hexo.base_dir, cacheFile);
  const explicit = args.cookie || process.env.HEXO_LUOGU_COOKIE || '';

  const candidates = [];
  if (explicit) {
    candidates.push({ value: explicit, source: args.cookie ? '--cookie' : 'HEXO_LUOGU_COOKIE', fromCache: false });
  } else {
    const cached = readCookieCache(cacheFile, hexo);
    if (cached) candidates.push({ value: cached.cookie, source: `缓存 ${cacheName}`, fromCache: true });
  }

  for (const cand of candidates) {
    const { cookie, missing } = normalizeCookie(cand.value);
    if (missing.length) {
      hexo.log.warn('%s 里缺少 %s，跳过。', cand.source, missing.join(' / '));
      continue;
    }
    hexo.log.info(cand.fromCache
      ? `用缓存 ${cacheName} 里的 Cookie 试试 ...`
      : `用 ${cand.source} 传入的 Cookie 试试 ...`);
    const attempt = requestArticle(lid, { proxy, cookie });
    if (attempt.kind === 'ok') {
      const where = writeCookieCache(cacheFile, hexo, { cookie, user: attempt.user, lid });
      hexo.log.info('Cookie 可用，已刷新缓存 %s。', path.relative(hexo.base_dir, where));
      return { attempt, cookieNote: `${cand.source}${attempt.user ? `（${attempt.user.name}）` : ''}` };
    }
    hexo.log.warn('%s 里的 Cookie %s。', cand.source,
      attempt.kind === 'auth' ? '仍然没有权限（大概是过期了）' : `取不到这篇：${attempt.message}`);
    if (cand.fromCache) {
      dropCookieCache(cacheFile, hexo);
      hexo.log.warn('已删除失效的缓存 %s。', cacheName);
    }
  }

  if (!process.stdin.isTTY) {
    throw new Error('需要洛谷 Cookie 才能读到这篇。当前不是终端，请用\n' +
      '    --cookie "<_uid=…; __client_id=…>"  或环境变量 HEXO_LUOGU_COOKIE 传入；\n' +
      '    在终端里直接跑 hexo sync_luogu 则会提示你粘贴。');
  }

  for (let tries = 1; tries <= 3; tries++) {
    const input = await readSecret(
      `请粘贴洛谷 Cookie（F12 → Network → 任意请求的 Cookie 请求头，或 document.cookie；` +
      `输入用 * 代替、不会明文显示）[${tries}/3]: `);
    if (!input) {
      hexo.log.warn('没有输入，再来一次。');
      continue;
    }
    const { cookie, missing } = normalizeCookie(input);
    if (missing.length) {
      hexo.log.error('这串里缺少 %s —— 洛谷登录态由 _uid 和 __client_id 两个字段构成，两个都要。', missing.join(' / '));
      continue;
    }
    hexo.log.info('拿这篇私有文章实测这串 Cookie ...');
    const attempt = requestArticle(lid, { proxy, cookie });
    if (attempt.kind === 'ok') {
      const where = writeCookieCache(cacheFile, hexo, { cookie, user: attempt.user, lid });
      hexo.log.info('Cookie 验证通过，已缓存到 %s（权限 600%s）。',
        path.relative(hexo.base_dir, where),
        cachePathNote(hexo, where) ? '，该目录已 gitignore' : '；注意这是自定义位置，确认没被 git 跟踪');
      return { attempt, cookieNote: `你刚粘贴的 Cookie${attempt.user ? `（${attempt.user.name}）` : ''}` };
    }
    hexo.log.error('这串 Cookie 还是不行：%s', attempt.kind === 'auth'
      ? '仍然是 401 没有权限'
      : attempt.message);
  }
  throw new Error('Cookie 试了 3 次都没能取到这篇，先放弃。');
}

function normalizeLid(input) {
  let s = String(input).trim().replace(/^['"]|['"]$/g, '');
  const m = s.match(/article\/([0-9a-zA-Z]+)/);
  if (m) s = m[1];
  return s;
}

function matchRule(pid) {
  for (const rule of FILENAME_RULES) {
    const m = pid.match(rule.test);
    if (m) return { name: rule.name(pid, m), tag: rule.tag };
  }
  return null;
}

function sanitizeName(input) {
  let s = String(input).trim().replace(/^['"]|['"]$/g, '').replace(/\\/g, '/');
  for (const prefix of ['source/_posts/', './source/_posts/', '_posts/', './']) {
    while (s.startsWith(prefix)) s = s.slice(prefix.length);
  }
  if (s.toLowerCase().endsWith('.md')) s = s.slice(0, -3);
  return s;
}

function askFilename(hexo, suggestion) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const hint = suggestion ? `（不带 .md）[${suggestion}]` : '（不带 .md）';
    let settled = false;
    const finish = value => {
      if (settled) return;
      settled = true;
      rl.close();
      const name = sanitizeName(value || suggestion || '');
      if (!name) reject(new Error('没有填写文件名'));
      else resolve(name);
    };
    rl.question(`请输入文件名${hint}: `, answer => finish(answer));
    rl.on('SIGINT', () => {
      settled = true;
      rl.close();
      reject(new Error('已取消'));
    });
  });
}

function validateName(name) {
  if (!name) return '文件名不能为空';
  if (/[\\/]/.test(name)) return '文件名里不要带路径分隔符';
  if (/^[._]/.test(name)) return '文件名不要以 _ 或 . 开头（Hexo 会忽略这类文件）';
  if (/[?#%]/.test(name)) return '文件名里不要带 ? # % 这类字符';
  return null;
}

function buildFrontMatter({ title, date, updated, categories, tags }) {
  const lines = ['---', `title: ${yamlString(title)}`, `date: ${date}`, `updated: ${updated}`];
  lines.push('categories:');
  for (const c of categories) lines.push(`  - ${yamlString(c)}`);
  if (tags.length) {
    lines.push('tags:');
    for (const t of tags) lines.push(`  - ${yamlString(t)}`);
  } else {
    lines.push('tags: []');
  }
  lines.push('---', '');
  return lines.join('\n') + '\n';
}

// 正文首行（去掉开头空行后）不是一级标题，就补一个
function buildBody(content, title) {
  let body = String(content).replace(/^\uFEFF/, '').replace(/^(?:[ \t]*\r?\n)+/, '');
  if (!/^#[ \t]/.test(body)) body = `# ${title}\n\n${body}`;
  return body.replace(/\s*$/, '') + '\n';
}

// ---------------------------------------------------------------- 图片本地化

const IMAGE_EXT = {
  'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/jpg': 'jpg',
  'image/gif': 'gif', 'image/svg+xml': 'svg', 'image/bmp': 'bmp', 'image/avif': 'avif',
  'image/x-icon': 'ico'
};

// ![alt](url "title")，url 允许用 <> 包起来
const IMAGE_RE = /!\[([^\]]*)\]\(\s*(<[^>]+>|[^\s)]+)((?:\s+"[^"]*")?)\s*\)/g;

function isLuoguHost(url) {
  try {
    return /(^|\.)luogu\.com(\.cn)?$/i.test(new URL(url).hostname);
  } catch (e) {
    return false;
  }
}

// 取 URL 最后一段当文件名，冲突时加 -1 / -2
function imageFileName(url, taken) {
  let base = '';
  try {
    base = path.basename(decodeURIComponent(new URL(url).pathname));
  } catch (e) { /* 忽略 */ }
  base = base.replace(/[^\w.\-]+/g, '_').replace(/^[.\-]+/, '');
  if (!base) base = 'image';
  const ext = (base.match(/\.[A-Za-z0-9]{1,6}$/) || [''])[0];
  const stem = ext ? base.slice(0, -ext.length) : base;
  let name = base;
  for (let i = 1; taken.has(name); i++) name = `${stem}-${i}${ext}`;
  return { name, stem, ext };
}

// 走代理把图下到资源目录，返回 { ok, type }
function downloadImage(url, dest, { proxy, referer }) {
  const argv = ['-sS', '-L', '--compressed', '--max-time', '60', '-A', UA,
    '-H', `Referer: ${referer}`];
  if (proxy) argv.push('-x', proxy);
  argv.push('-o', dest, '-w', '%{http_code}|%{content_type}', url);

  const res = spawnSync('curl', argv, { encoding: 'utf8' });
  if (res.error) return { ok: false, reason: res.error.message };
  const [code, type] = String(res.stdout || '').trim().split('|');
  if (res.status !== 0) return { ok: false, reason: `curl 退出码 ${res.status}` };
  if (code !== '200') return { ok: false, reason: `HTTP ${code}` };
  if (!/^image\//.test(type || '')) return { ok: false, reason: `返回的不是图片（${type || '未知类型'}）` };
  return { ok: true, type };
}

/**
 * 把正文里指向洛谷图床的图片下到文章资源目录，并把链接改成裸文件名
 * （和站内现有文章 `![](XO-X.png)` 的写法一致）。非洛谷域名的图保持原样。
 */
function localizeImages(hexo, content, { assetDir, proxy, referer, dryRun }) {
  const refs = [];
  let m;
  IMAGE_RE.lastIndex = 0;
  while ((m = IMAGE_RE.exec(content))) {
    refs.push({ start: m.index, raw: m[0], token: m[2], url: m[2].replace(/^<|>$/, '') });
  }

  const stats = { total: refs.length, downloaded: 0, reused: 0, failed: 0, skipped: 0 };
  if (!refs.length) return { content, stats };

  const taken = new Map();
  for (const ref of refs) {
    if (!/^https?:\/\//i.test(ref.url) || !isLuoguHost(ref.url)) {
      stats.skipped++; // 站外图片（或本来就写好的相对路径）保持原样
      continue;
    }
    const { name, stem, ext } = imageFileName(ref.url, taken);

    let finalName = name;
    if (!ext) {
      // URL 没扩展名时，落盘名字是拿 content-type 现补的（noext -> noext.webp），
      // 复用检查得按 <stem>.* 去找，不然每次同步都会重下一遍
      const guess = fs.existsSync(assetDir)
        ? fs.readdirSync(assetDir).find(f => f.startsWith(`${stem}.`) && !f.startsWith('.') &&
            fs.statSync(path.join(assetDir, f)).size > 0)
        : null;
      if (guess) finalName = guess;
    }
    taken.set(finalName, ref.url);

    const dest = path.join(assetDir, finalName);
    const existed = fs.existsSync(dest) && fs.statSync(dest).size > 0;

    if (dryRun) {
      hexo.log.info('[dry-run] 将下载图片 %s -> %s', ref.url, path.relative(hexo.base_dir, dest));
      ref.newToken = finalName;
      continue;
    }

    if (existed) {
      stats.reused++;
      ref.newToken = finalName;
      continue;
    }

    const tmp = path.join(assetDir, `.tmp-image-${stats.downloaded + stats.failed}`);
    const got = downloadImage(ref.url, tmp, { proxy, referer });
    if (!got.ok) {
      stats.failed++;
      hexo.log.warn('图片下载失败（%s），链接保持原样：%s', got.reason, ref.url);
      try { fs.unlinkSync(tmp); } catch (e) { /* 忽略 */ }
      continue;
    }
    if (!ext) finalName = `${stem}.${IMAGE_EXT[got.type] || 'png'}`;
    const target = path.join(assetDir, finalName);
    fs.rmSync(target, { force: true });
    fs.renameSync(tmp, target);
    stats.downloaded++;
    ref.newToken = finalName;
  }

  // 从后往前替换，避免前面的改动影响后面的下标
  let out = content;
  for (let i = refs.length - 1; i >= 0; i--) {
    const ref = refs[i];
    if (!ref.newToken || ref.newToken === ref.token) continue;
    out = out.slice(0, ref.start) + ref.raw.replace(ref.token, ref.newToken) + out.slice(ref.start + ref.raw.length);
  }
  return { content: out, stats };
}

// ---------------------------------------------------------------- 命令本体

hexo.extend.console.register('sync_luogu', '从洛谷专栏同步一篇文章到 source/_posts', {
  arguments: [
    { name: 'id', desc: '洛谷文章 ID（如 2c9ahe4w），也可以直接粘贴文章链接' }
  ],
  options: [
    { name: '--proxy <url>', desc: `代理地址，默认 ${DEFAULT_PROXY}（--no-proxy 关闭，环境变量 HEXO_LUOGU_PROXY 亦可）` },
    { name: '--cookie <string>', desc: '洛谷 Cookie（_uid=…; __client_id=…），传了就不问；可用环境变量 HEXO_LUOGU_COOKIE' },
    { name: '--forget-cookie', desc: '删除已缓存的 Cookie 再继续（缓存里的失效了、或想换账号时用）' },
    { name: '--no-images', desc: '不下载正文里的洛谷图床图片（默认会下到资源目录并改写链接）' },
    { name: '--name <filename>', desc: '直接指定文件名（不带 .md），不交互询问' },
    { name: '--force', desc: '目标文件已存在时覆盖重写' },
    { name: '--dry-run', desc: '只打印将要写入的文件名、frontmatter 和正文长度，不落盘' }
  ]
}, async function (args) {
  const rawId = (args._ || []).join(' ').trim();
  if (!rawId) {
    hexo.log.error('用法：hexo sync_luogu <洛谷文章 ID> [--name <文件名>] [--force] [--dry-run]\n' +
      '                [--cookie "<_uid=…; __client_id=…>"] [--forget-cookie] [--proxy <url>]');
    hexo.log.error('例如：hexo sync_luogu 2c9ahe4w');
    process.exitCode = 1;
    return;
  }

  const lid = normalizeLid(rawId);
  const proxy = args.proxy === false
    ? ''
    : (typeof args.proxy === 'string' ? args.proxy : (process.env.HEXO_LUOGU_PROXY ?? DEFAULT_PROXY));

  const cacheFile = cookieCacheFile(hexo);
  if (args.forgetCookie) {
    dropCookieCache(cacheFile, hexo);
    hexo.log.info('已清掉 Cookie 缓存 %s。', path.relative(hexo.base_dir, cacheFile));
  }

  hexo.log.info('抓取 https://www.luogu.com/article/%s%s ...', lid, proxy ? `（代理 ${proxy}）` : '（不使用代理）');

  let article;
  let cookieNote = null;
  try {
    ({ attempt: { article }, cookieNote } = await fetchWithAuth(hexo, args, lid, proxy));
  } catch (e) {
    hexo.log.error('抓取失败：\n    %s', e.message);
    process.exitCode = 1;
    return;
  }

  if (cookieNote) hexo.log.info('用的是：%s', cookieNote);

  const title = article.title || '';
  const categoryName = LUOGU_CATEGORIES[article.category] || hexo.config.default_category || 'uncategorized';
  const pid = article.solutionFor && article.solutionFor.pid ? article.solutionFor.pid : '';
  const isSolution = article.category === SOLUTION_CATEGORY && !!pid;

  hexo.log.info('标题：%s', title);
  hexo.log.info('分类：%s%s', categoryName, pid ? `，题目 ID：${pid}` : '');

  // 标签：题解一律带 Solution，再按题目 ID 前缀补一个来源标签
  const tags = [];
  let rule = null;
  if (isSolution) {
    tags.push('Solution');
    rule = matchRule(pid);
    if (rule) tags.push(rule.tag);
    else hexo.log.warn('题目 ID「%s」前缀不认识，只写 Solution 标签，文件名请你确认', pid);
  }

  // 文件名
  let name = args.name ? sanitizeName(args.name) : '';
  const autoName = isSolution && rule ? rule.name : '';
  if (!name && autoName) {
    name = autoName;
    hexo.log.info('文件名按题目 ID 自动生成：%s.md', name);
  }
  if (!name) {
    const suggestion = autoName || (pid ? `${pid}-sol` : '');
    if (!process.stdin.isTTY) {
      hexo.log.error('需要你确认文件名，但当前 stdin 不是终端，请用 --name <文件名> 指定。');
      if (suggestion) hexo.log.error('建议：--name %s', suggestion);
      process.exitCode = 1;
      return;
    }
    hexo.log.warn(isSolution ? '无法自动生成文件名（题目 ID 前缀不认识）' : '不是题解，无法自动生成文件名');
    try {
      name = await askFilename(hexo, suggestion);
    } catch (e) {
      hexo.log.error('%s', e.message);
      process.exitCode = 1;
      return;
    }
  }

  const invalid = validateName(name);
  if (invalid) {
    hexo.log.error('文件名不合法：%s', invalid);
    process.exitCode = 1;
    return;
  }

  const target = path.join(hexo.source_dir, POSTS_DIR, name + '.md');
  const relative = path.relative(hexo.base_dir, target);

  // post_asset_folder 打开时，和 hexo new 一样给文章建一个同名资源目录
  const assetDir = path.join(hexo.source_dir, POSTS_DIR, name);
  const wantAssetDir = !!hexo.config.post_asset_folder && path.basename(name) !== 'index';
  // minimist 的约定：--no-images 会被解析成 images = false
  const skipImages = args.images === false;

  // 正文里的洛谷图床图片下到资源目录，链接改成裸文件名
  let content = article.content || '';
  const imageRefs = [...content.matchAll(IMAGE_RE)];
  let imageNote = '';
  if (imageRefs.length) {
    if (!wantAssetDir) {
      hexo.log.warn('正文里有 %d 张图片，但 post_asset_folder 没开（或文件名是 index），图片保持原链接。', imageRefs.length);
    } else if (skipImages) {
      hexo.log.info('正文里有 %d 张图片，--no-images 指定不下载，链接保持原样。', imageRefs.length);
    } else {
      if (!args.dryRun) fs.mkdirSync(assetDir, { recursive: true });
      const { content: localized, stats } = localizeImages(hexo, content, {
        assetDir,
        proxy,
        referer: `https://www.luogu.com/article/${lid}`,
        dryRun: !!args.dryRun
      });
      content = localized;
      imageNote = `，图片 下载 ${stats.downloaded} / 复用 ${stats.reused} / 跳过 ${stats.skipped}（站外或已是本地路径） / 失败 ${stats.failed}`;
      if (stats.failed) imageNote += `（失败的保留了原链接，正文共 ${stats.total} 张）`;
    }
  }

  const now = formatTime(new Date(), siteTimezone(hexo));
  const frontMatter = buildFrontMatter({
    title,
    date: formatTime(article.time, siteTimezone(hexo)),
    updated: formatTime(article.time, siteTimezone(hexo)),
    categories: [categoryName],
    tags
  });
  const body = buildBody(content, title);
  const text = frontMatter + body;

  if (article.contentFull === false) {
    hexo.log.warn('洛谷标记 contentFull = false，正文可能被截断，请打开文章页对一下。');
  }
  if (article.status !== undefined && article.status !== 2) {
    const statusName = ARTICLE_STATUS[article.status] || '未知';
    if (article.status === 1 && cookieNote) {
      hexo.log.info('这篇在洛谷上是「%s」文章，已经用你的登录态取到；同步出来的 md 是公开的，注意别误发。', statusName);
    } else {
      hexo.log.warn('文章状态是「%s」（status = %s），不是公开文章，请自行确认。', statusName, article.status);
    }
  }

  const assetNote = wantAssetDir ? `，并建资源目录 ${path.relative(hexo.base_dir, assetDir)}/${imageNote}` : '';

  if (args.dryRun) {
    hexo.log.info('[dry-run] 将写入 %s（正文 %d 字符）%s', relative, body.length, assetNote);
    console.log('\n' + text.trimEnd() + '\n');
    return;
  }

  if (fs.existsSync(target) && !args.force) {
    hexo.log.error('%s 已存在，加 --force 覆盖，或换个文件名（--name）。', relative);
    process.exitCode = 1;
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text, 'utf8');
  if (wantAssetDir) fs.mkdirSync(assetDir, { recursive: true });

  hexo.log.info('已写入 %s（正文 %d 字符）%s', relative, body.length, assetNote);
  hexo.log.info('标签：%s', tags.join(' / ') || '（无）');
  hexo.log.info('想继续改的话：hexo edit %s', name);
});
