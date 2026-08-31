---
title: 1770E 题解
tags:
  - Solution
  - Codeforces Problem Solution
  - Mathematics
  - Probabilities
categories:
  - Solution
date: 2026-08-31 11:07:04
updated: 2026-08-31 11:07:04
---

水题吧，每一步都是显然的，这不水？

首先显然对于每条边拆贡献，即经过它的概率。那么问题就转化为一个子树内蝴蝶数量的期望和蝴蝶数量平方的期望。

那么我们维护每个节点上有蝴蝶的概率，子树内蝴蝶数量的期望和子树内蝴蝶数量平方的期望即可。

那么考虑每一条边会对期望产生什么影响。

有一个 key observation：在某一条边被操作之前，断开这条边后的两棵树（的概率，期望，平方期望）相互独立。这个是显然的。

不妨假设 $u$ 是 $v$ 的父亲。显然只有 $v$ 的子树的蝴蝶数量期望和蝴蝶数量平方期望会变化。

假设操作前 $u$ 有 $p$ 的概率有蝴蝶，$v$ 有 $q$ 的概率有蝴蝶，则有 $\dfrac{p(1-q)}{2}$ 的概率 $u$ 有 $v$ 没有且 $u$ 飞到 $v$，而有 $\dfrac{q(1-p)}{2}$ 的概率反之。

也就是说 $v$ 子树内蝴蝶数量加上一个 $\dfrac{p(1-q)}{2}$ 概率为 $1$，$\dfrac{q(1-p)}{2}$ 的概率为 $-1$，其余为 $0$ 的随机变量，且这个和 $v$ 子树的蝴蝶数量的期望和平方期望独立（其实 $v$ 子树内蝴蝶数量根本没有变化过）。

这样就可以同时计算期望和平方期望了。由于 $(a+b)^2=a^2+2ab+b^2$，由线性性 $\mathbb E[(a+b)^2]=\mathbb E[a^2] + 2\mathbb E[ab] + \mathbb E[b^2]$，由独立性 $\mathbb E[ab]=\mathbb E[a]\mathbb E[b]$，而上面这个随机变量的期望和平方期望都是好计算的，直接做一下就解决了平方期望；对于期望直接加就可以了。

对于概率，稍微动下脑子就能知道操作后 $u,v$ 有蝴蝶的概率都是 $\dfrac{p+q}{2}$。

时间复杂度 $O(n)$。为什么不取模啊。

:::info[sub&code]

[sub](https://codeforces.com/contest/1770/submission/388922505)。

```cpp
#include <cstdio>
#include <vector>
#include <utility>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

vector<int> ch[300005];
int fa[300005];

long long qpow(long long x, long long y) { long long ans = 1; do { if(y & 1) ans = ans * x % 998244353; x = x * x % 998244353; } while(y >>= 1); return ans; }

long long p[300005], e[300005], e2[300005];

pair<int, int> web[300005];

int main()
{
  int n, k;
  scanf("%d%d", &n, &k);
  for(int i=1;i<=k;i++)
  {
    int x;
    scanf("%d", &x);
    p[x] = 1;
  }
  for(int i=1;i<n;i++)
  {
    int u, v;
    scanf("%d%d", &u, &v);
    web[i] = {u, v};
    ch[u].push_back(v);
    ch[v].push_back(u);
  }
  U([&](auto &&self, int u) -> void
  {
    if(fa[u]) ch[u].erase(find(ch[u].begin(), ch[u].end(), fa[u]));
    e[u] = p[u];
    for(int v : ch[u])
    {
      fa[v] = u;
      self(self, v);
      e[u] += e[v];
    }
  })(1);
  for(int i=1;i<=n;i++)
  {
    e2[i] = e[i] * e[i] % 998244353;
  }
  for(int i=1;i<n;i++)
  {
    auto [u, v] = web[i];
    if(fa[u] == v) swap(u, v);
    // 对于 E[cnt^2]
    /*
    有 pq 的概率都有，(1-p)(1-q) 的概率都没有，p(1-q)/2 + q(1-p)/2 的概率只有一个有但是没用
    剩下只有 p(1-q)/2 的概率 u 有 v 无且飞过去，q(1-p)/2 的概率 v 有 u 无飞过去
    那么 e2[v]？有 (1-p(q-1)/2-q(1-p)/2) 的概率不变，e 有 p(1-q)/2 的概率增加 1，q(1-p)/2 的概率减少 1
    也就相当于，它加上一个随机变量，其期望为 p(1-q)/2 - q(1-p)/2，平方的期望为 p(1-q)/2 + q(1-p)/2
    代入完全平方公式，(a+b)^2 = a^2 + b^2 + 2ab
    两者显然独立（E[v], E[v^2] 之前都没变过），能直接算
    */
    long long x = p[u], y = p[v];
    long long vx = x * (998244354 - y) % 998244353 * 499122177 % 998244353, vy = y * (998244354 - x) % 998244353 * 499122177 % 998244353;
    e2[v] = (e2[v] + (vx + vy) + 2 * e[v] % 998244353 * ((vx - vy + 998244353) % 998244353)) % 998244353;
    // 对于 E[cnt^2]，这个相对好算
    e[v] = (e[v] + vx - vy + 998244353) % 998244353;
    // 对于 p 本身
    p[u] = p[v] = (p[u] + p[v]) % 998244353 * 499122177 % 998244353;
  }
  // finally...
  long long sum = 0;
  for(int i=1;i<=n;i++)
  {
    // 考虑这条边被选中的概率
    // 若子树内有 x 个点，则为 x(k-x) / (k(k-1)/2)
    // 也就是 xn - x^2
    // printf("e[%d] = %lld, e2[%d] = %lld, contrib = %lld\n", i, e[i], i, e2[i], (e[i] * k - e2[i] + 998244353) % 998244353);
    sum = (sum + e[i] * k % 998244353 - e2[i] + 998244353) % 998244353;
  }
  printf("%lld\n", sum * qpow(1ll * k * (k-1) % 998244353 * 499122177 % 998244353, 998244351) % 998244353);
  return 0;
}
```

:::