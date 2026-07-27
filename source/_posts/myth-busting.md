---
title: 大家好我又来辟谣了
date: 2025-10-30 10:24:30
categories:
  - Algorithm & Theory
tags: []
---
流传着一种测量程序空间的方法（C++）。

```cpp
#include </*头文件*/>

char _begin;
// 你的所有变量，数组之类的
char _end;

int main()
{
  printf("Memory usage: %d Byte\n", &_end - &_begin);
  return 0;
}
```

假的。比如：

```cpp
#include <cstdio>

char _begin;
int arr[10000005];
char _end;

int main()
{
	printf("Memory usage: %d Byte\n", &_end - &_begin);
	return 0;
}
```

在我这边是 $1\mathrm{B}$。