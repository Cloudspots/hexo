---
title: 题解：P11455 [USACO24DEC] Cowdependence G
date: 2026-4-30 18:40:01
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
首先把所有颜色分离。

注意到颜色数量很少的时候，段数的变化次数不多。数量很多时，次数也不多。

那么我们不妨大胆猜测变化次数是 $O(\sqrt n)$ 级别的。注意到当长度 $x\le \sqrt n$ 时，显然至多 $\sqrt n$ 次（因为只有 $\sqrt n$ 个 $x$）。而 $x>\sqrt n$ 时，划分的段数必然不多于 $\sqrt n$，所以也只有 $\sqrt n$ 次。证毕。

于是我们考虑二分分界点。那么，一次 check 的复杂度是 $O\left(\dfrac{\text{sz}}{x}\log \text{sz}\right)$，加上记忆化之后总复杂度最多就是 $O(\text{sz}\log^2 n)$，$\text{sz}$ 是这个数字的出现次数。那么总共时间复杂度就是 $O(n\sqrt n\log n)$。

不加记忆化也能过，我不知道为什么，但是略微卡常。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/276104053)。

```cpp
#include <cstdio>
#include <map>
#include <vector>

using namespace std;

vector<unsigned> vt[100005];
unsigned diff[100005];

#ifndef __linux__
#define getchar_unlocked _getchar_nolock
#endif

unsigned qread()
{
	unsigned res = 0;
	char ch;
	while((ch = getchar_unlocked()) < '0' || ch > '9');
	do
	{
		res = res * 10 + ch - '0';
	} while((ch = getchar_unlocked()) >= '0' && ch <= '9');
	return res;
}

int main()
{
	// freopen("P11455.in", "r", stdin);
	// freopen("P11455.out", "w", stdout);
	unsigned n;
	// scanf("%d", &n);
	n = qread();
	for(unsigned i=1;i<=n;i++)
	{
		unsigned x;
		x = qread();
		vt[x].push_back(i);
	}
	for(unsigned i=1;i<=n;i++)
	{
		if(vt[i].empty()) continue;
		auto calc = [&](unsigned x)
		{
			unsigned cnt = 0, pos = vt[i][0];
			auto vi = vt[i].begin();
			while(true)
			{
				cnt++;
				auto it = lower_bound(vi, vt[i].end(), pos + x);
				if(it == vt[i].end()) break;
				pos = *it;
				vi = it;
			}
			return cnt;
		};
		unsigned vl = 1;
		for(unsigned x=vt[i].size();;)
		{
			unsigned l = vl, r = n + 2;
			while(l < r)
			{
				unsigned mid = (l + r) / 2;
				if(calc(mid) < x) r = mid;
				else l = mid + 1;
			}
			diff[vl] += x;
			diff[l] -= x;
			if(l <= vl) break;
			vl = l;
			x = calc(l);
		}
	}
	for(unsigned i=1;i<=n+1;i++)
	{
		diff[i] += diff[i-1];
		if(i > 1) printf("%u\n", diff[i]);
	}
	return 0;
}
```

:::