---
title: 题解：P15576 [USACO26FEB] Good Cyclic Shifts G
date: 2026-3-13 20:08:53
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
分别处理逆序对和 $f$ 函数。

逆序对是好做的，先树状数组求出初始值，然后树状数组+队列每次维护最后一个元素就行了。可以用同一个树状数组。

$f$ 函数比较困难。大力分讨。

首先注意到每次等价于下标 $i\gets i\bmod n+1$。比如，刚开始是 $p_i$ 的贡献是 $\lvert i-p_i\rvert$，那么一次之后就是 $\lvert (i\bmod n+1)-p_i\rvert$，两次之后就是 $\lvert ((i+1)\bmod n+1)-p_i\rvert$，以此类推。

如果我们按照向右移位次数 $k$ 作为时间轴（横坐标轴），分别画两条线表示 $p_i$ 的值和 $i$ 的话，那么由于 $p_i$ 是常数所以是水平的不变，而 $i$ 就是先上升，然后上升到 $n$ 之后就变化为 $1$，然后继续上升。

那么，大力分讨刚开始 $i$ 和 $p_i$ 的大小关系。下面放一张图。

黑色坐标轴就是坐标轴，蓝色的线分别代表 $p_i$ 和 $i$，黑色的线代表 $\lvert p_i-i\rvert$，绿色的线代表黑色的线的差分。

会有一些不规范的使用，比如 $i=n-i$ 实际上表示的是右移次数 $k=n-i$，感觉都能理解吧。

左边是正常情况，右边是特殊情况，$i=n$ 的情况。第一种情况没有特殊情况是因为 $i=n$ 不可能满足 $p_i>i$。

![](peAqRXT.png)

关于实现，可以用线段树维护差分数组，也可以用树状数组维护二阶差分。我使用的是后者。

:::info[代码&提交记录]

[sub](https://www.luogu.com.cn/record/266959390)。

```cpp
#include <cstdio>
#include <queue>
#include <algorithm>
#include <vector>

using namespace std;

class BIT
{
	long long sum[200005];
public:
	void add(int x, int val, int n)
	{
		x += 3; n += 8;
		do
		{
			sum[x] += val;
		} while((x += x & -x) <= n);
	}
	long long qsum(int x) const
	{
		x += 3;
		long long s = 0;
		do
		{
			s += sum[x];
		} while(x -= x & -x);
		return s;
	}
	void clear(int n)
	{
		fill(sum + 1, sum + n + 10, 0);
	}
} bt1, b2t;

int p[200005];
long long wow[200005];

int main()
{
	int t;
	scanf("%d", &t);
	while(t--)
	{
		int n;
		scanf("%d", &n);
		bt1.clear(n);
		b2t.clear(n);
		for(int i=1;i<=n;i++)
		{
			scanf("%d", p + i);
			// printf("i = %d, p = %d\n", i, p[i]);
			if(i < p[i])
			{
				b2t.add(0, p[i] - i, n); // 1 + 1 + 1
				b2t.add(1, -1 - (p[i] - i), n); // (-2) + (-2)
				b2t.add(p[i] - i + 1, 2, n); // 2
				b2t.add(n - i + 1, 2 * p[i] - n - 1 - 1, n); // 3
				b2t.add(n - i + 2, -1 - (2 * p[i] - n - 1), n);
			}
			else if(i == p[i])
			{
				if(i == n)
				{
					b2t.add(1, n - 1, n);
					b2t.add(2, (-1) - (n-1), n);
				}
				else
				{
					b2t.add(1, 1, n);
					b2t.add(n - i + 1, i - 1 - (n - i) - 1, n);
					b2t.add(n - i + 2, -1 - (i - 1 - (n - i)), n);
				}
			}
			else
			{
				if(i == n)
				{
					b2t.add(0, n - p[i], n);
					b2t.add(1, 2 * p[i] - n - 1 - (n - p[i]), n);
					b2t.add(2, -1 - (2 * p[i] - n - 1), n);
					b2t.add(p[i] + 1, 2, n);
				}
				else
				{
					b2t.add(0, i - p[i], n);
					b2t.add(1, 1 - (i - p[i]), n);
					b2t.add(n - i + 1, 2 * p[i] - n - 1 - 1, n);
					b2t.add(n - i + 2, -1 - (2 * p[i] - n - 1), n);
					b2t.add(n - i + p[i] + 1, 2, n);
				}
			}
		}
		for(int i=0;i<n;i++)
		{
			wow[i] = (i ? wow[i-1] : 0) + b2t.qsum(i);
			// printf("wow[%d] = %lld (/2 = %lld)\n", i, wow[i], wow[i] / 2);
		}
		queue<int> q;
		long long current = 0;
		for(int i=n;i>=1;i--)
		{
			current += bt1.qsum(p[i]);
			bt1.add(p[i], 1, n);
			q.push(p[i]);
		}
		vector<int> ans;
		for(int i=0;i<n;i++)
		{
			// printf("i = %d, current = %lld, wow / 2 = %lld\n", i, current, wow[i] / 2);
			if(current <= wow[i] / 2) ans.push_back(i);
			current -= bt1.qsum(n) - bt1.qsum(q.front());
			current += bt1.qsum(q.front() - 1);
			q.push(q.front());
			q.pop();
		}
		printf("%d\n", ans.size());
		for(int x : ans) printf("%d ", x);
		printf("\n");
	}
	return 0;
}
```

:::