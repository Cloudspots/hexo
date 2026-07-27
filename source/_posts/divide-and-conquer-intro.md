---
title: 分治法入门
date: 2025-2-14 17:00:55
categories:
  - Algorithm & Theory
tags: []
---
感觉 LionBlaze 退化了，从学线段树退化成学分治法了。

---

分治，是一种解决问题的方法（不是算法），很多人猜测其名字来源于“分而治之”。分治法的框架如下：

1. 分割问题，并以递归地对分割出来的每一块分别解决；
1. 用神秘方法合并每一块问题的答案。

这就是十分可爱的分治法了。

通常情况下，难点在于合并。也有难点在于分割的情况。

同时，分析时间复杂度需要用到主定理（Master 定理），这个人太蒻了于是在这里给自己挖了个坑。

下面讲几个分治方法的例子。

# $1$ 归并排序算法

我们要对序列进行排序，这里为升序排序，降序见练习 $1.1$。

注意到，我们可以把序列尽量均分成两部分（能均分就均分，否则两者长度相差 $1$ 也行），然后分治求解。

如何合并？这就是典型的划分简单合并的问题。

## $1.1$ 合并

显然，直接把两部分拼在一起是不正确的[^1]。

[^1]: 显然 $2,1$ 就可以卡掉。但是一个更有意思的视角是从信息论的视角看，我们容易证明基于比较[^2]的排序方法的时间复杂度是 $\Omega(\log n!)=\Omega(n \log n)$（这个等于号怎么推的我不懂，可否有巨佬答个疑），显然归并排序是基于比较的，但是如果使用链表实现，并且这种合并方法正确，那么可以做到 $T(n)=2T(n\div 2)+\Theta(1)=\Theta(n)$ 的时间复杂度，矛盾。
[^2]: 这是一个术语，它是指只基于比较操作，而不是指基于比较。比如计数排序（桶排序）（$\mathcal O(V)$），基数排序（$\mathcal O(n \log V)$），利用 vEB 树进行的排序（$\mathcal O(n \log \log n)$）等的不算基于比较的排序方法。

但是我们注意到，我们可以采用类似双指针[^3]的算法。

[^3]: 我知道双指针是对于一个序列的，这个是对于两个序列的，所以加上了“类似”。但是双指针真的是这个算法的一个好名字——它用了两个指针。实际上，我们在归并排序中通常称其为 Merge 算法。

我们用两个指针（学习没有“指针”的语言（如 Java）的可以理解为下标），分别放在两个已经排序好的序列中。每一次，操作如下：

1. 如果两个指针都超过序列末尾了：结束。
2. 如果其中一个指针超尾，其中一个没超尾：在将要生成的“已排序序列”的末尾中加入那个没到头的指针指向的值，并将那个指针向后移一位。
3. 如果都没超尾：取两个指针中指向的值更小的那一个加到末尾，然后把对应指针向后移一位。

举个例子：

比如对序列 $1,9,9,8,2,4,4,3,6,0$[^4] 排序。

[^4]: 显然，$1998244360 = 998244353 + 1000000007$。

首先分为两部分，$1,9,9,8,2$ 和 $4,4,3,6,0$。

将两部分分别排序，排序的过程见练习 $1.2$。

排序后得到 $1,2,8,9,9$ 和 $0,3,4,4,6$。

那么我们的状态刚开始是这样的：

$$\begin{aligned}
\text{Result: }&\begin{matrix}\end{matrix}\\
\text{Left: }&\begin{matrix}1&2&8&9&9\\\uparrow\end{matrix}\\
\text{Right: }&\begin{matrix}0&3&4&4&6\\\uparrow\end{matrix}
\end{aligned}$$

插播一条消息：此处作者写 $\KaTeX\kern-25pt\LaTeX$（我受够了 $\LaTeX$ 和 $\KaTeX$ 的争论，所以准备折中一下（延伸阅读：数组下标从 $0$ 还是 $1$ 开始？我的回答是 $0.5$ —— Notepad++[^5]）（延伸阅读：离向心力 ——xkcd[^6]））手都快废了，大家快点个赞鼓励一下。

[^5]: 在 Notepad++ 中新建一个空文件，输入 `random` 并选中，然后按 F1，就会随机出现一句有意思的话，其中一句翻译成中文大概就是这个意思。这些话可以在 Notepad++ 源码中找到。

[^6]: 书中的原注释：我受够了离心力和向心力的争论，于是准备折中一下。[^7]

[^7]: 我忘了他是在 What if 1 还是 What if 2 还是 How to 中说的了。

第一次操作，由于 $0$ 更小，故选 $0$。

第一次操作之后：

$$\begin{aligned}
\text{Result: }&\begin{matrix}0\end{matrix}\\
\text{Left: }&\begin{matrix}1&2&8&9&9\\\uparrow\end{matrix}\\
\text{Right: }&\begin{matrix}0&3&4&4&6\\&\uparrow\end{matrix}
\end{aligned}$$

此时 $1$ 更小，于是选择 $1$。然后 $2$ 还是更小，于是选择 $2$。经过前三次操作后：

$$\begin{aligned}
\text{Result: }&\begin{matrix}0&1&2\end{matrix}\\
\text{Left: }&\begin{matrix}1&2&8&9&9\\&&\uparrow\end{matrix}\\
\text{Right: }&\begin{matrix}0&3&4&4&6\\&\uparrow\end{matrix}
\end{aligned}$$

此时序列 Right 连续四次都是最小，于是发生了：

$$\begin{aligned}
\text{Result: }&\begin{matrix}0&1&2&3&4&4&6\end{matrix}\\
\text{Left: }&\begin{matrix}1&2&8&9&9\\&&\uparrow\end{matrix}\\
\text{Right: }&\begin{matrix}0&3&4&4&6\\&&&&&\uparrow\end{matrix}
\end{aligned}$$

此时 Right 指针超尾了，于是持续选择 Left，最终结果：

$$\begin{aligned}
\text{Result: }&\begin{matrix}0&1&2&3&4&4&6&8&9&9\end{matrix}\\
\text{Left: }&\begin{matrix}1&2&8&9&9\\&&&&&\uparrow\end{matrix}\\
\text{Right: }&\begin{matrix}0&3&4&4&6\\&&&&&\uparrow\end{matrix}
\end{aligned}$$

结束。

Merge 伪代码：

$$ \begin{array}{ll}
1&\textbf{Input}\text{. }\textbf{array}\text{ }a,b\text{ are two sorted arrays.}\\
2&\textbf{Output}\text{. }\textbf{array}\text{ res has all elements in }a\text{ and }b\text{, and }c\text{ is sorted.}\\
3&\textbf{Method}\text{.}\\
4&\textbf{let}\text{ }s_x = \text{the address of begin}(a),s_y=\text{the address of begin}(b)\\
5&\textbf{let}\text{ }t_x = \text{the address of end}(a)+1,t_y = \text{the address of end}(b)+1\\
6&\textbf{let}\text{ res}=\text{an empty array}\\
&\textbf{Note}\text{. begin}(x)\text{ is the first element of array }x\text{, and end}(x)\text{ is the last element of array }x.\\
7&\textbf{repeat}\text{ }\textbf{until}\text{ }s_x=t_x\text{ and }s_y=t_y\text{:}\\
8&\qquad \textbf{if}\text{ }\text{value}(s_x)\le \text{value}(s_y)\text{:}\\
9&\qquad\qquad \text{put }s_x\text{ in the end of res}\\
&\qquad\qquad\begin{aligned}
\textbf{Note}\text{. }&\text{value}(x)\text{ is the value of address }x\text{ in the memory.}\\
&\text{If }x\text{ isn't a vaild pointer, value}(x)=+\infty\text{.}\end{aligned}\\
10&\qquad\qquad s_x \gets s_x + 1\\
11&\qquad \textbf{else}\\
12&\qquad\qquad \text{put }s_y\text{ in the end of res}\\
13&\qquad\qquad s_y \gets s_y + 1\\
14&\textbf{return}\text{ res}\\
\end{array} $$

$\KaTeX$ 伪代码比 C++ 代码长，谴责！

甚至还把 Markdown 第 $114$ 行占掉了，谴责！

## $1.2$ 总伪代码

$$ \begin{array}{ll}
1&\textbf{Input}\text{. an array }x\text{.}\\
2&\textbf{Output}\text{. an array }y\text{ contains and just contains all element in }x\text{.}\\
3&\textbf{Method}\text{.}\\
4&\text{MergeSort}(x)\text{:}\\
5&\qquad\textbf{let}\text{ }p=\text{the address of the middle element in }x\\
6&\qquad\textbf{set}\text{ the elements in }[\text{address}(\text{begin}(x)),p)=\text{MergeSort}(\text{the elements in }[\text{address}(\text{begin}(x)),p))\\
7&\qquad\textbf{set}\text{ \text{the elements in }[p,\text{address}(\text{end}(x))]}=\text{MergeSort}(\text{the elements in }[p,\text{address}(\text{end}(x))])\\
8&\qquad \textbf{set}\text{ }x = \text{Merge}(\text{the elements in }[\text{address}(\text{begin}(x)),p),\text{the elements in }[p,\text{address}(\text{end}(x))])\\
9&\qquad\textbf{return }x
\end{array} $$

## $1.3$ 一些感想&练习

此段选读。

可惜的是，通常情况下，[C++ STL 中的 `sort` 函数](https://zh.cppreference.com/w/cpp/algorithm/stable_sort)并不是归并排序，甚至没有用到归并排序。它是插入排序和[内省排序](https://zh.wikipedia.org/wiki/%E5%86%85%E7%9C%81%E6%8E%92%E5%BA%8F)的结合体，在序列较小时进行插入排序，否则使用[内省排序](https://oi-wiki.org/basic/quick-sort/#%E5%86%85%E7%9C%81%E6%8E%92%E5%BA%8F)[^8]。内省排序基于快速排序和堆排序，可以在通常情况下保持快速排序的高性能，但是最坏情况下快速排序是 $\mathcal O(n^2)$ 的，而内省排序在递归层数太多[^9]的时候转为堆排序，从而保证最坏时间复杂度。不过，快速排序也是一种分治算法，后面会讲。

[^8]: 第一个链接是 wikipedia 的链接，第二个是 OI-wiki 的链接。众所周知一个文字是不能对应两个链接的。

[^9]: 阀值设为元素个数的对数。

欣慰的是，[STL 中的 `stable_sort`](https://zh.cppreference.com/w/cpp/algorithm/stable_sort) 通常使用的是归并排序。

---

练习：

练习 $1.1$：写出将序列降序排序的归并排序算法的伪代码或某种语言的代码。如果你是用的语言中有内置的 `sort` 之类的排序函数，请不要使用。请使用归并排序算法。

练习 $1.2$：分别写出序列 $1,9,9,8,2$ 和 $4,4,3,6,0$ 的归并排序的全过程。

练习 $1.3$：使用归并排序实现 P1177【模板】排序。如果你真的想要练习，请自觉。

# $2$ 逆序对相关

## $2.1$ 简单逆序对

其实逆序对也是基于归并排序算法的。

逆序对是指，在一个数组内，存在 $i<j$ 且 $a_i>a_j$，则称其（指 $a_i$ 与 $a_j$）为一个逆序对。通常，要求你求出一个数组内逆序对个数。

朴素算法极其简单，是 $\Theta(n^2)$ 的。我们有没有更高效的算法呢？

有的兄弟，有的。.jpg

首先我们知道不能一直用 $+1$ 统计，因为逆序对数量是 $\Theta(n^2)$ 的。但凡只用到 $+\text{constant}$ 的都一定是很慢的。

我们同样可以使用分治算法解决这个问题。

> 显然我么可以用树状数组/线段树解决。但是分治法又好写又好写，为什么不用分治呢？

我们考虑逆序对的来源：左半部分的逆序对，右半部分的逆序对，和横跨左右两边的逆序对。

> 笔者曾经想到过另一种算法，就是把序列分成三段 $a,b,c$，令 $x+y$ 表示拼接 $x,y$ 两段，$L(x)$ 表示序列 $x$ 中的逆序对个数，那么答案为 $L(a+b+c)=L(a+b)+L(a+c)+L(b+c)-L(a)-L(b)-L(c)$，这样复杂度为 $T(n)=3T(2n\div 3)+3T(n\div 3)+\Theta(1)$，复杂度不会算反正比 $\Theta(n^2)$ 的朴素算法要劣，并且常数也很大。

左右的逆序对可以分治递归求解。横跨左右两边就是难点（合并）。

注意到如果左右两边都是有序（假设升序）的，那么一个 $x<y$ 就会导致所有比 $y$ 大 $z$ 的都满足 $x<z$，这样就可以看贡献。

注意到没有有序我们就创造有序，顺便归并排序一遍。

C++ 代码（实在不想写伪代码了，太 $\tiny\begin{matrix}\tiny\text{携手共创}\\\tiny\text{文明社区}\end{matrix}$ 了）：

```cpp
int a[500005], t1[500005], t2[500005];

long long merge(int *s1, int *t1, int *s2, int *t2, int *d)
{
	*t1 = *t2 = 2147483647;
	long long sum = 0;
	while(s1 != t1 || s2 != t2)
	{
		if(*s1 <= *s2) *(d++) = *(s1++);
		else
		{
			*(d++) = *(s2++);
			sum += (t1 - s1);
		}
	}
	return sum;
}

long long mergesort(int *s, int *t)
{
	if(s + 1 == t) return 0;
	int *mid = s + (t - s) / 2;
	long long sum = 0;
	sum += mergesort(s, mid); sum += mergesort(mid, t);
	memcpy(t1, s, (mid - s) * sizeof(int));
	memcpy(t2, mid, (t - mid) * sizeof(int));
	return sum += merge(t1, t1 + (mid - s), t2, t2 + (t - mid), s);
}
```

注意传入的是左闭右开区间，也就是类似 `std::sort` 的用法。

不得不说左闭右开区间在计算长度上真的有很多方便的地方。怪不得~~大家~~ STL 都在用。

例题：P1908 逆序对。这是模版题。

## $2.x$ 练习

练习 $2.1$：自己写出 P1908 的代码，并 AC。

练习 $2.2$：把序列 $a$ 中 $i<j$ 且 $a_i>2a_j$ 的元素称之为翻转对，实现 $\mathcal O(n \log n)$ 算法求翻转对个数。[solution](https://www.luogu.com.cn/paste/pyjdjr42)。

练习 $2.3$：

# 注解