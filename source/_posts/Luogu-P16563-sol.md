---
title: 题解：P16563 [ICPC 2026 APC] Parallel Sums
date: 2026-7-8 15:19:16
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
非常【数据删除】的做法，卡了一上午常，怎么过了/bx。

## 思路

我们注意到 $s_{i+1}-s_i=a_{i+m}-a_i$，所以我们我们可以用前 $m$ 个 $a$ 表示所有 $a$，形如 $a_i=a_{i\bmod m}+k_i$，其中 $k$ 是某个常数。特别地，如果 $m\mid i$，则需要写成 $a_i=a_m + k_i$。

另外，我们有前 $m$ 个 $a$ 之和，所以同时对 $a_m$ 也有限制 $\displaystyle a_m=s_1-\sum_{j<m}a_j$。

由于是求最大值的最小值，我们先考虑二分。如果答案是 $g$，那么就有区间内所有数字 $\le g$。那么，如果两个数模 $m$ 同余，那么它们由于形式相同，只需要取最大值。然后我们假设 $a_1,a_2,\dots,a_m$ 的加数的最大值分别为 $l_1,l_2,\dots,l_m$。

此时，我们有 $a_i+l_i\le g$，我们考虑先把前 $m-1$ 项加起来，得到 $\displaystyle\sum_{i<m}a_i+l_i\le (m-1)g$。由于我们知道 $l$，我们先拆出来，设成 $L_m$。我们得到 $\displaystyle\sum_{i<m}a_i\le (m-1)g-L_m$。

然后由于 $a_m=s_1-\displaystyle\sum_{i<m}a_i\le g-l_m$，所以 $\displaystyle\sum_{i<m}a_i\ge s_1-g+l_m$。试我们就知道了 $mg\ge s_1+\displaystyle\sum l$，我们把 $\displaystyle\sum l$ 设为 $L$，就得到了 $g\ge \dfrac{s_1+L}{m}$。由于 $g$ 是整数，所以答案为 $\left\lceil\dfrac{s_1+L}{m}\right\rceil$，构造是简单的（比如所有 $a_{<m}$ 都顶格取）。

所以，我们每次询问就相当于求：

$$S=\sum_{i=0}^{m-1}\max_{\substack{l\le j\le r\\j\equiv i\pmod m}} k_j$$

最终 $\left\lceil\dfrac{S+L}{m}\right\rceil$ 即为答案。

顺便，`unbounded` 的充要条件显然是 $r-l+1<m$，此时至少有一个 $\max$ 没有定义，而且我们可以找到一个长度为 $m$ 的覆盖 $[l,r]$ 的区间，里面必然有不在 $[l,r]$ 中的元素。我们让 $[l,r]$ 的元素尽量小，其他尽量大，然后就 `unbounded` 了。

## 莫队

我们暴力算……哦不这个实在是太假了。

我会莫队！我们直接对询问跑莫队，由于端点移动 $1$ 就只有一个 $\max$ 可能发生变化，所以我们可删堆一下就好了！

时间复杂度有点错，是 $O\left(n\sqrt q\log\left(\dfrac{n}{m}\right)\right)$。至于后面的 $\log$ 是怎么来的，每个堆里面有 $O\left(\dfrac{n}{m}\right)$ 个数字。

并不能通过。如果有卡常大手子用这个卡过了请和我说一声。

## ST 表

我们考虑 $m$ 很小的时候是上面的算法的瓶颈。当 $m$ 很大的时候上面的算法就接近 $O(n\sqrt q)$ 了，这个直接对麻了。

但是当 $m$ 很小的时候我们可以直接暴力枚举上面的 $i$。然后用神秘的方法求这个 $\max$。

我们这里还是离线，然后先枚举每一部分 $i$，建出 ST 表，然后再枚举每个询问 $q$，进行查询。

这样的时间复杂度是 $O(n\log n+mq)$ 的。至于前面预处理（建出 ST 表）为什么是 $O(n\log n)$：剩余类大小之和为 $n$。

## 综合做法

由于 $\log$ 里面的东西其实关系不是特别大，所以要求出精确平衡点较为困难，绝对不是我懒得算。所以随便调参一下，当 $m\le 3000$ 的时候使用 ST 表做法，否则使用莫队。

非常非常非常卡常。不过，能在洛谷上 $2.53\mathrm{s}$ 通过，CF 上 $3187\mathrm{ms}$ 通过，还是非常好的。居然不是洛谷最劣解（未经优化的版本只拿了倒数第二），洛谷神人还是太多了。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/284571578)。

```cpp
/*
(x+a), (y+b), (z+c), (d-x-y-z)

若 x+a, y+b, z+c <= k:

x <= k-a, y <= k-b, z <= k-c

x+y+z <= 3k-a-b-c
d-x-y-z >= d-3k+a+b+c

d-3k+a+b+c <= k
a+b+c+d <= 4k
k >= (a+b+c+d)/4.
*/
#include <cstdio>
#include <algorithm>
#include <vector>
#include <cmath>
#include <chrono>
#include <queue>
#include <random>
#include <cassert>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

class myheap
{
public:
	vector<long long> st;
	unsigned cur = 0;
	void push(long long x)
	{
		if(st.size() == ++cur) st.push_back(x);
		else st[cur] = x;
		unsigned p = cur;
		while(__builtin_expect(p != 1 && x > st[p / 2], true))
		{
			swap(st[p], st[p / 2]);
			p /= 2;
		}
	}
	void pop()
	{
		st[1] = st[cur--];
		unsigned p = 1;
		while(p * 2 <= cur)
		{
			if(__builtin_expect(p * 2 == cur, false))
			{
				if(st[p] < st[p * 2])
				{
					swap(st[p], st[p * 2]);
				}
				break;
			}
			if(__builtin_expect(st[p] < st[p * 2] || st[p] < st[p * 2 + 1], true))
			{
				if(st[p * 2] > st[p * 2 + 1])
				{
					swap(st[p * 2], st[p]);
					p *= 2;
				}
				else
				{
					swap(st[p * 2 + 1], st[p]);
					p = p * 2 + 1;
				}
			}
			else break;
		}
	}
	long long top() { return st[1]; }
	bool empty() { return cur == 0; }
	unsigned size() { return cur; }
};
class delheap { public: myheap has, del; void maintain() { while(!del.empty() && has.top() == del.top()) { has.pop(); del.pop(); }} void push(long long x) { has.push(x); } bool empty() { return has.size() == del.size(); } void erase(long long x) { del.push(x); } long long top() { maintain(); return has.top(); } };

delheap maxs[200005];
long long s[200005];
long long val[200005];
long long ans[200005];

class qry { public: unsigned id, l, r; } qrys[100005];

char ibf[100000005];
unsigned li = 0;
unsigned quread()
{
	unsigned res = 0;
	char ch;
	while((ch = ibf[li++]) < '0' || ch > '9');
	do
	{
		res = res * 10 + ch - '0';
	} while((ch = ibf[li++]) >= '0' && ch <= '9');
	return res;
}
int qsread()
{
	int res = 0, fg = 1;
	char ch;
	while((ch = ibf[li++]) < '0' || ch > '9') if(ch == '-') fg = -1;
	do
	{
		res = res * 10 + ch - '0';
	} while((ch = ibf[li++]) >= '0' && ch <= '9');
	return res * fg;
}

class segforest
{
public:
	vector<vector<long long>> maxn;
	void build(const vector<long long> &a)
	{
		unsigned n = (unsigned)a.size();
		unsigned lgn = __lg(n)+1;
		maxn.clear();
		maxn.resize(lgn);
		for(auto &x : maxn) x.resize(n);
		for(unsigned i=0;i<n;i++)
		{
			maxn[0][i] = a[i];
			for(unsigned j=1;(1<<j)<=i+1;j++)
			{
				maxn[j][i] = max(maxn[j-1][i], maxn[j-1][i-(1<<(j-1))]);
			}
		}
	}
	long long qmax(unsigned l, unsigned r)
	{
		unsigned len = r - l + 1, llen = __lg(len), lllen = 1 << llen;
		return max(maxn[llen][l + lllen - 1], maxn[llen][r]);
	}
} sfc[3005];

int main()
{
#ifdef RANDOM_TEST
	auto bgn = chrono::high_resolution_clock::now();
	mt19937_64 mt(random_device{}());
	uniform_int_distribution<int> gv(999990000, 1000000000);
	uniform_int_distribution<int> gs(1, 100000);
#else
	fread(ibf, 1, sizeof ibf, stdin);
#endif
	unsigned n, m;
#ifdef RANDOM_TEST
	n = 200000; m = 1999;
	uniform_int_distribution<unsigned> gu(1, n);
#else
	n = quread(); m = quread();
#endif
	for(unsigned i=1;i<=n-m+1;i++)
	{
#ifdef RANDOM_TEST
		s[i] = gv(mt) * (i % 2 ? 1 : -1);
#else
		s[i] = qsread();
#endif
		if(i >= 2) val[i+m-1] = s[i] - s[i-1] + val[i-1];
	}
	unsigned q;
#ifdef RANDOM_TEST
	q = 100000;
#else
	q = quread();
#endif
	for(unsigned i=1;i<=q;i++)
	{
#ifdef RANDOM_TEST
		qrys[i].l = gu(mt); qrys[i].r = gu(mt); if(qrys[i].l > qrys[i].r) swap(qrys[i].l, qrys[i].r);
		// qrys[i].l = m * 4 + 18; qrys[i].r = n - 4 * m - 8;
		// qrys[i].l = gs(mt); qrys[i].r = n - gs(mt) + 1;
#else
		qrys[i].l = quread(); qrys[i].r = quread();
#endif
		qrys[i].id = i;
	}
	// if(m == 1999)
	// {
	// 	for(int i=1;i<=10;i++)
	// 	{
	// 		printf("%d %d\n", qrys[i].l, qrys[i].r);
	// 	}
	// 	return 0;
	// }
	if(m <= 3000)
	{
		long long xs = 0;
		for(unsigned i=0;i<m;i++)
		{
			vector<long long> vk;
			for(unsigned j=(i?i:m);j<=n;j+=m)
			{
				vk.push_back(val[j]);
			}
			sfc[i].build(vk);
    		for(unsigned j=1;j<=q;j++)
			{
    			if(qrys[j].r - qrys[j].l + 1 < m) continue;
				ans[j] += sfc[i].qmax(i?(qrys[j].l-i+m-1)/m:(qrys[j].l-1)/m, i?(qrys[j].r-i)/m:qrys[j].r/m-1);
                // printf("i = %d, j = %d, contrib = %lld\n", i, j, sfc[i].qmax(i?(qrys[j].l-i+m-1)/m:(qrys[j].l-1)/m, i?(qrys[j].r-i)/m:qrys[j].r/m-1));
            }
        }
        for(int i=1;i<=q;i++)
        {
            if(qrys[i].r - qrys[i].l + 1 < m) printf("unbounded\n");
            else printf("%lld\n", s[1] + ans[i] >= 0 ? (s[1] + ans[i] + m - 1) / m : (s[1] + ans[i]) / m);
        }
		return 0;
	}
	unsigned b = 1.3 * n / sqrt(q) + 1;
	sort(qrys + 1, qrys + q + 1, [b](const auto &x, const auto &y) { return x.l / b < y.l / b || x.l / b == y.l / b && x.r != y.r && ((x.r < y.r) ^ (x.l / b % 2)); });
	long long sum = s[1];
	unsigned l = 1, r = 0;
	for(unsigned i=0;i<m;i++)
	{
		maxs[i].has.st.resize(n / m + 2);
		maxs[i].del.st.resize(n / m + 2);
	}
	// if(m == 1999)
	// {
	// 	long long s = 0;
	// 	for(unsigned i=1;i<=q;i++)
	// 	{
	// 		s += abs((int)qrys[i].l - (int)qrys[i-1].l) + abs((int)qrys[i].r - (int)qrys[i-1].r);
	// 	}
	// 	printf("%lld\n", s);
	// 	return 0;
	// }
	// printf("!\n");
	for(unsigned i=1;i<=q;i++)
	{
		// printf("i = %d\n", i); fflush(stdout);
		if(qrys[i].r - qrys[i].l + 1 < m)
		{
			ans[qrys[i].id] = -0x3f3f3f3f3f3f3f3f;
			continue;
		}
		while(r < qrys[i].r)
		{
			r++;
			if(maxs[r % m].empty())
			{
				maxs[r % m].push(val[r]);
				sum += val[r];
			}
			else
			{
				long long g = maxs[r % m].top();
				if(val[r] > g)
				{
					sum -= g;
					maxs[r % m].push(val[r]);
					sum += val[r];
				}
				else maxs[r % m].push(val[r]);
			}
		}
		while(l > qrys[i].l)
		{
			l--;
			if(maxs[l % m].empty())
			{
				maxs[l % m].push(val[l]);
				sum += val[l];
			}
			else
			{
				long long g = maxs[l % m].top();
				if(val[l] > g)
				{
					sum -= g;
					maxs[l % m].push(val[l]);
					sum += val[l];
				}
				else maxs[l % m].push(val[l]);
			}
		}
		while(r > qrys[i].r)
		{
			long long g = maxs[r % m].top(); 
			if(val[r] == g)
			{
				sum -= g;
				maxs[r % m].erase(val[r]);
				if(!maxs[r % m].empty()) sum += maxs[r % m].top();
			}
			else maxs[r % m].erase(val[r]);
			r--;
		}
		while(l < qrys[i].l)
		{
			long long g = maxs[l % m].top(); 
			if(val[l] == g)
			{
				sum -= g;
				maxs[l % m].erase(val[l]);
				if(!maxs[l % m].empty()) sum += maxs[l % m].top();
			}
			else maxs[l % m].erase(val[l]);
			l++;
		}
		ans[qrys[i].id] = (sum >= 0 ? (sum + m - 1) / m : sum / m);
	}
	for(unsigned i=1;i<=q;i++)
	{
#ifndef RANDOM_TEST
		if(ans[i] == -0x3f3f3f3f3f3f3f3f) printf("unbounded\n");
		else printf("%lld\n", ans[i]);
#endif
	}
#ifdef RANDOM_TEST
	fprintf(stderr, "Time: %llu ms\n", chrono::duration_cast<chrono::milliseconds>(chrono::high_resolution_clock::now() - bgn).count());
#endif
	return 0;
}
```

:::