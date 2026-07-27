---
title: 题解：P8272 [USACO22OPEN] Apple Catching G
date: 2026-5-16 15:18:40
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
注意到奶牛和苹果是对称的。我们让奶牛和苹果配对即可。~~二分图最大匹配。~~

首先我们放到平面上，横坐标为位置，纵坐标为时间。

我们考虑苹果和奶牛配对。这是因为，苹果只能向下配对，这样有下限 $x=0$。而虽然奶牛也有上限（$x=10^9$），但是需要参与运算，不好考虑。

那么，一个苹果能够匹配到的奶牛的范围：[desmos](https://www.desmos.com/calculator/jbeuirhtfx)。我不想传图到洛谷图床。

我们首先考虑简化版，所有奶牛都在 $t=0$ 时出现。也就是说，它们都在 $x$ 轴上。此时，每个苹果对应一个**区间**（启示 $1$）。

我们考虑**贪心，按照右端点从小到大排序**（启示 $2$）。为什么？

首先贪心是显然的。你不配对相当于没用，不会有好处。

- 两个区间，相互包含，一个点 $K$ 同时在两个区间中：[desmos](https://www.desmos.com/calculator/rktbqcbs84)。此时，如果选择了外面的区间，那可能还有点 $H$ 处于外面的区间中但是不处于内部的区间中。那么我们就应该选择里面的区间，这没有任何坏处。
- 两个区间，不相互包含，一个点 $K$ 同时在两个区间中：[desmos](https://www.desmos.com/calculator/s6qimu6prx)。此时难以判断，但是如果 $K$ 左边的奶牛都已经被配对，或者无法配对了，那么显然选择左边的 $Q$ 更优。也就是说，如果我们从左往右考虑，那么在左边的更优。

综合上述两种情况，**按照右端点从左到右排序**。对于每个苹果，如果有可以匹配的奶牛，则**匹配最靠左的**。

现在来考虑原题，不保证奶牛的 $t=0$。

其实差别不大，只需要考虑如何排序和如何判断“靠左”。

对于排序，显然顺序是一样的。如何判断“靠左”？其实这里“靠左”本质上是“不容易和其它奶牛配对”。一个奶牛 $(t,x)$ 和一个苹果 $(T,X)$ 能够配对的充要条件是 $\lvert x-X\rvert \le T-t$，换句话说就是，$t+x\le T+X$ 和 $t-x\ge T-X$……这是什么意思？$[t-x,t+x]\subseteq [T-X,T+X]$。哦对了几何意义也可以证的。

那么，我们既然在按照右端点 $T+X$ 从小到大排序，那么用一个数据结构（如 `set`）维护“目前满足右界限制的所有点的集合”，只需要判断左界限制即可。

我们按照 $T-X$ 从小到大排序所有奶牛，然后用 `std::set` 的 `lower_bound` 方法找到 $\ge T-X$ 的最小奶牛即可。

至于如何加入右端点符合的，这个你扫描线即可。

时间复杂度 $O(n\log n)$。注意如果用 `set` 那你比较方法不能直接写 $T-X$ 的比较，因为可能这个值相等，然后 `set` 判断为两个元素等价，只保留一个，你就挂了。用 `multiset`，或者两者相等时指定一个顺序（比如按照 $X$ 从大到小）即可。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/278019774)。

```cpp
// Aaron Catching G
// This is an Aaron. I like Aarons. Aarons are good for our English (and Chinglish).
// 没看到 一旦一头奶牛接住了一个苹果，她就会离开数轴。 见祖宗
/*
考虑贪心

优先考虑【右端点靠左】的苹果，也就是按照 pos + time 从小到大排序。如果相同，则按照 pos 从小到大排序。

匹配的是【靠左】的奶牛。

哪些奶牛可以被匹配？

既然你是右端点越来越大，那你就扫描线，不断加入奶牛即可。

判断左端点合法？

pos >= P - (T - time). 换句话说，pos - time >= P - T

右端点也合法。这是扫描线保证的。pos + time <= P + T

有没有保证 time <= T？显然。这是区间长度。
*/
#include <cstdio>
#include <set>
#include <algorithm>

using namespace std;

class appon // apple & aaron
{
public:
	long long t, x;
	mutable long long k;
} apple[200005], aaron[200005] /* cow */;

int main()
{
	int n;
	scanf("%d", &n);
	int x = 0, y = 0;
	for(int i=1;i<=n;i++)
	{
		int q;
		scanf("%d", &q);
		if(q == 1)
		{
			x++;
			scanf("%d%d%d", &aaron[x].t, &aaron[x].x, &aaron[x].k);
		}
		else
		{
			y++;
			scanf("%d%d%d", &apple[y].t, &apple[y].x, &apple[y].k);
		}
	}
	sort(apple + 1, apple + y + 1, [](const auto &x, const auto &y) { return x.t + x.x < y.t + y.x || x.t + x.x == y.t + y.x && x.x < y.x; });
	sort(aaron + 1, aaron + x + 1, [](const auto &x, const auto &y) { return x.t + x.x < y.t + y.x || x.t + x.x == y.t + y.x && x.x < y.x; });
	class _
	{
	public:
		bool operator()(const appon &x, const appon &y) const { return x.x - x.t < y.x - y.t || x.x - x.t == y.x - y.t && x.x > y.x; }
	};
	set<appon, _> st;
	int cur = 0;
	long long sum = 0;
	for(int i=1;i<=y;i++)
	{
		while(cur < x && aaron[cur + 1].t + aaron[cur + 1].x <= apple[i].t + apple[i].x) st.insert(aaron[++cur]);
		while(apple[i].k && !st.empty())
		{
			auto it = st.lower_bound(apple[i]);
			if(it == st.end()) break;
			sum += min(apple[i].k, it->k);
			// printf("apple {t = %d, x = %d, k = %d} <---> aaron {t = %d, x = %d, k = %d}\n", apple[i].t, apple[i].x, apple[i].k, it->t, it->x, it->k);
			if(it->k == apple[i].k)
			{
				st.erase(it);
				break;
			}
			if(it->k > apple[i].k)
			{
				it->k -= apple[i].k;
				break;
			}
			apple[i].k -= it->k;
			st.erase(it);
		}
	}
	printf("%lld\n", sum);
	return 0;
}
// Lionblaze 危
```

:::