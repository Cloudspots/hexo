---
title: 题解：P6805 [CEOI 2020] 春季大扫除
tags:
  - Solution
  - Luogu P Problem Solution
  - Tree
  - Segment Tree
  - Heavy-light Decomposition
categories:
  - Solution
date: 2026-09-05 16:24:55
updated: 2026-09-05 16:24:55
---
这是简单题噢。

考虑静态版本怎么做。考虑 DP。如果有 $1\to 2,1\to 3$（$\to$ 表示父亲儿子关系）的情况显然（除非是根节点）是 $2,3$ 的边都连上来，也就是 $1$ 会有两条边连到上面。

进一步，我们看一个点有多少条边连到上面，显然简化为 $1$ 或 $2$ 即可。

$1\to 1,2\to 0$。现在插入一个叶子，相当于祖先链翻转，全局求和，单点求值（需要减去 $1$，同时需要判断是否无解）。树剖线段树即可。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/296707021)。

```cpp
#include <cstdio>
#include <algorithm>
#include <vector>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; }; // 我的 lambda 人生

// 区间翻转，全局求和，单点求值
class segtree
{
public:
  class node { public: int sum; bool flip; } nodes[200005];
  constexpr int getr(int l, int r, int id) { return id + ((l + r) / 2 - l + 1) * 2; }
  void pushdown(int l, int r, int id) { if(nodes[id].flip) { nodes[id + 1].sum = ((l + r) / 2 - l + 1) - nodes[id + 1].sum; nodes[id + 1].flip ^= 1; nodes[getr(l, r, id)].sum = (r - (l + r) / 2) - nodes[getr(l, r, id)].sum; nodes[getr(l, r, id)].flip ^= 1; nodes[id].flip = false; } }
  void pushup(int l, int r, int id) { nodes[id].sum = nodes[id + 1].sum + nodes[getr(l, r, id)].sum; }
  // 为啥要 build 啊/kel
  // void build(int n) { U([&](auto &&self, int l, int r, int id) -> void { if(l == r) { nodes[id] = {ikv[l], false}; return; } self(self, l, (l + r) / 2, id + 1); self(self, (l + r) / 2 + 1, r, getr(l, r, id)); pushup(l, r, id); })(1, n, 1); }
  void vflip(int n, int L, int R) { U([&](auto &&self, int l, int r, int vl, int vr, int id) -> void { if(l == vl && r == vr) { nodes[id].flip ^= 1; nodes[id].sum = r - l + 1 - nodes[id].sum; return; } pushdown(l, r, id); if(vl <= (l + r) / 2) self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1); if(vr > (l + r) / 2) self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id)); pushup(l, r, id); })(1, n, L, R, 1); }
  int qasum() { return nodes[1].sum; }
  int qval(int n, int pos) { return U([&](auto &&self, int l, int r, int id) -> int { if(l == r) return nodes[id].sum; pushdown(l, r, id); if(pos <= (l + r) / 2) return self(self, l, (l + r) / 2, id + 1); else return self(self, (l + r) / 2 + 1, r, getr(l, r, id)); })(1, n, 1); }
} seg;

// 讨厌树剖喵！！
vector<int> ch[100005];
int ndfn[100005];
int sz[100005];
int hson[100005];
int fa[100005];
int htop[100005];
int ccnt[100005];

int vk[100005];

int main()
{
  int n, q;
  scanf("%d%d", &n, &q);
  for(int i=2;i<=n;i++)
  {
    int u, v;
    scanf("%d%d", &u, &v);
    ch[u].push_back(v);
    ch[v].push_back(u);
  }
  int rt = -1;
  for(int i=1;i<=n;i++)
  {
    if(ch[i].size() > 1)
    {
      rt = i;
      break;
    }
  }
  // printf("rt = %d\n", rt);
  // dfs1
  U([&](auto &&self, int u) -> void
  {
    if(fa[u]) ch[u].erase(find(ch[u].begin(), ch[u].end(), fa[u]));
    sz[u] = 1;
    ccnt[u] = (int)ch[u].size();
    for(int v : ch[u])
    {
      fa[v] = u;
      self(self, v);
      sz[u] += sz[v];
      hson[u] = max(hson[u], v, [](int x, int y) { return sz[x] < sz[y]; });
    }
  })(rt);
  int ddfn = 0;
  // dfs2
  U([&](auto &&self, int u) -> void
  {
    if(fa[u] && u == hson[fa[u]]) htop[u] = htop[fa[u]];
    else htop[u] = u;
    ndfn[u] = ++ddfn;
    // printf("ndfn[%d] = %d\n", u, ndfn[u]);
    if(hson[u]) self(self, hson[u]);
    for(int v : ch[u]) if(v != hson[u]) self(self, v);
  })(rt);
  auto ancflip = [&](int x)
  {
    while(x)
    {
      // printf("flip dfn [%d, %d]\n", ndfn[htop[x]], ndfn[x]);
      seg.vflip(n, ndfn[htop[x]], ndfn[x]);
      // printf("now sum = %d\n", seg.qasum());
      x = fa[htop[x]];
    }
  };
  for(int i=1;i<=n;i++)
  {
    if(!ccnt[i])
    {
      // printf("ancflip(%d)\n", i);
      ancflip(i);
    }
  }
  // printf("qsum = %d\n", seg.qasum());
  auto vcalc = [&]() { return seg.qval(n, ndfn[rt]) ? -0x3f3f3f3f : 2 * (n - 1) - seg.qasum(); };
  // printf("origin: %d\n", vcalc());
  // switch on the power line
  while(q--)
  {
    int k;
    scanf("%d", &k);
    for(int i=1;i<=k;i++)
    {
      scanf("%d", vk + i);
      if(ccnt[vk[i]]) ancflip(vk[i]);
      ccnt[vk[i]]++;
    }
    printf("%d\n", max(-1, vcalc() + k));
    for(int i=k;i>=1;i--)
    {
      ccnt[vk[i]]--;
      if(ccnt[vk[i]]) ancflip(vk[i]);
    }   
  }
  return 0;
}
```

:::
