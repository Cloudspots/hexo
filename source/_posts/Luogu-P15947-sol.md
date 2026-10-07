---
title: 题解：P15947 [JOI Final 2026] 集邮 5 / Collecting Stamps 5
tags:
  - Solution
  - Luogu P Problem Solution
  - Centroid Decomposition
  - 2D Point Counting
  - Fenwick Tree
categories:
  - Solution
date: 2026-09-22 21:36:16
updated: 2026-09-22 21:36:16
---
# 题解：P15947 [JOI Final 2026] 集邮 5 / Collecting Stamps 5

简单题吧，没什么思维难度，想清楚后也不难写，怎么一堆人用两个线段树写二维数点……

> 我写 T1 题解，你写 T2 题解，我们不会做 T3？

---

先考虑一个路径 $s\leadsto t$ 是否合法。显然它合法当且仅当 $d_{s,t}\le D$ 且路径上有一个点 $u$ 满足 $d_{s,u}\ge T_u$（$d_{x,y}$ 表示 $x,y$ 之间的距离）。

换根 DP 不太行。考虑点分治。

如何统计经过一个点的路径？

假设分治中心（重心）是 $c$。我们将 $s\leadsto t$ 分为 $s\leadsto c$ 和 $c\leadsto t$ 两部分，然后分讨 $d$ 在哪一部分（不需要考虑 $c$ 同时在两条路径上产生的重复贡献因为本来就是两条路径求或，而不是求和，重复贡献本来就是允许的）。

由于是点分治，在结尾处计算贡献比较好，所以我们考虑 $t\leadsto s$。条件是相同的。

若 $u$ 在 $t\leadsto c$ 路径上，则 $d_{s,u}=\text{dep}_s+\text{dep}_u$（$\text{dep}$ 代表深度，$c$ 为根）。所以有 $\text{dep}_s+\text{dep}_u\ge T_u$，分离 $s,u$ 得到 $\text{dep}_s\ge T_u-\text{dep}_u$。由于 $u$ 在 $t\leadsto c$ 路径上所以我们对计算 $t$ 祖先链上 $\text{dep}-T$ 的最小值即可。

若 $u$ 在 $c\leadsto s$ 路径上，则 $d_{s,u}=\text{dep}_s-\text{dep}_u$，所以 $\text{dep}_s\ge T_u+\text{dep}_u$。所以若 $s$ 祖先链上 $T+\text{dep}$ 的最小值 $\le \text{dep}_s$，那么说明从 $s$ 连出去只要经过 $c$，连出的任何一条路径都是合法的（只要距离满足限制）。

而对于距离限制，显然就是 $\text{dep}_s+\text{dep}_t\le D$，换句话说 $\text{dep}_t\le D-\text{dep}_s$。

也就是我们要对这两个东西进行计数：

- $\text{dep}$ 带上界，祖先链 $\min\{\text{dep}-T\}$ 带上界。
- 只有 $\text{dep}$ 带上界。


二维数点即可，离线然后树状数组，不卡常。子树内部贡献用容斥减掉。时间复杂度 $O(n\log^2 n)$。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/298664091)。

```cpp
/*
考虑一个点被选中的条件。

dep <= D 且 祖先链中有一个节点 u 满足 dep[u] >= T[u]

dep[u] >= T[u] -> dep[u] - T[u] >= 0.

也就是说，祖先链 dep[u] - T[u] 的 max 要 >= 0。

先考虑 D = +inf（有 41pts 呢喵）。

思考：你会统计经过一个点的所有贡献吗喵？

这个倒是不难。考虑容斥。直接做就行了。对于一般的 D 就二维数点。

那么你套一个点分治就能做到 2log 了。

做完了，2log。
*/
#include <bitset>
#include <cstdio>
#include <vector>
#include <utility>
#include <cassert>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

class fenwick
{
public:
  long long st[400005];
  void vadd(int pos, long long val, int n) { pos++; n++; do { st[pos] += val; } while((pos += pos & -pos) <= n); }
  long long qsum(int pos) { pos++; long long s = 0; do { s += st[pos]; } while(pos -= pos & -pos); return s; }
} fw;

int t[400005];
vector<int> web[400005];
bitset<400005> vis;
int dep[400005];
int dcnt1[400005], dcnt2[400005];
long long ans[400005];

int main()
{
  int n, d;
  scanf("%d%d", &n, &d);
  for(int i=1;i<=n;i++)
  {
    scanf("%d", t + i);
    t[i] = min(t[i], n);
  }
  for(int i=1;i<n;i++)
  {
    int u, v;
    scanf("%d%d", &u, &v);
    web[u].push_back(v);
    web[v].push_back(u);
  }
  auto cent = [](int x) { int s = U([&](auto &&self, int u, int fa) -> int { int res = 1; for(int v : web[u]) if(v != fa && !vis[v]) res += self(self, v, u); return res; })(x, -1); return -U([&](auto &&self, int u, int fa) -> int { int sum = 1, maxn = 0; for(int v : web[u]) if(v != fa && !vis[v]) { int res = self(self, v, u); if(res < 0) return res; maxn = max(maxn, res); sum += res; } maxn = max(maxn, s - sum); if(maxn <= s / 2) return -u; else return sum; })(x, -1); };
  U([&](auto &&self, int u) -> void
  {
    u = cent(u);
    // preprocess
    dep[u] = 0;
    U([&](auto &&sel, int x, int fa) -> void { for(int y : web[x]) if(y != fa && !vis[y]) { dep[y] = dep[x] + 1; sel(sel, y, x); } })(u, -1);
    auto vcalc = [&](int x)
    {
      // insert
      /*
      对于从 R1 开始的点 x，终点为 y

      那么 dep[x] + dep[y] >= t[x].

      换句话说 dep[y] >= t[x] - dep[x]

      对于从 R2 开始的点 x

      dep[y] - dep[x] >= t[x].

      dep[x] + t[x] <= dep[y].
      */
      vector<pair<int, int>> vins;
      U([&](auto &&sel, int a, int fa, int minn) -> void
      {
        if(dep[a] > d) return;
        minn = min(minn, t[a] - dep[a]);
        vins.push_back({dep[a], minn});
        for(int b : web[a])
        {
          if(b != fa && !vis[b]) sel(sel, b, a, minn);
        }
      })(x, -1, t[u] + dep[u]);
      class qry
      {
      public:
        int id, dmax, vmax, fctr;
      };
      vector<qry> vq;
      // calculate
      int bfc = (x == u ? 1 : -1);
      U([&](auto &&sel, int a, int fa, int minn) -> void
      {
        if(dep[a] > d) return;
        minn = min(minn, t[a] + dep[a]);
        if(minn <= dep[a])
        {
          vq.push_back({a, d - dep[a], 0x3f3f3f3f, bfc});
          // printf("special: %d\n", a);
        }
        else vq.push_back({a, d - dep[a], dep[a], bfc});
        for(int b : web[a])
        {
          if(b != fa && !vis[b]) sel(sel, b, a, minn);
        }
      })(x, -1, t[u] + dep[u]);
      sort(vq.begin(), vq.end(), [](const auto &x, const auto &y) { return x.dmax < y.dmax; });
      sort(vins.begin(), vins.end(), [](const auto &x, const auto &y) { return x.first < y.first; });
      int cur = 0;
      for(const auto &[id, dmax, vmax, fctr] : vq)
      {
        while(cur < vins.size() && vins[cur].first <= dmax) fw.vadd(max(0, vins[cur++].second), 1, n + 5);
        // printf("ans[%d] += %d\n", id, fctr * (vmax < 0 ? 0 : fw.qsum(min(n + 1, vmax))));
        ans[id] += fctr * (vmax < 0 ? 0 : fw.qsum(min(n + 1, vmax)));
      }
      while(cur > 0) fw.vadd(max(0, vins[--cur].second), -1, n + 5);
    };
    vcalc(u);
    vis[u] = true;
    for(int v : web[u])
    {
      if(!vis[v]) vcalc(v);
    }
    for(int v : web[u])
    {
      if(!vis[v]) self(self, v);
    }
  })(1);
  for(int i=1;i<=n;i++) printf("%lld\n", ans[i]);
  return 0;
}
// sleeping...
// 我能在 1h 之内打完点分治+二维数点吗，嗯这个其实看起来并不很难。
```

:::
