---
layout: blog
title: 记一次把所有洛谷专栏迁移到 `github.io` 的经历
date: 2026-07-26 20:49:16
category: Technology & Engineering
tags:
  - Engineering
---
# 记一次把所有洛谷专栏迁移到 `github.io` 的经历

## 阶段 $1$：抓取专栏

### 步骤 $1$：获取专栏链接

这一步是我自己做的。

```javascript
tmp1 = document.firstElementChild.children[1].children[0].children[4].children[0].children[1].children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[1]; s = ''; for(i=0;i<tmp1.children.length;i++) s += tmp1.children[i].lastElementChild.lastElementChild.href.substr(0, tmp1.children[i].lastElementChild.lastElementChild.href.length - 5) + '\n'; console.log(s)
```
打开洛谷文章列表的任意一页，控制台运行这段代码（如果你不信任也可以自己写，反正这个是给我自己用的），就会输出所有文章链接（如 <https://www.luogu.com.cn/article/12345678>）。

手动重复了几次（页数挺多的），存到 `URLs.txt` 中。

### 步骤 $2$：抓取文章

直接访问洛谷会成为 Teapot。经测试，改 User-Agent 不会。让 AI 使用 `fake_useragent` 库写代码批量抓取文章。每次抓取之间有 $100\mathrm{ms}$ 的间隔，虽然没什么用，因为这个是串行执行的，并且抓取的时间远大于 $100\mathrm{ms}$。

:::info[代码]
```python
import os
import time
import requests
import fake_useragent
from urllib.parse import urlparse

ua = fake_useragent.UserAgent()

# ==================== 用户配置区域 ====================
# 1. 请将包含 URL 列表的文件路径填写在此
URL_FILE = "./URLs.txt"

# 2. 如需使用 Cookies，请在此处填写字典（例如登录后的 Cookie）
COOKIES = {
    # 人类注释：在这里填入你的 cookies。
}

# 3. 每次请求之间的间隔（秒），此处为 100ms
DELAY = 0.1

# 4. 请求超时（秒）
TIMEOUT = 10
# ====================================================

def get_filename_from_url(url):
    """
    从 URL 中提取文件名。
    规则：取路径最后一段，去除查询参数和锚点；若无扩展名则添加 .html。
    若路径为空或只有斜杠，则返回 "index.html"。
    """
    parsed = urlparse(url)
    path = parsed.path  # 例如 "/article/tzvm97eh" 或 "/"
    
    if not path or path == "/":
        return "index.html"
    
    # 去除首尾斜杠并拆分
    segments = path.strip('/').split('/')
    # 取最后一段
    last = segments[-1] if segments else ""
    
    if not last:
        return "index.html"
    
    # 如果有查询参数或锚点，已经通过 urlparse 去掉了，但为防止手动保留，再清理一次
    # 去除可能残留的 ? 或 #（实际上 path 不包含这些）
    # 但有些 URL 可能在 path 中包含特殊字符，直接使用
    
    # 检查是否已有扩展名（包含点）
    if '.' in last:
        # 简单认为有扩展名，直接返回
        return last
    else:
        return last + ".html"

def download_page(url, cookies, delay, timeout):
    """
    下载单个 URL 并保存为本地文件。
    返回 (成功标志, 文件名, 状态码或异常信息)
    """
    try:
        filename = get_filename_from_url(url)
        print(f"正在下载: {url} -> {filename}")
        
        # 发送 GET 请求，携带 Cookies
        response = requests.get(url, cookies=cookies, timeout=timeout, headers = {'User-Agent': ua.random})
        response.raise_for_status()  # 如果状态码不是 2xx，抛出异常
        
        # 写入本地文件（二进制模式，保留原始内容）
        with open(filename, 'wb') as f:
            f.write(response.content)
        
        print(f"下载成功: {filename} (状态码 {response.status_code})")
        return True, filename, response.status_code
    except requests.exceptions.RequestException as e:
        print(f"下载失败: {url} - 错误: {e}")
        return False, None, str(e)
    except OSError as e:
        print(f"文件写入失败: {url} - 错误: {e}")
        return False, None, str(e)

def main():
    # 检查 URL 文件是否存在
    if not os.path.isfile(URL_FILE):
        print(f"错误: 找不到 URL 文件 '{URL_FILE}'，请检查路径。")
        return
    
    # 读取所有 URL（每行一个，忽略空行和注释行）
    with open(URL_FILE, 'r', encoding='utf-8') as f:
        urls = [line.strip() for line in f if line.strip() and not line.startswith('#')]
    
    if not urls:
        print("文件中没有有效的 URL。")
        return
    
    print(f"共发现 {len(urls)} 个 URL，开始下载...")
    print(f"Cookies 已{'启用' if COOKIES else '禁用'}，请求间隔 {DELAY*1000}ms")
    
    for idx, url in enumerate(urls, 1):
        print(f"\n[{idx}/{len(urls)}]")
        success, filename, info = download_page(url, COOKIES, DELAY, TIMEOUT)
        # 间隔等待（除了最后一个请求之后不必要，但为了简单仍加）
        if idx < len(urls):
            time.sleep(DELAY)
    
    print("\n所有任务执行完毕。")

if __name__ == "__main__":
    main()
```
:::

### 步骤 $3$：转化为 Markdown

通过人类分析，我们发现 `content:":"` 和 `","top":` 之间的是转义的 Markdown。我们让 AI 写一个代码。结果……有一些文章失败了？

然后你发现 `top` 是置顶量，但是私有文章没有置顶量会炸掉，文章内容之后就是 `","adminNote":null`。

随手改一下代码。

:::info[代码]

```python
#!/usr/bin/env python3
import glob
import json
import os

def extract_content(html_path):
    """Extract and unescape the content field from an HTML file."""
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Locate the boundaries
    start_marker = 'content":"'
    end_marker = '","top":'

    start = html.find(start_marker)
    if start == -1:
        print(f"Warning: '{start_marker}' not found in {html_path}")
        return None

    start += len(start_marker)

    end = html.find(end_marker, start)
    if end == -1:
        end = html.find('","adminNote":null', start)
    if end == -1:
        print(f"Warning: '{end_marker}' not found after content in {html_path}")
        return None

    # Extract the raw JSON string (without the outer quotes)
    raw = html[start:end]

    # Decode JSON string by wrapping it in quotes
    try:
        decoded = json.loads('"' + raw + '"')
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON in {html_path}: {e}")
        return None

    return decoded

def main():
    html_files = glob.glob('*.html')
    if not html_files:
        print("No .html files found in current directory.")
        return

    for html_path in html_files:
        base = os.path.splitext(html_path)[0]
        md_path = base + '.md'

        content = extract_content(html_path)
        if content is None:
            continue

        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Written: {md_path}")

if __name__ == '__main__':
    main()

```

:::

### 阶段 $4$：整理一下混乱的文件

这下所有文件（包括 `URLs.txt`，HTML，Markdown 和 Python 脚本）都在同一个目录下，不好。

移动。

:::info[bash]

```bash
mkdir ./blogs
mv ./*.md ./blogs/
mkdir ./luoguhtmls
mv ./*.html ./luoguhtmls/
```

现在干净多了。

:::

### 阶段 $5$：提取所有公开文章，创建 Hexo 头

我忘了咋做的了，你可以让 AI 写个简单的 Python 脚本重新分析一下。

Hexo 头里面是 `layout`，`title`，`date`，`category`，`tags`，这个你自己定几个类别然后让 AI 写个脚本分析一下 HTML 即可。

另外文章显然不能再用 ID 作为名称了。我的方法是提取出每个文章的标题，喂给 AI 让它搞一个 URL 中的名称，然后自己手动微调一下。

## 阶段 $2$：Hexo

先把 Hexo 下下来。使用 NexT 主题。

### 文章资源目录

我的文章有很多图片怎么办。

启用资源目录，让 AI 写一个脚本提取所有文章中的所有图片，下载下来，放到资源目录中。

有两张图片炸了？？其中一张通过翻 `git` 记录发现不知道为啥删掉了，成功恢复。另一张恢复失败，无法找回。

### 洛谷 Markdown 语法支持

#### 折叠框

在 `script` 目录下创建 `newRenderer.js`：

:::info[`script/newRenderer.js`]

```javascript
// scripts/newRenderer.js

// 辅助函数：渲染标题，避免 <p> 包裹
function renderTitle(md, title) {
  if (typeof md.renderInline === 'function') {
    return md.renderInline(title.trim());
  }
  // 降级方案：手动剔除 <p> 标签（兼容非 markdown-it 环境）
  let html = md.render(title).trim();
  if (html.startsWith('<p>') && html.endsWith('</p>')) {
    return html.slice(3, -4);
  }
  return html;
}

function newRenderer(md, str)
{
  let res = [];
  const lns = str.split('\n');
  const isend = (s) => { s = s.trim(); if(s.length >= 3 && s == ':'.repeat(s.length)) return s.length; else return -1; }
  const getstart_f = (s) => { s = s.trim(); let x = s.indexOf('['), y = s.lastIndexOf(']'); if(x == -1 || y == -1) return null; if(!s.startsWith(':::')) return null; for(let i=0;;i++) if(s[i] != ':') return [i,s.substring(i,x),s.substring(x+1,y)]; };
  let vals = [];
  let vkp = [[]];
  let tmp = [];
  for(let i=0;i<lns.length;i++)
  {
    let p = isend(lns[i]);
    if(vals.length > 0 && p != -1 && p == vals[vals.length - 1].cnt)
    {
      if(tmp.length > 0) vkp[vkp.length - 1].push(md.render(tmp.join('\n')));
      tmp = [];
      let g = newRenderer(md, vkp[vkp.length - 1].join('\n'));
      // if(vals.length > 1) console.log('!!!\n', g, '!!!\n');
      vkp.pop();
      let res = renderTitle(md, vals[vals.length-1].title);
      vkp[vkp.length - 1].push(`<details class="fold-${vals[vals.length-1].type}">
          <summary>${res}</summary>
          <div class="fold-content">${g}</div>
        </details>`);
      vals.pop();
      continue;
    }
    let r = getstart_f(lns[i]);
    if(r == null)
    {
      tmp.push(lns[i]);
      // vkp[vkp.length - 1].push(lns[i]);
      continue;
    }
    else
    {
      if(tmp.length > 0) vkp[vkp.length - 1].push(md.render(tmp.join('\n')));
      tmp = [];
      vals.push({cnt: r[0], type: r[1], title: r[2]});
      vkp.push([]);
    }
  }
  if(tmp.length > 0) vkp[vkp.length - 1].push(md.render(tmp.join('\n')));
  let arp = [];
  while(vkp.length > 1)
  {
    let g = newRenderer(md, vkp[vkp.length - 1].join('\n'));
    vkp.pop();
    let res = renderTitle(md, vals[vals.length-1].title);
    vkp[vkp.length - 1].push(`<details class="fold-${vals[vals.length-1].type}">
        <summary>${res}</summary>
        <div class="fold-content">${g}</div>
      </details>`);
    vals.pop();
  }
  return vkp[0].join('\n');
}

hexo.extend.filter.register('markdown-it:renderer', function (md) {
  // console.log(1);

  md.block.ruler.before('fence', 'fold_block', function (state, startLine, endLine, silent)
  {
    // console.log(typeof(state));
    // console.log(state); while(true){};
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const lineText = state.src.slice(start, max);
    const isend = (s) => { s = s.trim(); if(s.length >= 3 && s == ':'.repeat(s.length)) return s.length; else return -1; }
    const getstart_f = (s) => { s = s.trim(); let x = s.indexOf('['), y = s.lastIndexOf(']'); if(x == -1 || y == -1) return null; if(!s.startsWith(':::')) return null; for(let i=0;;i++) if(s[i] != ':') return [i,s.substring(i,x),s.substring(x+1,y)]; };

    const startMatch = getstart_f(lineText);
    if (!startMatch) return false;
    let vals = [];
    let contentLines = [];
    let endLineFound = endLine;
    for(let i=startLine;i<endLine;i++)
    {
      let ibf = state.src.slice(state.bMarks[i] + state.tShift[i], state.eMarks[i]);
      contentLines.push(ibf);
      let p = isend(ibf);
      if(vals.length > 0 && p != -1 && p == vals[vals.length - 1].cnt)
      {
        if(vals.length == 1)
        {
          endLineFound = i;
          break;
        }
        vals.pop();
        continue;
      }
      let r = getstart_f(ibf);
      if(r == null) continue;
      else vals.push({cnt: r[0], type: r[1], title: r[2]});
    }
    const content = contentLines.join('\n');

    const token = state.push('fold_block', 'details', 0);
    token.block = true;
    token.info = vals[0].type;
    token.title = vals[0].title;
    token.content = content;
    token.map = [startLine, endLineFound + 1];

    state.line = endLineFound + 1;
    return true;
  });

  md.renderer.rules.fold_block = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    let content = token.content || '';

    return newRenderer(md, content);
  };
});
```

:::

欢迎来找 bug。

#### 居左/居中/居右排版

:::info[`script/newRenderer2.js`]

```javascript
// scripts/newRenderer2.js

function newRenderer2(md, str)
{
  let res = [];
  const lns = str.split('\n');
  const isend = (s) => { s = s.trim(); if(s.length >= 3 && s == ':'.repeat(s.length)) return s.length; else return -1; }
  const getstart_f = (s) => { s = s.trim(); let x = s.indexOf('{'), y = s.lastIndexOf('}'); if(x == -1 || y == -1) return null; if(!s.startsWith(':::')) return null; for(let i=0;;i++) if(s[i] != ':') { if(s.substring(i, x) == 'align') return [i,s.substring(x+1,y)]; else return null; } };
  let vals = [];
  let vkp = [[]];
  let tmp = [];
  for(let i=0;i<lns.length;i++)
  {
    let p = isend(lns[i]);
    if(vals.length > 0 && p != -1 && p == vals[vals.length - 1].cnt)
    {
      if(tmp.length > 0) vkp[vkp.length - 1].push(md.render(tmp.join('\n')));
      tmp = [];
      let g = newRenderer2(md, vkp[vkp.length - 1].join('\n'));
      // if(vals.length > 1) console.log('!!!\n', g, '!!!\n');
      vkp.pop();
      vkp[vkp.length - 1].push(`<div align="${vals[vals.length-1].ali}">
          ${g}
        </div>`);
      vals.pop();
      continue;
    }
    let r = getstart_f(lns[i]);
    if(r == null)
    {
      tmp.push(lns[i]);
      // vkp[vkp.length - 1].push(lns[i]);
      continue;
    }
    else
    {
      if(tmp.length > 0) vkp[vkp.length - 1].push(md.render(tmp.join('\n')));
      tmp = [];
      vals.push({cnt: r[0], ali: r[1]});
      vkp.push([]);
    }
  }
  if(tmp.length > 0) vkp[vkp.length - 1].push(md.render(tmp.join('\n')));
  let arp = [];
  while(vkp.length > 1)
  {
    let g = newRenderer2(md, vkp[vkp.length - 1].join('\n'));
    vkp.pop();
    vkp[vkp.length - 1].push(`<div align="${vals[vals.length-1].ali}">
          ${g}
        </div>`);
    vals.pop();
  }
  return vkp[0].join('\n');
}

hexo.extend.filter.register('markdown-it:renderer', function (md) {
  // console.log(2);

  md.block.ruler.after('fold_block', 'align', function (state, startLine, endLine, silent)
  {
    // console.log(typeof(state));
    // console.log(state); while(true){};
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const lineText = state.src.slice(start, max);
    const isend = (s) => { s = s.trim(); if(s.length >= 3 && s == ':'.repeat(s.length)) return s.length; else return -1; }
  const getstart_f = (s) => { s = s.trim(); let x = s.indexOf('{'), y = s.lastIndexOf('}'); if(x == -1 || y == -1) return null; if(!s.startsWith(':::')) return null; for(let i=0;;i++) if(s[i] != ':') { if(s.substring(i, x) == 'align') return [i,s.substring(x+1,y)]; else return null; } };

    const startMatch = getstart_f(lineText);
    if (!startMatch) return false;
    let vals = [];
    let contentLines = [];
    let endLineFound = endLine;
    for(let i=startLine;i<endLine;i++)
    {
      let ibf = state.src.slice(state.bMarks[i] + state.tShift[i], state.eMarks[i]);
      contentLines.push(ibf);
      let p = isend(ibf);
      if(vals.length > 0 && p != -1 && p == vals[vals.length - 1].cnt)
      {
        if(vals.length == 1)
        {
          endLineFound = i;
          break;
        }
        vals.pop();
        continue;
      }
      let r = getstart_f(ibf);
      if(r == null) continue;
      else vals.push({cnt: r[0], ali: r[1]});
    }
    const content = contentLines.join('\n');

    const token = state.push('align', 'details', 0);
    token.block = true;
    token.info = vals[0].type;
    token.title = vals[0].title;
    token.content = content;
    token.map = [startLine, endLineFound + 1];

    state.line = endLineFound + 1;
    return true;
  });

  md.renderer.rules.align = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    let content = token.content || '';

    return newRenderer2(md, content);
  };
});
```

:::

#### `anti-ai`

使用 `hexo-text-pipeline` 插件。使用下面的 `pipeline`：

:::info[`text-pipeline/anti-ai.js`]

```javascript
// text-pipeline/anti-ai.js
module.exports = {
  // 在 Markdown 渲染前处理（原始文本）
  stage: 'before_post_render',

  // 使用 replace 数组：每个元素为 [正则, 替换字符串]
  replace: [
    [
      // 匹配整行：行首可选空白 + ::anti-ai[...] + 行尾可选空白
      /^\s*::anti-ai\[[^\]]*\]\s*$/gm,
      ''  // 替换为空（即删除该行）
    ]
  ]
};
```

:::

## 阶段 $3$：Github Pages

在 Deepseek 老师的指导下搞了出来。

首先在 Hexo 根目录下 `git init` 一下。然后由于我们要实现的效果是访问 <https://cloudspots.github.io/hexo/> 而不是 <https://cloudspots.github.io/> 访问 Hexo 博客，所以我们新建一个仓库 `hexo`。

然后直接推到这个仓库下（Hexo 根目录下面有内置 `.gitignore` 文件。根据 Deepseek 老师的教诲，我们需要删除 `themes/next/.git` 文件夹，否则会挂掉）。配置一下 Github Actions，做完了！

现在 <https://cloudspots.github.io/hexo/> 就可以看到博客了。

巨佬 small\_lemon\_qwq 直接简单粗暴地把 `public` 文件夹传上去……听说能用，但有点难评。
