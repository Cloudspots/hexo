---
title: 题解：P15575 [USACO26FEB] Point Elimination S
date: 2026-4-13 15:09:06
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
神秘思维题！

首先看第二个条件。显然它等价于所有的 $y$ 坐标可以任意排列。

那么问题转化为，每次可以选择两个差为 $1$ 的 $y$ 坐标和两个相同的 $x$ 坐标进行消除，或者两个相同的 $y$ 坐标和两个差为 $1$ 的 $x$ 坐标进行消除。

也就是说，把 $y$ 坐标和 $x$ 坐标分成若干组，每组两种类型。第一种类型是两个相同的数字，第二种是两个差距为 $1$ 的数字。要求 $y$ 坐标的第一种类型的组数等于 $x$ 坐标的第二种类型的组数。

同时，注意到类似 $2,2,3,3$ 的数字（就是 $x,x,x+1,x+1$ 类型）可以分为两个第一种或者两个第二种。所以不妨猜测假设第一种的最小个数为 $a$，最大个数为 $b$，则任意 $a\le x\le b$ 满足 $a\equiv x\pmod 2$ 的 $x$ 都可以取到。

那么问题转化为，求最小值和最大值。$x$ 和 $y$ 坐标的处理方式是相同的，我们就假设要处理 $a$。

首先把 $a$ 分为若干段，按照差距 $\ge 2$ 分段。那么每一段值域都是连续的。打出值域桶。

第一种（两个相同数字）的最大值是好办的。只需要贪心，遇到奇数则向后延即可。

最小值稍微麻烦一点，也是贪心。我们先尽量让相邻两个全部抵消（也就是让第二种最多），如果遇到奇数则撤回一次抵消。剩下的（必定是偶数）就只能用第一种了。

时间复杂度是排序的 $O(n\log n)$。为什么常数这么大？？

:::info[sub&code]

[sub](https://www.luogu.com.cn/record/273840440)。

```cpp
#include <cstdio>
#include <map>
#include <vector>
#include <algorithm>

using namespace std;

int main()
{
	int t;
	scanf("%d", &t);
	while(t--)
	{
		int n;
		scanf("%d", &n);
		map<int, int> pm;
		map<int, int> mp;
		for(int i=1;i<=n;i++)
		{
			int x, y;
			scanf("%d%d", &x, &y);
			mp[x]++;
			pm[y]++;
		}
		vector<pair<int, int>> vt;	
		for(const auto &[x, y] : pm) vt.push_back({x, y});
		vector<pair<int, int>> vr;
		for(const auto &[x, y] : mp) vr.push_back({x, y});
		int min1 = 0, max1 = 0, min2 = 0, max2 = 0;
		bool flag = false;
		auto parser = [&](vector<int> val, int &mn1, int &mx1)
		{
			if(flag) return;
			int lst = 0;
			// printf("val:");
			for(int i=0;i<val.size();i++)
			{
				// printf(" %d", val[i]);
				mn1 += lst;
				lst = (val[i] - lst) % 2;
			}
			// printf("\n");
			if(lst)
			{
				flag = true;
				// printf("E! lst = %d\n", lst);
				return;
			}
			for(int i=0;i<val.size();i++)
			{
				if(i+1 < val.size())
				{
					int v = min(val[i], val[i+1]);
					mx1 += v;
					val[i] -= v; val[i+1] -= v;
					if(val[i] % 2 == 1)
					{
						val[i]++;
						val[i+1]++;
						mx1--;
					}
				}
				if(val[i] > 0)
				{
					if(val[i] % 2 == 1)
					{
						// printf("E!\n");
						flag = true;
						return;
					}
					val[i] = 0;
				}
			}
			if(val.back())
			{
				// printf("EEEEEEEEEEEEEEEEE\n");
				flag = true;
			}
		};
		vector<int> vv;
		for(int i=0;i<=vt.size();i++)
		{
			if(i > 0 && (i == vt.size() || vt[i].first - vt[i-1].first > 1))
			{
				parser(vv, min1, max1);
				vv.clear();
			}
			if(i < vt.size()) vv.push_back(vt[i].second);
		}
		for(int i=0;i<=vr.size();i++)
		{
			if(i > 0 && (i == vr.size() || vr[i].first - vr[i-1].first > 1))
			{
				parser(vv, min2, max2);
				vv.clear();
			}
			if(i < vr.size()) vv.push_back(vr[i].second);
		}
		tie(min2, max2) = tuple<int, int>(n / 2 - max2, n / 2 - min2);
		// printf("min1 = %d, max1 = %d, min2 = %d, max2 = %d, flag = %d\n", min1, max1, min2, max2, (int)flag);
		printf(!flag && min2 % 2 == min1 % 2 && min(max1, max2) >= max(min1, min2) ? "YES\n" : "NO\n");
	}
	return 0;
}
```
:::