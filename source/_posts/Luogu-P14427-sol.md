---
title: 题解：P14427 [JOISC 2014] 电压 / Voltage
date: 2026-10-17 16:04:58
updated: 2026-10-17 16:04:58
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P14427 [JOISC 2014] 电压 / Voltage

简单题。

考虑到能够让所有电阻导电当且仅当图是二分图。

而一条边能够满足条件当且仅当同时满足：

- 去掉这条边后是二分图。
- 去掉这条边后，这条边的两个端点不再同一个连通分量中，或它们在一个连通分量中但颜色相同（即它是割边或加上它后不是二分图）。

其实可以直接做，但是线段树分治可以助你拿到最优解最后一页。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/303639050)。

```cpp
// 30min 通过 T1！
// 咋又是 JOI 公司，生气了。
/*
去掉这条边后是二分图。

线段树分治板子题。为什么总是出板子，生气了。

O(m log^2 m).
*/
#include <cstdio>
#include <vector>
#include <utility>
#include <cassert>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };
const auto getr = [](int l, int r, int id) { return id + ((l + r) / 2 - l + 1) * 2; };

class undodsu
{
public:
	int fa[200005], rk[200005];
	int getfa(int x) { while(x != fa[x]) x = fa[x]; return x; }
	int mfs[400005], mcur;
	int vcnt;
	void merge(int x, int y) { if((x = getfa(x)) == (y = getfa(y))) { mfs[++mcur] = 0; return; } vcnt--; if(rk[x] < rk[y]) { fa[x] = y; mfs[++mcur] = x; } else if(rk[x] > rk[y]) { fa[y] = x; mfs[++mcur] = y; } else { fa[x] = y; rk[y]++; mfs[++mcur] = -x; } }
	void undo() { assert(mcur); if(!mfs[mcur]) { mcur--; return; } vcnt++; if(mfs[mcur] > 0) fa[mfs[mcur]] = mfs[mcur]; else { rk[fa[-mfs[mcur]]]--; fa[-mfs[mcur]] = -mfs[mcur]; } mcur--; }
} dsa;

vector<pair<int, int>> vks[400005];
pair<int, int> vk[200005];

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	auto vins = [&](int L, int R, const pair<int, int> &e) { U([&](auto &&self, int l, int r, int vl, int vr, int id) -> void { if(l == vl && r == vr) { vks[id].push_back(e); return; } if(vl <= (l + r) / 2) self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1); if(vr > (l + r) / 2) self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id)); })(1, m, L, R, 1); };
	for(int i=1;i<=2*n;i++) dsa.fa[i] = i;
	// bool kfg = false;
	for(int i=1;i<=m;i++)
	{
		int u, v;
		scanf("%d%d", &u, &v);
		vk[i] = {u, v};
		// dsa.merge(u, v+n);
		// dsa.merge(v, u+n);
		// if(dsa.getfa(u) == dsa.getfa(u+n) || dsa.getfa(v) == dsa.getfa(v+n)) kfg = true;
		if(i > 1) vins(1, i-1, {u, v});
		if(i < m) vins(i+1, m, {u, v});
	}
	// if(kfg) printf("report: origin boom\n");
	// return 0;
	dsa.vcnt = 2 * n;
	int cnt = 0;
	U([&](auto &&self, int l, int r, int id) -> void
	{
		// printf("l = %d, r = %d, id = %d\n", l, r, id);
		bool fg = false;
		for(const auto &[u, v] : vks[id])
		{
			dsa.merge(u, v + n);
			dsa.merge(v, u + n);
			if(dsa.getfa(u) == dsa.getfa(u + n) || dsa.getfa(v) == dsa.getfa(v + n)) fg = true;
			// printf("Edge: (%d, %d), vcnt = %d\n", u, v, dsa.vcnt);
		}
		if(fg)
		{
			// printf("boom, undo all\n");
			for(int i=0;i<2*vks[id].size();i++) dsa.undo();
			// printf("now vcnt = %d\n", dsa.vcnt);
			return;
		}
		if(l == r)
		{
			if(dsa.getfa(vk[l].first) != dsa.getfa(vk[l].second + n))
			{
				// printf("hey edge #%d ok, vcnt = %d\n", l, dsa.vcnt);
				cnt++;
			}
		}
		else
		{
			self(self, l, (l + r) / 2, id + 1);
			self(self, (l + r) / 2 + 1, r, getr(l, r, id));
		}
		// printf("back to l = %d, r = %d, id = %d\n", l, r, id);
		for(int i=0;i<2*vks[id].size();i++)
		{
			dsa.undo();
			// printf("undo, now vcnt = %d\n", dsa.vcnt);
		}
	})(1, m, 1);
	assert(dsa.mcur == 0);
	printf("%d\n", cnt);
	return 0;
}
```

:::
