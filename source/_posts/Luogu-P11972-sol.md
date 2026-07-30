---
title: 题解：P11972 [JOI Open 2020] 家具摆放 / Furniture
tags:
  - Solution
  - Luogu P Problem Solution
  - JOI Problem Solution
categories:
  - Solution
date: 2026-07-28 15:59:12
updated: 2026-07-28 15:59:12
---
> 招笑做法强势通过/bx。

---

我没见过维护上下边界的 trick，怎么办。

一个原始的想法是，求出所有左上角到右下角的路径。

当然这个做法本身是非常劣的，但是我们可以考虑求出所有在某一条路径上的点。也就是说，可以由左上角到达，并且可以到达右下角的点。容易发现一个点只要成为不合法点（本身是障碍，或者不能从左上角到达，或者不能到达右下角），以后就再也无法成为合法点了。

这就给了我们势能。我们只需要保证：

- 能够快速判断一个点是不是左上到右下的必经点。
- 能够快速将一个点变为不合法状态，同时把和它相关的其它点也变为不合法状态。

你先考虑怎么判断。你考虑每一行。

首先有一个思路是，如果这个点是这一行唯一的合法点，那么删掉显然不能连通。但这不是充要的，请看下面的例子：

```plaintext
....XXX
...o...
XXX....
```

此时这个 `o` 点**是**必经点。

我们修正一下条件：我们把每一行的合法点分为若干连续段，如果连续段个数 $\ge 2$，显然这个点可以删掉。否则，如果这个点左边的所有合法点下面都是不合法点，并且这个点右边的所有合法点上面都是不合法点，那么这个点不可以删掉，否则可以。这里的上面和下面指上/下一行。

我们解决了第一个问题（判断是否全是不合法点可以树状数组或者 `set`）。

对于第二个问题，我们容易发现每次添加一个障碍之后，所新增的不合法点必然是连通的。我们考虑一个点变为不合法点后，其上下左右四个点是否变为不合法（假设原本合法）：

- 如果这个点左下方的点不合法，或者这个点处于最后一行，则其左边不合法（原因是无法到达右下角）。
- 同理，如果右上方不合法，或处于第一行，则其右边不合法（原因是无法从左上角到达）。
- 对于上面，容易发现如果其右上方的点不合法，或者它处于最后一列，则其上面不合法（无法到达右下角）。
- 同理，如果左下方不合法，或处于第一列，则其下面不合法（无法从左上角到达）。

直接 $O(1)$ 判一下就可以了。

总时间复杂度 $O(nm+Q\log m)$。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/289143571)。

```cpp
#include <set>
#include <cstdio>
#include <bitset>
#include <vector>
#include <cassert>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

bitset<1005> cg[1005];
bitset<1005> prep[1005];
class fenwick
{
public:
	int st[1005];
	void vadd(int pos, int val, int n) { do { st[pos] += val; } while((pos += pos & -pos) <= n); }
	int qsum(int pos) { int sum = 0; do { sum += st[pos]; } while(pos -= pos & -pos); return sum; }
} qs[1005];
set<int> q1[1005];

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	for(int i=1;i<=n;i++)
	{
		q1[i].insert(0);
		q1[i].insert(m + 1);
	}
	auto mark = U([&](auto &&self, int x, int y) -> bool
	{
		if(cg[x][y]) return true;
		auto px = q1[x].lower_bound(y);
		// 判断
		// 首先如果不是唯一的段，那么可以删。
		// 如果是唯一的段，那么不能删当且仅当右边的点不能向上，左边的点不能向下。
		if(qs[x].qsum(m) == m - (*px - *prev(px) - 1) && (x == 1 || qs[x-1].qsum(*px - 1) - qs[x-1].qsum(y) == *px - 1 - y) && (x == n || qs[x+1].qsum(y - 1) - qs[x+1].qsum(*prev(px)) == y - 1 - *prev(px))) return false;
		// printf("marked (%d, %d)\n", x, y);
		// 现在可以删除
		// 首先考虑本行。
		px = q1[x].insert(y).first;
		qs[x].vadd(y, 1, m);
		cg[x][y] = true;
		bool fg = false;
		do
		{
			fg = false;
			// 先考虑这一段左边，如果爆炸
			// 也就是说不能向下走
			if(y > 1 && (x == n || cg[x+1][y-1]) && !cg[x][y-1])
			{
				self(self, x, y-1); fg = true;
			}
			// 然后如果右边爆炸
			if(y < m && (x == 1 || cg[x-1][y+1]) && !cg[x][y+1])
			{
				self(self, x, y+1); fg = true;
			}
			if(x > 1 && (y == m || cg[x-1][y+1]) && !cg[x-1][y])
			{
				self(self, x-1, y); fg = true;
			}
			if(x < n && (y == 1 || cg[x+1][y-1]) && !cg[x+1][y])
			{
				self(self, x+1, y); fg = true;
			}
		} while(fg);
		return true;
	});
	for(int i=1;i<=n;i++)
	{
		for(int j=1;j<=m;j++)
		{
			int x;
			scanf("%d", &x);
			if(x == 1)
			{
				// printf("[mark (%d, %d)]\n", i, j);
				bool res = mark(i, j);
				assert(res);
			}
		}
	}
	int q;
	scanf("%d", &q);
	while(q--)
	{
		int x, y;
		scanf("%d%d", &x, &y);
		printf("%d\n", (int)mark(x, y));
		// printf("after: \n");
		// for(int i=1;i<=n;i++)
		// {
		// 	for(int j=1;j<=m;j++)
		// 	{
		// 		printf("%d%c", (int)cg[i][j], " \n"[j == m]);
		// 	}
		// }
	}
	return 0;
}
```

:::
