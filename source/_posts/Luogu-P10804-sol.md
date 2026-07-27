---
title: 题解：P10804 [CEOI 2024] 玩具谜题
date: 2026-7-10 21:32:54
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
> 把所有 `int` 换成 `unsigned` 之后最优解第二。顺手卡卡就是最优解了。

我们考虑如果我们固定了这个交点，那么竖着的条只能上下移动，横着的只能左右移动。这样两个条能够处于的位置就是非常好算的，我们求交点向上/下/左/右能够延伸的最长长度即可。

然后我们发现两个条初始的位置（起点）实质上只和交点位置有关；终点给的就是交点位置；中间移动的时候造成实质性移动的也只有移动交点位置造成的移动。

四个方向移动差不多，我们就考虑向一个方向移动，比如向右。那么，我们基本不需要移动横着的条（有时候可能需要向右移动一位，这个没有造成影响）。我们考虑竖着的条，我们先要在原本的一列移动到合适的位置，然后向右移动一位，保证向右移动之后没有碰到障碍。那么我们就考虑起点和终点向上/下能够延伸到的位置，求一下交集大小，看看有没有达到竖条长度即可。

判断是 $O(1)$ 可以解决的，预处理 $O(nm)$，判断可达性可以 dfs/bfs，总时间复杂度 $O(nm)$。cache 不是很友好（可以对于一些矩阵求转置？不知道，试了一下好像慢了很多。我不知道我现在的代码到底慢在哪了），谢罪。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/285117554)。

没有场切真的要好好反省，为什么去做紫了，还做了 $2.5\mathrm{h}$ 才做出来。

```cpp
#include <cstdio>
#include <algorithm>
#include <queue>
#include <bitset>

using namespace std;

bitset<1505> vis[1505];
char mp[1505][1505];
unsigned lt[1505][1505], rt[1505][1505], ut[1505][1505], dt[1505][1505];

int main()
{
	unsigned m, n, a, b;
	scanf("%u%u%u%u", &m, &n, &a, &b);
	unsigned sx, sy;
	scanf("%*u%u%u%*u", &sx, &sy);
	sx++; sy++;
	for(unsigned i=1;i<=n;i++)
	{
		while(getchar() != '\n');
		fread(mp[i] + 1, 1, m, stdin);
	}
	unsigned tx = 0, ty = 0;
	for(unsigned i=1;i<=n;i++)
	{
		for(unsigned j=1;j<=m;j++)
		{
			if(mp[i][j] == '*')
			{
				mp[i][j] = '.';
				tx = i;
				ty = j;
			}
			lt[i][j] = (mp[i][j] == '.' ? lt[i][j-1] + 1 : 0);
			ut[i][j] = (mp[i][j] == '.' ? ut[i-1][j] + 1 : 0);
		}
	}
	for(unsigned i=n;i>=1;i--)
	{
		for(unsigned j=m;j>=1;j--)
		{
			rt[i][j] = (mp[i][j] == '.' ? rt[i][j+1] + 1 : 0);
			dt[i][j] = (mp[i][j] == '.' ? dt[i+1][j] + 1 : 0);
		}
	}
	queue<pair<unsigned, unsigned>> q;
	q.push({sx, sy});
	mp[sx][sy] = true;
	while(!q.empty())
	{
		auto [x, y] = q.front();
		q.pop();
		// printf("x = %d, y = %d\n", x, y);
		if(x == tx && y == ty)
		{
			printf("YES\n");
			return 0;
		}
		for(unsigned dx = -1; dx != 3; dx += 2)
		{
			unsigned vx = x + dx;
			if(vx < 1 || vx > n) continue;
			if(mp[vx][y] == 'X') continue;
			if(vis[vx][y]) continue;
			unsigned l1 = y - lt[vx][y] + 1, r1 = y + rt[vx][y] - 1;
			unsigned l2 = y - lt[x][y] + 1, r2 = y + rt[x][y] - 1;
			if(min(r1, r2) - max(l1, l2) + 1 >= a)
			{
				vis[vx][y] = true;
				q.push({vx, y});
			}
		}
		for(unsigned dy = -1; dy != 3; dy += 2)
		{
			unsigned vy = y + dy;
			if(vy < 1 || vy > m) continue;
			if(mp[x][vy] == 'X') continue;
			if(vis[x][vy]) continue;
			// printf("dy = %d\n", dy);
			unsigned l1 = x - ut[x][vy] + 1, r1 = x + dt[x][vy] - 1;
			unsigned l2 = x - ut[x][y] + 1, r2 = x + dt[x][y] - 1;
			// printf("1 = [%d, %d], 2 = [%d, %d]\n", l1, r1, l2, r2);
			if(min(r1, r2) - max(l1, l2) + 1 >= b)
			{
				vis[x][vy] = true;
				q.push({x, vy});
			}
		}
	}
	printf("NO\n");
	return 0;
}
```

:::