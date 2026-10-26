---
title: 题解：P14351 [JOISC 2019] 矿物 / Minerals
date: 2026-10-26 21:43:49
updated: 2026-10-26 21:43:49
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P14351 [JOISC 2019] 矿物 / Minerals

卡了一万年常，题解以记之。

---

考虑 Subtask $2$ 的特殊性质。

考虑分治。每次取出左边的一半，对于右边依次判断是否属于左边，然后分治下去。操作次数 $T(n)=2T\left(\dfrac{n}{2}\right)+3n$，先不急着优化。

考虑一般情况，此时可以扫一遍知道每个数是第一次还是第二次出现，分为两组，然后直接用上面的分治。可以用 $2n$ 次操作解决。

期望得分 $40\mathrm{pts}$，考虑优化。

首先分治并不要求所有数字都初始不在集合中，于是可以去除一部分的清空。此时还是不错的，左边和右边都是要么初始全选，要么初始全不选。

然后在划分到左右边的时候，如果左边或右边满了，那么剩下所有数字都分到另一边。

考虑上面两个优化一起使用会出现奇奇怪怪的问题，具体来讲就是右边不一定全在或全不在集合中，于是判断在和不在的哪个多。

考虑两边都两个元素的时候分讨用最多两次操作解决掉。

考虑划分并不平衡，经过计算（具体可以看其它题解）最优划分点是 $\dfrac{3-\sqrt 5}{2}$，换句话说划分的时候应该让左边的操作次数在 $\alpha=\dfrac{3-\sqrt 5}{2}N$，$N$ 是左边元素个数。

不妨假设左边左 $\alpha$ 部分选中，右 $1-\alpha$ 部分不选。的考虑在统一右边状态的时候，一个位置 $k$ 如果改变状态后改变了不同元素数量，则它一定不在左半边的左 $\alpha$ 部分。

然后就过了，比较极限，`shuffle` 一下操作次数在 $999000$ 以内。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/306018398)。

```cpp
// 还剩 55min，我能 AK 吗？
/*
subtask 2: 分治。每次在左边一半中选一半，右边挨个判断，然后递归。总操作次数 T(n) = 3/4n + 2T(n/2)，非常正确……还要清空啊。先不急。

一般情况：still? 感觉很困难。考虑分治。通过 n 次操作可以判断每个 mineral 的另一半在左边还是右边。

左左/右右：分治。左右：用上面的方法。

哦不这个过不了
*/
int Query(int x);
void Answer(int x, int y);
#include <vector>
#include <random>
#include <cassert>
#include <algorithm>
#include <cstdio>
#include <cstdlib>
#include <cstring>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

void Solve(int n)
{
	vector<int> vt;
	for(int i=1;i<=2*n;i++) vt.push_back(i);
	mt19937_64 mt(random_device{}());
	shuffle(vt.begin(), vt.end(), mt);
	unsigned long long s1 = 0, s2 = 0, s3 = 0;
	vector<unsigned char> exis(2*n+5);
	vector<int> pl(2*n+5);
	int lstans = 0;
	int kks = 0;
	auto q1 = [&](int x) { s1++; kks -= 2 * exis[x] - 1; exis[x] ^= 1; return lstans = Query(x); };
	auto q2 = [&](int x) { s2++; kks -= 2 * exis[x] - 1; exis[x] ^= 1; return lstans = Query(x); };
	auto solr = U([&](auto &&self, vector<int> l, vector<int> r, bool fg) -> void
	{
		assert(l.size() == r.size());
		if(l.size() == 0) return;
		if(l.size() == 1)
		{
			Answer(l[0], r[0]);
			return;
		}
		if(l.size() == 2)
		{
			int c1 = exis[l[0]] + exis[l[1]], c2 = exis[r[0]] + exis[r[1]];
			if(c1 > c2)
			{
				swap(l, r);
				swap(c1, c2);
			}
			if(c1 == 0 && c2 == 0)
			{
				q1(l[0]);
				int ll = lstans;
				if(q1(r[0]) != ll) swap(r[0], r[1]);
				Answer(l[0], r[0]);
				Answer(l[1], r[1]);
				return;
			}
			if(c1 == 0 && c2 == 1)
			{
				if(exis[r[1]]) swap(r[0], r[1]);
				int ll = lstans;
				if(q1(l[0]) != ll) swap(r[0], r[1]);
				Answer(l[0], r[0]);
				Answer(l[1], r[1]);
				return;
			}
			if(c1 == 0 && c2 == 2)
			{
				q1(r[1]);
				int ll = lstans;
				if(q1(l[0]) != ll) swap(r[0], r[1]);
				Answer(l[0], r[0]);
				Answer(l[1], r[1]);
				return;
			}
			if(c1 == 1 && c2 == 1)
			{
				int ll = lstans;
				if(exis[r[1]]) swap(r[0], r[1]);
				if(exis[l[1]]) swap(l[0], l[1]);
				if(q1(l[0]) != ll) swap(l[0], l[1]);
				Answer(l[0], r[0]);
				Answer(l[1], r[1]);
				return;
			}
			if(c1 == 1 && c2 == 2)
			{
				if(exis[l[1]]) swap(l[0], l[1]);
				int ll = lstans;
				if(q1(r[0]) != ll) swap(r[0], r[1]);
				Answer(l[0], r[0]);
				Answer(l[1], r[1]);
				return;
			}
			if(c1 == 2 && c2 == 2)
			{
				q1(l[1]);
				int ll = lstans;
				if(q1(r[0]) != ll) swap(r[0], r[1]);
				Answer(l[0], r[0]);
				Answer(l[1], r[1]);
				return;
			}
			return;
		}
		vector<int> al, ar, bl, br;
		int cnt = 0;
		for(int v : r) if(exis[v]) cnt++; else cnt--;
		bool ftarget = cnt > 0;
		int vcnt = 0;
		long double beta = 0.3819660112501051;
		long double alpha = (exis[l[0]] ^ ftarget) ? 1 - beta : beta;
		unsigned spl = max(1, int(l.size() * alpha));
		for(int i=0;i<l.size();i++)
		{
			assert(exis[l[i]] == exis[l.back()]);
			if(i < spl)
			{
				al.push_back(l[i]);
				if(!(exis[l[i]] ^ ftarget))
				{
					q1(l[i]);
					vcnt++;
				}
			}
			else
			{
				bl.push_back(l[i]);
				if(exis[l[i]] ^ ftarget)
				{
					q1(l[i]);
					vcnt++;
				}
			}
		}
		// int bsum = kks;
		// for(int v : r) bsum -= exis[v];
		// if(spl + bsum != lstans)
		// {
		for(int i=r.size()-1;i>=0;i--)
		{
			int v = r[i];
			if(exis[v] ^ ftarget)
			{
				int lls = lstans;
				int lx = q1(v);
				if((lx != lls) ^ ftarget)
				{
					s3++;
					pl[v] = -1;
				}
				else pl[v] = 0;
			}
			else pl[v] = 0;
		}
		// }
		// else
		// {
		// 	for(int v : r)
		// 	{
		// 		if(exis[v] ^ ftarget)
		// 		{
		// 			s3++;
		// 			pl[v] = 1;
		// 		}
		// 		else pl[v] = 0;
		// 	}
		// }
		// assert(exis[l[0]] == exis[r[0]]);
		assert(abs(vcnt - int(l.size() * beta)) <= 2);
		for(int i=0;i<r.size();i++)
		{
			if(ar.size() == al.size())
			{
				br.push_back(r[i]);
				if(pl[r[i]] == -1) s3--;
				continue;
			}
			if(br.size() == bl.size())
			{
				ar.push_back(r[i]);
				if(pl[r[i]] == -1) s3--;
				continue;
			}
			bool ffg = false;
			if(pl[r[i]] == 1) ffg = true;
			else if(pl[r[i]] == -1) ffg = false;
			else
			{
				int lls = lstans;
				int lx = q1(r[i]);
				ffg = (lx == lls) ^ ftarget;
			}
			if(ffg) ar.push_back(r[i]);
			else br.push_back(r[i]);
		}
		self(self, al, ar, false);
		self(self, bl, br, true);
	});
	U([&](auto &&self, vector<int> v) -> void
	{
		vector<int> ql, qr;
		for(int x : v)
		{
			// if(lstans == n)
			// {
			// 	qr.push_back(x);
			// 	continue;
			// }
			int ll = lstans;
			q2(x);
			if(lstans == ll)
			{
				// q2(x);
				qr.push_back(x);
			}
			else ql.push_back(x);
		}
		solr(ql, qr, true);
	})(vt);
	fprintf(stderr, "s1 = %llu, s2 = %llu, saved (approximately) %llu\n", s1, s2, s3);
}
```

:::
