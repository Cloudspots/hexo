---
title: 题解：P16458 [UOI 2026] mex plus
tags:
  - Segment Tree Divide and Conquer
  - Data Structure
  - Fenwick Tree
  - Binary Search
  - DSU
  - Rollback Data Structure
  - Mathematics
  - Graph
  - Binary Tree
  - Solution
  - Luogu P Problem Solution
categories:
  - Solution
date: 2026-09-18 22:48:00
updated: 2026-09-18 22:48:00
---
# 题解：P16458 [UOI 2026] mex plus

线段树分治日，看看今天能做几个线段树分治题/fendou。最大值 $4$，实际值 $1$，在这个题上犯了两个很蠢的错误调了一万年。

---

直接做不太行，建图，二元组 $(a,b)$ 变为连接 $a,b$ 的边。显然 $>n+q$ 的数字都是 useless 的。

不妨转为定向问题，规定 $a\to b$ 代表 $a$ 在 $A$ 中，$b$ 在 $B$ 中。

考虑每个连通块。如果这个连通块非树，那么可以找到一个“生成基环树”（即，一个生成子图，满足它是个基环树）。

稍微思考一下就能发现，如果这样，那么我们可以做到：

- 非叶子节点同时在两个集合中。
- 叶子节点在我们想要的任意集合中。

从环开始数学归纳即可证明。

继续思考。容易发现我们最好把大多数数字都放在一个 $A$ 中，如果 $A$ 中已经有了或者实在放不进 $A$ 中才放到 $B$ 中，否则得不偿失。

而对于树，显然我们可以指定一个点不在 $A$ 中，其它都在 $A$ 中。这个是简单的。显然我们选择最大的点最优，此时 $\operatorname{mex}$ 就会在此处断开（另一种断开的条件是遇到孤立点，非树一定不会断开）。

考虑 $B$，它包含所有非叶子节点。这个是好做的，我们在线做都可以。实际上如果线段树分治加上线段树**外**二分就会有三只 $\log$ 鼎立，但是在线做就只有两个 $\log$（当然如果写线段树上二分就随便啦）。

所以我们线段树分治，维护每棵树（不是树不算）的点的最大值，然后对于所有这些最大值取 $\min$ 即可（得到 $A$ 的 $\operatorname{mex}$）。合并的时候，如果自己合自己就把自己的最大值删了；两边都非树那么不管；有一边是树就把树的最大值删了；两边都是树就把较小值删了。

支持插入删除求最小值的数据结构一大堆，但是考虑到常数问题我们可以用一种同时类似 01-Trie 和线段树的东西（这两个本就是一家），即每个节点维护子树中是否有东西。追求复杂度可以使用 vEB，这个是 $O(\log \log V)$ 的，十分高速。

最后再思考以下怎么考虑某次插入只有一个点的情况（另一个点太大所以没用）。我们只需要假设它向天上连边，然后天上全都是边。换句话说它所在的连通块一出生就不是树，换句话说给它连了个有向自环（原本自环是无向的，度数要统计两次）。当然度数只有在统计 $B$ 的时候是有用的，所以除了度数之外都和普通自环无异。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/298252372)。

```cpp
#include <map>
#include <stack>
#include <cstdio>
#include <vector>
#include <bitset>
#include <cassert>
#include <utility>
#include <signal.h>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };
const auto getr = [](int l, int r, int id) { return id + ((l + r) / 2 - l + 1) * 2; };

class fenwick
{
public:
  int st[500005]; // 超过 4e5 显然没用。
  void vadd(int pos, int val, int n) { pos++; n++; /*printf("! %d %d\n", pos, val);*/ do { st[pos] += val; } while((pos += pos & -pos) <= n); }
  int qsum(int pos) { pos++; int s = 0; do { s += st[pos]; } while(pos -= pos & -pos); return s; }
  int mex(int n)
  {
    if(!qsum(0)) return 0;
    int l = 0, r = n;
    while(l < r)
    {
      int mid = (l + r + 1) / 2;
      if(qsum(mid) == mid + 1) l = mid;
      else r = mid - 1; 
    }
    return l + 1;
  }
} f2;

class trie
{
public:
  bitset<1048576> bs; // 524288 * 2
  void insert(unsigned x) { x += 524288; do { bs[x] = true; } while(x >>= 1); }
  void erase(unsigned x) { x += 524288; bs[x] = false; while(x >>= 1) { bs[x] = bs[x * 2] | bs[x * 2 + 1]; } }
  unsigned qmin() const { if(!bs[1]) return 0x3f3f3f3f; unsigned x = 1; do { if(bs[x * 2]) x *= 2; else x = x * 2 + 1; } while(x < 524288); return x - 524288; }
} purr;

class undoarr
{
public:
  int st[400005];
  stack<pair<int, int>> mdf;
  void set(int pos, int val) { mdf.push({pos, st[pos]}); st[pos] = val; }
  int get(int pos) { return st[pos]; }
  void undo() { st[mdf.top().first] = mdf.top().second; mdf.pop(); }
};

class dsu
{
public:
  int fa[400005], rk[400005];
  int getfa(int x) { while(x != fa[x]) x = fa[x]; return x; }
  stack<int> st;
  int merge(int x, int y) { if((x = getfa(x)) == (y = getfa(y))) { st.push(-0x3f3f3f3f); return -1; } if(rk[x] < rk[y]) { fa[x] = y; st.push(x); return y; } else if(rk[x] > rk[y]) { st.push(y); fa[y] = x; return x; } else { fa[x] = y; rk[y]++; st.push(-x-1); return y; } }
  void undo() { assert(!st.empty()); int x = st.top(); st.pop(); if(x == -0x3f3f3f3f) return; if(x >= 0) fa[x] = x; else { rk[fa[-x-1]]--; fa[-x-1] = -x-1; } }
} ds;

undoarr val;

int tcnt[400005];

int ans[200005];

multimap<pair<int, int>, int> mp;

vector<pair<int, int>> ixs[524290];

int main()
{
  // freopen("P16458.in", "r", stdin);
  int n, q;
  scanf("%d%d", &n, &q);
  for(int i=1;i<=n;i++)
  {
    int x, y;
    scanf("%d%d", &x, &y);
    if(x > 400000) continue;
    if(y > 400000)
    {
      mp.insert({{x, y}, 0});
      if(++tcnt[x] == 2) f2.vadd(x, 1, 410000);
    }
    else
    {
      mp.insert({{x, y}, 0});
      if(++tcnt[x] == 2) f2.vadd(x, 1, 410000);
      if(++tcnt[y] == 2) f2.vadd(y, 1, 410000);
    }
  }
  ans[0] = f2.mex(410000);
  auto vins = [](int N, int L, int R, const pair<int, int> &v) { U([&](auto &&self, int l, int r, int vl, int vr, int id) -> void { if(l == vl && r == vr) { ixs[id].push_back(v); return; } if(vl <= (l + r) / 2) self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1); if(vr > (l + r) / 2) self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id)); })(0, N, L, R, 1); };
  for(int i=1;i<=q;i++)
  {
    char op;
    int x, y;
    scanf("\n%c%d%d", &op, &x, &y);
    if(x > y) swap(x, y);
    if(x > 400000)
    {
      ans[i] = f2.mex(410000);
      continue;
    }
    if(op == '+')
    {
      if(y > 400000)
      {
        mp.insert({{x, y}, i});
        if(++tcnt[x] == 2) f2.vadd(x, 1, 410000);
      }
      else
      {
        mp.insert({{x, y}, i});
        if(++tcnt[x] == 2) f2.vadd(x, 1, 410000);
        if(++tcnt[y] == 2) f2.vadd(y, 1, 410000);
      }
    }
    else
    {
      if(y > 400000)
      {
        auto it = mp.find({x, y});
        vins(q, it->second, i - 1, {x, x});
        if(--tcnt[x] == 1) f2.vadd(x, -1, 410000);
        mp.erase(it);
      }
      else
      {
        auto it = mp.find({x, y});
        vins(q, it->second, i - 1, {x, y});
        if(--tcnt[x] == 1) f2.vadd(x, -1, 410000);
        if(--tcnt[y] == 1) f2.vadd(y, -1, 410000);
        mp.erase(it);
      }
    }
    ans[i] = f2.mex(410000);
  }
  for(int i=0;i<=400000;i++) ds.fa[i] = i;
  for(const auto &[x, y] : mp) vins(q, y, q, {x.first, x.second > 400000 ? x.first : x.second});
  for(int i=0;i<=400000;i++) val.set(i, i);
  for(int i=0;i<=400000;i++) purr.insert(i);
  U([&](auto &&self, int l, int r, int id) -> void
  {
    // if(l == 98058 && r == 98058) raise(SIGTRAP);
    int ctt = 0, cttt = 0;
    stack<int> ct;
    for(const auto &[x, y] : ixs[id])
    {
      if(ds.getfa(x) == ds.getfa(y))
      {
        if(val.get(ds.getfa(x)) != -1)
        {
          purr.erase(val.get(ds.getfa(x)));
          ct.push(val.get(ds.getfa(x)));
          val.set(ds.getfa(x), -1);
          ctt++;
        }
      }
      else if(val.get(ds.getfa(x)) == -1)
      {
        if(val.get(ds.getfa(y)) == -1) continue;
        purr.erase(val.get(ds.getfa(y)));
        ct.push(val.get(ds.getfa(y)));
        val.set(ds.getfa(y), -1);
        ctt++;
        ds.merge(x, y);
        cttt++;
      }
      else if(val.get(ds.getfa(y)) == -1)
      {
        if(val.get(ds.getfa(x)) == -1) continue;
        purr.erase(val.get(ds.getfa(x)));
        ct.push(val.get(ds.getfa(x)));
        val.set(ds.getfa(x), -1);
        ctt++;
        ds.merge(x, y);
        cttt++;
      }
      else
      {
        auto vx = val.get(ds.getfa(x)), vy = val.get(ds.getfa(y)), minn = min(vx, vy), maxn = vx ^ vy ^ minn;
        ct.push(minn);
        purr.erase(minn);
        int a = ds.getfa(x), b = ds.getfa(y), xt = ds.merge(x, y), xr = a ^ b ^ xt;
        val.set(xt, maxn);
        val.set(xr, -1);
        ctt += 2;
        cttt++;
      }
    }
    if(l == r)
    {
      ans[l] += purr.qmin();
    }
    else
    {
      self(self, l, (l + r) / 2, id + 1);
      self(self, (l + r) / 2 + 1, r, getr(l, r, id));
    }
    while(ctt--) val.undo();
    while(cttt--) ds.undo();
    while(!ct.empty())
    {
      purr.insert(ct.top());
      ct.pop();
    }
  })(0, q, 1);
  assert(ds.st.empty());
  for(int i=0;i<=q;i++)
  {
    printf("%d\n", ans[i]);
  }
  return 0;
}
```
:::
