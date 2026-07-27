---
title: 如何开启强力学术模式
date: 2025-1-14 18:40:20
categories:
  - Technology & Engineering
tags: []
---
众所周知洛谷自带的学术模式并不够用，导致了我~~在龙王榜上排名第一，并且我是回了 $\text{\sout{205}}$ 条，第二名 4041nofoundGeoge（我没拼错吧？）回了 $\text{\sout{150}}$ 多条~~被禁言。

什么你说我是发布强力学术之后被禁言的？那是因为没开。

什么你说我是因为工单被禁言的？别管那么多。

[这里](https://www.luogu.com.cn/article/h30kz85a)是作者好友开发的 $2.0$ 版本，orz。

所以如何开启强力的学术模式呢？

首先我们肯定要打开洛谷内置的学术模式。

然后我们安装 [Gooreplacer](https://chromewebstore.google.com/detail/gooreplacer/jnlkjeecojckkigmchmfoigphmgkgbip?pli=1) 插件（jnlkjeecojckkigmchmfoigphmgkgbip 是什么意思？）。

打开插件，点入“拦截”，我们会发现到了这样一个页面。

![](pEiGndU.png)

下面三条是作者加的。

我们可以通过点击“新增”，在匹配模式中填入 `www\.luogu\.com(\.cn)?/(chat|discuss|team|(user(?!/setting))|(article\?category=7))`，然后选择“正则表达式”来开启强力学术模式。

我们解析一下这个正则表达式：

1. `www\.luogu\.com(\.cn)?`：这是匹配洛谷，其中 `(\.cn)?` 代表可以有 `.cn` 也可以没有，同时匹配国内站和国际站。
2. `(chat|discuss|team|`：匹配私信、帖子和团队。如果要启用某一部分，直接把它删掉就好了，比如如果要访问帖子那么改成 `(chat|team`。
3. `(user(?!/setting))|`：匹配所有用户的页面，因为用户主页通常都有好看的。但是由于可能需要更新用户设置，所以加入了 `(?!/setting)`，这样就可以访问用户设置了。
4. `(article\?category=7))`：文章页面通常是可以访问的，但是不可以访问休闲·娱乐页面。

下一步：再增加 `lglg.top` 和 `benben.sbs` 的匹配项。注意这次选择的是“通配符”而非“正则表达式”。

再下一步：在 hosts 文件（Windows 系统通常位于 C:\Windows\System32\drivers\etc\HOSTS）的结尾加入下面的条目：

```plaintext
223.111.30.96 poki.cn
223.111.30.96 g8hh.com
223.111.30.96 www.360kuai.com
223.111.30.96 hao.360.com
223.111.30.96 hao.360.cn
223.111.30.96 www.so.com
223.111.30.96 g8hh.github.com
223.111.30.96 florr.io
223.111.30.96 diep.io
223.111.30.96 local.id.seewo.com
223.111.30.96 4399.com
223.111.30.96 poki.com
223.111.30.96 fun.360.cn
223.111.30.96 digdig.io
223.111.30.96 dinoswords.gg
# 再在后面填上你想要屏蔽的网站，格式为 223.111.30.96 网址
# 同时有收集游戏网站或其他网站的功能，嘻嘻。
```

> 私货：把 C++ Primer Plus 第六版中文版封面上的 C 看成了 sky 球怎么办啊……
