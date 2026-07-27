---
title: 题解：CF1446D1 Frequency Problem (Easy Version)
date: 2025-12-28 17:25:25
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
容易发现众数不是很好处理。它甚至不可以合并。

我们考虑从整个序列的众数入手。如果存在超过一个众数则显然答案为 $n$。否则假设唯一的那个众数为 $x$。

因为 $x$ 的出现次数是最多的，所以不妨猜测答案的区间中的众数之一一定有 $x$。

证明？如果没有，也就是存在一个 $[l,r]$ 满足 $y,z$ 是众数并且 $x$ 的出现次数比它们要少。那么往左和右扩张直到 $x$ 的出现次数等于 $y$ 或者 $z$ 即可。这样的情况一定会出现，因为每次扩张一步那么 $x,y,z$ 至多有一个数字会增加 $1$，而如果扩张成整个序列则 $x$ 的出现次数会比 $y,z$ 都要多，所以中途一定有一种情况满足 $x$ 的出现次数和 $y$ 或 $z$ 一样多。此时因为我们进行且只进行了扩张，所以长度一定会更大。矛盾！故证毕。

我们枚举出现次数最多的另外一个值 $y$。

要求一个子段中 $x,y$ 出现次数相等。

不妨给 $x$ 赋权 $1$，$y$ 赋权 $-1$，求一个最长的和为 $0$ 的子段。

等等这样对吗？会不会出现这样求出的最优解中有 $z$ 的出现次数比 $x,y$ 都要多？

实际上虽然对于单个 $y$ 可能出现这样的情况，但是我们把 $y$ 设成使其矛盾的 $z$ 就行了，这样区间长度必然更大。

等等为什么？我们假设 $\{x,y\}$ 得出的区间为 $[l,r]$，其中 $z$ 出现次数更多，那么我们用 $\{x,z\}$ 从 $[l,r]$ 开始按照上面的方法扩张，最终一定能得出一个长度比 $[l,r]$ 长的合法的解。而我们求出的是最长的子段所以 $\{x,z\}$ 求出的最长子段一定不会比这样求出的短，证毕！

因为 $\{x,y\}$ 是最优解所以没有解比它更优，而如果存在一个 $z$ 出现次数更多则有解比它更优，矛盾！证毕！

正确性解决了，那么考虑怎么求一个最长的和为 $0$ 的子段。注意到这是子段所以可以表示为 $S_r-S_{l-1}$，那么因为这个东西为 $0$ 所以是 $S_r=S_{l-1}$，开一个 `map` 或者哈希表记录 $S_i=j$ 的最小 $j$ 即可。线性，或者多一只 $\log$（用数组也可以做只不过比较麻烦）。

总时间复杂度 $\mathcal O(nV)$。代码极其好写。

:::info[Happy New Year!]

[submission](https://codeforces.com/contest/1446/submission/355467454)。

```cpp
#include <cstdio>
#include <iostream>
#include <unordered_map>

using namespace std;

int a[200005];
int apr[200005];

int main()
{
    int n;
    scanf("%d", &n);
    for(int i=1;i<=n;i++)
    {
        scanf("%d", a + i);
        apr[a[i]]++;
    }
    int maxn = 0, maxid = 0, maxcnt = 0;
    for(int i=1;i<=n;i++)
    {
        if(apr[i] > maxn)
        {
            maxid = i;
            maxn = apr[i];
            maxcnt = 0;
        }
        if(apr[i] == maxn) maxcnt++;
    }
    if(maxcnt >= 2)
    {
        printf("%d\n", n);
        return 0;
    }
    if(maxn == n)
    {
        printf("0\n");
        return 0;
    }
    int ans = 0;
    for(int i=1;i<=100;i++)
    {
        unordered_map<int, int> um;
        int s = 0;
        um[0] = 0;
        for(int j=1;j<=n;j++)
        {
            int val;
            if(a[j] == maxid) val = 1;
            else if(a[j] == i) val = -1;
            else val = 0;
            s += val;
            if(um.count(s) && j - um[s] > ans) ans = j - um[s];
            if(!um.count(s)) um[s] = j;
        }
    }
    printf("%d\n", ans);
    return 0;
}
```

:::