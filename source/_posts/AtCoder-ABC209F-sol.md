---
title: 题解：AT_abc209_f [ABC209F] Deforestation
tags:
  - Solution
  - Atcoder Problem Solution
  - Dynamic Programming
  - Counting
  - Mathematics
categories:
  - Solution
date: 2026-09-02 14:04:38
updated: 2026-09-02 14:04:38
---
简单题。

首先考虑最小值本身怎么算。考虑设 $q$ 为 $P$ 的逆排列，即 $i$ 第 $q_i$ 个被砍。

那么对于相邻两棵树 $i,i+1$，若 $q_i<q_{i+1}$ 则有一个 $a_{i+1}$ 的额外代价，否则有 $a_i$ 的额外代价。

注意到对于任意的相邻两项的小于大于限制（比如样例一限制就是 $q_1<q_2>q_3$）都是存在对应排列的，所以显然在相邻两项之间让更大的数字 $q$ 更小即可。

那么现在考虑怎么算最优方案数。显然 $q$ 和 $P$ 形成双射，故只需要对 $q$ 计数。然后就是 AT_dp_t 了！只是多了一个 `?`，代表这里小于大于都可以。这个也是好办的，有两种方法。第一种是在 `?` 的位置分段，分出来每一段之内就没有 `?`，最后穿插回去。第二种就是在 dp 的过程中，遇到 `?` 就把所有位置都设成之前的总方案数。我代码写的是第二种。

时间复杂度 $O(n^2)$。

:::info[sub&code]

[sub](https://atcoder.jp/contests/abc209/submissions/78867712)。

```cpp
#include <cstdio>
#include <algorithm>

using namespace std;

long long dp[4005][4005];

int a[4005];

int main()
{
  int n;
  scanf("%d", &n);
  for(int i=1;i<=n;i++)
  {
    scanf("%d", a + i);
  }
  dp[1][1] = 1;
  for(int i=2;i<=n;i++)
  {
    if(a[i] == a[i-1])
    {
      long long s = 0;
      for(int j=1;j<i;j++)
      {
        s = (s + dp[i-1][j]) % 1000000007;
      }
      for(int j=1;j<=i;j++) dp[i][j] = s;
    }
    else if(a[i] < a[i-1])
    {
      for(int j=i;j>=1;j--)
      {
        dp[i][j] = (dp[i][j+1] + dp[i-1][j]) % 1000000007;
      }
    }
    else
    {
      for(int j=1;j<=i;j++)
      {
        dp[i][j] = (dp[i][j-1] + dp[i-1][j-1]) % 1000000007;
      }
    }
  }
  long long s = 0;
  for(int i=1;i<=n;i++) s = (s + dp[n][i]) % 1000000007;
  printf("%lld\n", s);
  return 0;
}
```

:::
