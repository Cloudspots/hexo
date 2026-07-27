---
title: 题解：P12684 【MX-J15-T4】叉叉学习魔法
date: 2025-6-5 15:27:17
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
简单题，不知道为什么是绿？

前置知识：01-BFS。如果你还不知道，首先你应该会 BFS，那么 BFS 的原理就是保持队列元素的代价（距离、长度等）从小到大。而如果边权只有 $0$ 和常数（通常为 $1$），则遇到边权为 $0$ 的点放入队首，否则放入队尾，也可以保持这样的性质，正确性有保证，时间复杂度也是线性的。这就是 01-BFS。

首先看如何走的步数（记为代价 A）最小。则直接走代价为 $1$，用魔法代价为 $0$，直接 01-BFS 即可。注意这里需要处理出所有可达节点的代价（走的步数）。判无解不用我说了吧？

然后看如何在这样的前提下使用魔法的次数（记为代价 B）最小。同样是 01-BFS（什么是 $0$ 什么是 $1$ 请读者自己练习，实在写不出来看代码吧），但是需要条件：不能够破坏代价 A 最小的性质。正确性证明也是很显然的，反证法，如果有一条路径中途破坏了代价 A 最小的性质，则后面代价 A 都会更多，走到终点也会更多，所以每一步都不能破坏。

[赛时代码](https://www.luogu.com.cn/record/219146784)：

```cpp
// Magic！
// Do the magic!
// 做法：显然是两次 bfs
// 对于第一次，求出至少要走几步（顺便把走不到给判了）
// 对于第二次，求出在走的步数最少的情况下最少要 Do the magic 多少次
#include <cstdio>
#include <queue>
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

char mp[5005][5005];
int dist1[5005][5005], dist2[5005][5005];
constexpr int dx1[] = {0, 0, 1, -1};
constexpr int dy1[] = {1, -1, 0, 0};
constexpr int dx2[] = {1, 1, -1, -1};
constexpr int dy2[] = {1, -1, 1, -1};
int main()
{
    memset(dist1, 0x3f, sizeof dist1);
    memset(dist2, 0x3f, sizeof dist2);
    int n, m;
    scanf("%d%d", &n, &m);
    int xx, xy, wx, wy;
    for(int i=1;i<=n;i++)
    {
        while(getchar() != '\n'); // 我要把这个用法推广给全世界 OIer！
        for(int j=1;j<=m;j++)
        {
            mp[i][j] = getchar();
            if(mp[i][j] == 'X')
            {
                xx = i;
                xy = j;
                mp[i][j] = '.';
            }
            if(mp[i][j] == 'W')
            {
                wx = i;
                wy = j;
                mp[i][j] = '.';
            }
        }
    }
    int sx = xx, sy = xy;
    deque<pair<int, int>> q1;
    dist1[sx][sy] = 0;
    dist2[sx][sy] = 0;
    q1.push_back({sx, sy});
    while(!q1.empty())
    {
        pair<int, int> u = q1.front();
        q1.pop_front();
        int x = u.first, y = u.second;
        for(int i=0;i<4;i++)
        {
            int ux = x + dx2[i], uy = y + dy2[i];
            if(mp[ux][uy] == '.' && dist1[x][y] < dist1[ux][uy])
            {
                dist1[ux][uy] = dist1[x][y];
                q1.push_front({ux, uy});
            }
        }
        for(int i=0;i<4;i++)
        {
            int ux = x + dx1[i], uy = y + dy1[i];
            if(mp[ux][uy] == '.' && dist1[x][y] + 1 < dist1[ux][uy])
            {
                dist1[ux][uy] = dist1[x][y] + 1;
                q1.push_back({ux, uy});
            }
        }
    }
    /*for(int i=1;i<=n;i++)
        {
            for(int j=1;j<=m;j++)
{
    printf("dist1[%d][%d] = %d\n", i, j, dist1[i][j]);
}
        }*/
    if(dist1[wx][wy] == 0x3f3f3f3f)
    {
        printf("-1 -1\n");
        return 0;
    }
    deque<pair<int, int>> q2;
    q2.push_back({sx, sy});
    while(!q2.empty())
    {
        pair<int, int> u = q2.front();
        q2.pop_front();
        int x = u.first, y = u.second;
        // printf("x = %d, y = %d\n", x, y);
        for(int i=0;i<4;i++)
        {
            int vx = x + dx1[i], vy = y + dy1[i];
            if(mp[vx][vy] == '.' && dist1[x][y] + 1 == dist1[vx][vy] && dist2[x][y] < dist2[vx][vy])
            {
                dist2[vx][vy] = dist2[x][y];
                q2.push_front({vx, vy});
            }
        }
        for(int i=0;i<4;i++)
        {
            int vx = x + dx2[i], vy = y + dy2[i];
            if(mp[vx][vy] == '.' && dist1[x][y] == dist1[vx][vy] && dist2[x][y] + 1 < dist2[vx][vy])
            {
                dist2[vx][vy] = dist2[x][y] + 1;
                q2.push_back({vx, vy});
            }
        }
    }
    printf("%d %d\n", dist1[wx][wy], dist2[wx][wy]);
    return 0;
}
// 懂了，这场是 BFS 场。【题解中注：T3 做法也是 BFS】
// 但是 01bfs useful!
```