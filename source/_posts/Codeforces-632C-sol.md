---
title: 题解：CF632C The Smallest String Concatenation
date: 2026-1-17 11:17:52
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
> 一眼题！按照数字大小排序，降橙！
>
> 怎么假了。
>
> 一眼题！按照字典序排序，降黄！
>
> 怎么又假了。
>
> 【打开题解】。
>
> 这么简单，建议降黄！

数学中有一种证明方法，邻项交换。

大概就是，如果某个方案可以通过交换相邻两个元素变成更好的方案，则这个方案不是最好的。这是显然的。

同时，如果比较的方法满足严格偏序关系，则如果不能比较就是最优的。证明很简单，如果有另一种方案不满足按照偏序从小到大，那么必然会有相邻的两个不满足从小到大，重复这样的调整，类似冒泡排序的过程，每次交换得到的解都必然不劣，那么排序的结果也必然不劣于原结果。

于是我们可以想到对于两个字符串 $x,y$，若 $x+y<y+x$ 则把 $x$ 放在前面。

这能对？？[^1]

首先比较需要满足严格偏序关系。

- 反自反性：$x+x<x+x$ 显然成立。
- 反对称性：若 $x+y<y+x$，则 $y+x<x+y$ 不成立。这个显然也是对的。
- 传递性：若 $x+y<y+x$，$y+z<z+y$，则 $x+z<z+x$。  
  字符串拼接没有很好的性质。  
  注意到 $(x+y,y+x)$，$(y+z,z+y)$，$(x+z,z+x)$ 长度相同，众所周知长度相同的字典序比较可以转化为数字比较。那么设 $\Sigma$ 为字符集大小，$a,b,c$ 分别为 $x,y,z$ 对应的 $\Sigma$ 进制数字，$|x|,|y|,|z|$ 为 $x,y,z$ 的长度。  
  则两个条件分别表示 $a\Sigma^{|y|}+b<b\Sigma^{|x|}+a$，$b\Sigma^{|z|}+c<c\Sigma^{|y|}+b$，需要证明 $a\Sigma^{|z|}+c<c\Sigma^{|x|}+a$。  
  既然变成了数字，我们就可以移项了。两个条件分别表明 $\dfrac{a}{\Sigma^{x}-1}<\dfrac{b}{\Sigma^{y}-1}$，$\dfrac{b}{\Sigma^{y}-1}<\dfrac{c}{\Sigma^{z}-1}$，由实数比较的传递性得到 $\dfrac{a}{\Sigma^{x}-1}<\dfrac{c}{\Sigma^{z}-1}$，证毕！$\square$。

然后就结束了。

:::info[为什么是蓝]
糊了一个排序方法就开始降降降。你第一眼能看出正解吗，感觉非常困难啊。除非你提前看了题解。

证明也是比较困难的，主要是证传递性，目前作者没有找到（找到的都没有看懂）纯用字符串的证明（不转成数字），而转成数字比较非常规，比较难想。

如果是按照证明难度那肯定是蓝甚至更高，但如果综合可能大概是绿。不过考虑到讨论结果（？）是证明难度那就应该是蓝。

代码难度简单？参见 CF1264F Beautiful Fibonacci Problem，停车场和所有的提交答案题。

想出做法简单？首先确保你自己没有看过题解，看过再说想出来简单是无意义的。还有所有大模拟不都是不用想都知道做法吗，只是实现过于困难而已。
:::

:::info[证明常见易错点]

- 认为 $x+y<y+x\iff x<y$。反例：$x=\texttt{32},y=\texttt{321}$。
- 由邻项交换，直接证毕！邻项交换是用来证一个东西不是最优解的，证最优解需要满足严格偏序关系。
- 由局部调整……这个更是错完了。也是得证偏序关系。

:::

:::info[代码&提交记录]

这个真的意义不大吧。

[submission](https://codeforces.com/contest/632/submission/358157570)。

```cpp
// 如何辨别 Lionblaze 是否睡醒
// 看他代码里有没有 using namespace std;。

// 怎么是字典序最小，我是唐逼
#include <cstdio>
#include <string>
#include <iostream>
#include <algorithm>

using namespace std;

string str[50005];

int main()
{
    int n;
    scanf("%d", &n);
    for(int i=1;i<=n;i++)
    {
        cin >> str[i];
    }
    sort(str + 1, str + n + 1, [](const auto &x, const auto &y) { return x + y < y + x; });
    for(int i=1;i<=n;i++)
    {
        printf("%s", str[i].c_str());
    }
    return 0;
}
```

:::

[^1]: 按照字典序排序，这能错？