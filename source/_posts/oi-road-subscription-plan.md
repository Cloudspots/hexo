---
title: OI 之路 - 订阅计划。
date: 2024-11-28 22:16:26
categories:
  - Entertainment
tags: []
---
在本专栏下回复“dy”可以订阅，回复“td”可以退订，回复不合法内容触发惊喜。

[回到小说](https://www.luogu.com.cn/article/lv15w0ny)

订阅：每次更新会批量发送私信。每人一条。

订阅（@ 版）：回复“qh”从普通订阅切换到 @ 版订阅，或者从 @ 版订阅切换到普通订阅，会在某帖子里面 @ 你。

订阅名单：Han_Si_Ying(UID = 1334245),wangshengchen(UID = 1400450),0x3f3f3f3f3f3f(UID = 1046508),Finchpaw(UID = 663291),xuchong123321(UID = 754840),liuhuayang(UID = 1259135),yqz1005(UID = 1070340),\_\_QWQ\_qwq\_\_(UID = 845367)

脚本：

```javascript
async function f(u, s) {
    await fetch("https://www.luogu.com.cn/api/chat/new", {
        headers: [["content-type", "application/json"], ["referer", "https://www.luogu.com.cn/"], ["x-csrf-token", document.querySelector("meta[name=csrf-token]").content], ],
        body: JSON.stringify({
            user: u,
            content: s,
        }),
        method: "POST",
    });
}
(function() {
    var str="【自动发送】OI 之路更新啦！快来看看吧！\n>-- https://www.luogu.com.cn/article/lv15w0ny --<";
    f(1334245, str)
    f(1400450, str)
    f(1046508, str)
    f(663291, str)
    f(754840, str)
    f(1259135, str)
    f(1070340, str)
    f(845367, str)
}
)();

```

订阅（@ 版）名单：taoruiguo120（UID = 1390411）。

第一次发送：

```plaintext
@[taoruiguo120](luogu://user/1390411)
```