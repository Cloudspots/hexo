---
title: 题解：P15819 [JOI 2015 Final] 舞会 / Ball
date: 2026-09-24 20:28:30
updated: 2026-09-26 18:53:00
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P15819 [JOI 2015 Final] 舞会 / Ball

> 没见过的 trick :(。

---

建树是显然的，二分答案也是显然的。trick：转为 $0/1$（$\ge v$ 的转为 $1$，否则是 $0$，$v$ 是二分 check 的答案）。原理是中位数不改变相对大小，即使非严格。

那么我们就可以 DP 了，每个位置记录让它为 $1$ 需要的最少额外 $1$ 数量，转移是显然的。

同时你也不需要显式建树，直接边用 `queue` 模拟边转移就可以了。

总时间复杂度 $O(n\log V)$，原因是我懒得离散化。dp 如果无解赋为了正无穷需要注意溢出问题。

:::info[rec&code]

[rec](https://www.luogu.com.cn/problem/P15819)。

```cpp
#include <queue>
#include <chrono>
#include <random>
#include <cstdio>
#include <bitset>
#include <algorithm>

using namespace std;

int b[100005];
int vpos[100005];
int knb[100005];

int main()
{
	// auto med = [](int a, int b, int c) { return a ^ b ^ c ^ max({a, b, c}) ^ min({a, b, c}); };
	int n, m;
	scanf("%d%d", &n, &m);
	for(int i=1;i<=m;i++)
	{
		int d, p;
		scanf("%d%d", &d, &p);
		b[p] = d;
	}
	for(int i=1;i<=n-m;i++)
	{
		scanf("%d", knb + i);
	}
	auto check = [&](int v)
	{
		queue<int> q;
		int c1 = 0;
		for(int i=1;i<=n;i++)
		{
			if(!b[i]) q.push(1);
			else q.push(b[i] < v ? 0x3f3f3f3f : 0);
		}
		for(int i=1;i<=n-m;i++) if(knb[i] >= v) c1++;
		while(q.size() > 1)
		{
			int x = q.front(); q.pop();
			int y = q.front(); q.pop();
			int z = q.front(); q.pop();
			q.push(min(0x3f3f3f3f, x + y + z - max({x, y, z})));
		}
		return q.front() <= c1;
	};
	int l = 1, r = 1000000000;
	while(l < r)
	{
		int mid = (l + r + 1) / 2;
		if(check(mid)) l = mid;
		else r = mid - 1;
	}
	printf("%d\n", l);
	return 0;
}
```

:::
