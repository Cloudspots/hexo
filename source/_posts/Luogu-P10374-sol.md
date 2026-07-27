---
title: 题解：P10374 [AHOI2024 初中组] 操作
date: 2024-5-13 21:38:33
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
做这道题，我们要考虑到操作的两个性质：

> 1. 每次执行同一个操作得到的结果都是一样的。
> 3. $k$ 次执行同一个操作相当于将执行一次这个操作的更改 $\times k$。

还有操作二（$o_i = 2$）的一个性质：

> 只会执行编号在 $i$ 之前的操作。

所以，我们可以这样做：

因为操作二的性质，所以我们可以倒着看每一条操作。下面定义 $cnt_i$ 为编号为 $i$ 的操作**实际**执行的次数（所以刚开始时每个 $cnt_{(c_i)}$ 都要为 $1$）：

1. 倒序枚举每一个操作，设这次操作编号为 $i$。
2. 如果 $o_i = 1$，即为直接修改操作，则直接将 $a_{(x_i)}$ 加上 $y_i$，但是要加上 $cnt_i$ 次，所以总共加上 $y_i \times cnt_i$。
3. 否则，为区间调用操作，将 $cnt_{(x_i)}, cnt_{(x_i+1)}, cnt_{(x_i+2)}, \cdots, cnt_{(y_i)}$ 都加上 $1$（都多调用一次），但是一共要加上 $cnt_i$ 次，所以一共加上的是 $cnt_i$。

但是，现在的时间复杂度仍然是 $O(nm)$ 的，因为每次将 $cnt_{(x_i)}$ 到 $cnt_{(y_i)}$ 加上 $cnt_i$ 时，仍然需要 $O(n)$ 复杂度。

如何优化区间加减？考虑差分。

但是！！如果直接从前往后差分的话，不可以实时知道 $cnt_i$，所以需要从后往前差分。

还有，就是注意 $cnt_i$ 可能会非常大，所以需要**实时取模**，但是有减法，取模然后加上模数再取模就好。

这题就完美地结束啦~

```
#include <cstdio>

using namespace std;

int o[200005], x[200005], y[200005], cnt[200005], a[200005];

int main()
{
    int n, m, k;
    scanf("%d%d%d", &n, &m, &k);
    for(int i=1;i<=k;i++)
    {
        int c_i;
        scanf("%d", &c_i);
        cnt[c_i]++;
        cnt[c_i-1]--; //单点修改
    }
    for(int i=1;i<=m;i++)
    {
        scanf("%d%d%d", o + i, x + i, y + i);
    }
    for(int i=m;i>=1;i--)
    {
        cnt[i] = ((cnt[i] + cnt[i+1]) % 10007 + 10007) % 10007; //从后往前差分
        if(o[i] == 2)
        {
            cnt[y[i]] += cnt[i];
            cnt[x[i]-1] -= cnt[i]; //区间修改
        }
        else a[x[i]] = (a[x[i]] + y[i]*cnt[i]) % 10007;
    }
    for(int i=1;i<=n;i++)
    {
        printf("%d%c", a[i], " \n"[i == n]);
    }
    return 0;
}
```