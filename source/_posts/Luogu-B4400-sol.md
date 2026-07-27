---
title: 题解：B4400 [蓝桥杯青少年组国赛 2025] 第五题
date: 2025-8-29 20:11:20
categories:
  - Solution
tags:
  - Solution
  - Luogu B Problem Solution
---
感觉这题是整场比赛唯一难度到达绿的题。还是靠 $6$ 种情况的分类讨论搭起来的。

考虑建图，$(i,j,k)$ 代表第一个桶剩余 $i$，第二个剩余 $j$ 和第三个剩余 $k$。那么 BFS 计算 $(v,0,0)$ 到所有 $\left(\dfrac{v}{2},?,?\right)$ 的距离的最小值即可。注意如果 $\dfrac{v}{2}$ 不是整数则显然无解。

赛时写挂了/fn/fn/fn

:::info[代码&提交记录]
```cpp
#include <cstdio>
#include <queue>
#include <tuple>
#include <cstring>
#include <algorithm>

using namespace std;

int dist[205][205][205];

class node
{
public:
    int x, y, z;
};

// x -> y
// 赛时不能用 tuple。
tuple<int, int, int> pure(int x, int y, int z, int X, int Y, int Z)
{
    int g = min(x, Y - y);
    return {x - g, y + g, z};
}

int main()
{
    int x, y, z;
    scanf("%d%d%d", &x, &y, &z);
    if(x & 1)
    {
        printf("-1\n");
        return 0;
    }
    queue<node> q;
    memset(dist, 0x3f, sizeof dist);
    q.push({x, 0, 0});
    dist[x][0][0] = 0;
    while(!q.empty())
    {
        auto u = q.front();
        q.pop();
        if(u.x == x / 2 || u.y == x / 2 || u.z == x / 2)
        {
            printf("%d\n", dist[u.x][u.y][u.z]);
            return 0;
        }
        // x -> y
        // 赛时也不能用结构化绑定
        { auto [xx, yy, zz] = pure(u.x, u.y, u.z, x, y, z); if(dist[u.x][u.y][u.z] + 1 < dist[xx][yy][zz]) { dist[xx][yy][zz] = dist[u.x][u.y][u.z] + 1; q.push({xx, yy, zz}); }} 
        // x -> z
        { auto [xx, zz, yy] = pure(u.x, u.z, u.y, x, z, y); if(dist[u.x][u.y][u.z] + 1 < dist[xx][yy][zz]) { dist[xx][yy][zz] = dist[u.x][u.y][u.z] + 1; q.push({xx, yy, zz}); }} 
        // y -> z
        { auto [yy, zz, xx] = pure(u.y, u.z, u.x, y, z, x); if(dist[u.x][u.y][u.z] + 1 < dist[xx][yy][zz]) { dist[xx][yy][zz] = dist[u.x][u.y][u.z] + 1; q.push({xx, yy, zz}); }} 
        // y -> x
        { auto [yy, xx, zz] = pure(u.y, u.x, u.z, y, x, z); if(dist[u.x][u.y][u.z] + 1 < dist[xx][yy][zz]) { dist[xx][yy][zz] = dist[u.x][u.y][u.z] + 1; q.push({xx, yy, zz}); }} 
        // z -> x
        { auto [zz, xx, yy] = pure(u.z, u.x, u.y, z, x, y); if(dist[u.x][u.y][u.z] + 1 < dist[xx][yy][zz]) { dist[xx][yy][zz] = dist[u.x][u.y][u.z] + 1; q.push({xx, yy, zz}); }} 
        // z -> y
        { auto [zz, yy, xx] = pure(u.z, u.y, u.x, z, y, x); if(dist[u.x][u.y][u.z] + 1 < dist[xx][yy][zz]) { dist[xx][yy][zz] = dist[u.x][u.y][u.z] + 1; q.push({xx, yy, zz}); }} 
    }
    printf("-1\n");
    return 0;
}
```
[rec](https://www.luogu.com.cn/record/233757731)。
:::