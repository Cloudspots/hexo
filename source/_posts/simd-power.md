---
title: SIMD 神力！！！！！
date: 2026-7-16 14:52:12
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
这个数据范围非常小啊，我们考虑暴力能不能过。

[我错了](https://www.luogu.com.cn/record/286100056)。

这个 `nth_element` 不是很优秀啊，这个算法本身不利于 SIMD 优化，我们考虑二分。虽然时间复杂度从 $O(n^2)$ 变成了 $O(n^2\log V)$（假设 $n,q$ 同阶），但是便于优化，跑得更快。顺便把 `vector` 改成数组，便于优化。

[$\color{red}100\color{black}\mathrm{pts}$ TLE](https://www.luogu.com.cn/record/286102005)。

godbolt 一下，编译器太菜了没能给我们自动写成指令集。那我们自己写吧。

[怎么更慢了](https://www.luogu.com.cn/record/286106044)。

究其原因是因为这个运算耗时有点长，并且依赖链很长。我们考虑循环展开优化一下依赖链。

[$\color{red}100\color{black}\mathrm{pts}$ TLE](https://www.luogu.com.cn/record/286107853)。

这个 hack 数据很强啊，在 [hack 题](https://www.luogu.com.cn/problem/U550054)上要跑大概 $2.6\mathrm{s}$。各种直接优化无果（AVX512F 试过了，不知为何跑得更慢，有没有高手指点一下/bx），我们考虑人类智慧优化。

耗时的是二分（修改是 $O(1)$ 的，插入被编译器转化成了 `memmove` 应该会挺快的）。

我们假定 $[x,y]$ 中的值在 $[0,V]$ 中均匀分布，然后估计一个范围。验证一下，如果这个范围正确就是用之，否则还是用原本的范围。

[最慢 $1.02\mathrm{s}$](https://www.luogu.com.cn/record/286161680)。

当然这个技巧可以扩展，你可以从估计的值开始向左/右倍增再二分。不过不扩展已经可以过了。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/286168799)。

```cpp
#pragma GCC target("avx2")
#include <immintrin.h>
#include <stdio.h>

__attribute__((aligned(32))) unsigned arr[70005];
__attribute__((aligned(32))) unsigned rr[8];

char ibf[10000005];
unsigned li = 0;
unsigned qread()
{
    unsigned res = 0;
    char ch;
    while((ch = ibf[li++]) < '0' || ch > '9');
    do
    {
        res = res * 10 + (ch - '0');
    } while((ch = ibf[li++]) >= '0' && ch <= '9');
    return res;
}

unsigned calc(unsigned x, unsigned y, unsigned mid)
{
    __m256i cmp_mask = _mm256_set1_epi32(mid + 1);
    __m256i cnts1 = _mm256_setzero_si256(), cnts2 = _mm256_setzero_si256(), cnts3 = _mm256_setzero_si256(), cnts4 = _mm256_setzero_si256();
    unsigned cntv = 0;
    unsigned i = x;
    for(;i%8&&i<=y;i++) if(arr[i] <= mid) cntv++;
    for(;i+31<=y;i+=32)
    {
        __m256i a1 = _mm256_load_si256((__m256i *)(arr + i));
        __m256i a2 = _mm256_load_si256((__m256i *)(arr + i + 8));
        __m256i a3 = _mm256_load_si256((__m256i *)(arr + i + 16));
        __m256i a4 = _mm256_load_si256((__m256i *)(arr + i + 24));
        a1 = _mm256_cmpgt_epi32(cmp_mask, a1);
        a2 = _mm256_cmpgt_epi32(cmp_mask, a2);
        a3 = _mm256_cmpgt_epi32(cmp_mask, a3);
        a4 = _mm256_cmpgt_epi32(cmp_mask, a4);
        cnts1 = _mm256_add_epi32(cnts1, a1);
        cnts2 = _mm256_add_epi32(cnts2, a2);
        cnts3 = _mm256_add_epi32(cnts3, a3);
        cnts4 = _mm256_add_epi32(cnts4, a4);
    }
    for(; i + 7 <= y; i += 8)
    {
        cnts1 = _mm256_add_epi32(cnts1, _mm256_cmpgt_epi32(cmp_mask, _mm256_load_si256((__m256i *)(arr + i))));
    }
    for(;i<=y;i++) if(arr[i] <= mid) cntv++;
    unsigned cnt = cntv;
    _mm256_store_si256((__m256i *)rr, cnts1);
    cnt = cnt - rr[0] - rr[1] - rr[2] - rr[3] - rr[4] - rr[5] - rr[6] - rr[7];
    _mm256_store_si256((__m256i *)rr, cnts2);
    cnt = cnt - rr[0] - rr[1] - rr[2] - rr[3] - rr[4] - rr[5] - rr[6] - rr[7];
    _mm256_store_si256((__m256i *)rr, cnts3);
    cnt = cnt - rr[0] - rr[1] - rr[2] - rr[3] - rr[4] - rr[5] - rr[6] - rr[7];
    _mm256_store_si256((__m256i *)rr, cnts4);
    cnt = cnt - rr[0] - rr[1] - rr[2] - rr[3] - rr[4] - rr[5] - rr[6] - rr[7];
    return cnt;
}

unsigned min(unsigned x, unsigned y) { return x < y ? x : y; }
unsigned max(unsigned x, unsigned y) { return x > y ? x : y; }


int main()
{
#ifdef LB_IS_TESTING
    freopen("P4278.in", "r", stdin);
    freopen("P4278.out", "w", stdout);
#endif
    fread(ibf, 1, sizeof ibf, stdin);
    unsigned n;
    // scanf("%u", &n);
    n = qread();
    for(unsigned i=1;i<=n;i++)
    {
        arr[i] = qread();
    }
    unsigned q;
    q = qread();
    // scanf("%u", &q);
    unsigned lstans = 0;
    while(q--)
    {
        char op = ibf[li++];
        if(op == '\n') op = ibf[li++];
        if(op == 'Q')
        {
            unsigned x, y, k;
            x = qread(); y = qread(); k = qread();
            x ^= lstans; y ^= lstans; k ^= lstans;
            unsigned l = 0, r = 70000;
            unsigned kl = 70000ull * (k > 5 ? k - 5 : 0) / (y - x + 1), kr = min(70000, 70000ull * (k + 5) / (y - x + 1));
            if(calc(x, y, kl) < k) l = kl;
            if(calc(x, y, kr) >= k) r = kr;
            while(l < r)
            {
                unsigned mid = (l + r) / 2;
                if(calc(x, y, mid) >= k) r = mid;
                else l = mid + 1;
            }
            printf("%u\n", lstans = l);
        }
        else if(op == 'M')
        {
            unsigned x, val;
            x = qread(); val = qread();
            x ^= lstans; val ^= lstans;
            arr[x] = val;
        }
        else
        {
            unsigned x, val;
            x = qread(); val = qread();
            x ^= lstans; val ^= lstans;
            for(unsigned i=++n;i>=x+1;i--) arr[i] = arr[i-1];
            arr[x] = val;
        }
    }
    return 0;
}
```

:::