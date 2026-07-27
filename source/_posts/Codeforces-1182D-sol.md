---
title: 题解：CF1182D Complete Mirror
date: 2026-5-26 17:12:26
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
> $root$ 这个取名真的太有提示性了。
>
> 这篇题解本应当有图片，但是我不想用洛谷图床，所以请大家自行脑补。另外，所有图片的占位符也被删除。

---

首先很显然的一个事情就是，如果选取的根节点合法，那么每个子树两两同构，且也都要合法（其实这是充要的）。

我们先考虑同构。根据 CF1252F 的结论，显然选取的节点要么是重心，要么是叶子（CF1252F 中规定了不能是叶子，但是其实叶子也是可以的）。如果没做过也没事，显然同构的必要条件就是大小相同，如果有 $\ge 2$ 个邻居则必然每个邻居的连通块大小都要 $\le \dfrac{n}{2}$，这个点就是重心。否则，只有一个邻居，就是叶子。

重心是好解决的，因为最多有两个，只需要暴力判断即可。叶子？

我们考虑以某个叶子 $g$ 为根，从上往下找到第一个子节点个数 $\ge 2$ 的点，设为 $u$。那么这个叶子合法，当且仅当去掉 $u$ 的严格祖先链（不包括 $u$）中所有节点后，以 $u$ 为根时合法。

我们考虑继续使用必要条件——重心。$u$ 必须是修改后的树的重心。那么，我们考虑修改后的树，在这棵树上，$u$ 的每个邻居的大小都要 $\ge \dfrac{m}{2}$，$m$ 是修改后的树的大小，自然也就 $<\dfrac{n}{2}$。

也就是说，$u$ 要么是重心，要么唯一一个大小 $>\dfrac{n}{2}$ 的邻居子树就是它到叶子节点 $g$ 的方向的邻居，也就是一条链。

等下，后者可能吗？不行，因为它到 $g$ 的方向的子树大小不然不多于重心（随便选一个）到 $g$ 的方向的大小，必然 $\ge \dfrac{n}{2}$。矛盾了！

所以只可能 $u$ 本身就是重心。

阶段性总结一下，合法的根节点有两种可能：

- 这个节点是树的重心。
- 这个节点是从树的重心开始，沿着某一条纯链（没有任何多余节点的链，除了开头）一直走，走到某一个叶子的节点。

我们还是需要着重处理后者。

后者什么时候合法？假设重心 $c$ 到这个节点的方向上第一个节点是 $u$，那么就相当于删除 $u$ 的子树之后整棵树以 $c$ 为根时合法。

这就非常好做了。注意到纯链也是合法的结构，所以相当于：

- $c$ 的所有邻居均合法。
- $c$ 的所有除 $u$ 之外的邻居均同构（根节点就是 $c$ 的邻居）。

直接做就行。时间复杂度 $O(n)$。

:::info[sub&code]
[sub](https://codeforces.com/contest/1182/submission/376162508)。

```cpp
#include <cstdio>
#include <vector>
#include <random>
// #include <cassert>
#include <algorithm>

using namespace std;
#define assert(x) if(!(x)) printf("Line %d", __LINE__)

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

vector<int> web[100005];
bool forbids[100005];

int main()
{
	int n;
	scanf("%d", &n);
	// n = 6;
	if(n == 1)
	{
		printf("1\n");
		return 0;
	}
	mt19937_64 mt(random_device{}());
	for(int i=2;i<=n;i++)
	{
		int u, v;
		scanf("%d%d", &u, &v);
		// v = i;
		// u = uniform_int_distribution<int>(1, i-1)(mt);
		// printf("%d %d\n", u, v);
		web[u].push_back(v);
		web[v].push_back(u);
	}
	auto cent = [](int rt) -> vector<int>
	{
		// printf("[cent] rt = %d\n", rt);
		int tot = 0;
		U([&](auto &&self, int u, int fa) -> void { tot++; for(int v : web[u]) if(v != fa && !forbids[v]) self(self, v, u); })(rt, 0);
		vector<int> ans;
		// printf("tot = %d\n", tot);
		U([&](auto &&self, int u, int fa) -> int { int sum = 1, maxn = 0; for(int v : web[u]) if(v != fa && !forbids[v]) { int res = self(self, v, u); sum += res; maxn = max(maxn, res); } maxn = max(maxn, tot - sum); if(maxn <= tot / 2) ans.push_back(u); return sum; })(rt, 0);
		// printf("sz = %d\n", (int)ans.size());
		return ans;
	};
	unsigned long long hvx = ((unsigned long long)random_device{}() << 32) | random_device{}(), hvm;
	do
	{
		hvm = ((unsigned long long)random_device{}() << 32) | random_device{}();
	} while(hvm % 2 == 0);
	auto rootedhash = U([&](auto &&self, int u, int fa) -> unsigned long long
	{
		unsigned long long val = 33550336;
		for(int v : web[u])
		{
			if(v != fa && !forbids[v])
			{
				val += (hvx ^ ((hvx ^ self(self, v, u)) * hvm));
			}
		}
		return val;
	});
	auto thash = [&](int u) -> vector<unsigned long long>
	{
		vector<unsigned long long> res;
		for(int x : cent(u))
		{
			res.push_back(rootedhash(x, 0));
		}
		sort(res.begin(), res.end());
		return res;
	};
	auto qtype = [](int rt) -> int
	{
		vector<int> ds;
		bool flag = true;
		U([&](auto &&self, int u, int fa, int dep) -> void { int cnt = 0; for(int v : web[u]) if(!forbids[v]) cnt++; if(ds.size() <= dep) ds.push_back(cnt); else if(ds[dep] != cnt) flag = false; for(int v : web[u]) if(v != fa && !forbids[v]) self(self, v, u, dep + 1); })(rt, 0, 0);
		if(ds.size() == 1) return 1;
		if(!flag) return -1;
		for(int i=0;i<ds.size();i++)
		{
			if((i == 0 || i + 1 == ds.size()) && ds[i] != 1) return 0;
			if(i > 0 && i + 1 < ds.size() && ds[i] != 2) return 0;
		}
		return 1;
	};
	// int maxn = -1;
	for(int g : cent(1))
	{
		// printf("g = %d\n", g);
		forbids[g] = true;
		/*
		1. 所有子树均合法且同构
		2. 有一棵子树是是链，其余均同构
		*/
		unsigned long long X = 0;
		vector<pair<int, unsigned long long>> Y;
		bool flag = false;
		for(int u : web[g])
		{
			int res = qtype(u);
			if(res == -1)
			{
				flag = true;
				break;
			}
			else if(res == 0)
			{
				if(!X) X = rootedhash(u, 0);
				else if(X != rootedhash(u, 0))
				{
					flag = true;
					break;
				}
			}
			else Y.push_back({u, rootedhash(u, 0)});
		}
		if(flag)
		{
			forbids[g] = false;
			continue;
		}
		if(!X)
		{
			// printf("?\n");
			unsigned long long a = 0, b = 0;
			int ca = 0, cb = 0, ka = 0, kb = 0;
			for(const auto &x : Y)
			{
				if(!a)
				{
					ca = 1;
					a = x.second;
					ka = x.first;
				}
				else if(x.second == a) ca++;
				else if(!b)
				{
					cb = 1;
					b = x.second;
					kb = x.first;
				}
				else if(x.second == b) cb++;
				else
				{
					flag = true;
					break;
				}
			}
			if(flag)
			{
				// printf("!\n");
				forbids[g] = false;
				continue;
			}
			if(ca == 1)
			{
				// printf("ka = %d\n", ka);
				int lst = g, nw = ka;
				while(web[nw].size() == 2)
				{
					if(web[nw][0] == lst)
					{
						lst = nw;
						nw = web[nw][1];
					}
					else
					{
						lst = nw;
						nw = web[nw][0];
					}
				}
				forbids[g] = false;
				// assert(web[nw].size() == 1);
				assert(qtype(nw) != -1);
				if(qtype(nw) != -1) printf("%d\n", nw);
				return 0;
			}
			else if(cb == 0)
			{
				printf("%d\n", g);
				return 0;
			}
			else if(cb == 1)
			{
				// printf("kb = %d\n", kb);
				int lst = g, nw = kb;
				while(web[nw].size() == 2)
				{
					if(web[nw][0] == lst)
					{
						lst = nw;
						nw = web[nw][1];
					}
					else
					{
						lst = nw;
						nw = web[nw][0];
					}
				}
				forbids[g] = false;
				assert(qtype(nw) != -1);
				if(qtype(nw) != -1) printf("%d\n", nw);
				return 0;
			}
			else
			{
				flag = true;
				forbids[g] = false;
				continue;
			}
		}
		pair<int, unsigned long long> Z{0, {}};
		// printf("X = {%llu}\n", X[0]);
		// printf("Y.size() = %lu\n", Y.size());
		for(const auto &x : Y)
		{
			// printf("x = {first = %d, second = {%llu, %llu}}\n", x.first, x.second[0], x.second[1]); fflush(stdout);
			if(x.second != X)
			{
				if(Z.first)
				{
					flag = true;
					break;
				}
				Z = x;
			}
		}
		if(flag)
		{
			forbids[g] = false;
			continue;
		}
		if(Z.first == 0)
		{
			forbids[g] = false;
			assert(qtype(g) != -1);
			if(qtype(g) != -1) printf("%d\n", g);
		}
		else
		{
			int lst = g, nw = Z.first;
			while(web[nw].size() == 2)
			{
				if(web[nw][0] == lst)
				{
					lst = nw;
					nw = web[nw][1];
				}
				else
				{
					lst = nw;
					nw = web[nw][0];
				}
			}
			forbids[g] = false;
			assert(qtype(nw) != -1);
			if(qtype(nw) != -1) printf("%d\n", nw);
		}
		return 0;
		// forbids[g] = false;
	}
	printf("%d\n", -1);
	return 0;
}
// 笑点解析：调试这题代码的时候控制台一直在用 1252F 的代码，**并且通过了两个样例**。
// 鉴定为：机关算尽太聪明 写成了一坨石山
```
:::