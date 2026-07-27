---
title: 题解：P10815 【模板】快速读入
date: 2024-7-29 14:06:59
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
~~制约接触作战！~~

update on 2025/2/25：应[洛谷模板题题解规范](https://www.luogu.com.cn/discuss/1061716)，更改了排版。

# 算法介绍

鉴于某些时间复杂度严格的题目需要较大输入量，而输入很多数字（比如对于 C++，直接使用 `scanf` 或 `cin`）很可能导致 TLE，这个时候就需要使用快速读入算法。

而快速读入有很多种版本，最慢的版本大概就是直接使用 `getchar()` 了。但是其实不同的版本，思路都基本一样：秦九韶算法，或者使用乘法分配律的位值原理。

简要概括一下：思路是 $\overline{a_1a_2a_3\dots a_n}=(((\dots((a_1 \times 10 + a_2) \times 10 +a_3) \times 10 + a_4 \dots)\times 10 + a_{n-2})\times 10 + a_{n-1})\times 10 +a_n$。

那么我们就可以每读入一个字符就把之前的结果 $\times 10$，然后加上这个字符对应的值。

而时间复杂度达到了理论下界 $\mathcal O(\log V)$，不过达到这个理论下界极其容易。快速读入是用来卡常的。

# 正确性证明

> 如果算法本身正确性和复杂度比较显然，这一部分可以略过。 ——[洛谷模板题题解规范](https://www.luogu.com.cn/discuss/1061716)

显然。略。

# 代码实现

主函数：

```cpp
int main()
{
    int n = fastread();
    unsigned long long sum = 0;
    while(n--)
    {
        sum += fastread();
    }
    printf("%lld\n", (long long)sum);
    return 0;
}
```

## 慢

使用 `getchar` 实现。

```cpp
inline unsigned long long fastread()
{
    char ch;
    while((ch = getchar()) == ' ' || ch == '\n'); // 跳过空白字符中的两个。注意，在某些不负责任的数据师造的数据中，还可能有 \r 符号，也需要判断。
    unsigned long long flag = (ch != '-' ? 1 : ((ch = getchar()), -1)); // 是否是负数。
    unsigned long long a = 0;
    do
    {
        a = (a << 3) + (a << 1) + ch - '0'; // a << 3 代表 a * 2³，<<1 同理，相加即为乘十。而 ch - '0' 即为字符转数字。
        ch = getchar();
    } while(ch >= '0' && ch <= '9');
    return a * flag;
}
```

## 快

拿出珍藏（指掉了十几页）的《程序员的自我修养》，然后看到，在 Linux 下，`getchar` 使用了 `fread`，然后 `fread` 使用了 `read`，然后 `read` 触发了中断，最终调用到内核中的 `sys_read`（当然没这么简单，这是简化过的，不过大概就是这样）。

当然，我们不能去直接调用内核中的 `sys_read` 函数，所以我们可以直接调用到的最底层的函数是 `read` 函数，位于 `<unistd.h>` 中。

`read` 函数的用法：
```cpp
int read(int handle, char *buffer, int size);
```
`handle` 表示输入句柄，在 Linux 下的文件句柄都表示为一个 `int` 值，而标准输入的文件句柄为 $0$，标准输出的文件句柄为 $1$，标准错误的文件句柄为 $2$。

`buffer` 表示输入缓冲，其实就是要把输入存放到哪里，可以是一个 `char` 数组也可以是一个 `char` 指针。

`size` 表示最大输入长度，为什么说“最大”呢，因为有时候文件剩余部分并没有这么长，比如文件剩余还没有读入的内容是 `abc`，此时设置 `size = 5`，就读不满。

而它的返回值就是实际读入了多少个字节，不包括最后的 `EOF`。

比如：
```cpp
char ch;
char buffer[10];
read(0, &ch, 1);
int rlen = read(0, buffer, 5);
```
意思是先从标准输入中读取一个字节存入到 `ch` 中，再读入 $5$ 个字节存入到 `buffer` 中，并且把实际读入到 `buffer` 中的字符个数存入到 `rlen` 中。

如果标准输入中的内容是 `abcabcabc`，则 `ch` 的值就是 `'a'`，`buffer` 就是 `"bcabc"`（最后还有个 `'\0'`），`rlen` 就是 $5$。

如果标准输入中的内容是 `1uogu`，则 `ch` 的值就是 `'1'`，`buffer` 就是 `"uogu"`，`rlen` 就是 $4$。

于是，我们就可以通过 `read` 函数实现快读了！

代码：
```cpp
#include <cstdio>
#include <unistd.h>

using namespace std;

inline int fastread()
{
    char ch;
    do
    {
        read(0, &ch, 1);
    } while(ch == ' ' || ch == '\n');
    int flag = (ch != '-' ? 1 : (read(0, &ch, 1) * 0 + -1));
    int a = 0;
    do
    {
        a = a * 10 + ch - '0';
        read(0, &ch, 1);
    } while(ch >= '0' && ch <= '9');
    return a * flag;
}
```
然而，我们发现 TLE 了三个点，还不如 `getchar` 好呢。

这是为什么呢？

因为 `getchar`（和 `scanf` 等）使用了缓冲机制，毕竟读文件其实本身就是非常慢的，所以 `getchar` 就提前把文件中的前几个字节存入到内存中，具体存入多少个字节呢？不能太小，不然就跟没有一样。不能太大，否则就需要去访问内存，不能直接访问 `cache`，访问内存同样很慢。而存放这些字符的数组就叫缓冲区，也叫缓存。

比如文件中是 `LionBlaze is a jvruo`，`getchar` 的缓冲长度为 `10`（实际上太小了，这里仅仅是举例子），那么第一次 `getchar` 时，`LionBlaze `（注意后面有一个空格）就被存入到了缓冲区中。而如果后面我们又调用了 $9$ 次 `getchar`，就不会去直接访问文件，因为前 $10$ 个字符就在内存（大概率是 cache）中，可以直接要。如果后面又调用了一次 `getchar`，也就是读取文件的第 $11$ 个字符，但是缓存中没有，于是 `getchar` 就会再读取 $10$ 个字符到缓存中，缓存就变成了 `is a jvruo`，此后如果继续调用 `getchar` 也不用访问文件了。

但是 `read` 函数并没有使用缓冲机制，导致每次都需要访问文件。

那怎么办？难不成继续用 `getchar`？不需要。

可以使用一个好东西，叫做 `getchar_unlocked`，~~只在 Linux 下能用~~在 Windows 下也能用，叫做 `_getchar_nolock`，显然都是非标准的。因为 `getchar` 还加入了锁，为了防止多线程竞争。而 `getchar_unlocked` 就没有加锁，会快一点，但是需要保证不会有多个线程同时读取。这种方法可以 AC，只需要把原本使用 `getchar` 的快读中的所有 `getchar` 换成 `getchar_unlocked` 即可。

但是，如果没有缓冲机制，我们为什么不自己写一个呢？

```cpp
char buffer[32769]; // 缓冲区
unsigned li = 0; // 缓冲区指针，记录到了哪个位置

inline char my_getchar()
{
    if(buffer[li] == '\0') // 缓冲区已满，刷新缓冲区
    {
        buffer[read(0, buffer, 32768)] = '\0'; // 读文件，文件句柄为 0（标准读入），缓冲区为 buffer，大小为 32768（通常是 cache 大小）。
        li = 0; // 更新缓冲区指针
    }
    return buffer[li++]; // 返回缓冲区的下一个字符，并且增加指针
}
```
同理，我们只需要把原本使用 `getchar` 的快读前面加上上面的代码，再把所有的 `getchar` 替换成我们的 `my_getchar` 即可，比[使用 `getchar_unlocked` 的代码](https://www.luogu.com.cn/record/190239015)快 $440$ 毫秒！

另外此题 [O2](https://www.luogu.com.cn/record/190236461) 和[没有 O2](https://www.luogu.com.cn/record/190236506) 一模一样，O2 慢了 $3$ 毫秒……大概是评测机波动。

## 更快

update on 2025/1/15：

> ![](hu0gfpdv.png) / [P6013](https://www.luogu.com.cn/problem/P6103)。

众所周知 `unsigned` 大部分情况是比 `int` 快的。这是为什么呢？

1. ~~它溢出不会出现 UB——这利于编译器优化。~~ 没有 UB 反而编译器优化，比如 `int` 就可以把类似 `x+1>x` 优化为 `true`，而 `unsigned` 不可以。
2. 它不用考虑符号位，有些运算比较简单。如 `int` 不可以把 `x * 2` 优化为 `x << 1`，而 `unsigned` 可以。

并且它还有一个特性，就是我们容易从同余角度证明，在模任何数意义下，都有 $a - b = a + (-b)$。而 `unsigned` 本质上就是在模 $2^{32}$ 意义下的正整数。

于是我们就可以利用这一点来优化我们的快读，就是把 `int` 全部转化为 `unsigned`。

这就有了一个问题：虽然 `unsigned + (-unsigned) == unsigned - unsigned`，但是这不意味着 `long long + (-unsigned) == long long - unsigned`，然而和需要开 `long long`。

一个显而易见的解决方法是，全部都用 `unsigned long long`，但是这真的不会让常数增大吗？

由于评测机是先进的 $64$ 位系统，所以常数相同。最终可以优化数十毫秒。

# 结语

快速读入是一种没有什么用的东西。当你需要快速读入时，先想想你的算法是不是最高效的吧。

另外有一个巨佬的光速读入，有时间我去搞清楚来讲讲。

鸣谢名单（不分先后）：

- @[normalpcer](luogu://user/745184) 指出对于自然溢出为什么快的分析错误，已修改。
- @[W1ngD1nGa5ter](luogu://user/521554) 提供关于“自然溢出啥事没有”的出处，已修改。