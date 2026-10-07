---
title: 题解：P15543 [CCC 2026 S4] Minecarts
date: 2026-09-30 19:15:26
updated: 2026-10-07 21:53:07
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P15543 [CCC 2026 S4] Minecarts

简单题，红。

到底是谁在用奇奇怪怪的数据结构。

---

将矿车**从右往左**编号为 $1\dots n$。设第 $i$ 个移到右边的为 $p_i$，手模一下容易发现需要的长度是 $\max\{p_i-i\}$，证明是显然的。

当然注意由于编号反过来了，所以目标变为单调不增而不是单调不降。

$K=0$ 就做完了，按照值从大到小为第一关键字，下标从小到大作为第二关键字排序即可。

考虑 $K>0$。

先把所有非空矿车放一起按照上面的方法排序，然后按照某种方法空矿车插进去。显然编号小的矿车插的位置编号也一定小。

考虑插进一个空矿车会对答案造成什么影响。我们不妨假设初始时所有非空矿车都在序列的最右方，即每次插入空矿车会将非空矿车的一个前缀整体左移一位，然后在空出来的位置插入空矿车。这样做的好处是只对答案有非负贡献（右移的话下标会增加，$p_i-i$ 会减少，答案可能减小，不好考虑）。

那么插入一个空矿车会首先将所有编号比它插入的位置小的矿车对答案的贡献增加 $1$，然后它自己也对答案有原编号减新位置的贡献。

而新矿车对新矿车的贡献可以通过按照编号从大到小来避免，这样不需要后面新加的矿车对之前的矿车额外造成不好处理的贡献。

这样的贡献由两部分组成（原本的矿车的修改后的贡献和新加的矿车的贡献），不好做。但这是求最大值的最小值，考虑二分。

考虑尽量往大编号放除了对于第一部分贡献（对原矿车的贡献）可能出事之外对于其它两个限制（备用宝石数，新矿车贡献）都是不劣的，好在第一部分合法性是好判定的。

那么就可以直接做了，计算出每个位置应该放多少个空矿车，将空矿车排序后判断合法性即可。

:::info[rec&code]

这个代码是我赛后简化过的。赛时写得有点复杂，但是还是比什么奇怪线段树做法好。

[rec](https://www.luogu.com.cn/record/300060541)。

```cpp
#include <cstdio>
#include <cassert>
#include <algorithm>

using namespace std;

class mc { public: int id, val; } ps[300005], ez[300005];
int ca[300005];

int main()
{
	int n;
	long long v;
	scanf("%d%lld", &n, &v);
	int cur1 = 0, cur2 = 0;
	for(int i=1;i<=n;i++)
	{
		int g;
		scanf("%d", &g);
		if(g) ps[++cur1] = {n-i+1, g};
		else ez[++cur2] = {n-i+1, g};
	}
	sort(ps + 1, ps + cur1 + 1, [](const auto &x, const auto &y) { return x.val > y.val || x.val == y.val && x.id < y.id; });
	sort(ez + 1, ez + cur2 + 1, [](const auto &x, const auto &y) { return x.id > y.id; });
	auto check = [&](int val)
	{
		ca[0] = cur2;
		for(int i=1;i<=cur1;i++)
		{
			ca[i] = min(ca[i-1], val - (ps[i].id - (i + cur2)));
		}
		if(ca[cur1] < 0) return false;
		int c = 1;
		long long s = 0;
		int vlc = 0;
		for(int i=cur1+1;i>=1;i--)
		{
			int vlc = ca[i-1] - ca[i];
			while(vlc--)
			{
				if(ez[c].id - (n - (cur1 - i + c - (i == 0 ? 1 : 0))) > val || s + ps[i].val > v) return false;
				s += ps[i].val;
				c++;
			}
		}
		assert(c == cur2 + 1);
		return true;
	};
	int l = 0, r = n;
	while(l < r)
	{
		int mid = (l + r) / 2;
		if(check(mid)) r = mid;
		else l = mid + 1;
	}
	printf("%d\n", l);
	return 0;
}
```

:::
