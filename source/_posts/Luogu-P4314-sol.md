---
title: P4314 指令集神力
date: 2026-4-4 11:16:17
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
我们注意到洛谷支持 avx512f 指令集，而这个指令集支持同时对 $16$ 个 $32$ 位有符号整数（即 `int`）进行加法、取 $\max$ 和赋值操作。具体地，使用 `__m512i` 类型，它相当于一个 $512$ 位的变量，并且可以拆分为 $16$ 个 $32$ 位的变量分别操作。

[Intel 指令集手册官网](https://www.intel.com/content/www/us/en/docs/intrinsics-guide/index.html)。也可以下载离线版本。

- `void _mm512_storeu_epi32(void *addr, __m512i a)` 把 `a` 中的 $512$ 位二进制数解释为 $16$ 个 $32$ 位二进制数，存入 `addr[0], addr[1], ..., addr[7]` 中。
- `__m512i _mm512_loadu_epi32(void *const addr)` 把 `addr` 解释为 $32$ 位整数数组，将 `addr[0], addr[1], ..., addr[7]` 存入返回值中。
- `__m512i _mm512_max_epi32(__m512i a, __m512i b)` 把 `a` 和 `b` 解释为 $16$ 个 $32$ 位整数，分别取 $\max$ 后存入返回值中。
- `__m512i _mm512_add_epi32(__m512i a, __m512i b)` 把 `a` 和 `b` 解释为 $16$ 个 $32$ 位整数，分别求和 $\max$ 后存入返回值中。

所以我们使用指令集即可通过本题。指令集效果是常数 $\div 16$。

另外，这题如果你没注意到题目中“所有必要运算都在 $32$ 位有符号整数范围内”也是可以过的。这些指令集都有对应的 $64$ 位版本，但是需要卡常。

:::info[rec&code]
[rec](https://www.luogu.com.cn/record/271889662)。

```cpp
// brute force
#pragma GCC target("avx512f")
#include <cstdio>
#include <algorithm>
#include <immintrin.h>

using namespace std;

int a[100005], mx[100005];
int mxs[16], mss[16];
char ipb[10000005];
unsigned li = 0;

inline int qread()
{
    char ch;
    int res = 0;
    int flag = 1;
    while((ch = ipb[li++]) < '0' || ch > '9') if(ch == '-') flag = -1;
    do
    {
        res = res * 10 + ch - '0';
    } while((ch = ipb[li++]) >= '0' && ch <= '9');
    return res * flag;
}
inline unsigned uqread()
{
    char ch;
    unsigned res = 0;
    while((ch = ipb[li++]) < '0' || ch > '9');
    do
    {
        res = res * 10 + ch - '0';
    } while((ch = ipb[li++]) >= '0' && ch <= '9');
    return res;
}

int main()
{
    fread(ipb, 1, sizeof ipb, stdin);
	int n, q;
	// scanf("%d", &n);
    n = qread();
    // printf("n = %d\n", n); return 0;
	for(int i=1;i<=n;i++)
	{
		// scanf("%lld", a + i);
        a[i] = qread();
		mx[i] = a[i];
	}
	// scanf("%d", &q);
    q = qread();
    // printf("q = %d\n", q); return 0;
    mss[0] = mss[1] = mss[2] = mss[3] = mss[4] = mss[5] = mss[6] = mss[7] = mss[8] = mss[9] = mss[10] = mss[11] = mss[12] = mss[13] = mss[14] = mss[15] = -2147483648;
	while(q--)
	{
		char op = ipb[li++];
		unsigned x = uqread(), y = uqread();
        int z;
        __m512i ms;
        int mx9 = -2147483648;
        // printf("%c %u %u\n", op, x, y); fflush(stdout);
		switch(op)
		{
		case 'Q':
            ms = _mm512_loadu_epi32(mss);
            for(;x+15<=y;x+=16)
            {
                ms = _mm512_max_epi32(ms, _mm512_loadu_epi32(a + x));
            } 
            for(; x<=y; x++) mx9 = max(mx9, a[x]);
            _mm512_storeu_epi32(mxs, ms);
            printf("%d\n", max({mxs[0], mxs[1], mxs[2], mxs[3], mxs[4], mxs[5], mxs[6], mxs[7], mxs[8], mxs[9], mxs[10], mxs[11], mxs[12], mxs[13], mxs[14], mxs[15], mx9}));
            break;
		case 'A':
            ms = _mm512_loadu_epi32(mss);
            for(;x+15<=y;x+=16)
            {
                ms = _mm512_max_epi32(ms, _mm512_loadu_epi32(mx + x));
            }
            for(; x<=y; x++) mx9 = max(mx9, mx[x]);
            _mm512_storeu_epi32(mxs, ms);
            printf("%d\n", max({mxs[0], mxs[1], mxs[2], mxs[3], mxs[4], mxs[5], mxs[6], mxs[7], mxs[8], mxs[9], mxs[10], mxs[11], mxs[12], mxs[13], mxs[14], mxs[15], mx9}));
            break;
		case 'P':
            mxs[0] = mxs[1] = mxs[2] = mxs[3] = mxs[4] = mxs[5] = mxs[6] = mxs[7] = mxs[8] = mxs[9] = mxs[10] = mxs[11] = mxs[12] = mxs[13] = mxs[14] = mxs[15] = z = qread();
            ms = _mm512_loadu_epi32(mxs);
            for(;x+15<=y;x+=16)
            {
                auto res = _mm512_add_epi32(_mm512_loadu_epi32(a + x), ms);
                _mm512_storeu_epi32(a + x, res);
                _mm512_storeu_epi32(mx + x, _mm512_max_epi32(res, _mm512_loadu_epi32(mx + x)));
            } 
            for(; x<=y; x++) { a[x] += z; mx[x] = max(mx[x], a[x]); }
            break;
		case 'C':
            mxs[0] = mxs[1] = mxs[2] = mxs[3] = mxs[4] = mxs[5] = mxs[6] = mxs[7] = mxs[8] = mxs[9] = mxs[10] = mxs[11] = mxs[12] = mxs[13] = mxs[14] = mxs[15] = z = qread();
            ms = _mm512_loadu_epi32(mxs);
            for(;x+15<=y;x+=16)
            {
                _mm512_storeu_epi32(a + x, ms);
                _mm512_storeu_epi32(mx + x, _mm512_max_epi32(ms, _mm512_loadu_epi32(mx + x)));
            } 
            for(; x<=y; x++) { a[x] = z; mx[x] = max(mx[x], a[x]); }
            break;
		}
	}
	return 0;
}
```
:::