---
title: 题解：P15940 [JOI Final 2026] 花园 3 / Garden 3
tags:
  - Solution
  - Luogu P Problem Solution
  - Potential Analysis
  - Segment Tree
  - Offline Algorithm
categories:
  - Solution
date: 2026-09-22 21:42:47
updated: 2026-09-22 21:42:47
---
# 题解：P15940 [JOI Final 2026] 花园 3 / Garden 3

确实不难。

首先我们求出 $\ge X$ 的格子中，$X,Y$ 坐标分别的最大最小值，显然答案就是 $(X_{\max}-X_{\min}+1)(Y_{\max}-Y_{\min}+1)$。

同时注意到这个范围单调递增，即 $X_{\max},Y_{\max}$ 单增，$X_{\min},Y_{\min}$ 单减。

如果直接做其实没那么好做。因为我们首先要找到第一个出现 $\ge X$ 的格子的时刻。考虑时光倒流，从 $X_{\min}=Y_{\min}=1,X_{\max}=H,Y_{\max}=W$ 开始向内收缩。

只考虑 $X_{\min}$，在时光倒流意义下是单降的。扫描线，维护扫描位置，对于每个时刻从上往下移动扫描线。

最开始有 $N$ 个长方形，由于这是扫描线，我们可以直接将左上角 $(X_1,Y_1)$，右下角 $(X_2,Y_2)$（原点在左上方，$x$ 轴向下，$y$ 轴向右）变换为“扫描线扫到 $X=X_1$ 时 $Y_1\dots Y_2$ 加一个数，扫到 $X=X_2+1$ 时 $Y_1\dots Y_2$ 减去它”。

而删除一个长方形，首先判断如果扫描线不在长方形内部则不需要对长方形本身进行修改，否则也要区间减法。然后要删掉开始和结束的加法标记，更简单的实现方法是加上和原本标记权值相反的标记。

需要离散化。时间复杂度 $O(N\log N)$。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/298851486)。

```cpp
#include <map>
#include <cstdio>
#include <vector>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };
const auto getr = [](int l, int r, int id) { return id + ((l + r) / 2 - l + 1) * 2; };

class segtree
{
public:
  class node { public: long long addn, maxn; } nodes[800005];
  void pushup(int l, int r, int id) { nodes[id].addn = 0; nodes[id].maxn = max(nodes[id + 1].maxn, nodes[getr(l, r, id)].maxn); }
  void pushdown(int l, int r, int id) { nodes[id + 1].addn += nodes[id].addn; nodes[id + 1].maxn += nodes[id].addn; nodes[getr(l, r, id)].addn += nodes[id].addn; nodes[getr(l, r, id)].maxn += nodes[id].addn; nodes[id].addn = 0; }
  void build(int n) { U([&](auto &&self, int l, int r, int id) -> void { if(l == r) { nodes[id] = {0, 0}; return; } self(self, l, (l + r) / 2, id + 1); self(self, (l + r) / 2 + 1, r, getr(l, r, id)); pushup(l, r, id); })(1, n, 1); }
  void vadd(int n, int L, int R, long long val) { U([&](auto &&self, int l, int r, int vl, int vr, int id) -> void { if(l == vl && r == vr) { nodes[id].addn += val; nodes[id].maxn += val; return; } pushdown(l, r, id); if(vl <= (l + r) / 2) self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1); if(vr > (l + r) / 2) self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id)); pushup(l, r, id); })(1, n, L, R, 1); }
  long long qmax(int n, int L, int R) { return U([&](auto &&self, int l, int r, int vl, int vr, int id) -> long long { if(l == vl && r == vr) return nodes[id].maxn; pushdown(l, r, id); long long res = -1; if(vl <= (l + r) / 2) res = max(res, self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1)); if(vr > (l + r) / 2) res = max(res, self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id))); return res; })(1, n, L, R, 1); }
} st;

int xreal[400005], yreal[400005];

long long xmin[200005], xmax[200005], ymin[200005], ymax[200005];

class seg { public: int l, r; long long val; };
vector<seg> ivs[400005];

class rect { public: int u, d, l, r; long long val; } rects[200005];

int main()
{
  int n, h, w;
  long long x;
  scanf("%d%d%d%lld", &h, &w, &n, &x);
  map<int, int> _mx, _my;
  for(int i=1;i<=n;i++)
  {
    scanf("%d%d%d%d%lld", &rects[i].u, &rects[i].d, &rects[i].l, &rects[i].r, &rects[i].val);
    _mx[rects[i].u]; _mx[rects[i].d];
    _my[rects[i].l]; _my[rects[i].r];
  }
  {
    int cur = 0;
    for(auto &[vx, y] : _mx) xreal[y = ++cur] = vx;
    cur = 0;
    for(auto &[vx, y] : _my) yreal[y = ++cur] = vx;
    for(int i=1;i<=n;i++)
    {
      rects[i] = {_mx[rects[i].u], _mx[rects[i].d], _my[rects[i].l], _my[rects[i].r], rects[i].val};
    }
  } // 离散化完成！
  { // Xmin
    for(int i=0;i<=2*n+1;i++) ivs[i].clear();
    for(int i=1;i<=n;i++)
    {
      ivs[rects[i].u].push_back({rects[i].l, rects[i].r, rects[i].val});
      ivs[rects[i].d + 1].push_back({rects[i].l, rects[i].r, -rects[i].val});
    }
    int cur = 0;
    for(int i=n;i>=1;i--)
    {
      while(cur <= 2 * n + 1 && st.qmax(2 * n, 1, 2 * n) < x)
      {
        cur++;
        for(const auto &[l, r, v] : ivs[cur])
        {
          st.vadd(2 * n, l, r, v);
        }
      }
      xmin[i] = cur;
      if(rects[i].u <= cur && cur <= rects[i].d) st.vadd(2 * n, rects[i].l, rects[i].r, -rects[i].val);
      ivs[rects[i].u].push_back({rects[i].l, rects[i].r, -rects[i].val});
      ivs[rects[i].d + 1].push_back({rects[i].l, rects[i].r, rects[i].val});
    }
  }
  { // Xmax
    for(int i=0;i<=2*n+1;i++) ivs[i].clear();
    for(int i=1;i<=n;i++)
    {
      ivs[rects[i].u - 1].push_back({rects[i].l, rects[i].r, -rects[i].val});
      ivs[rects[i].d].push_back({rects[i].l, rects[i].r, rects[i].val});
    }
    int cur = 2 * n + 1;
    for(int i=n;i>=1;i--)
    {
      while(cur > 0 && st.qmax(2 * n, 1, 2 * n) < x)
      {
        cur--;
        for(const auto &[l, r, v] : ivs[cur])
        {
          st.vadd(2 * n, l, r, v);
        }
      }
      xmax[i] = cur;
      if(rects[i].u <= cur && cur <= rects[i].d) st.vadd(2 * n, rects[i].l, rects[i].r, -rects[i].val);
      ivs[rects[i].u - 1].push_back({rects[i].l, rects[i].r, rects[i].val});
      ivs[rects[i].d].push_back({rects[i].l, rects[i].r, -rects[i].val});
    }
  }
  { // Ymin
    for(int i=0;i<=2*n+1;i++) ivs[i].clear();
    for(int i=1;i<=n;i++)
    {
      ivs[rects[i].l].push_back({rects[i].u, rects[i].d, rects[i].val});
      ivs[rects[i].r + 1].push_back({rects[i].u, rects[i].d, -rects[i].val});
    }
    int cur = 0;
    for(int i=n;i>=1;i--)
    {
      while(cur <= 2 * n + 1 && st.qmax(2 * n, 1, 2 * n) < x)
      {
        cur++;
        for(const auto &[l, r, v] : ivs[cur])
        {
          st.vadd(2 * n, l, r, v);
        }
      }
      ymin[i] = cur;
      if(rects[i].l <= cur && cur <= rects[i].r) st.vadd(2 * n, rects[i].u, rects[i].d, -rects[i].val);
      ivs[rects[i].l].push_back({rects[i].u, rects[i].d, -rects[i].val});
      ivs[rects[i].r + 1].push_back({rects[i].u, rects[i].d, rects[i].val});
    }
  }
  { // Ymax
    for(int i=0;i<=2*n+1;i++) ivs[i].clear();
    for(int i=1;i<=n;i++)
    {
      ivs[rects[i].l - 1].push_back({rects[i].u, rects[i].d, -rects[i].val});
      ivs[rects[i].r].push_back({rects[i].u, rects[i].d, rects[i].val});
    }
    int cur = 2 * n + 1;
    for(int i=n;i>=1;i--)
    {
      while(cur > 0 && st.qmax(2 * n, 1, 2 * n) < x)
      {
        cur--;
        for(const auto &[l, r, v] : ivs[cur])
        {
          st.vadd(2 * n, l, r, v);
        }
      }
      ymax[i] = cur;
      if(rects[i].l <= cur && cur <= rects[i].r) st.vadd(2 * n, rects[i].u, rects[i].d, -rects[i].val);
      ivs[rects[i].l - 1].push_back({rects[i].u, rects[i].d, rects[i].val});
      ivs[rects[i].r].push_back({rects[i].u, rects[i].d, -rects[i].val});
    }
  }
  for(int i=1;i<=n;i++)
  {
    printf("%lld\n", 1ll * (xmax[i] >= xmin[i] ? xreal[xmax[i]] - xreal[xmin[i]] + 1 : 0) * (ymax[i] >= ymin[i] ? yreal[ymax[i]] - yreal[ymin[i]] + 1 : 0));
  }
  return 0;
}
```

:::
