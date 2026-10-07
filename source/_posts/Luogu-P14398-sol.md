---
title: 题解：P14398 [JOISC 2016] 三明治 / Sandwich
date: 2026-10-06 16:49:49
updated: 2026-10-07 21:51:46
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P14398 [JOISC 2016] 三明治 / Sandwich

随便卡卡常就是最优解。谁在卡卡卡卡卡常常常？

---

性质 $1$：在最优情况中，某一对三明治要么同时被选，要么同时没被选。这是显然的。

性质 $2$：在最优情况中，所有被选中的三明治是凸的。这也是显然的。

性质 $3$：任意一个 $\texttt N$ 点的最优解要么是其左边和下面的最优解的并再取上它本身，要么是右边和上面的并再取它本身。$\texttt Z$ 点同理。

有了性质 $3$ 就可以跑最短路了。Dijkstra 即可。由性质 $1$，单个状态可以用 $2N$ 个 $[0,M+1]$ 的数字存储，在本题中可以用 $18N$ 个 bit 存储（为什么要这么干？因为 $N^2$ 个状态直接存会爆空间，$18$ bit 可以用来卡空间）。

总时间复杂度 $O(N^2\log N+N^3)=O(N^3)$（假设 $N,M$ 同阶），空间复杂度 $O(N^3)$，需要卡空间。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/301468230)。

```cpp
#include <queue>
#include <cstdio>
#include <cassert>
#include <cstring>

using namespace std;

class v18arr
{
public:
	unsigned v2[26];
	unsigned v16[201];
	void vset(unsigned pos, unsigned val)
	{
		v2[pos >> 4] = (v2[pos >> 4] & ~(3u << ((pos & 15) * 2))) | ((val >> 16) << ((pos & 15) * 2));
		v16[pos >> 1] = (v16[pos >> 1] & ~(0xffffu << ((pos & 1) * 16))) | ((val & 0xffffu) << ((pos & 1) * 16));
	}
	unsigned qval(unsigned pos) const { return (((v2[pos >> 4] >> ((pos & 15) * 2)) & 3) << 16) | ((v16[pos >> 1] >> ((pos & 1) * 16)) & 0xffffu); }
	v18arr &operator=(const v18arr &r) { memcpy(this, &r, sizeof(v18arr)); return *this; }
	void clear() { memset(this, 0, sizeof(v18arr)); }
    void extract(unsigned *arr, unsigned n) const
    {
        for(unsigned i=0;i<=n/2;i++)
        {
            arr[2*i] = v16[i] & 0xffff;
            arr[2*i+1] = v16[i] >> 16;
        }
        for(unsigned i=0;i<=n/16;i++)
        {
            arr[16*i+0] |= ((v2[i] >> 0) & 3) << 16;
            arr[16*i+1] |= ((v2[i] >> 2) & 3) << 16;
            arr[16*i+2] |= ((v2[i] >> 4) & 3) << 16;
            arr[16*i+3] |= ((v2[i] >> 6) & 3) << 16;
            arr[16*i+4] |= ((v2[i] >> 8) & 3) << 16;
            arr[16*i+5] |= ((v2[i] >> 10) & 3) << 16;
            arr[16*i+6] |= ((v2[i] >> 12) & 3) << 16;
            arr[16*i+7] |= ((v2[i] >> 14) & 3) << 16;
            arr[16*i+8] |= ((v2[i] >> 16) & 3) << 16;
            arr[16*i+9] |= ((v2[i] >> 18) & 3) << 16;
            arr[16*i+10] |= ((v2[i] >> 20) & 3) << 16;
            arr[16*i+11] |= ((v2[i] >> 22) & 3) << 16;
            arr[16*i+12] |= ((v2[i] >> 24) & 3) << 16;
            arr[16*i+13] |= ((v2[i] >> 26) & 3) << 16;
            arr[16*i+14] |= ((v2[i] >> 28) & 3) << 16;
            arr[16*i+15] |= ((v2[i] >> 30) & 3) << 16;
        }
    }
    void load(unsigned *arr, int n)
    {
        for(unsigned i=0;i<=n/2;i++)
        {
            v16[i] = (arr[2*i] & 0xffff) | ((arr[2*i+1] & 0xffff) << 16);
        }
        for(unsigned i=0;i<=n/16;i++)
        {
            v2[i] = 
                ((arr[16*i+0] >> 16) << 0) |
                ((arr[16*i+1] >> 16) << 2) |
                ((arr[16*i+2] >> 16) << 4) |
                ((arr[16*i+3] >> 16) << 6) |
                ((arr[16*i+4] >> 16) << 8) |
                ((arr[16*i+5] >> 16) << 10) |
                ((arr[16*i+6] >> 16) << 12) |
                ((arr[16*i+7] >> 16) << 14) |
                ((arr[16*i+8] >> 16) << 16) |
                ((arr[16*i+9] >> 16) << 18) |
                ((arr[16*i+10] >> 16) << 20) |
                ((arr[16*i+11] >> 16) << 22) |
                ((arr[16*i+12] >> 16) << 24) |
                ((arr[16*i+13] >> 16) << 26) |
                ((arr[16*i+14] >> 16) << 28) |
                ((arr[16*i+15] >> 16) << 30);
        }
    }
} vk[405][405]; // ~144 MB ok, time about ~1.3 raw array.

v18arr ful;

unsigned ba[505], bb[505], yql[505], yqr[505];
unsigned dist[405][405];
bool isz[405][405];

int main()
{
	unsigned n, m;
	scanf("%u%u", &n, &m);
	for(unsigned i=1;i<=n;i++)
	{
		while(getchar() != '\n');
		for(unsigned j=1;j<=m;j++)
		{
			isz[i][j] = getchar() == 'Z';
		}
	}
	class node
	{
	public:
		unsigned x, y;
		unsigned dst;
		bool operator<(const node &r) const { return dst > r.dst; };
	};
	priority_queue<node> pq;
	memset(dist, 0x3f, sizeof dist);
	for(unsigned i=1;i<=n;i++)
	{
		ful.vset(i, (m << 9) | 1);
	}
	if(isz[1][1])
	{
		vk[1][1] = ful;
		vk[1][1].vset(1, (m << 9) | 2);
		dist[1][1] = 1;
		pq.push({1, 1, 1});
	}
	if(isz[n][m])
	{
		vk[n][m] = ful;
		vk[n][m].vset(n, ((m-1) << 9) | 1);
		dist[n][m] = 1;
		pq.push({n, m, 1});
	}
	if(!isz[1][m])
	{
		vk[1][m] = ful;
		vk[1][m].vset(1, ((m-1)<<9) | 1);
		dist[1][m] = 1;
		pq.push({1, m, 1});
	}
	if(!isz[n][1])
	{
		vk[n][1] = ful;
		vk[n][1].vset(n, (m << 9) | 2);
		dist[n][1] = 1;
		pq.push({n, 1, 1});
	}
    bool fg = false;
	auto upd = [&](unsigned x, unsigned y, unsigned dx, unsigned dy)
	{
		unsigned rx = x + dx, ry = y + dy;
		unsigned vx, vy;
		if(isz[x][y])
		{
			vx = x + dy;
			vy = y + dx;
		}
		else
		{
			vx = x - dy;
			vy = y - dx;
		}
		unsigned s = 0;
		if(vx == 0 || vx == n+1 || vy == 0 || vy == m+1)
		{
			if(dist[rx][ry] + 1 < dist[x][y])
			{
				dist[x][y] = dist[rx][ry] + 1;
				vk[x][y] = vk[rx][ry];
				unsigned ox = vk[x][y].qval(x), ql = ox & 0x1ff, qr = ox >> 9;
				vk[x][y].vset(x, (ql == qr ? m+1 : (y == ql ? (qr << 9) | (ql + 1) : (((qr - 1) << 9) | ql))));
				pq.push({x, y, dist[x][y]});
			}
		}
		if(dist[vx][vy] >= dist[x][y] || dist[rx][ry] >= dist[x][y]) return;
        vk[vx][vy].extract(ba, n);
        if(!fg)
        {
            vk[rx][ry].extract(bb, n);
            fg = true;
        }
		for(unsigned i=1;i<=n;i++)
		{
			unsigned o1 = ba[i], o2 = bb[i];
			yql[i] = max(o1 & 0x1ff, o2 & 0x1ff);
			yqr[i] = min(o1 >> 9, o2 >> 9);
			if(i == x)
			{
				if(yql[i] == yqr[i])
				{
					yql[i] = m+1;
					yqr[i] = 0;
				}
				else if(yql[i] == y) yql[i]++;
				else yqr[i]--;
			}
			s += m - max(0, int(yqr[i] - yql[i] + 1));
		}
		if(s < dist[x][y])
		{
			dist[x][y] = s;
			for(unsigned i=1;i<=n;i++)
			{
                yql[i] |= yqr[i] << 9;
			}
            vk[x][y].load(yql, n);
			pq.push({x, y, s});
		}
	};
	while(!pq.empty())
	{
		auto [x, y, dst] = pq.top();
		pq.pop();
		if(dst != dist[x][y]) continue;
        fg = false;
		if(x > 1) upd(x-1, y, 1, 0);
		if(x < n) upd(x+1, y, -1, 0);
		if(y > 1) upd(x, y-1, 0, 1);
		if(y < m) upd(x, y+1, 0, -1);
	}
	for(unsigned i=1;i<=n;i++)
	{
		for(unsigned j=1;j<=m;j++)
		{
			printf("%d%c", dist[i][j] == 0x3f3f3f3f ? -1 : 2 * dist[i][j], " \n"[j == m]);
		}
	}
	return 0;
}
```

:::
