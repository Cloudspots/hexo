---
title: 题解：AT_abc435_e [ABC435E] Cover query
date: 2025-12-7 11:08:27
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
板子。ABC 什么时候这样了。绿吧。

区间推平，还只能赋值为 $1$，还有区间求和。

显然是线段树，还需要动态开点。

在每个节点记录什么信息？显然要记录它的和。同时，为了不遍历整个子树（又会 TLE 又会 MLE），看似我们要记录每个节点对应的区间是否已经完全涂黑。但实际上不需要（你这样做也没问题，也能过），我们只需要判断这个子树的和是否等于这个节点所在区间的长度。

怎么做区间覆盖？有一个问题是，你不知道覆盖之后区间的和是多少。但这也简单，你把两棵子树的和的增量加起来就是自己的增量，这样就可以处理了。而如果这个节点对应的区间就是要覆盖的区间，增量也是容易求的。

怎么做区间查询？都给你节点的和了，直接做就完事了。

::::info[代码&提交记录]

:::info[赛时代码&提交记录（记录是否被覆盖）]

[submission](https://atcoder.jp/contests/abc435/submissions/71492030)。

```cpp
// 笑点解析：全是四字函数名。
#include <cstdio>
#include <algorithm>
#include <vector>
#include <cstring>
#include <iostream>

using namespace std;

class info
{
public:
	bool colored;
	int sum;
} ifs[6000005];
int lid[6000005], rid[6000005];
int lrg[6000005], rrg[6000005];
int cur = 1;

void init(int n)
{
	lid[1] = rid[1] = -1;
	lrg[1] = 1;
	rrg[1] = n;
	ifs[1] = { false, 0 };
}
int getl(int x)
{
	if (lrg[x] == rrg[x]) return -1;
	if (lid[x] != -1) return lid[x];
	else
	{
		int id = ++cur;
		lid[x] = id;
		lid[id] = rid[id] = -1;
		lrg[id] = lrg[x];
		rrg[id] = (lrg[x] + rrg[x]) / 2;
		return id;
	}
}
int getr(int x)
{
	if (lrg[x] == rrg[x]) return -1;
	if (rid[x] != -1) return rid[x];
	else
	{
		int id = ++cur;
		rid[x] = id;
		lid[id] = rid[id] = -1;
		lrg[id] = (lrg[x] + rrg[x]) / 2 + 1;
		rrg[id] = rrg[x];
		return id;
	}
}
int qfil(int id, int x, int y)
{
	if (ifs[id].colored) return 0;
	if (lrg[id] == x && rrg[id] == y)
	{
		ifs[id].colored = true;
		int res = y - x + 1 - ifs[id].sum;
		ifs[id].sum = y - x + 1;
		return res;
	}
	int res = 0;
	if (x <= (lrg[id] + rrg[id]) / 2) res += qfil(getl(id), x, min(y, (lrg[id] + rrg[id]) / 2));
	if (y > (lrg[id] + rrg[id]) / 2) res += qfil(getr(id), max(x, (lrg[id] + rrg[id]) / 2 + 1), y);
	ifs[id].sum += res;
	return res;
}
int qsum(int id, int x, int y)
{
	if (lrg[id] == x && rrg[id] == y) return ifs[id].sum;
	int sum = 0;
	if (x <= (lrg[id] + rrg[id]) / 2) sum += qsum(getl(id), x, min(y, (lrg[id] + rrg[id]) / 2));
	if (y > (lrg[id] + rrg[id]) / 2) sum += qsum(getr(id), max(x, (lrg[id] + rrg[id]) / 2 + 1), y);
	return sum;
}

int main()
{
	int n, q;
	scanf("%d%d", &n, &q);
	init(n);
	while (q--)
	{
		int l, r;
		scanf("%d%d", &l, &r);
		qfil(1, l, r);
		printf("%d\n", n - qsum(1, 1, n));
	}
	return 0;
}
```

:::

:::info[赛后代码&提交记录（通过和判断是否被覆盖）]

在赛时代码上加了点小改动。

[submission](https://atcoder.jp/contests/abc435/submissions/71531761)。

```cpp
// 笑点解析：全是四字函数名。
#include <cstdio>
#include <algorithm>
#include <vector>
#include <cstring>
#include <iostream>

using namespace std;

int sum[6000005];
int lid[6000005], rid[6000005];
int lrg[6000005], rrg[6000005];
int cur = 1;

void init(int n)
{
	lid[1] = rid[1] = -1;
	lrg[1] = 1;
	rrg[1] = n;
	sum[1] = 0;
}
int getl(int x)
{
	if (lrg[x] == rrg[x]) return -1;
	if (lid[x] != -1) return lid[x];
	else
	{
		int id = ++cur;
		lid[x] = id;
		lid[id] = rid[id] = -1;
		lrg[id] = lrg[x];
		rrg[id] = (lrg[x] + rrg[x]) / 2;
		return id;
	}
}
int getr(int x)
{
	if (lrg[x] == rrg[x]) return -1;
	if (rid[x] != -1) return rid[x];
	else
	{
		int id = ++cur;
		rid[x] = id;
		lid[id] = rid[id] = -1;
		lrg[id] = (lrg[x] + rrg[x]) / 2 + 1;
		rrg[id] = rrg[x];
		return id;
	}
}
int qfil(int id, int x, int y)
{
	if (sum[id] == rrg[id] - lrg[id] + 1) return 0;
	if (lrg[id] == x && rrg[id] == y)
	{
		int res = y - x + 1 - sum[id];
		sum[id] = y - x + 1;
		return res;
	}
	int res = 0;
	if (x <= (lrg[id] + rrg[id]) / 2) res += qfil(getl(id), x, min(y, (lrg[id] + rrg[id]) / 2));
	if (y > (lrg[id] + rrg[id]) / 2) res += qfil(getr(id), max(x, (lrg[id] + rrg[id]) / 2 + 1), y);
	sum[id] += res;
	return res;
}
int qsum(int id, int x, int y)
{
	if (lrg[id] == x && rrg[id] == y) return sum[id];
	int sum = 0;
	if (x <= (lrg[id] + rrg[id]) / 2) sum += qsum(getl(id), x, min(y, (lrg[id] + rrg[id]) / 2));
	if (y > (lrg[id] + rrg[id]) / 2) sum += qsum(getr(id), max(x, (lrg[id] + rrg[id]) / 2 + 1), y);
	return sum;
}

int main()
{
	int n, q;
	scanf("%d%d", &n, &q);
	init(n);
	while (q--)
	{
		int l, r;
		scanf("%d%d", &l, &r);
		qfil(1, l, r);
		printf("%d\n", n - qsum(1, 1, n));
	}
	return 0;
}
```

:::

::::