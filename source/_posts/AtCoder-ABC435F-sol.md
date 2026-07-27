---
title: 题解：AT_abc435_f [ABC435F] Cat exercise
date: 2025-12-7 10:48:04
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
感觉黄吧。这个做法的思维难度大概就黄，ST 表也是黄，两个加起来最多就绿吧。

感觉上，每次不移除猫猫所在的地方是没用的……实则不然。

比如样例 $1$。第一次移除 $5$，第二次移除 $4$，然后猫猫就在 $3$ 的位置。动不了了！只能开始和 Takahashi 打架。

容易发现一个性质：任何时刻猫猫能到的地方都是一个区间。

实际上，每次移除猫猫所在的地方后，猫猫可能向左边走，也可能向右边走。向哪边走就看哪边更高。但是！Takahashi 可以移除掉高的一边的所有地方，让猫猫只能往另一边走。移除是没有代价的。也就是，Takahashi 可以自由地控制猫猫往那边走！

另一件事情是，如果一种情况下猫猫可以到达的区间是另一种情况的子区间，那么前者必然不比后者更优。因为可以通过把后者转化为前者并不带来任何代价。

所以，如果 Takahashi 想要猫猫往一边走，则他最好不要移除那一边的任何元素，已经移除掉的除外。

这样，猫猫往一边走之后所在的位置就是确定的。假设原本猫猫可以到达 $[l,r]$，现在猫猫在 $p$ 的位置，则 Takahashi 移除 $p$ 之后，如果他让猫猫往左走则猫猫会走到 $[l,p-1]$ 的最大的数字上，否则是 $[p+1,r]$ 的最大的数字上。

而如果左边或右边是空的，那么猫猫只能往一边走。

分治下去即可。不过暴力算单次是线性的，而这里有 $\mathcal O(n)$ 次，并且可能分割不均匀（比如单调的序列），所以需要用支持区间查询最大值的位置的数据结构优化，比如 ST 表。

使用 ST 表就可以做到预处理 $\mathcal O(n\log n)$，单层递归 $\Theta(1)$，总时间复杂度 $\mathcal O(n\log n)$。

注意需要开 `long long`，因为可以让猫猫在最左边和最右边反复横跳，比如形如 `n (n-2) (n-4) (n-6) ... 2 1 3 5 7 ... (n-7) (n-5) (n-3) (n-1)` 的数据（假设 $n$ 是偶数）。

::::info[代码&提交记录]

:::warning{open}
代码的注释中我没有认真分析。ST 表的单次查询实际上是 $\Theta(1)$ 的，只要你给 $\left\lfloor\log_2 x\right\rfloor$ 打个表。不过不影响总时间复杂度。
:::

[submission](https://atcoder.jp/contests/abc435/submissions/71500612)。

```cpp
/*
分析问题性质

原本可爱的猫猫想要往一边跑

但是你可以 block 那一边的最靠近猫猫所在的地方的元素

然后猫猫就只能往另一边跑了

那么你处理一个区间 max

然后分治下去

一共 O(n) 轮

每轮 O(log n) 复杂度

能过
*/
#include <cstdio>
#include <algorithm>

using namespace std;

int st[200005][25], smx[200005][25];
int a[200005];
int lg2[200005];

static pair<int, int> gtmax(int x, int y)
{
	int bsz = y - x + 1, lgbsz = lg2[bsz], vbsz = 1 << lgbsz;
	int res = max(st[x + vbsz - 1][lgbsz], st[y][lgbsz]);
	if (res == st[x + vbsz - 1][lgbsz]) return { res, smx[x + vbsz - 1][lgbsz] };
	else return { res, smx[y][lgbsz] };
}

long long solve(int l, int r)
{
	if (l == r) return 0; // 猫猫可爱！The cat jumps into Takahashi's arms!
	int pos = gtmax(l, r).second;
	if (pos == l) return solve(l + 1, r) + abs(gtmax(l + 1, r).second - l);
	if (pos == r) return solve(l, r - 1) + abs(r - gtmax(l, r - 1).second);
	int lp = gtmax(l, pos - 1).second, rp = gtmax(pos + 1, r).second;
	return max(abs(pos - lp) + solve(l, pos - 1), abs(rp - pos) + solve(pos + 1, r));
}

int main()
{
	int n;
	scanf("%d", &n);
	for (int i = 2; i <= n; i++)
	{
		lg2[i] = lg2[i / 2] + 1;
	}
	for (int i = 1; i <= n; i++)
	{
		scanf("%d", a + i);
		st[i][0] = a[i];
		smx[i][0] = i;
		for (int j = 1; (1 << j) <= i; j++)
		{
			st[i][j] = max(st[i][j - 1], st[i - (1 << (j - 1))][j - 1]);
			if (st[i][j] == st[i][j - 1]) smx[i][j] = smx[i][j - 1];
			else smx[i][j] = smx[i - (1 << (j - 1))][j - 1];
		}
	}
	printf("%lld\n", solve(1, n));
	return 0;
}
```

::::