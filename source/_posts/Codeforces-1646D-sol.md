---
title: 题解：CF1646D Weight the Tree
date: 2026-3-17 15:08:21
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
显然两个相邻的元素不可能都成为好顶点。

等下，为什么？首先，如果相邻两个点中存在一个节点度数 $\ge 2$，那么与其相邻的节点权值之和就必然大于另一个节点。但是另一个节点的权值要等于这个节点，所以不可能。

但是如果两个相邻节点度数都为 $1$ 呢？那么只有一种情况就是整棵树只有两个顶点，就是这两个（如果没有样例 $3$，这个题一次通过的概率估计会骤降）。

我们先不考虑特殊情况。那么，在一棵树中选择尽量多不相邻的点，就是经典的树形 dp。设 $f_{i,0/1}$ 为考虑 $i$ 的子树，而 $i$ 这个点本身被选择/不被选择，最大选择的节点数量。

权值怎么设？显然，没有被选择的权值就设为 $1$，而被选择的就设为其度数。

那么有了这个构造，就可以同时进行 dp。dp 的结果有两个关键字，第一个是最大的节点数量，第二个是是在节点数量最大的基础上最小的权值之和。

至于输出答案，这个很简单，同时记录一个变长数组 $b_{i,0/1,0\sim c-1}$，其中 $c$ 是 $i$ 的子节点个数，用于记录在 $f_{i,0/1}$ 的最优解中，每个子节点是否被选择。当然，也可以在输出答案的时候再进行一次转移，这个时候不改变 $f$ 的值，而是根据 $f$ 计算子节点是否选择。

时间复杂度 $O(n)$。

:::info[sub&code]

[submission](https://codeforces.com/contest/1646/submission/367067657)。

```cpp
/*
水题？
*/
#include <cstdio>
#include <vector>
#include <algorithm>

using namespace std;

int deg[200005];
pair<int, int> f[200005][2];
vector<bool> bf[200005][2];
vector<int> ch[200005];
int fa[200005];

void dfs(int x)
{
    auto it = find(ch[x].begin(), ch[x].end(), fa[x]);
    if(it != ch[x].end()) ch[x].erase(it);
    for(int y : ch[x])
    {
        fa[y] = x;
        dfs(y);
    }
    f[x][1] = {1, deg[x]}; f[x][0] = {0, 1};
    bf[x][0].resize(ch[x].size()); bf[x][1].resize(ch[x].size());
    for(int i=0;i<ch[x].size();i++)
    {
        f[x][1].first += f[ch[x][i]][0].first;
        f[x][1].second += f[ch[x][i]][0].second;
        if(f[ch[x][i]][0].first > f[ch[x][i]][1].first || f[ch[x][i]][0].first == f[ch[x][i]][1].first && f[ch[x][i]][0].second < f[ch[x][i]][1].second)
        {
            f[x][0].first += f[ch[x][i]][0].first;
            f[x][0].second += f[ch[x][i]][0].second;
        }
        else
        {
            f[x][0].first += f[ch[x][i]][1].first;
            f[x][0].second += f[ch[x][i]][1].second;
            // printf("bf[%d][%d][%")
            bf[x][0][i] = true;
        }
    }
    // printf("f[%d][0] = {count = %d, sum = %d}, f[%d][1] = {count = %d, sum = %d}\n", x, f[x][0].first, f[x][0].second, x, f[x][1].first, f[x][1].second);
}

void dfs2(int x, int val)
{
    // printf("[dfs2] x = %d, val = %d\n", x, val);
    if(val == 0) deg[x] = 1;
    for(int i=0;i<ch[x].size();i++)
    {
        dfs2(ch[x][i], bf[x][val][i]);
    }
}

int main()
{
    /*
    bf[0][0].resize(1);
    auto res = bf[0][0][0];
    bf[0][0][0] = true;
    printf("%d\n", (int)(bool)res);

    vector<bool>::operator[] 返回的是“类似引用的东西”
    上面这个东西 会输出 1
    如果把 res 声明为 bool，则会输出 0

    涉及到 vector<bool> 的东西尽量不要使用 auto，使用 bool
    */
    int n;
    scanf("%d", &n);
    if(n == 2)
    {
        printf("2 2\n1 1\n");
        return 0;
    }
    for(int i=1;i<n;i++)
    {
        int x, y;
        scanf("%d%d", &x, &y);
        ch[x].push_back(y);
        ch[y].push_back(x);
        deg[x]++;
        deg[y]++;
    }
    dfs(1);
    if(f[1][0].first > f[1][1].first || f[1][0].first == f[1][1].first && f[1][0].second < f[1][1].second)
    {
        printf("%d %d\n", f[1][0].first, f[1][0].second);
        dfs2(1, 0);
    }
    else
    {
        printf("%d %d\n", f[1][1].first, f[1][1].second);
        dfs2(1, 1);
    }
    for(int i=1;i<=n;i++)
    {
        printf("%d%c", deg[i], " \n"[i == n]);
    }
    return 0;
}
```

:::