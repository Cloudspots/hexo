---
title: 题解：CF1864F Exotic Queries
date: 2026-10-25 13:07:13
updated: 2026-10-25 13:07:13
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---

# 题解：CF1864F Exotic Queries

Because the chosen segments cannot intersect, there is a trivial greedy algorithm: Find the minimum value $v$ in the whole sequence, then subtract $v$ from all elements, split the sequence at $0$s, then repeat the process above until all elements are $0$. The optimality of the greedy algorithm is trivial.

Consider the cost (number of operations) of the algorithm above. For each position $i$, let its predecessor (the largest position where the value is the same as $a_i$; if it does not exist, let it be $0$) be $t_i$. Trivially, if $t_i\neq 0$ and $\min\limits_{k\in [t_i,i]}a_k=a_i$, then the elements at positions $i$ and $t_i$ become $0$ in the same operation.

So, trivially, the total cost is:

$$ \sum_{i=1}^n [t_i=0\lor \exists k \text{ s.t. } a_k<a_i,k\in [t_i,i]] $$

It is trivial that this problem allows an offline algorithm. Thus we can trivially enumerate $l$ from $n$ to $1$, and let $v_i$ be the total contribution of all $j$ where $a_j=i$, and trivially use a trivial Fenwick tree to answer all queries with left endpoint $l$ because $\text{Ans}=\displaystyle\sum_{l\le i\le r}v_i$ (and because we only considered $i$ such that $a_i\ge l$, all $v_j$ with $j<l$ are trivially zero).

For each $i$, we trivially call the segment $[t_i,i]$ alive if and only if there is no $k$ satisfying $l\le a_k<a_i$ and $k\in[t_i,i]$.

What happens to the values $v_i$ when $l$ decreases by $1$? Since $l$ is the minimum value among the currently considered values, for each $i$ with $a_i=l$, just trivially traverse all alive segments $[x,y]$ containing $i$, and mark them as dead (then trivially increase $v_{a_x}$ by $1$). Then set $v_l=[\exists i\text{ s.t. }a_i=l]$, and for each adjacent pair of occurrences $x<y$ with $a_x=a_y=l$, mark the segment $[x,y]$ as alive. The total number of segments processed in this procedure is trivially $O(n)$. The proof is trivial; leave it as an exercise.

So the only problem is to trivially implement a data structure that supports:

1. Inserting a segment. It is trivial that (in this problem) all inserted segments have distinct left endpoints.
2. Finding a segment containing a position $x$, then remove the segment.

This can be solved trivially by using a segment tree maintaining the right endpoint associated with each left endpoint and their range maxima. We can trivially process the second query by performing binary search on the segment tree in $O(\log n)$ time.

Thus, the total time complexity is $O(n\log n)$ (and the trivial complexity is $O(\text{BB}(n))$).

:::info[rec&code]

[rec](https://codeforces.com/contest/1864/submission/395868432)。

```cpp
#include <cstdio>
#include <vector>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

int a[1000005];
vector<int> gval[1000005];

class segtree
{
public:
	constexpr int getr(int l, int r, int id) { return id + ((l + r) / 2 - l + 1) * 2; }
	int maxn[2000005];
	void pushup(int l, int r, int id) { maxn[id] = max(maxn[id + 1], maxn[getr(l, r, id)]); }
	void build(int n) { U([&](auto &&self, int l, int r, int id) -> void { if(l == r) { maxn[id] = 0; return; } self(self, l, (l + r) / 2, id + 1); self(self, (l + r) / 2 + 1, r, getr(l, r, id)); pushup(l, r, id); })(1, n, 1); }
	void vset(int n, int pos, int val) { U([&](auto &&self, int l, int r, int id) -> void { if(l == r) { maxn[id] = val; return; } if(pos <= (l + r) / 2) self(self, l, (l + r) / 2, id + 1); else self(self, (l + r) / 2 + 1, r, getr(l, r, id)); pushup(l, r, id); })(1, n, 1); }
	int qval(int n, int pos) { return U([&](auto &&self, int l, int r, int id) { if(l == r) return maxn[id]; if(pos <= (l + r) / 2) return self(self, l, (l + r) / 2, id + 1); else return self(self, (l + r) / 2 + 1, r, getr(l, r, id)); })(1, n, 1); }
	int qsearch(int n, int pos) { return U([&](auto &&self, int l, int r, int id) -> int { if(l == r) return maxn[id] >= pos ? l : -1; if(pos <= (l + r) / 2) return self(self, l, (l + r) / 2, id + 1); if(maxn[id + 1] >= pos) return self(self, l, (l + r) / 2, id + 1); else return self(self, (l + r) / 2 + 1, r, getr(l, r, id)); })(1, n, 1); }
} seg;

class fenwick
{
public:
	int st[1000005];
	void vadd(int pos, int val, int n) { pos++; n++; do { st[pos] += val; } while((pos += pos & -pos) <= n); }
	int qsum(int pos) { pos++; int sum = 0; do { sum += st[pos]; } while(pos -= pos & -pos); return sum; }
} fw;

class qry { public: int l, r, id; } qrys[1000005];
int ans[1000005];

int main()
{
	int n, q;
	scanf("%d%d", &n, &q);
	for(int i=1;i<=n;i++)
	{
		scanf("%d", a + i);
		gval[a[i]].push_back(i);
	}
	for(int i=1;i<=q;i++)
	{
		scanf("%d%d", &qrys[i].l, &qrys[i].r);
		qrys[i].id = i;
	}
	sort(qrys + 1, qrys + q + 1, [](const auto &x, const auto &y) { return x.l > y.l; });
	int cur = 1;
	seg.build(n);
	for(int i=n;i>=1;i--)
	{
		for(int x : gval[i])
		{
			int res;
			while((res = seg.qsearch(n, x)) != -1) 
			{
				fw.vadd(a[res], 1, n);
				// printf("i = %d, x = %d, found [%d, %d], level %d --\n", i, x, res, seg.qval(n, res), a[res]);
				seg.vset(n, res, 0);
			}
		}
		for(int j=0;j+1<gval[i].size();j++)
		{
			seg.vset(n, gval[i][j], gval[i][j+1]);
		}
		if(!gval[i].empty()) fw.vadd(i, 1, n);
		while(cur <= q && qrys[cur].l == i)
		{
			ans[qrys[cur].id] = fw.qsum(qrys[cur].r);
			cur++;
		}
	}
	for(int i=1;i<=q;i++)
	{
		printf("%d\n", ans[i]);
	}
	return 0;
}
```

:::
