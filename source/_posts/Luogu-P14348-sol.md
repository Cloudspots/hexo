---
title: 题解：P14348 [JOISC 2019] 穿越时空 Bitaro / Bitaro, who Leaps through Time
date: 2026-11-02 03:27:43
updated: 2026-11-02 03:27:43
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P14348 [JOISC 2019] 穿越时空 Bitaro / Bitaro, who Leaps through Time

> 分块块简单题。场切了，我真棒。

---

不妨假设只能往右。平移一下把时间流逝去了。考虑多次操作之后会发生什么。

首先注意到若干次操作之后得到的可能值一定是个区间。

并且若这个区间在某个时刻变为了单点，则以后都是单点；而如果不是，则其之间的所有操作复合起来就相当于适配到最终可能区间，对于变化量也是如此。

那么就可以得到一个做法：首先找到这个位置往后第一个变为单点的位置，计算其贡献，然后通过某种方式预处理之后的贡献。

这个直接暴力做是很差的，考虑分块优化一下，对于每个块处理变为单点的位置（可能不存在），$O(n\sqrt n)$ 做完了。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/307626671)。

```cpp
/*
笑点解析：这个区第一次以为是个图，第二次以为是个树。

原来是个链啊.jpg

那是不是就好做了。

分块一下。对于每个块维护收敛位置和从收敛开始的总代价。当然还有最终的位置。需要特判不收敛的情况。

正着和反者各维护一个。

时间复杂度 O(n sqrt n)，完全胜利。
*/
#include <cmath>
#include <cstdio>
#include <algorithm>
#ifdef LB_IS_TIMING
#include <chrono>
#endif

using namespace std;

const unsigned B = 512;
long long l1[300005], l2[300005], r1[300005], r2[300005];
long long c1pos[300005 / B + 5], c1sum[300005 / B + 5], c2pos[300005 / B + 5], c2sum[300005 / B + 5];
long long r1nl[300005], r1nr[300005], r2nl[300005], r2nr[300005];

int main()
{
#ifdef LB_IS_TIMING
	auto bgn = chrono::high_resolution_clock::now();
#endif
	int n, q;
	scanf("%d%d", &n, &q);
	n--;
	for(int i=1;i<=n;i++)
	{
		long long l, r;
		scanf("%lld%lld", &l, &r);
		l1[i] = l - i;
		r1[i] = r - i - 1;
		l2[i] = l + i;
		r2[i] = r + i - 1;
	}
	auto setrng = [](long long l, long long r, long long v) { return min(r, max(l, v)); };
	auto buildblk = [&](int id) -> void // build block lol
	{
		long long vl = -2000000000, vr = 2000000000;
		c1pos[id] = c2pos[id] = -1;
		c1sum[id] = c2sum[id] = 0;
		for(int i=(id-1)*B+1;i<=min((unsigned)n, id*B);i++)
		{
			long long rvl = vl, rvr = vr;
			vl = setrng(l1[i], r1[i], vl);
			vr = setrng(l1[i], r1[i], vr);
			r1nl[i] = vl; r1nr[i] = vr;
			if(vl == vr && c1pos[id] == -1) c1pos[id] = i;
			if(rvl == rvr) c1sum[id] += max(0ll, rvl - vl);
		}
		vl = -2000000000; vr = 2000000000;
		for(int i=min((unsigned)n, id*B);i>=(id-1)*B+1;i--)
		{
			long long rvl = vl, rvr = vr;
			vl = setrng(l2[i], r2[i], vl);
			vr = setrng(l2[i], r2[i], vr);
			r2nl[i] = vl; r2nr[i] = vr;
			if(vl == vr && c2pos[id] == -1) c2pos[id] = i;
			if(rvl == rvr) c2sum[id] += max(0ll, rvl - vl);
		}
	};
	for(int i=1;i<=(n+B-1)/B;i++) buildblk(i);
	while(q--)
	{
		int t;
		scanf("%d", &t);
		if(t == 1) // modify
		{
			int p, s, t;
			scanf("%d%d%d", &p, &s, &t);
			l1[p] = s - p;
			r1[p] = t - p - 1;
			l2[p] = s + p;
			r2[p] = t + p - 1;
			buildblk((p+B-1)/B);
		}
		else // query
		{
			int l, r;
			long long s, t;
			scanf("%d%lld%d%lld", &l, &s, &r, &t);
			if(l == r)
			{
				printf("%lld\n", max(0ll, s-t));
				continue;
			}
			if(l < r)
			{
				t -= r;
				s -= l;
				r--;
				int lid = (l + B - 1) / B, rid = (r + B - 1) / B;
				if(lid == rid)
				{
					long long ps = 0;
					for(int i=l;i<=r;i++)
					{
						long long lst = s;
						s = setrng(l1[i], r1[i], s);
						ps += max(0ll, lst - s);
					}
					printf("%lld\n", ps + max(0ll, s - t));
					continue;
				}
				long long ps = 0;
				for(int i=l;i<=lid*B;i++)
				{
					long long lst = s;
					s = setrng(l1[i], r1[i], s);
					ps += max(0ll, lst - s);
				}
				for(int i=lid+1;i<rid;i++)
				{
					if(c1pos[i] == -1)
					{
						long long tgt = setrng(r1nl[i*B], r1nr[i*B], s);
						ps += max(0ll, s - tgt);
						s = tgt;
					}
					else
					{
						long long tg1 = (c1pos[i] == (i-1)*B+1 ? s : setrng(r1nl[c1pos[i]-1], r1nr[c1pos[i]-1], s));
						ps += max(0ll, s - tg1);
						long long tg2 = setrng(r1nl[c1pos[i]], r1nr[c1pos[i]], tg1);
						ps += max(0ll, tg1 - tg2);
						ps += c1sum[i];
						s = r1nl[i*B];
					}
				}
				for(int i=(rid-1)*B+1;i<=r;i++)
				{
					long long lst = s;
					s = setrng(l1[i], r1[i], s);
					ps += max(0ll, lst - s);
				}
				printf("%lld\n", ps + max(0ll, s - t));
			}
			else
			{
				s += l - 1;
				t += r - 1;
				l--;
				int lid = (l + B - 1) / B, rid = (r + B - 1) / B;
				if(lid == rid)
				{
					long long ps = 0;
					for(int i=l;i>=r;i--)
					{
						long long lst = s;
						s = setrng(l2[i], r2[i], s);
						ps += max(0ll, lst - s);
					}
					printf("%lld\n", ps + max(0ll, s - t));
					continue;
				}
				long long ps = 0;
				for(int i=l;i>=(lid-1)*B+1;i--)
				{
					long long lst = s;
					s = setrng(l2[i], r2[i], s);
					ps += max(0ll, lst - s);
				}
				for(int i=lid-1;i>rid;i--)
				{
					if(c2pos[i] == -1)
					{
						long long tgt = setrng(r2nl[(i-1)*B+1], r2nr[(i-1)*B+1], s);
						ps += max(0ll, s - tgt);
						s = tgt;
					}
					else
					{
						long long tg1 = (c2pos[i] == i*B ? s : setrng(r2nl[c2pos[i]+1], r2nr[c2pos[i]+1], s));
						ps += max(0ll, s - tg1);
						long long tg2 = setrng(r2nl[c2pos[i]], r2nr[c2pos[i]], tg1);
						ps += max(0ll, tg1 - tg2);
						ps += c2sum[i];
						s = r2nl[(i-1)*B+1];
					}
				}
				for(int i=rid*B;i>=r;i--)
				{
					long long lst = s;
					s = setrng(l2[i], r2[i], s);
					ps += max(0ll, lst - s);
				}
				printf("%lld\n", ps + max(0ll, s - t));
			}
		}
	}
#ifdef LB_IS_TIMING
	fprintf(stderr, "Time: %llu ms\n", chrono::duration_cast<chrono::milliseconds>(chrono::high_resolution_clock::now() - bgn).count());
#endif
	return 0;
}
```

:::
