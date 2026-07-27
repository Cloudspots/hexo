---
title: 题解：CF1650G Counting Shortcuts
date: 2026-3-20 21:14:40
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
首先长度等于最短路的就不用说了。

对于长度为最短路加一的，容易发现会且仅会经过一条“冗余边”，即在 BFS 树上同层之间的边。

那么，设 $d_{x,y}$ 为 $x\sim y$ 最短路（实际上只需要用到 $d_{s,\cdot}$ 和 $d_{\cdot,t}$），$c_{x,y}$ 为最短路条数（也是只需要用 $c_{s,\cdot}$ 和 $c_{\cdot,t}$）。那么，一条边 $(u,v)$ 能够造成贡献的前提是，$d_{s,u}+d_{v,t}+1=d_{s,t}+1$（不能大于 $d_{s,t}+1$，并且后面一个条件保证了不可能的等于。如果大于，那就说明长度一定比 $d_{s,t}+1$ 都要大，没法造成贡献）且 $d_{s,u}=d_{s,v}$（一定要是冗余边）。造成的贡献是 $c_{s,u}c_{v,t}$（一定要走最短路，已经是冗余边了）。

会不会漏数？显然不会。任何长度为 $d_{s,t}+1$ 的路径都**必须经过**恰好一条冗余边。会不会重复技术？显然不会。任何长度为 $d_{s,t}+1$ 的路径都必须经过**恰好一条**冗余边。

最后记得加上最短路数量 $c_{s,t}$。

:::info[sub&code]
[sub](https://codeforces.com/contest/1650/submission/367482023)。

```cpp
#include <cstdio>
#include <vector>
#include <queue>

using namespace std;

long long qpow(long long x, long long y)
{
    long long p = x, ans = 1;
    do
    {
        if (y & 1) ans = ans * p % 1000000007;
        p = p * p % 1000000007;
    } while (y >>= 1);
    return ans;
}

vector<int> web[200005];
long long dists[200005], distt[200005], sto[200005], tot[200005];

int main()
{
    int t;
    scanf("%d", &t);
    while (t--)
    {
        int n, m;
        scanf("%d%d", &n, &m);
        for (int i = 1; i <= n; i++)
        {
            web[i].clear();
            dists[i] = 0x3f3f3f3f3f3f3f3f;
            distt[i] = 0x3f3f3f3f3f3f3f3f;
            sto[i] = 0;
            tot[i] = 0;
        }
        int s, t;
        scanf("%d%d", &s, &t);
        dists[s] = 0; distt[t] = 0;
        sto[s] = 1; tot[t] = 1;
        for (int i = 1; i <= m; i++)
        {
            int u, v;
            scanf("%d%d", &u, &v);
            web[u].push_back(v);
            web[v].push_back(u);
        }
        queue<int> q;
        q.push(s);
        while (!q.empty())
        {
            int u = q.front();
            q.pop();
            for (int v : web[u])
            {
                if (dists[u] + 1 < dists[v])
                {
                    dists[v] = dists[u] + 1;
                    q.push(v);
                }
                if (dists[u] + 1 == dists[v]) sto[v] = (sto[v] + sto[u]) % 1000000007;
            }
        }
        q.push(t);
        while (!q.empty())
        {
            int u = q.front();
            q.pop();
            for (int v : web[u])
            {
                if (distt[u] + 1 < distt[v])
                {
                    distt[v] = distt[u] + 1;
                    q.push(v);
                }
                if (distt[u] + 1 == distt[v]) tot[v] = (tot[v] + tot[u]) % 1000000007;
            }
        }
        long long alpha = 0, beta = 0;
        for (int i = 1; i <= n; i++)
        {
            for (int j : web[i])
            {
                if (dists[i] == dists[j] && dists[i] + distt[j] + 1 == dists[t] + 1)
                    beta = (beta + sto[i] * tot[j] % 1000000007) % 1000000007;
            }
        }
        printf("%lld\n", (sto[t] + beta) % 1000000007);
    }
    return 0;
}
// 洛谷题解审核好慢啊。
```
:::