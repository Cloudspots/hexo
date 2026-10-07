---
title: 题解：P15059 [UOI 2023 II Stage] Product
date: 2026-10-05 10:37:20
updated: 2026-10-07 21:50:17
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P15059 [UOI 2023 II Stage] Product

上笛卡尔树，怎么做不了，原因是不平衡。

直接分治。就做完了。

分讨 $\min$ 和 $\text{secmin}$ 都在左边，前者在左边后者在右边，前者在右边后者在左边，都在右边的情况。

使用双指针做到每层 $O(\text{len})$。注意相等的情况。

总时间复杂度 $O(n\log n)$，常数不小。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/301078178)。

```cpp
// 简单题，绿！
// 直接分治，做完了。
#include <cstdio>
#include <cassert>
#include <algorithm>
#ifndef WROI_DBG
#define __builtin_unreachable()
#endif

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

long long a[1000005];
long long tmin[1000005], tmin2[1000005];

int main()
{
	int n;
	scanf("%d", &n);
	for(int i=1;i<=n;i++)
	{
		scanf("%lld", a + i);
	}
	auto kmin2 = [](long long x, long long y, long long z) { long long vmin = min({x, y, z}); if(x == vmin) return min(y, z); if(y == vmin) return min(x, z); if(z == vmin) return min(x, y); __builtin_unreachable(); };
	long long ans = U([&](auto &&self, int l, int r) -> long long
	{
		if(l == r) return -1;
		if(r == l + 1) return (a[l] + a[r]) * 2;
		int mid = (l + r) / 2;
		long long res = max(self(self, l, mid), self(self, mid + 1, r));
		// if(l <= 773349 && 933202 <= r) __debugbreak();
		for(int i=mid;i>=l;i--)
		{
			// tmax[i] = (i == mid ? a[i] : max(tmax[i+1], a[i]));
			tmin[i] = (i == mid ? a[i] : min(tmin[i+1], a[i]));
			tmin2[i] = (i == mid ? 0x3f3f3f3f : kmin2(a[i], tmin[i+1], tmin2[i+1]));
			assert(i == mid || tmin2[i] <= tmin2[i+1]);
		}
		for(int i=mid+1;i<=r;i++)
		{
			// tmax[i] = (i == mid+1 ? a[i] : max(tmax[i-1], a[i]));
			tmin[i] = (i == mid+1 ? a[i] : min(tmin[i-1], a[i]));
			tmin2[i] = (i == mid+1 ? 0x3f3f3f3f : kmin2(a[i], tmin[i-1], tmin2[i-1]));
			assert(i == mid + 1 || tmin2[i] <= tmin2[i-1]);
		}
		int cur = mid;
		// min, secmin 都在左边
		for(int i=mid-1;i>=l;i--)
		{
			while(cur < r && tmin[cur + 1] >= tmin2[i]) cur++;
			res = max(res, (tmin[i] + tmin2[i]) * (cur - i + 1));
		}
		// 右边
		cur = mid + 1;
		for(int i=mid+2;i<=r;i++)
		{
			while(cur > l && tmin[cur - 1] >= tmin2[i]) cur--;
			res = max(res, (tmin[i] + tmin2[i]) * (i - cur + 1));
		}
		// min 在左边，secmin 在右边
		// 枚举右端点
		cur = mid+1;
		for(int i=mid+1;i<=r;i++)
		{
			while(cur > l && tmin2[cur - 1] >= tmin[i]) cur--;
			// if(i == 933202 && l <= 773349 && 933202 <= r) __debugbreak();
			if(cur > mid || tmin[cur] <= tmin[i]) res = max(res, (tmin[i] + tmin[cur]) * (i - cur + 1));
		}
		// min 在右边，secmin 在左边
		cur = mid;
		for(int i=mid;i>=l;i--)
		{
			while(cur < r && tmin2[cur + 1] > tmin[i]) cur++;
			if(cur <= mid || tmin[cur] <= tmin[i]) res = max(res, (tmin[i] + tmin[cur]) * (cur - i + 1));
		}
		return res;
	})(1, n);
	printf("%lld\n", ans);
	return 0;
}
```

:::
