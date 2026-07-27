---
title: 离线洛谷题库（Markdown 版）
date: 2025-9-10 11:06:35
categories:
  - Technology & Engineering
tags: []
---
> 感觉在造轮子，不管了。本人是 Python 新手，轻喷。

## 简介

注意：因为输出是 Markdown 所以你需要 Markdown 渲染。这很简单，比如 VSCode 的 Markdownlint 插件就可以，VS 好像是原生就支持但是貌似不能直接渲染 $\KaTeX$。同时你还需要能够执行 Python 代码。

由[洛谷开放平台的评测能力页面](https://docs.lgapi.cn/open/judge/)，我们得知可以在 <https://cdn.luogu.com.cn/problemset-open/latest.ndjson.gz> 下载洛谷题库数据。解压后是 JSON 格式，所以我写了一个 Python 程序，将 JSON 转换为 Markdown，这样就可以在本地看洛谷的题了（没有 RMJ 的，但是有 P&B 题库的）。

> 我不知道你们有没有这个需求，但是我因为一些原因是经常坐时间比较长的地铁的。就需要这个。

同时，因为下载的文件只有语言是题目原文的版本，这个我也无能为力。一些题目只能获取到英文版之类的，生成的 Markdown 也就只有英文版。

使用方法是把 JSON 文件和下面的 Python 代码放在同一个目录下，重命名为 `problem (origin).json`，然后运行 Python 代码，输入题号就可以生成。测试过目前所有的题目，代码都没有报错，生成结果我不可能都看一遍但是应该没啥问题。有问题/建议欢迎指出。

生成的 Markdown 会有一堆警告，但是可以正常渲染。实际上，洛谷题目上的 Markdown 本来就有一堆警告。同时，洛谷 $2025$ 年 $7$ 月更新的 Markdown 语法能否渲染取决于你的 Markdown 渲染器能否渲染。反正我的 markdownlint 是不行的。

## 代码

```python
import json as j
import re as r
import functools as fcts
pid = input("请输入题号：")
with open("./problem (origin).json", "r") as f:
    for k in f.readlines():
        if k.find("{\"pid\":\"" + pid + "\",") != -1:
            print("找到题目！")
            print("正在解析 JSON…")
            info = j.JSONDecoder().decode(k)
            print("正在创建文件…")
            with open("./" + pid + "_markdown.md", "w", encoding='utf-8') as o:
                print("写入标题…")
                print("# " + pid + " " + info['title'], end = "\n\n", file = o)
                print("写入题目背景…")
                if info['background'] == None or info['background'].replace(' ', '').replace('\t', '').replace('\n', '') == "":
                    print("题目背景为空。")
                else:
                    print("题目背景非空。")
                    print("## 题目背景", end = "\n\n", file = o)
                    print(info['background'], file = o)
                print("写入题目描述…")
                print("\n## 题目描述\n", file = o)
                print(info['description'], file = o)
                print("写入输入输出格式…")
                print("\n## 输入格式\n", file = o)
                print(info['inputFormat'], file = o)
                print("\n## 输出格式\n", file = o)
                print(info['outputFormat'], file = o)
                print("写入样例…")
                print("\n## 输入输出样例\n", file = o)
                for i in range(len(info['samples'])):
                    # 我觉得样例不会【数据删除】到包含一行的 ``` 符号，你们觉得呢
                    # 如果有我就加个检测改成 ~~~，如果都包含那么我就要【数据删除】出题人了。
                    # 目前没有发现题库中这样的题，先不加判断
                    print("写入第 " + str(i + 1) + " 个样例…")
                    print("### 样例 " + str(i + 1), end = "\n\n", file = o)
                    print("样例 " + str(i+1) + " 输入：", end = "\n\n", file = o)
                    print("```plaintext", file = o)
                    print("写入样例输入…")
                    print(info['samples'][i][0].rstrip('\n'), file = o)
                    print("```", file = o)
                    print("样例 " + str(i+1) + " 输出：", file = o)
                    print("```plaintext", file = o)
                    print("写入样例输出")
                    print(info['samples'][i][1].rstrip('\n'), file = o)
                    print("```", file = o)
                if len(info['samples']) == 0:
                    print("没有找到样例。")
                    print("无。", file = o)
                print("写入说明提示…")
                print("## 说明/提示", file = o)
                print(info['hint'], file = o)
                print("写入附加信息（包括时间限制、空间限制、题目难度与标签）…")
                print("## 附加信息", file = o)
                if len(info['limits']['time']) == 0:
                    print('没有找到测试点。')
                    print("无测试点。", file = o)
                else:
                    gt = lambda x: "$" + (f"{x}" + "\\mathrm{ms}" if x <= 999 else f"{x/1000}" + "\\mathrm{s}") + "$"
                    gm = lambda x: "$" + (f"{x}" + "\\mathrm{KB}" if x <= 1023 else ("{:.2f}".format(x/1024) + "\\mathrm{MB}" + (f"({x}" + "\\mathrm{KB}" + ")" if float("{:.2f}".format(x/1024)) != x/1024 else ""))) + "$"
                    print("写入最大/最小时间/空间限制…")
                    tmin = min(info['limits']['time'])
                    tmax = max(info['limits']['time'])
                    mmin = min(info['limits']['memory'])
                    mmax = max(info['limits']['memory'])
                    if tmin == tmax:
                        print(f"时间限制：{gt(tmin)}  ", file = o)
                    else:
                        print(f"时间限制：{gt(tmin)} \\~ {gt(tmax)}  ", file = o)
                    if mmin == mmax:
                        print(f"空间限制：{gm(mmin)}", end = "\n\n", file = o)
                    else:
                        print(f"空间限制：{gm(mmin)} \\~ {gm(mmax)}", end = "\n\n", file = o)
                    print("写入时空限制表格…")
                    print("### 时空限制", file = o)
                    print('写入表头…')
                    print(end = '| 限制 |', file = o)
                    for i in range(len(info['limits']['time'])):
                        print(end = ' 测试点 $' + str(i + 1) + '$ |', file = o)
                    print('写入对齐信息…')
                    print('\n' + '|:-----' * len(info['limits']['time']) + '|:-----|', file = o)
                    print('写入时间限制…')
                    print(end = "| 时间限制 |", file = o)
                    for i in info['limits']['time']:
                        print(end = f" {gt(i)} |", file = o)
                    print('写入空间限制…')
                    print(end = "\n| 空间限制 |", file = o)
                    for i in info['limits']['memory']:
                        print(end = f" {gm(i)} |", file = o)
                    print(file = o)
                print('写入难度与标签…')
                print("### 难度与标签", file = o)
                print("难度：" + ["暂未评定","入门","普及-","普及/提高-","普及+/提高","提高+/省选-","省选/NOI-","NOI/NOI+/CTSC"][info['difficulty']], end = "。\n\n", file = o)
                print("标签：" + (fcts.reduce(lambda x,y: x+"、"+y, info['tags']) if info['tags'] != [] else "无"), end = "。\n", file = o)
                break
    else:
        print("无法找到题目！")
        exit(1)
# 我的代码有错别字吗 awa
```

## 效果

对于目前 JSON 文件最后一行的题目 P14001，理论上来讲因为上面的代码是逐行判断的，所以代码应当跑得最慢（解析题目和写入文件时间太短可以不管）。实际上，大概使用 $1$ 秒钟就可以跑出 P14001 的结果。一两分钟就可以跑出整个题库的结果了（需要对代码进行一定的更改，使其一次性跑出所有结果）。

放几张运行截图。

![](pVRU0zV.png)

![](pVRUrsU.png)

![](pVRU6Z4.png)

![](pVRUcdJ.png)

> 写完文章后发现怎么下载的文件中没有无数据的题啊！！某个判断白加了。