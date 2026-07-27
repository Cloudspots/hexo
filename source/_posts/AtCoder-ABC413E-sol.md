---
title: 题解：AT_abc413_e [ABC413E] Reverse 2^i
date: 2025-7-6 10:45:26
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
> 做分讨题的时候大脑真的得在线啊……

看上去很恐怖实际上很简单。

显然，每次操作是选定一个 $2^i$，然后把下标为它的某一个倍数开始的 $2^i$ 个连续元素全部反转。

画出图就可以发现所有能够反转的区间大概是这样（其实，你可以在大脑里画图的。我这张图花了好久……）：

![](pVKqjBV.png)

容易发现左右区间互不干涉。想到分治。

但是分治只记录最小字典序并不可以，因为这样翻转就没用了。实际上还需要记录“使反转后成为最小字典序的数列”，将答案合并的时候使用。

如何合并？分类讨论两种情况即可。

```cpp
#include <cstdio>
#include <vector>
#include <utility>
#include <algorithm>

using namespace std;

int a[(1 << 18) + 5];

pair<vector<int>, vector<int>> qwq(int l, int r)
{
	if (l == r) return { {a[l]}, {a[r]} };
	auto r1 = qwq(l, (l + r) / 2), r2 = qwq((l + r) / 2 + 1, r);
	// 首先处理正序字典序最小如何做
	// case 1: 两个字典序最小的拼接起来
	auto k1 = r1.first;
	for (int x : r2.first) k1.push_back(x);
	// case 2: 两个反序后字典序最小的拼起来，然后反序
	auto k2 = r1.second;
	for (int x : r2.second) k2.push_back(x);
	reverse(k2.begin(), k2.end());
	vector<int> res1, res2;
	// 比较字典序择优选择
	if (lexicographical_compare(k1.begin(), k1.end(), k2.begin(), k2.end())) res1 = k1;
	else res1 = k2;
	// 然后处理反序字典序最小如何做
	// case 1: 两个字典序最小的拼接起来，然后反序
	reverse(k1.begin(), k1.end());
	// case 2: 两个反序后字典序最小的拼接起来
	reverse(k2.begin(), k2.end());
	if (lexicographical_compare(k1.rbegin(), k1.rend(), k2.rbegin(), k2.rend())) res2 = k1;
	else res2 = k2;
	// reverse(res2.begin(), res2.end());
	return { res1, res2 };
}

int main()
{
	int t;
	scanf("%d", &t);
	while (t--)
	{
		int n;
		scanf("%d", &n);
		n = 1 << n;
		for (int i = 1; i <= n; i++)
		{
			scanf("%d", a + i);
		}
		vector<int> v = qwq(1, n).first;
		for (int x : v)
		{
			printf("%d ", x);
		}
		printf("\n");
	}
	return 0;
}
```

[sub](https://atcoder.jp/contests/abc413/submissions/67338635)。