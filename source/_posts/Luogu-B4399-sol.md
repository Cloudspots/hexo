---
title: 题解：B4399 [蓝桥杯青少年组国赛 2025] 第四题
date: 2025-8-29 19:53:45
categories:
  - Solution
tags:
  - Solution
  - Luogu B Problem Solution
---
> 这题咋是 B4399……

带权区间覆盖。点 $x$ 的权值为 $x$。最小化总权值。

先看经典的区间覆盖问题——无权区间覆盖，即最小化选点数量。按照右端点从小到大排序，遇到一个目前没有被覆盖的区间就选取其右端点。显然它是正确的，因为它让每个点都尽量靠右。

回到这题。尽量靠右会发生什么？选点数量尽量小的前提下，总权值尽量大。那我们从右向左贪心（同时按照左端点从大到小排序）不就是选点数量尽量小的前提下总权值尽量小吗？然后权值都是正数，所以总权值必然尽量小。

所以我们从右向左贪心即可。

显然要开 `long long`。

:::info[代码&提交记录]
```cpp
#include <cstdio>
#include <algorithm>

using namespace std;

class seg
{
public:
    int l, r;
} segs[100005];

int main()
{
    int n;
    scanf("%d", &n);
    for(int i=1;i<=n;i++)
    {
        scanf("%d%d", &segs[i].l, &segs[i].r);
    }
    sort(segs + 1, segs + n + 1, [](const auto &x, const auto &y) { return x.l > y.l; });
    int r = 1000000001;
    long long sum = 0;
    for(int i=1;i<=n;i++)
    {
        if(segs[i].r < r)
        {
            r = segs[i].l;
            sum += r;
        }
    }
    printf("%lld\n", sum);
    return 0;
}
```

[record](https://www.luogu.com.cn/record/233755121)。
:::