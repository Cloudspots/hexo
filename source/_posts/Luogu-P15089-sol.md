---
title: 题解：P15089 [UOI 2025 II Stage] OldPost --- NewPost
date: 2026-10-10 19:40:12
updated: 2026-10-10 19:40:12
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P15089 [UOI 2025 II Stage] OldPost --- NewPost

> 赛时没判 $n=2$ 爽挂 $70$，赢赢赢，哦不对输输输。

---

关于直径有一个性质：找出任意一条直径，找到它的中点（如果两个则任意一个都行），则所有直径都过这个点。

这是很显然的，首先反证法证明所有直径两两相交，然后反证法证明交点必须包含直径中点即可。

考虑这个怎么用。我们先求出直径中点，然后以它为根。

考虑直径是什么样的，显然两个端点分别位于是根节点的所有子树中最高和第二高的子树（并列可以任选）。

开始分讨。

- 若有 $\ge 4$ 个最高的子树：显然选两条只在根节点相交的路径。
- 若有 $3$ 个最高的子树：此时必然有两条路径的某个端点在同一棵子树中。考虑一个子树中最浅的包含 $\ge 2$ 个拥有最深点的分叉的节点，假设其深度为 $f$，那么显然选择公共子树为 $f$ 最小的子树。
- 若有 $2$ 个最高的子树：类似上面，但是更加简单。
- 若只有一个最高的子树：
  - 若没有第二高的子树：此时 $n=2$，然后我赛时没有特判（其实是判炸了）爽挂 $70\mathrm{pts}$。
  - 若只有一个第二高的子树：仿照有 $2$ 个最高的子树处理。
  - 若有 $\ge 2$ 两个第二高的子树：仿照有 $3$ 个最高的子树处理，但是公共子树限定为最高的子树。


:::info[rec&code]

[rec](https://www.luogu.com.cn/record/302244681)。

```cpp
#include <cstdio>
#include <vector>
#include <bitset>
#include <utility>
#include <cassert>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

vector<int> web[600005];
int fa[600005];
int lgs[600005];
int dp[600005];
int dep[600005];
bitset<600005> fg;

int main()
{
	int n;
	scanf("%d", &n);
    if(n == 2)
    {
        printf("2\n1 2\n1 2\n");
        return 0;
    }
	for(int i=2;i<=n;i++)
	{
		int x, y;
		scanf("%d%d", &x, &y);
		web[x].push_back(y);
		web[y].push_back(x);
	}
	auto qlongest = [](int x) { return U([&](auto &&self, int u, int fa) -> pair<int, int> { int maxn = 0, maxx = u; for(int v : web[u]) if(v != fa) { auto res = self(self, v, u); if(res.first + 1 > maxn) { maxn = res.first + 1; maxx = res.second; } } return {maxn, maxx}; })(x, -1).second; };
	int xu = qlongest(1), xv = qlongest(xu);
	vector<int> pth;
	U([&](auto &&self, int u, int fa) -> bool { pth.push_back(u); if(u == xv) return true; for(int v : web[u]) if(v != fa) { if(self(self, v, u)) return true; } pth.pop_back(); return false; })(xu, -1);
	int bx = pth[pth.size()/2];
	U([&](auto &&self, int u) -> void
	{
		if(fa[u]) web[u].erase(find(web[u].begin(), web[u].end(), fa[u]));
		if(web[u].empty())
		{
			lgs[u] = 1;
			dp[u] = u;
			return;
		}
		for(int v : web[u])
		{
			fa[v] = u;
			dep[v] = dep[u] + 1;
			self(self, v);
			lgs[u] = max(lgs[u], lgs[v]);
		}
		int cnt = 0;
		for(int v : web[u])
		{
			if(lgs[v] == lgs[u])
			{
				cnt++;
				dp[u] = max(dp[u], dp[v], [](int x, int y) { return y != 0 && (x == 0 || dep[x] < dep[y]); });
			}
		}
		if(cnt >= 2) dp[u] = u;
		lgs[u]++;
	})(bx);
	auto qadv = [&](int x) -> int { while(!web[x].empty()) { for(int v : web[x]) if(lgs[v] + 1 == lgs[x]) { x = v; break; } } return x; };
	auto cst = [&](int x) -> pair<vector<int>, vector<int>>
	{
		vector<int> va, vb;
		int gx = dp[x];
		int la = 0, lb = 0;
		if(web[gx].empty())
		{
			la = lb = gx;
		}
		else
		{
			for(int v : web[gx])
			{
				if(lgs[v] + 1 != lgs[gx]) continue;
				if(!la) la = v;
				lb = v;
			}
			assert(lb);
			la = qadv(la); lb = qadv(lb);
			while(la != gx)
			{
				va.push_back(la);
				la = fa[la];
			}
			while(lb != gx)
			{
				vb.push_back(lb);
				lb = fa[lb];
			}
		}
		while(la != bx)
		{
			va.push_back(la);
			vb.push_back(la);
			la = fa[la];
		}
		va.push_back(bx);
		vb.push_back(bx);
		return {va, vb};
	};
	auto gcmp = [](int x, int y) { return y != 0 && (x == 0 || (lgs[x] < lgs[y] || (lgs[x] == lgs[y] && dep[dp[x]] < dep[dp[y]]))); };
	auto qval = [](int x) { return 2 * lgs[x] - dep[dp[x]] + 1; };
	vector<int> canbe;
	for(int v : web[bx])
	{
		if(lgs[v] + 1 == lgs[bx]) canbe.push_back(v);
	}
	if(canbe.size() == 1)
	{
		vector<int> cang;
		for(int v : web[bx])
		{
			if(lgs[v] + 1 == lgs[bx]) continue;
			if(!cang.empty() && lgs[v] > lgs[cang[0]]) cang.clear();
			if(cang.empty() || lgs[v] == lgs[cang[0]]) cang.push_back(v);
		}
		if(cang.empty())
		{
			printf("%d\n", lgs[canbe[0]]);
			auto res = cst(canbe[0]);
			for(int x : res.first) printf("%d ", x);
			printf("\n");
			for(int x : res.second) printf("%d ", x);
			printf("\n");
			return 0;
		}
		else if(cang.size() == 1) canbe.push_back(cang[0]);
		else
		{
			int vk = canbe[0];
			int v1 = cang[0], v2 = cang[1];
			int l1 = qadv(v1), l2 = qadv(v2);
			auto r1 = cst(vk);
			vector<int> r1x, r2x;
			while(l1 != bx) { r1x.push_back(l1); l1 = fa[l1]; };
			while(l2 != bx) { r2x.push_back(l2); l2 = fa[l2]; };
			reverse(r1x.begin(), r1x.end());
			reverse(r2x.begin(), r2x.end());
			printf("%d\n", lgs[vk] + lgs[v1] + 1);
			for(int x : r1.first) printf("%d ", x);
			for(int i=0;i<r1x.size();i++) printf("%d ", r1x[i]);
			printf("\n");
			for(int x : r1.second) printf("%d ", x);
			for(int i=0;i<r2x.size();i++) printf("%d ", r2x[i]);
			return 0;
		}
	}
	if(canbe.size() == 2)
	{
		int kx = canbe[0], ky = canbe[1];
		printf("%d\n", lgs[kx] + lgs[ky] + 1);
		auto r1 = cst(kx), r2 = cst(ky);
		reverse(r2.first.begin(), r2.first.end());
		reverse(r2.second.begin(), r2.second.end());
		for(int x : r1.first) printf("%d ", x);
		for(int i=1;i<r2.first.size();i++) printf("%d ", r2.first[i]);
		printf("\n");
		for(int x : r1.second) printf("%d ", x);
		for(int i=1;i<r2.second.size();i++) printf("%d ", r2.second[i]);
		return 0;
	}
	if(canbe.size() == 3)
	{
		int kx = canbe[0], ky = canbe[1], kz = canbe[2];
		int vk = min({kx, ky, kz}, [](int x, int y) { return dep[dp[x]] < dep[dp[y]]; });
		int v1, v2;
		if(vk == kx) { v1 = ky; v2 = kz; }
		else if(vk == ky) { v1 = kx; v2 = kz; }
		else { v1 = kx; v2 = ky; }
		int l1 = qadv(v1), l2 = qadv(v2);
		auto r1 = cst(vk);
		vector<int> r1x, r2x;
		while(l1 != bx) { r1x.push_back(l1); l1 = fa[l1]; };
		while(l2 != bx) { r2x.push_back(l2); l2 = fa[l2]; };
		reverse(r1x.begin(), r1x.end());
		reverse(r2x.begin(), r2x.end());
		printf("%d\n", lgs[bx] * 2 - 1);
		for(int x : r1.first) printf("%d ", x);
		for(int i=0;i<r1x.size();i++) printf("%d ", r1x[i]);
		printf("\n");
		for(int x : r1.second) printf("%d ", x);
		for(int i=0;i<r2x.size();i++) printf("%d ", r2x[i]);
		return 0;
	}
	else
	{
		printf("%d\n", lgs[bx] * 2 - 1);
		int v1 = qadv(canbe[0]), v2 = qadv(canbe[1]), v3 = qadv(canbe[2]), v4 = qadv(canbe[3]);
		vector<int> tmp;
		while(v1 != bx) { printf("%d ", v1); v1 = fa[v1]; }
		while(v2 != bx) { tmp.push_back(v2); v2 = fa[v2]; }
		reverse(tmp.begin(), tmp.end());
		printf("%d ", bx);
		for(int x : tmp) printf("%d ", x);
		printf("\n");
		tmp.clear();
		while(v3 != bx) { printf("%d ", v3); v3 = fa[v3]; }
		while(v4 != bx) { tmp.push_back(v4); v4 = fa[v4]; }
		reverse(tmp.begin(), tmp.end());
		printf("%d ", bx);
		for(int x : tmp) printf("%d ", x);
		printf("\n");
	}
	return 0;
}
```

:::
