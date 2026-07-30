---
title: 不同编译器对于某 `#include` 的反应
date: 2024-12-19 14:21:18
categories:
  - Entertainment
tags: []
---
# `#include <con>/"con"`（我是 Windows 系统）

## VS

```plaintext
error C1083: 无法打开包括文件: “con”: No such file or directory
```

诈骗失败。

## G++

### `<con>`

```plaintext
main.cpp:5:15: fatal error: con: No such file or directory
 #include <con>
               ^
compilation terminated.
```

防诈骗。

### `"con"`

成功开始读控制台，但是因为 `#include` 是**直接包含**，所以我们输入这些东西之后按 Ctrl+Z = EOF：

```cpp
#include <cstdio>

using namespace std;

int main()
{
        printf("Hello World!\n");
        return 0;
}
```

结果是编译成功，输出 `Hello World!`。

# `#include __FILE__`

先解释一下，`__FILE__` 是当前源文件名称。

## VS
### Intellisense（我拼错了吗？）

```plaintext
#include 文件 "xxx" 包含自身。
```

防诈骗小能手。

### Compile

```plaintext
error C1014: 包含文件太多: 深度 = 1024
```

被骗。

## G++

```plaintext
In file included from main.cpp:5:0,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5,
                 from main.cpp:5:
main.cpp:5:18: error: #include nested too deeply
 #include __FILE__
```

被骗，但是可以看出最多套 $200$ 层。

# 双 `#include __FILE__`

即

```plaintext
#include __FILE__
#include __FILE__
```

## VS

和单个 `#include __FILE__` 一样。

## G++

惨，完全二叉树，理论上是至少 $2^{200}=1606938044258990275541962092341162602522202993782792835301376$ 行报错信息。
