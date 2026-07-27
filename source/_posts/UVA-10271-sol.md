---
title: 题解：UVA10271 佳佳的筷子 Chopsticks
date: 2025-6-15 10:47:40
categories:
  - Solution
tags:
  - Solution
  - UVA Problem Solution
---
单调递增？肯定有用处。考虑有什么用？

权值和 $c$ 没有关系，于是先不考虑。直觉上来看考虑 $a,b$ 在数组中相邻是最好的。证明非常容易，可惜洛谷支持的 Markdown 不能自动折叠某一段文本，只能直接把证明放在下面了。

> 不妨设有一组是 $(L_i,L_j,L_k)$，其中 $j>i+1$。
>
> 如果 $L_{i+1}$ 从来都没有选，则把第一组改成 $(L_i,L_{i+1},L_k)$ 显然更优。
>
> 如果 $L_{i+1}$ 作为其它组的第一个元素，就是 $(L_{i+1},L_u,L_v)$，那么交换 $L_{i+1}$ 和 $L_j$ 后代价从 $(L_j-L_i)^2+(L_u-L_{i+1})^2$ 变为 $(L_{i+1}-L_i)^2+(L_u-L_j)^2$，随手展开得到前者减去后者为 $2(L_iL_{i+1}+L_uL_j-L_jL_i-L_uL_{i+1})$，有点乱所以我们令  $a=L_i,b=L_{i+1},c=L_j,d=L_u$，满足 $a<b<c,a<b<d$，也就是 $2(ab+cd-ac-bd)$，去掉 $2$ 得到 $(a-d)(b-c)>0$。
>
> 如果 $L_{i+1}$ 作为其它组的第二个元素，那么 $(L_u,L_{i+1},L_v)$，我们有 $u<i$。改为 $(L_i,L_{i+1},L_k)$ 和 $(L_u,L_i,L_v)$ 两组都更优。
>
> 如果 $L_{i+1}$ 作为其它组的第三个元素，那么显然改完更优。
>
> 这样我们就证毕了。

我们利用这个性质进行 dp。

如果我们用经典的状态设计：$f_i$ 代表考虑前 $i$ 个的答案则不太好因为最后一个必然需要选择丢弃（选择当做第三个差不多也就相当于丢弃了），不好。我们就设 $f_i$ 为考虑 $L_i\sim L_n$ 的结果，但是不太好表示答案。我们就设 $f_{i,j}$ 为考虑 $L_i\sim L_n$，而选了 $j$ 组的答案。那么容易写出状态转移方程 $f_{i,j}=\max(f_{i+1,j},f_{i+2,j-1}+(L_i-L_{i+1})^2)$。

这样我们仍然无法通过这题。状态转移方程 $\max$ 中的第二项代表选取 $L_i$ 和 $L_{i+1}$ 和后面的某一项为一组，但是后面项有可能不够！后面一共有 $n-i-1$ 项，而我们需要选出 $3(j-1)$ 个元素组成 $j-1$ 组，所以需要 $3(j-1)\le n-i-1$ 时才可以进行后面的转移。

代码：

```cpp
#include <cstdio>
#include <algorithm>
#include <cstring>

using namespace std;

long long f[5005][1670];
int l[5005];

int main()
{
    int t;
    scanf("%d", &t);
    while(t--)
    {
        int n, k;
        scanf("%d%d", &k, &n);
        for(int i=1;i<=n;i++)
        {
            scanf("%d", l+i); 
        }
        k += 8;
        memset(f, 0x3f, sizeof f);
        f[n][0] = 0;
        for(int i=n-1;i>=1;i--)
        {
            for(int j=0;j<=k;j++)
            {
                f[i][j] = min(f[i+1][j], (j>=1 && (j-1)*3+1<=(n-i-1) ? 1ll*(l[i]-l[i+1])*(l[i]-l[i+1])+f[i+2][j-1] : 0x3f3f3f3f3f3f3f3fll));
                // printf("f[%d][%d] = %lld\n", i, j, f[i][j]);
            }
        }
        printf("%lld\n", f[1][k]);
    }
    return 0;
}
```

[提交记录](https://www.luogu.com.cn/record/220557572)。