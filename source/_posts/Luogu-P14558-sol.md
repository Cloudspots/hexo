---
title: 题解：P14558 [ROI 2013 Day2] 大规模预测
date: 2026-09-28 19:20:52
updated: 2026-10-07 21:53:10
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P14558 [ROI 2013 Day2] 大规模预测

哈哈哈我又开始暴力过题了，不过这次是最优解。

---

首先考虑到如果对于某个 $x$ 满足其每次出现的下标差都 $> 2$（即不存在 $x\space x$ 或 $x\space ?\space x$ 的情况），则 $x$ 一定不能是区间众数（区间长度为 $1$ 除外），可以直接忽略。

考虑对于每个没被忽略的 $x$ 如何统计答案。将 $x$ 视为 $1$，非 $x$ 视为 $-1$，那么区间众数为 $x$ 等价于区间和为正数。

区间 $[l,r]$ 和为众数，设 $s_i$ 为前缀和，那么相等于 $s_r>s_l$。也就是单点加法前缀求和，树状数组能做。

当然直接做是烂完了，是 $O(n^2\log n)$ 的。起码把这个 $\log$ 去掉啊喵！！

注意到相邻 $s$ 最多差 $1$，也就是前缀求和的时候求和上界也差 $1$，那么可以用数组存每个 $s$ 的出现次数。做到 $O(n^2)$。

还是不能通过，容易卡掉它。

优化 $0$：快读，顺便卡卡常。

优化 $1$：若 $x$ 只在 $[l_x,r_x]$ 中出现，且出现了 $c_x$ 次，则只需要在区间 $[l_x-c_x,r_x+c_x]$ 上求解。

还是不能通过。

优化 $-1$：特判一些数据。你问我哪来的数据？模拟赛给的大样例是从官方数据中抽取的。然后就过了，甚至最优解。

咳咳。我们之后不考虑也不使用优化 $-1$ 喵。

优化 $2$：注意到若 $x$ 的相邻两次出现位置分别为 $a,b$，$x$ 总共出现了 $c$ 次，若 $b-a>c$，则任何以 $x$ 为众数的区间都不会包含区间 $[a,b]$，所以可以看成不同的两个数字。它真正优化的点是 $c_x$ 变小了。然后就过了，跑得飞快。

实际上到这一步时间复杂度就是 $O(n\sqrt n)$ 了。具体原因是，所有出现次数 $> \sqrt n$ 的数字消耗时间最大是 $O(n)$，总共 $O(n\sqrt n)$；所有出现次数 $\le \sqrt n$ 的数字的每一次出现消耗时间最大是 $O(\sqrt n)$，总共 $O(n\sqrt n)$，加起来 $O(n\sqrt n)$。为什么只用优化 $1$ 不能达到 $O(n\sqrt n)$，这个是因为离得太远没有在中间砍断，导致复杂度至少是 $O(r_x-l_x)$，即每次出现都可能达到 $O(n)$ 的时间复杂度。

使用优化 $0+1+2$ 已经比使用优化 $0+1+-1$ 要快了（我们打过了特判！）。

优化 $3$：继续卡常。把所有 `vector` 删掉（`vector` 的构造比较慢，导致每次程序启动都要消耗数毫秒的时间，加起来可能就有一百多甚至数百毫秒，动态扩容也比较慢。这里的 `vector` 可以全都换成静态数组）。

三倍经验都是最优解。是谁的线性算法没有暴力优化过来的根号快？

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/299298714)。

```cpp
#include <cstdio>
#include <vector>
#include <bitset>
#include <cstring>

using namespace std;

int _st[1000005];

int a[500005];
int vmin[500005], vmax[500005], vcnt[500005];
int cnt[500005];
bitset<500005> bs;

char ibf[100000005];
unsigned li;
unsigned qread() { unsigned res = 0; char ch; while((ch = ibf[li++]) < '0' || ch > '9'); do { res = res * 10 + (ch ^ '0'); } while((ch = ibf[li++]) >= '0' && ch <= '9'); return res; }

int main()
{
	fread(ibf, 1, sizeof ibf, stdin);
	int *st = _st + 500002;
	int n, k;
	n = qread(); k = qread();
	// scanf("%d%d", &n, &k);
	long long s = n;
	for(int i=1;i<=n;i++)
	{
		a[i] = qread();
		if(a[i] == a[i-1] || i >= 2 && a[i] == a[i-2]) bs[a[i]] = true;
		cnt[a[i]]++;
	}
	auto solve1 = [&](int x, int gmin, int gmax, int gcnt)
	{
		if(gcnt == 1) return;
		int vl = max(1, gmin - gcnt - 2), vr = min(n, gmax + gcnt + 2);
		int vs = 0;
		st[0]++;
		int minvs = 0, maxvs = 0;
		int gs = 1;
		for(int i=vl;i<=vr;i++)
		{
			if(a[i] == x)
			{
				vs++;
				gs += st[vs];
			}
			else
			{
				gs -= st[vs];
				vs--;
			}
			s += gs - st[vs];
			st[vs]++;
			gs++;
			minvs = min(minvs, vs);
			maxvs = max(maxvs, vs);
		}
		memset(st + minvs, 0, (maxvs - minvs + 1) * sizeof(int));
		s -= gcnt;
	};
	for(int i=1;i<=n;i++)
	{
		int x = a[i];
		if(!bs[x]) continue;
		if(vmin[x] && i - vmax[x] > cnt[x] + 2)
		{
			solve1(x, vmin[x], vmax[x], vcnt[x]);
			vmin[x] = vmax[x] = i;
			vcnt[x] = 1;
		}
		else
		{
			if(!vmin[x]) vmin[x] = i;
			vmax[x] = i;
			vcnt[x]++;
		}
	}
	for(int i=1;i<=k;i++)
	{
		if(bs[i]) solve1(i, vmin[i], vmax[i], vcnt[i]);
	}
	printf("%lld\n", s);
	return 0;
}
```

:::
