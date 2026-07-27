---
title: 隐藏 Ynoi 题目背景
date: 2026-4-6 11:38:34
categories:
  - Technology & Engineering
tags: []
---
如果题目名称包含子串 `Ynoi`（不区分大小写）则把题目背景更改为“Ynoi 题目背景已隐藏”。

Tampermonkey 脚本：

```javascript
// ==UserScript==
// @name         隐藏 Ynoi 题目背景
// @namespace    http://tampermonkey.net/
// @version      2026-04-06
// @description  try to take over the world!
// @author       You
// @match        *://*.luogu.com.cn/problem/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    (new MutationObserver(() => { if(!window.location.href.includes("solution")) { let x=document.getElementsByClassName('lfe-caption problem-block-actions')[0].nextElementSibling; if(document.title.toLowerCase().includes('ynoi') && x.textContent == "题目背景" && x.nextSibling.children[0].innerHTML != '<p>Ynoi 题目背景已隐藏。</p>') { x.nextSibling.children[0].innerHTML = "<p>Ynoi 题目背景已隐藏。</p>"; }; }; }).observe(document.body, {childList:true, subtree:true, attributes:true}));
})();
```

- v0.0：随便写了一个。
- v0.1：发现打开 ide 之后会挂掉，因为元素位置变化了。使用另外的方法确定元素位置。
- v0.2：原本使用 `textContent` 偷懒来判断是否已经修改过，遇到[纯图片](https://www.luogu.com.cn/problem/P12014)会挂。使用 `innerHTML`。
- v0.3：适用洛谷新前端。
- v0.4：出现神秘 bug，神秘地修好。