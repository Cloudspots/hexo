---
title: 题解：P14431 [JOISC 2013] 有趣的图像收集 / Collecting Images is Fun
date: 2026-10-17 16:01:34
updated: 2026-10-17 16:01:34
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P14431 [JOISC 2013] 有趣的图像收集 / Collecting Images is Fun

简单简单题，一发就是最优解。感觉 $1\mathrm s$ 后就要被抢了 XD。

---

首先这是一个完全四叉树的结构，一个点有贡献等价于其父节点不是纯色的。注意到一个子矩形纯色当且仅当对应的行和列对应的值都相同（即，每一行有一个异或的值 $r_i$，每一列有 $c_i$，则行范围内 $r$ 相同，列范围内 $c$ 相同）。

容易发现行和列都是完全二叉树的结构，每个节点代表一个区间。设列二叉树有 $a_i$ 个长度为 $2^i$ 的纯色节点，行二叉树有 $b_i$ 个，则四叉树一共有 $a_ib_i$ 个 $2^i\times 2^i$ 的纯色子矩形。

每个纯色子矩形都会给其所有四个儿子产生贡献。

$a,b$ 是容易维护的，总时间复杂度 $O(NQ)$。$5\mathrm{s}$ 是有点意味了。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/303638820)。

```cpp
/*
判断是否纯色：区域内行和列 mark 全都相同。

手模一下，会了
*/
#include <cstdio>
#include <bitset>

using namespace std;

bitset<(1<<20)+5> vrow, vcol;
unsigned rstat[(1<<22)+5], cstat[(1<<22)+5];
unsigned long long rsum[25], csum[25];

int main()
{
	int n, q;
	scanf("%d%d", &n, &q);
	for(int i=1;i<=n;i++) rsum[i] = csum[i] = (1ull << (n - i));
	auto qval = [&]() -> unsigned long long
	{
		unsigned long long s = (1ull << (2 * n + 2)) / 3;
		for(int i=1;i<=n;i++) s -= rsum[i] * csum[i] * 4;
		return s;
	};
	auto vmdr = [&](unsigned pos) -> void
	{
		pos += (1ull << n) - 1;
		rstat[pos] ^= 1;
		unsigned vc = 0;
		while(pos >>= 1)
		{
			vc++;
			if(rstat[pos] != 2) rsum[vc]--;
			rstat[pos] = (rstat[pos * 2] == rstat[pos * 2 + 1] ? rstat[pos * 2] : 2);
			if(rstat[pos] != 2) rsum[vc]++;
		}
	};
	auto vmdc = [&](unsigned pos) -> void
	{
		pos += (1ull << n) - 1;
		cstat[pos] ^= 1;
		unsigned vc = 0;
		while(pos >>= 1)
		{
			vc++;
			if(cstat[pos] != 2) csum[vc]--;
			cstat[pos] = (cstat[pos * 2] == cstat[pos * 2 + 1] ? cstat[pos * 2] : 2);
			if(cstat[pos] != 2) csum[vc]++;
		}
	};
	while(q--)
	{
		int a, p;
		scanf("%d%d", &a, &p);
		if(a) vmdr(p);
		else vmdc(p);
		printf("%llu\n", qval());
	}
	return 0;
}
```

:::
