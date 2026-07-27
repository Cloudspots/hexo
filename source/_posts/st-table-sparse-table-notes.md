---
title: ST 表，稀疏表和 Sparse Table 学习笔记
date: 2025-2-17 11:29:05
categories:
  - Unclassified
tags: []
---
> 关于标题：云吞，混沌和包面。

遇到某些“灵感突现”的地方，会用 */\* \*/* 包括。

# 前置知识

如何快速求出 $\lfloor\log_2x\rfloor$？

这里有几种方法。

- $\mathcal O(n)$ 打表，在 ST 表的应用中只需要打数字数量级别的表就行。
- 使用不可移植的 GCC 内部函数。
- 标准做法是使用 C++20 的 `bit_width` 函数再 $-1$，注意目前 NOI 系列比赛不能用。
- $\mathcal O(\log \log n)$ 的倍增做法。

四种方法的代码见下。

```cpp
enum class qwq123_mode
{
	GetTable,
	GCCInnerFunc,
	BitWidth,
	Binary,
	Default = Binary // 此处 Binary 可以换成上面的任意一个值
};
constexpr int value_range = 100005; // 值域（用于打表）
unsigned qwq123(unsigned x)
{
	switch(qwq123_mode::Default)
	{
	case qwq123_mode::GetTable:
		// 定义表类型，原因见下
		class TableType
		{
			int* table;
		public:
			TableType()
			{
				table = new int[value_range + 1];
				table[1] = 0;
				for (int i = 2; i <= value_range; i++)
				{
					table[i] = table[i >> 1] + 1;
				}
			}
			int get(int x) { return table[x]; }
		};
		// 使用语法糖实现自动打表
		// 利用 static 变量第一次声明自动初始化
		static TableType tt;
		return tt.get(x);
	case qwq123_mode::GCCInnerFunc: return 31 - __builtin_clz(x);
	case qwq123_mode::BitWidth: return bit_width(x) - 1;
	case qwq123_mode::Binary: 
		// 通常来讲，unsigned 比 int 快
		// 前提是不开编译器优化。聪明一点的编译器
		// 都会把可以用 unsigned 的 int
		// 替换成 unsigned。
		unsigned res = 0;
		// 事实上，应该是 res += 16
		// 但是其实两者等价。不开编译器优化时
		// |= 明显更快。
		if (x >> 16) { res |= 16; x >>= 16; }
		if (x >> 8) { res |= 8; x >>= 8; }
		if (x >> 4) { res |= 4; x >>= 4; }
		if (x >> 2) { res |= 2; x >>= 2; }
		// 最后不需要调整 x 了。
		if (x >> 1) { res |= 1; }
		return res;
	}
}
```

下面是测速结果。

- 打表做法：[总用时 $2.10\mathrm{s}$，最快点 $4\mathrm{ms}$，最慢点 $467\mathrm{ms}$](https://www.luogu.com.cn/record/205109982)。
- 内部函数：[总用时 $2.05\mathrm{s}$，最快点 $3\mathrm{ms}$，最慢点 $448\mathrm{ms}$](https://www.luogu.com.cn/record/205110025)。
- 标准做法：[总用时 $2.06\mathrm{s}$，最快点 $3\mathrm{ms}$，最慢点 $456\mathrm{ms}$](https://www.luogu.com.cn/record/205110104)。
- 倍增算法：[总用时 $2.10\mathrm{s}$，最快点 $3\mathrm{ms}$，最慢点 $488\mathrm{ms}$](https://www.luogu.com.cn/record/205110153)。

意料之中地，GCC 内部函数做法最快，标准做法其次。

# ST 表

ST 表（又名稀疏表，Sparse Table */\* 化为人形为 @[Sparse_Table](luogu://user/1046508)，又名 0x3f3f3f3f \*/*），是一种支持静态 RMQ 问题的 */\* 可爱的 \*/* 数据结构。

> 什么是 RMQ 问题？是 Range Maximum/Minimum Query 的缩写，表示区间最值。其实，ST 表不仅可以处理 RMQ 问题，还可以处理所有满足可重复贡献且满足结合律的问题（没错，这一段就是从 [OI-wiki](https://oi-wiki.org/ds/sparse-table/) 上抄的）。设操作为 $f(x,y)$，可重复贡献是指 $f(x,x)=x$，而满足结合律是指 $f(x,f(y,z))=f(f(x,y),z)$。**下面我们都假设操作为 $\bm{\max}$ 操作。**

它其实是一个 */\* 可爱的 \*/* 二维数组。通常情况下，我们使用 $f_{i,j}$ 表示 $\displaystyle\max_{k=i}^{i+2^j-1}a_k$，但是事实证明这种表示方法并不是很好。

> 为什么？第一个原因是因为 cache 不友好，为啥不友好详见后面的预处理部分。第二个原因是因为作者常写的边度边预处理在这种表示法下不好写也不好看，作者习惯的是 $\displaystyle f_{j,i}=\max_{k=i-2^j+1}^{i}a_k$。**以下都用这种表示方法。**
>
> 测速结果（均使用 GCC 内置函数算 $\log$）：
>
> - cache 不友好：[$2.05 \mathrm{s}$](https://www.luogu.com.cn/record/205110025)。
> - cache 友好：[$1.87 \mathrm{s}$](https://www.luogu.com.cn/record/205111445)。

## 预处理

显然是递推。

我们注意到区间 $[x, x+2^j)$ 可以分为两部分，$[x,x+2^{j-1})$ 和 $[x+2^{j-1},x+2^j)$（看过我的线段树文章的估计对这个东西比较熟悉）。递推即可。递推式为 $f_{i,j}=\max(f_{i-1,j},f_{i-1,j-2^{i-1}})$，时间复杂度显然是 $\mathcal O(n \log n)$，显然这个递推式是时间复杂度上最优的。

我们发现一件事情：转移顺序？

显然第一维从 $i$ 还是 $j$ 开始转移都没毛病。然而，显然先枚举 $j$ 的做法难以处理“在 ST 表之后添加数字”，而先枚举 $i$ 可以，所以通常情况下我们先枚举 $j$。

## 查询

现在可重复贡献的优势就来了。

若 $x,y$ 是两个集合，则显然 $\displaystyle\max\left(\max_{i \in x} i,\max_{i\in y}i\right)=\max_{i \in x \cup y}i$。

那么如果 $x \cup y = [a,b]$，那么取 $k=2^{\log(b-a+1)}$，构造 $x=[a,a+2^k-1]$ 与 $y=[b-2^k+1,b]$，容易发现满足条件，且都可以使用 ST 表中的元素表示。时间复杂度取决于 $k$ 的计算复杂度，通常视为 $\Theta(1)$。

> 有人会说：需要遍历每一位，至少 $\Theta(\log V)$，不可能做到 $\Theta(1)$。其实，这和并查集（带路径压缩和按秩合并）时间复杂度 $\mathcal O(\alpha(n))$ 通常视为 $\mathcal O(1)$ 差不多的道理，因为 $\log V$ 太小，所以视作 $\Theta(\log V)$ 除了增加分析复杂度之外并没有什么好处。通常视为 $\Theta(1)$。这就是典型的说自己严谨实际上是钻牛角尖……

# 例题

## P3865 模板题

[P3865](https://www.luogu.com.cn/problem/P3865)。模板题。不讲了。代码：

```cpp
#include <bit>
#include <cstdio>
#include <algorithm>

using namespace std;

int a[100005], st[25][100005];
enum class qwq123_mode
{
	GetTable,
	GCCInnerFunc,
	BitWidth,
	Binary,
	Default = GCCInnerFunc
};
constexpr int value_range = 100005; // 值域
unsigned qwq123(unsigned x)
{
	switch(qwq123_mode::Default)
	{
	case qwq123_mode::GetTable:
		// 定义表类型，原因见下
		class TableType
		{
			int* table;
		public:
			TableType()
			{
				table = new int[value_range + 1];
				table[1] = 0;
				for (int i = 2; i <= value_range; i++)
				{
					table[i] = table[i >> 1] + 1;
				}
			}
			int get(int x) { return table[x]; }
		};
		// 使用语法糖实现自动打表
		// 利用 static 变量第一次声明自动初始化
		static TableType tt;
		return tt.get(x);
	case qwq123_mode::GCCInnerFunc: return 31 - __builtin_clz(x);
	case qwq123_mode::BitWidth: return bit_width(x) - 1;
	case qwq123_mode::Binary: 
		// 通常来讲，unsigned 比 int 快
		// 前提是不开编译器优化。聪明一点的编译器
		// 都会把可以用 unsigned 的 int
		// 替换成 unsigned。
		unsigned res = 0;
		// 事实上，应该是 res += 16
		// 但是其实两者等价。不开编译器优化时
		// |= 明显更快。
		if (x >> 16) { res |= 16; x >>= 16; }
		if (x >> 8) { res |= 8; x >>= 8; }
		if (x >> 4) { res |= 4; x >>= 4; }
		if (x >> 2) { res |= 2; x >>= 2; }
		// 最后不需要调整 x 了。
		if (x >> 1) { res |= 1; }
		return res;
	}
}

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	for (int i = 1; i <= n; i++)
	{
		scanf("%d", st[0] + i);
		for (int j = 1; (i - (1 << j)) >= 0; j++)
		{
			st[j][i] = max(st[j - 1][i], st[j - 1][i - (1 << (j - 1))]);
		}
	}
	for (int i = 1; i <= m; i++)
	{
		unsigned x, y;
		scanf("%u%u", &x, &y);
		unsigned len = y - x + 1, llen = qwq123(len), lllen = 1 << llen;
		printf("%d\n", max(st[llen][x + lllen - 1], st[llen][y]));
	}
	return 0;
}
```

[record](https://www.luogu.com.cn/record/205111445)。

## P1198 尾插数字

在尾部插入数字。强制在线。

动态构建 ST 表即可。



# 习题

P1714。注：此题 ST 表并不是最优做法，存在单调队列的线性做法。但是 ST 表也能过。

注意溢出。

[record](https://www.luogu.com.cn/record/205170268)。代码请由读者自行完成。

> 如果你看了我的代码：为什么我求 $\log$ 用的是 `bit_width`？因为本地 IDE MSVC 不支持 `__buildin_clz`。

P8818。注：这题似乎 ST 表已经不是主要的了，主要是你有一个清醒的大脑……另外我原本想放到习题里面，想了想还是放到例题里面比较好，但是不知道怎么讲于是又放到习题里面了。