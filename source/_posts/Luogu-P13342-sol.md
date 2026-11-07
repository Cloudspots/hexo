---
title: 题解：P13342 [EGOI 2025] Wind Turbines / 风力涡轮机
tags:
  - "Mo's Algorithm"
  - Kruskal Reconstruction Tree
  - '0-1 Trie'
  - Optimization
  - Solution
  - Luogu P Problem Solution
categories:
  - Solution
date: 2026-11-03 06:32:57
updated: 2026-11-03 06:32:57
---
# 题解：P13342 [EGOI 2025] Wind Turbines / 风力涡轮机

$O(n\sqrt q\log n)$ 卡过了，纪念一下。

首先如果 $r=l$，就是 MST。

如果 $r=l+1$，就是去掉 $l,r$ 路径上最大权边。

对于其它情况就是 $r=l+1$ 的扩展，$r=l+1$ 本质上就是 Kruskal 重构树上的 LCA，而一般情况就是将 $[l,r]$ 按照 dfn 排序（Kruskal 重构树上，下同），然后相邻求 LCA，所有不同的 LCA 的点权之和。换句话说就是虚树。

那么配上莫队可以做到 $O(n\sqrt n\log n)$。$O(n\log n)-O(1)$ LCA 是简单的（dfn ST 表），瓶颈在于求前驱后继。

接下来就是卡常（没想到吧不是回滚莫队而是卡常）。

- 快读。
- 用 `set` 肯定是爆爆爆的。考虑一个 `bitset` 优化的 01-Trie，堆式存储，每个节点存储子树中有没有存在的数字。`bitset` 只是为了稍微 cache 友好一点。然后使用位运算顺手加速一下插入删除前驱后继。然后这个 01-Trie 其实比较快了，和 LCA 差别不大，所以 LCA 的优化也比较重要。
- 莫队奇偶优化。
- 考虑到我们可以记忆化，对于每个存在的数字存储其前驱后继，和它和它的后继的 LCA，这样可以节省一半的 Trie 操作和 LCA 计算。
- 考虑到每次求 LCA 都是对于两个不同的叶子，可以对叶子不记录 dfn 序，这样相当于只有 $n-1$ 个点，ST 表可以加速一点点，`bitset` 也是，同时所有叶子节点按照父节点 dfn 排序；然后 LCA 和权值也相应优化一下，尽量减少数组访问次数，比较复杂，详见代码。
- ST 表的经典卡常小技巧：小的一维放前面，cache。
- 交两遍，完全相同的代码一个 $>4.2\mathrm{s}$ 一个 $3.5\mathrm{s}$ 成功气笑我。洛谷的所有评测机真的是一个配置吗。
- 善用 `perf` 啊，不能盲目优化，对于这个 $300+$ 行的代码瞪眼优化法真的很无从下手。

当然这个东西用 van Emde Boas 可以优化到 $O(n\sqrt q\log \log n)$，但我觉得直接写并不能过，毕竟 vEB 常数不小。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/307849028)。

下面的代码经过适当简化，主要删除了注释掉的调试语句。

```cpp
#include <cmath>
#include <cstdio>
#include <vector>
#include <bitset>
#include <chrono>
#include <utility>
#include <cassert>
#include <algorithm>
#ifdef LB_IS_DEBUGGING
#include <signal.h>
#define __debugbreak() raise(SIGTRAP)
#else
#define __debugbreak()
#endif

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

class dsu
{
public:
  unsigned fa[100005];
  unsigned rk[100005];
  unsigned getfa(unsigned x) { while(x != fa[x]) x = fa[x] = fa[fa[x]]; return x; }
  void merge(unsigned x, unsigned y) { if((x = getfa(x)) == (y = getfa(y))) return; if(rk[x] < rk[y]) fa[x] = y; else if(rk[x] > rk[y]) fa[y] = x; else { fa[x] = y; rk[y]++; } }
} ds;

class v2ray // trieeeeeeeeeeeeeee
{
public:
  bitset<262144> st;
  void insert(unsigned p)
  {
    p |= 131072;
    do
    {
      if(st[p]) break;
      st[p] = true;
    } while(p >>= 1);
  }
  void erase(unsigned p)
  {
    p |= 131072;
    st[p] = false;
    while(p >>= 1)
    {
      st[p] = st[p * 2] | st[p * 2 + 1];
    }
  }
  unsigned pred(unsigned p)
  {
    if(!st[1]) return 0;
    p |= 131072;
    while(p && (((~p)&1) || !st[p & 0xfffffffeu])) p >>= 1;
    if(p == 0) return 0;
    p &= 0xfffffffeu;
    while(!(p >> 17))
    {
      if(st[2 * p + 1]) p = 2 * p + 1;
      else p = 2 * p;
    }
    return p ^ 131072;
  }
  unsigned succ(unsigned p)
  {
    if(!st[1]) return 0;
    p |= 131072;
    while(p && (p&1 || !st[p | 1])) p >>= 1;
    if(p == 0) return 0;
    p |= 1;
    while(!(p >> 17))
    {
      if(st[2 * p]) p = 2 * p;
      else p = 2 * p + 1;
    }
    return p ^ 131072;
  }
} ray;

unsigned ht[100005], qg[100005], rv[100005];
unsigned rdfn[200005], vla[200005];
unsigned msk[200005];

class msedge { public: unsigned u, v, w; } es[100005];
class jury { public: unsigned l, r, id; long long ans; } qry[200005];

unsigned val[200005], fa[200005], ch[200005][2];
unsigned dfn[200005], vx[200005], dep[200005], fr[200005];
unsigned stmin[25][100005];
unsigned arc[100005], hpr[100005], archpr[100005];

char ibf[100000005];
unsigned li = 0;
unsigned qread() { unsigned res = 0; char ch; while((ch = ibf[li++]) < '0' || ch > '9'); do { res = res * 10 + ch - '0'; } while((ch = ibf[li++]) >= '0' && ch <= '9'); return res; }

int main()
{
  fread(ibf, 1, sizeof ibf, stdin);
  int n, m, q;
  n = qread(); m = qread(); q = qread();
  for(int i=1;i<=m;i++)
  {
    es[i].u = qread(); es[i].v = qread(); es[i].w = qread();
    es[i].u++; es[i].v++;
  }
  sort(es + 1, es + m + 1, [](const auto &x, const auto &y) { return x.w < y.w; });
  for(int i=1;i<=n;i++)
  {
    ds.fa[i] = ht[i] = i;
    ds.rk[i] = 0;
  }
  long long rs = 0;
  int cur = n;
  for(int i=1;i<=m;i++)
  {
    auto [u, v, w] = es[i];
    if(ds.getfa(u) == ds.getfa(v)) continue;
    rs += w;
    vla[++cur] = w;
    ch[cur][0] = ht[ds.getfa(u)]; ch[cur][1] = ht[ds.getfa(v)];
    fa[ht[ds.getfa(u)]] = fa[ht[ds.getfa(v)]] = cur;
    ds.merge(u, v);
    ht[ds.getfa(u)] = cur;
  }
  int ddfn = 0;
  unsigned cp = 0;
  U([&](auto &&self, int u) -> void
  {
    rdfn[dfn[u] = ++ddfn] = u;
    vx[ddfn] = dep[u];
    if(ch[u][0])
    {
      dep[ch[u][0]] = dep[ch[u][1]] = dep[u] + 1;
      if(!ch[ch[u][0]][0]) qg[ch[u][0]] = ++cp;
      if(!ch[ch[u][1]][1]) qg[ch[u][1]] = ++cp;
      if(ch[ch[u][0]][0]) self(self, ch[u][0]);
      if(ch[ch[u][1]][1]) self(self, ch[u][1]);
    }
  })(cur);
  assert(ddfn == n - 1);
  for(int i=1;i<=n-1;i++)
  {
    stmin[0][i] = i;
    for(int j=1;(1<<j)<=i;j++)
    {
      stmin[j][i] = min(stmin[j-1][i], stmin[j-1][i-(1<<(j-1))], [](int x, int y) { return vx[x] < vx[y]; });
    }
  }
  for(int i=1;i<=2*n-1;i++)
  {
    fr[i] = dfn[fa[rdfn[i]]];
    if(i <= n) rv[qg[i]] = dfn[fa[i]];
    if(dfn[i]) val[dfn[i]] = vla[i];
  }
  auto qmin = [](int l, int r) -> int { int llen = __lg(r - l + 1); return min(stmin[llen][l+(1<<llen)-1], stmin[llen][r], [](int x, int y) { return vx[x] < vx[y]; }); };
  auto qLCArdfn = [&](int dx, int dy) { return rv[dx] == rv[dy] ? rv[dx] : fr[qmin(rv[dx] + 1, rv[dy])]; };
  int B = n / sqrt(q) + 1;
  for(int i=1;i<=q;i++)
  {
    qry[i].l = qread(); qry[i].r = qread();
    qry[i].l++; qry[i].r++;
    qry[i].id = i;
  }
  sort(qry + 1, qry + q + 1, [&](const auto &x, const auto &y) { return x.l / B < y.l / B || x.l / B == y.l / B && x.r != y.r && ((x.r < y.r) ^ ((x.l / B) & 1)); });
  int l = 1, r = 0;
  for(int i=1;i<=q;i++)
  {
    while(l > qry[i].l)
    {
      l--;
      unsigned qq = qg[l];
      int vl = ray.pred(qq);
      int vr = ray.succ(qq);
      arc[qq] = vl; hpr[qq] = vr; archpr[qq] = 0;
      unsigned kv = archpr[vl];
      if(vl)
      {
        int v = qLCArdfn(vl, qq);
        archpr[vl] = v;
        if(!(msk[v]++))
        {
          rs -= val[v];
        }
      }
      if(vr)
      {
        int v = qLCArdfn(qq, vr);
        archpr[qq] = v;
        if(!(msk[v]++))
        {
          rs -= val[v];
        }
      }
      if(vl && vr)
      {
        int v = kv;
        if(!--msk[v]) rs -= val[v];
      }
      if(vl) hpr[vl] = qq;
      if(vr) arc[vr] = qq;
      ray.insert(qq);
    }
    while(r < qry[i].r)
    {
      r++;
      unsigned qq = qg[r];
      int vl = ray.pred(qq);
      int vr = ray.succ(qq);
      arc[qq] = vl; hpr[qq] = vr; archpr[qq] = 0;
      unsigned kv = archpr[vl];
      if(vl)
      {
        int v = qLCArdfn(vl, qq);
        archpr[vl] = v;
        if(!(msk[v]++))
        {
          rs -= val[v];
        }
      }
      if(vr)
      {
        int v = qLCArdfn(qq, vr);
        archpr[qq] = v;
        if(!(msk[v]++))
        {
          rs -= val[v];
        }
      }
      if(vl && vr)
      {
        int v = kv;
        if(!--msk[v]) rs -= val[v];
      }
      if(vl) hpr[vl] = qq;
      if(vr) arc[vr] = qq;
      ray.insert(qq);
    }
    while(l < qry[i].l)
    {
      unsigned qq = qg[l];
      ray.erase(qq);
      int vl = arc[qq];
      int vr = hpr[qq];
      if(vl) hpr[vl] = vr;
      if(vr) arc[vr] = vl;
      unsigned kv = archpr[vl];
      if(vl && vr)
      {
        int v = qLCArdfn(vl, vr);
        archpr[vl] = v;
        if(!(msk[v]++)) rs += val[v];
      }
      else if(vl) archpr[vl] = 0;
      if(vl)
      {
        int v = kv;
        if(!--msk[v])
        {
          rs += val[v];
        }
      }
      if(vr)
      {
        int v = archpr[qq];
        if(!--msk[v])
        {
          rs += val[v];
        }
      }
      archpr[qq] = 0;
      arc[qq] = hpr[qq] = 0;
      l++;
    }
    while(r > qry[i].r)
    {
      unsigned qq = qg[r];
      ray.erase(qq);
      int vl = arc[qq];
      int vr = hpr[qq];
      if(vl) hpr[vl] = vr;
      if(vr) arc[vr] = vl;
      unsigned kv = archpr[vl];
      if(vl && vr)
      {
        int v = qLCArdfn(vl, vr);
        archpr[vl] = v;
        if(!(msk[v]++)) rs += val[v];
      }
      else if(vl) archpr[vl] = 0;
      if(vl)
      {
        int v = kv;
        if(!--msk[v])
        {
          rs += val[v];
        }
      }
      if(vr)
      {
        int v = archpr[qq];
        if(!--msk[v])
        {
          rs += val[v];
        }
      }
      archpr[qq] = 0;
      arc[qq] = hpr[qq] = 0;
      r--;
    }
    qry[i].ans = rs;
  }
  sort(qry + 1, qry + q + 1, [](const auto &x, const auto &y) { return x.id < y.id; });
  for(int i=1;i<=q;i++)
  {
    printf("%lld\n", qry[i].ans);
  }
  return 0;
}
```

壮观吧。

:::
