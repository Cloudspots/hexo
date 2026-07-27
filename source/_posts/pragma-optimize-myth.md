---
title: 打击谣言，从我做起。#pragma G++/GNU optimize 没有用
date: 2025-8-9 21:41:57
categories:
  - Technology & Engineering
tags: []
---
这两个选项是流传已久的**谣言**。

你自己拿 gcc/g++ 试一下就会知道 `#pragma G++` 和 `#pragma GNU optimize` 没用（在 `-Wall` 选项下会报警告 `ignoring '#pragma G ' [-Wunknown-pragmas]` 或 `ignoring '#pragma GNU optimize' [-Wunknown-pragmas]`）。

```plaintext
PS【数据删除】> g++ -std=c++11 -Wall ./main.cpp -o main -Wextra
./main.cpp:1: warning: ignoring '#pragma G ' [-Wunknown-pragmas]
    1 | #pragma G++ optimize(2)
PS【数据删除】> g++ -std=c++11 -Wall ./main.cpp -o main -Wextra
./main.cpp:1: warning: ignoring '#pragma GNU optimize' [-Wunknown-pragmas]
    1 | #pragma GNU optimize(2)
```