---
title: 题解：P15275 [IOI 2016] Unscrambling a Messy Bug 解读 Bug
date: 2026-5-3 18:40:54
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
先看部分分。以下 $\log$ 默认为 $\log_2$。

- Subtask 1：$2^n$，给暴力用的。
- Subtask 2：$w$ 是 $2n\log n$，$r$ 是 $n^2$。
- Subtask 3：$w$ 是 $n^2$，$r$ 是 $2n\log n$。
- Subtask 4：$w$ 是 $2n\log n$，$r$ 是 $2n\log n$。
- Subtask 5：$w$ 是 $n\log n$，$r$ 是 $n\log n$。

出现 $\log$，有两种可能：一种是某些数据结构（如树状数组）的形态，另一种是分治（其实前者本身就属于后者）。

考虑分治。

我们先不考虑必须要先插入后查询的问题，假设可以边插入边查询。

那么我们就考虑如何把“当前区间对应的数字的集合 $S$”分为”当前区间的左半部分对应的集合 $S_L$“和”当前区间的右半部分对应的集合 $S_R$”。

这个并不是很困难，因为左半部分和有半部分我们是知道的。所以我们就可以，对于所有处于左半部分的数字 $i$，插入 $e_i$ 满足第 $i$ 个数字为 $1$，其余为 $0$。然后对于所有区间内的数字 $j$ 判断 $e_j$ 是否存在，如果存在则说明某个在左边的数字映射到了 $j$，否则说明某个右边的数字映射到了 $j$。容易发现总插入个数是 $\dfrac{n\log n}{2}$，查询次数是 $n\log n$。

现在只剩下一个问题了：实际上要求先插入后查询。这个也不是很困难，只要我们能够把某个区间内的 $e$ 和其它区间的 $e$ 区分开来就行了。

首先我们要能够区分大小不同的区间。我们想到把所有区间之外的元素都置为 $1$。然后我们发现大小相同的区间也能这样区分了。

插入和查询次数不变。此题得解。

另外，如果你能够做到 $o(n\log n)$ 次查询，那么你就可以拿到诺贝尔信息学奖了（我们有信息论，最小查询次数是 $\log(n!)=\Theta(n\log n)$）。

:::info[rec&code]
[rec](https://www.luogu.com.cn/record/276468762)。

```cpp
#include<vector>
#include<string>
extern "C"
{
	void add_element(std::string x);
	bool check_element(std::string x);
	void compile_set();
	std::vector<int> restore_permutation(int n, int w, int r);
}
#include <vector>
#include <algorithm>

using namespace std;

static auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

vector<int> restore_permutation(int n, int, int)
{
	U([&](auto &&self, int l, int r) -> void
	{
		if(l == r) return;
		for(int i=l;i<=(l+r)/2;i++)
		{
			string str(n, '1');
			for(int j=l;j<=r;j++) str[j] = '0';
			str[i] = '1';
			add_element(str);
		}
		self(self, l, (l + r) / 2);
		self(self, (l + r) / 2 + 1, r);
	})(0, n-1);
	compile_set();
	vector<int> vt;
	for(int i=0;i<n;i++) vt.push_back(i);
	vector<int> ans(n, 0);
	U([&](auto &&self, int l, int r, vector<int> may) -> void
	{
		// printf("l = %d, r = %d, may = ", l, r);
		// for(int x : may) printf("%d ", x);
		// printf("\n"); fflush(stdout);
		if(l == r)
		{
			ans[may[0]] = l;
			return;
		}
		vector<int> alpha, beta;
		for(int i : may)
		{
			string str(n, '1');
			for(int j : may) str[j] = '0';
			str[i] = '1';
			if(check_element(str)) alpha.push_back(i);
			else beta.push_back(i);
		}
		self(self, l, (l + r) / 2, alpha);
		self(self, (l + r) / 2 + 1, r, beta);
	})(0, n-1, vt);
	return ans;
}
```
:::