---
title: 题解：AT_abc441_g [ABC441G] Takoyaki and Flip
date: 2026-1-19 13:12:34
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
数据范围 $2\times 10^5$，考虑分块。

显然对于每个块你需要处理一个最大值 `maxp`，还有一个加法标记 `added` 和翻转标记 `flipped`。但是这样还不够，一是整体加的时候如果存在朝上的则 `maxp` 也会增加，但如果全都是朝下的那就没用。所以还需要一个 `iszero`（因为在 C++ 中会重名，所以以下称作 `iszzero`）标记，表示是否全部朝下。同时由于你要翻转还需要一个 `iszone` 标记，表示是否全部朝上。然后为了处理清零操作，还需要一个 `setzero` 标记。

而对于每个元素，需要处理一个 `cnt` 表示它的数字（加上这一块的 `added` 得到真实数值），还有 `ontop` 表示是否向上（异或这一块的 `flipped` 得到真实数值）。

你会发现有个问题就是如果清零之后再整体加，那么因为 `setzero` 标记还在所以会被认为没有加。而如果把 `setzero` 设成 `false`，那么假设原本就有一些元素非 $0$，这些元素原本被置 $0$ 的但是会被认为是没有置 $0$。解决方法也很简单，你让 `added` 标记优先级在 `setzero` 之上，整体加就不动 `setzero` 标记，而清空就把 `setzero` 设成 `true` 的同时把 `added` 设成 `false`。

而对于块内，我们考虑直接暴力，因为最多只有左边和右边两个不完整的块。暴力修改一部分也不好做，所以考虑实现一个函数 `notag` 把某一个块打回原形，也即处理 `flipped`，`added`，`setzero` 的 tag，同时计算 `maxp`，`iszzero`，`iszone`，`ontop` 和 `cnt`。显然可以做到块长 $\mathcal O(B)$ 的时间复杂度。

那么对于操作一，我们先处理块内，然后对于整块增其 `added` 标记，如果 `iszzero` 不为 `false` 则同时增加其 `maxp` 标记。

对于操作二，先处理块内，对于整块首先将 `added` 标记和 `maxp` 置零，然后交换 `iszzero` 和 `iszone`，同时翻转 `flipped` 标记，然后设置 `setzero` 标记。

对于询问你直接求个 $\max$ 就行了。

三种操作时间复杂度都是 $\mathcal O\left(B+\dfrac{N}{B}\right)$，取 $B=\mathcal O(\sqrt{N})$ 得到最优时间复杂度 $\mathcal O\left(Q\sqrt{N}\right)$，再加上一个预处理的时间复杂度 $\mathcal O(N)$ 得到 $O\left(N+Q\sqrt{N}\right)$。

注意预处理要把 `ontop` 和 `iszone` 置 $1$，同时注意 `ontop` 处理最后一个块时的越界问题（可以通过把数组开大避免）。

:::info[代码&提交记录]

[submission](https://atcoder.jp/contests/abc441/submissions/72574068)。

```cpp
#include <cstdio>
#include <cmath>
#include <iostream>
#include <algorithm>

using namespace std;

bool ontop[300005], flipped[455], setzero[455], iszzero[455], iszone[455];
long long cnt[300005], added[455], maxp[455];

int main()
{
	int n, q;
	scanf("%d%d", &n, &q);
	int blksz = sqrt(n);
	for (int i = 1; i <= n; i++)
	{
		ontop[i] = true;
	}
	for (int i = 1; i <= (n + blksz - 1) / blksz; i++)
	{
		iszone[i] = true;
	}
	auto notag = [&](int id) -> void
		{
			if (flipped[id])
			{
				for (int i = (id - 1) * blksz + 1; i <= id * blksz; i++)
				{
					ontop[i] ^= 1;
				}
				flipped[id] = false;
			}
			if (setzero[id])
			{
				iszzero[id] = true;
				iszone[id] = true;
				maxp[id] = 0;
				for (int i = (id - 1) * blksz + 1; i <= id * blksz; i++)
				{
					if (ontop[i]) cnt[i] = added[id];
					else cnt[i] = 0;
					if (cnt[i] > maxp[id]) maxp[id] = cnt[i];
					if (ontop[i]) iszzero[id] = false;
					else iszone[id] = false;
				}
				added[id] = 0;
				setzero[id] = false;
				return;
			}
			maxp[id] = 0;
			iszzero[id] = true;
			iszone[id] = true;
			for (int i = (id - 1) * blksz + 1; i <= id * blksz; i++)
			{
				cnt[i] += added[id];
				if (!ontop[i]) cnt[i] = 0;
				if (cnt[i] > maxp[id]) maxp[id] = cnt[i];
				if (ontop[i]) iszzero[id] = false;
				else iszone[id] = false;
			}
			added[id] = 0;
		};
	auto getontop = [&](int i) { return ontop[i] ^ flipped[(i + blksz - 1) / blksz]; };
	while (q--)
	{
		int op, l, r;
		scanf("%d%d%d", &op, &l, &r);
		int lid = (l + blksz - 1) / blksz, rid = (r + blksz - 1) / blksz;
		if (op == 1)
		{
			int x;
			scanf("%d", &x);
			notag(lid);
			notag(rid);
			if (lid == rid)
			{
				for (int i = l; i <= r; i++)
				{
					if (getontop(i)) cnt[i] += x;
					if (cnt[i] > maxp[lid]) maxp[lid] = cnt[i];
				}
				notag(lid);
			}
			else
			{
				for (int i = l; i <= lid * blksz; i++)
				{
					if (getontop(i)) cnt[i] += x;
					if (cnt[i] > maxp[lid]) maxp[lid] = cnt[i];
				}
				notag(lid);
				for (int i = (rid - 1) * blksz + 1; i <= r; i++)
				{
					if (getontop(i)) cnt[i] += x;
					if (cnt[i] > maxp[rid]) maxp[rid] = cnt[i];
				}
				notag(rid);
				for (int i = lid + 1; i < rid; i++)
				{
					added[i] += x;
					if (!iszzero[i]) maxp[i] += x;
				}
			}
		}
		else if (op == 2)
		{
			notag(lid);
			notag(rid);
			if (lid == rid)
			{
				for (int i = l; i <= r; i++)
				{
					ontop[i] ^= 1;
				}
				notag(lid);
			}
			else
			{
				for (int i = l; i <= lid * blksz; i++)
				{
					ontop[i] ^= 1;
				}
				notag(lid);
				for (int i = (rid - 1) * blksz + 1; i <= r; i++)
				{
					ontop[i] ^= 1;
				}
				notag(rid);
				for (int i = lid + 1; i < rid; i++)
				{
					setzero[i] = true;
					flipped[i] ^= 1;
					maxp[i] = 0;
					added[i] = 0;
					if (iszzero[i])
					{
						iszone[i] = true;
						iszzero[i] = false;
					}
					else if (iszone[i])
					{
						iszone[i] = false;
						iszzero[i] = true;
					}
				}
			}
		}
		else
		{
			long long maxn = 0;
			notag(lid); notag(rid);
			if (lid == rid)
			{
				for (int i = l; i <= r; i++)
				{
					if (ontop[i] && cnt[i] > maxn) maxn = cnt[i];
				}
				printf("%lld\n", maxn);
			}
			else
			{
				for (int i = l; i <= lid * blksz; i++)
				{
					if (ontop[i] && cnt[i] > maxn) maxn = cnt[i];
				}
				for (int i = (rid - 1) * blksz + 1; i <= r; i++)
				{
					if (ontop[i] && cnt[i] > maxn) maxn = cnt[i];
				}
				for (int i = lid + 1; i < rid; i++)
				{
					if (maxp[i] > maxn) maxn = maxp[i];
				}
				printf("%lld\n", maxn);
			}
		}
	}
	return 0;
}
// 让我们把世界分块吧！
```
:::