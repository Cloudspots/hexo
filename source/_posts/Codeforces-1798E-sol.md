---
title: 题解：CF1798E Multitest Generator
date: 2026-3-15 18:00:52
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
不难发现本题的数据也构成 multitest。

我们不妨设一个 multitest 的 test 数量为 $T$，一个 test 的长度为 $N$，一个 multitest 的各个 test 的长度分别为 $N_1,N_2,N_3,\dots,N_T$，一个 multitest 的长度为 $L$。

那么改变 $T=1,N_1=L-1$ 就可以把任意数列转化为 multitest。答案至多为 $2$。分讨。

- 答案为 $0$：考虑 dp。$f_i$ 为对于 $a_i,a_{i+1},\dots,a_n$，如果构成 multitest 的后半部分（即，去掉 $T$ 后的部分）那么有几个 test，如果不构成 multitest 则不存在。容易发现 $f_i=f_{i+a_i+1}+1$，$f_{n+1}=0$，$f_i\space (i>n+1)$ 不存在。那么，答案为 $0$ 当且仅当 $f_{i+1}=a_i$。
- 答案为 $1$：如果改变 $T$，那么条件是 $f_{i+1}$ 存在。  
  然而，如果不改变 $T$，那我们首先需要注意到一个事实。如果能变成 $k$ 个 test，并且 $k\ge T$，那么也能变成 $T$ 个 test。  
  证明？首先，如果你修改的 test 之后有至少 $T-k$ 个 test，那么可以增大这个 test 的 $N$（因为原本就进行了修改，所以两次对同一个位置进行修改相当于只有一次修改）把后面的 test 覆盖掉。否则，可以修改这个 test 前面的 test 把它和后面的一起覆盖掉（它自己就不用修改了）。
  所以，我们只需要求最大值。设 $g_i$ 为 $a_i,a_{i+1},\dots,a_n$ 修改至多一个数字能够组成的最多 test 数量。显然 $g_i=1+\displaystyle\max\left(\max\limits_{j=i+1}^n f_j,g_{i+a_i+1}\right)$。特别地，还是 $g_{n+1}=0$，但是 $g_i=-\infty\space(i>n+1)$。
- 答案为 $2$：不为上述两种情况的情况。

最后，倒着扫一遍，边扫边 dp，就可以求出所有的结果了。

:::info[sub&code]
[submission](https://codeforces.com/contest/1798/submission/366792875)。

```cpp
#include <cstdio>

using namespace std;

int a[300005], ans[300005];
int f[300005], g[300005];

int main()
{
    int t;
    scanf("%d", &t);
    while(t--)
    {
        int n;
        scanf("%d", &n);
        for(int i=1;i<=n;i++)
        {
            scanf("%d", a + i);
        }
        f[n+1] = g[n+1] = 0;
        int mxn = 0;
        for(int i=n;i>=1;i--)
        {
            if(i + a[i] + 1 > n + 1) f[i] = -0x3f3f3f3f;
            else if(i + a[i] + 1 == n + 1) f[i] = 1;
            else f[i] = f[i + a[i] + 1] + 1;
            if(f[i+1] > mxn) mxn = f[i+1];
            g[i] = mxn + 1;
            if(i+a[i]+1 == n+1 && 1 > g[i]) g[i] = 1;
            else if(i + a[i] + 1 <= n && g[i+a[i]+1] + 1 > g[i]) g[i] = g[i+a[i]+1] + 1;
            // printf("f[%d] = %d, g[%d] = %d\n", i, f[i], i, g[i]);
            
            // 你好，我不是 AI，但是我还是要加一个空行
            // vvv 空行 vvv

            // ^^^ 空行 ^^^
            // 一个被两层注释包围的空行.jpg
            if(f[i+1] == a[i]) ans[i] = 0;
            else if(f[i+1] >= 0 || g[i+1] >= a[i]) ans[i] = 1;
            else ans[i] = 2;
        }
        for(int i=1;i<n;i++) printf("%d%c", ans[i], " \n"[i == n - 1]);
    }
    return 0;
}
```
:::