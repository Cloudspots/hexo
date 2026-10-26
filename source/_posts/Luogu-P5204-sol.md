---
title: 题解：P5204 [USACO19JAN] Train Tracking 2 P
date: 2026-10-22 19:48:54
updated: 2026-10-22 19:48:54
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P5204 [USACO19JAN] Train Tracking 2 P

继续暴力过题，依旧均摊正确。

---

$O(n\log p)$ 做法，忽略快速幂之后 $O(n)$。

考虑如果对于某个 $i$ 有 $c_i<c_{i+1}$ 则说明 $a_i=c_i$。

考虑我们可以把区间整个倒过来，使得如果 $c$ 不全相等则必然有 $c_i<c_{i+1}$。

考虑确定一个 $a_i$ 之后怎么做。由于一定有解，所以可以不加检查地把区间分为两段，这就划分为了两个子问题。这样的正确性是显然的，读者自证不难。

如果 $c$ 全相等则可以直接 dp 求解，即任意一个长度为 $k$ 的区间内都有至少一个和 $c$ 相等的数字，$f_i$ 代表考虑 $1\sim i$ 且 $a_i=c$，前缀和优化做到 $O(n\log p)$（忽略快速幂则 $O(n)$）。

那么考虑分治，对于一个序列 $c$，首先正着扫描找到第一个 $c_i<c_{i+1}$ 的 $i$，如果有就分治；否则 $c$ 翻转再扫一遍；如果都没有则跑上面的 dp。注意一个细节，如果划分为的子问题中有长度 $<k$ 的，则不存在对应的 $c$，实际限制为 $\ge c_i$。

过了？？

考虑时间复杂度。

考虑第一个 $c_i<c_{i+1}$ 的位置，其左边的 $c$ 单调不增。我们将会证明对于单调不增的 $c$，处理的时间复杂度为 $O(n\log p)$（忽略快速幂 $O(n)$）。

:::info[Proof]

首先会消耗 $O(n)$ 的时间扫描并翻转。

然后对于每个 $c_i<c_{i+1}$，左边都是 $O(\text{len}\log p)$ dp 解决掉的；右边根本没有扫描到，只是递归了下去。这样每个元素最多被扫一遍，$O(n)$。

:::

拓展上面的证明，左边是 $O(\text{len}_l)$，右边是 $O(\text{len}_r)$，总共 $O(\text{len})$。$\square$

顺带一提，如果分治的时候把 $c$ 复制过去会让时空复杂度退化，但是还是有 $95\mathrm{pts}$。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/304798758)。

```cpp
/*
先按某种方式离散化，先认为值域是 O(n) 的。
*/
// bsgm 大样例怎么除了最后一个都不是从官方数据里选的，太邪恶了，还我分来
// 欸，USACO 题哪来的子任务
/*
考虑如果 c[i] < c[i+1] 就可以确定 a[i]，如果 c[i] > c[i+1] 就可以确定 a[i+k].如果 c[i] = c[i+1] 则无法确定任何信息。

而如果确定了一个数，就可以……

感觉上是消掉这个数。但是怎么消啊。
*/
// sub1: brute force
// sub2: ???
// sub3: simple dp
// sub4: ??????
/*
统计一下，现在可以拿到 100+35+67=202 分，略高于 200.

如果能过掉 T2 或 T3 就好了。
*/
/*
可以直接砍成两段，分别求解吗。

如果是 c[i] < c[i+1]. 那么 c[i] 本身是一定被满足的（如果确定了 a[i] 并且 c[i+1] 满足）。但是对于左右两边的呢？

右边显然没有任何影响。

然后如果我们钦定 i 是第一个 c[i] < c[i+1] 的位置是不是就行了……喵？

不一定哦喵。

哦不对是一定的，因为必然有解。

那就……做完了？

就可以得到一个 O(n^2) 做法，先验一下。
*/
// 验完了，是对的。并且有一个比较牛的方法直接变成正解。可以有均摊。
#include <cstdio>
#include <vector>
#include <cassert>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };
unsigned long long dp[100005], dps[100005];
int c[100005];

int main()
{
	int n, k;
	scanf("%d%d", &n, &k);
	vector<int> cc;
	for(int i=1;i<=n-k+1;i++) scanf("%d", c + i);
	auto qpow = [](unsigned long long x, unsigned long long y) -> unsigned long long { unsigned long long ans = 1; do { if(y & 1) ans = ans * x % 1000000007; x = x * x % 1000000007; } while(y >>= 1); return ans; };
	auto solveae = [&](int len, int x)
	{
		if(x == 1000000000) return 1ull;
		x = 1000000001 - x;
		dp[0] = dps[0] = 1;
		for(int i=1;i<=len;i++)
		{
			dp[i] = (dps[i-1] - (i>=k+1 ? dps[i-k-1] : 0) + 1000000007) * qpow(x-1, i-1) % 1000000007;
			dps[i] = (dps[i-1] + dp[i] * qpow(x-1, 1000000005ll * i % 1000000006)) % 1000000007;
		}
		unsigned long long ps = 0;
		for(int i=1;i<=len;i++)
		{
			if(i+k-1 >= len) ps = (ps + dp[i] * qpow(x-1, len-i)) % 1000000007;
		}
		return ps;
	};
	auto qsame = [](const vector<int> &x) { for(int i=0;i+1<x.size();i++) if(x[i] != x[i+1]) return false; return true; };
	auto solve = U([&](auto &&self, int m, int l, int r, int g) -> unsigned long long
	{
		assert(r - l + 1 == m - k + 1);
		if(l > r) return qpow(1000000000-g+1, m);
		// if(qsame(c)) return solveae(m, c[0]);
		auto splitter = [&](int p, int v) { return self(self, p-l, l, p-k, v) * self(self, m-(p-l)-1, p+1, r, v) % 1000000007; };
		// auto rsplitter = [&](int p, int v) { return self(self, p-l, l, p-k, v) * self(self, m-(p-l)-1, p+1, r, v) % 1000000007; };
		for(int i=l;i<r;i++)
		{
			if(c[i] < c[i+1]) return splitter(i, c[i]);
			// if(c[i] > c[i+1]) return rsplitter(i+k, c[i+k]);
			// if(c[r-i+l-1] < c[r-i+l]) return splitter(r-i+l-1, c[r-i+l-1]);
			// if(c[r-i+l-1] > c[r-i+l]) return rsplitter(r-i+l-1+k, c[r-i+l-1+k]);
		}
		reverse(c + l, c + r + 1);
		for(int i=l;i<r;i++)
		{
			if(c[i] < c[i+1]) return splitter(i, c[i]);
			// if(c[i] > c[i+1]) return rsplitter(i+k, c[i+k]);
			// if(c[r-i+l-1] < c[r-i+l]) return splitter(r-i+l-1, c[r-i+l-1]);
			// if(c[r-i+l-1] > c[r-i+l]) return rsplitter(r-i+l-1+k, c[r-i+l-1+k]);
		}
		return solveae(m, c[l]);
#ifdef LB_IS_HERE
		__builtin_unreachable();
#endif
	});
	printf("%llu\n", solve(n, 1, n-k+1, 1));
	return 0;
}
// 验证完毕，挑战成功。
```

:::
