---
title: 题解：P11792 [JOI 2017 Final] JOIOI 王国 / Kingdom of JOIOI
tags:
  - Solution
  - Luogu P Problem Solution
categories:
  - Solution
date: 2026-07-30 16:47:18
updated: 2026-07-30 16:47:18
---
> 欢迎来干掉 lemon。

---

怎么全是 $O(nm\log V)$ 做法。

给一个 $O(nm+(n+m)\log V)$ 做法，目前（不是）最优解。

首先我们注意到满足条件的划分必然是这样的：

- 存在一个非负整数序列 $a_{1\dots n}$，使得 $a$ 单调不增或单调不降，且 $a_i\in [0,m]$，并且 $(i,j)$ 在第一个颜色的区域中 $\iff j\le a_i$。

然后我们注意到题目要求的是让最大值最小，考虑二分。

首先显然 $\min$ 一定要在某个区域中，$\max$ 在另一个区域中。我们假设 $\max R=k$，那么 $\min$ 所在区域中所有数字都要 $\le \min a+k$，$\max$ 都要 $\ge \max a-k$。

那么我们分讨。

- $a$ 单调不增：我们从上往下贪心，尽量把数字划分到 $\min$ 所在的组中，然后判断 $\max$ 所在的组是否合法。
- $a$ 单调不降：我们把整个矩阵上下翻转然后变成单调不增。

直接贪心就是 $O(n+m)$ 的，使用前后缀 $\min/\max$ 优化一下即可。总时间复杂度 $O(nm+(n+m)\log V)$。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/289432464)。

```cpp
#pragma GCC target("avx2")
#include <stdio.h>
#include <unistd.h>
#include <stdbool.h>
#include <sys/mman.h>
#include<time.h>
#ifndef __cplusplus
#define var(tp,x,y) tp x=y
#include<ctype.h>
#include<stdio.h>
#include<stdint.h>
#include<stdlib.h>
#else
#define var(tp,x,y) tp x(y)
#include<cctype>
#include<cstdio>
#include<cstdint>
#include<cstdlib>
#endif
#pragma region IO input
char*__restrict _IO_iptr;
#define IO_no_special
#include<sys/mman.h>
#include<sys/stat.h>
#include<fcntl.h>
#include<unistd.h>
__attribute__((constructor))static void _IO_init(){
	struct stat s;
	fstat(0,&s);
	_IO_iptr=(char*)mmap(0,s.st_size,1,2,0,0);
	if(!_IO_iptr)exit(1);
}
#define gc() (*_IO_iptr++)
#define N 0,0,0,0,0,0,0,0,0,0,
#define W N N N N N N N N N N
#define Z W W W W W W W W W W
#define Q Z Z Z Z Z Z Z Z Z Z
#define D(a) a+1,1##a+1,2##a+1,3##a+1,4##a+1,5##a+1,6##a+1,7##a+1,8##a+1,9##a+1,
#define _ W W N N N N 0,0,0,0,0,0,
const int8_t _IO_imp[0x10000]={Q Z Z W W W N N N 0,0,0,0,0,0,D(0)_ D(1)_ D(2)_ D(3)_ D(4)_ D(5)_ D(6)_ D(7)_ D(8)_ D(9)Q Q Q Q Q W W W W W W W W N N N N N N N N 0,0,0,0,0,0};
#undef N
#undef W
#undef Z
#undef Q
#undef D
#undef _
#ifdef IO_no_special
#define isdigit(c) ((c)&16)
#else
#define isdigit(c) ((c)>47&(c)<58)
#endif
static inline __attribute__((always_inline,hot))int IO_gi(){
	var(unsigned,v,0);
#ifdef IO_auto_jump_space
	var(int,f,0);
	while(__builtin_expect(!isdigit(*_IO_iptr),0))f=*_IO_iptr++==45;
#else
	static int f;
	_IO_iptr+=f=*_IO_iptr==45;
#endif
	__builtin_expect(_IO_imp[*(uint16_t*)_IO_iptr],1)&&(v=_IO_imp[*(uint16_t*)_IO_iptr]-1,_IO_iptr+=2),
	_IO_imp[*(uint16_t*)_IO_iptr]&&(v=v*100+_IO_imp[*(uint16_t*)_IO_iptr]-1,_IO_iptr+=2),
	_IO_imp[*(uint16_t*)_IO_iptr]&&(v=v*100+_IO_imp[*(uint16_t*)_IO_iptr]-1,_IO_iptr+=2),
	_IO_imp[*(uint16_t*)_IO_iptr]&&(v=v*100+_IO_imp[*(uint16_t*)_IO_iptr]-1,_IO_iptr+=2),
	_IO_imp[*(uint16_t*)_IO_iptr]&&(v=v*100+_IO_imp[*(uint16_t*)_IO_iptr]-1,_IO_iptr+=2);
	isdigit(*_IO_iptr)&&(v=v*10+(15&gc()));
	return f?-v:v;
}
static inline __attribute__((always_inline,hot))unsigned IO_gui(){
	var(unsigned,v,0);
#ifdef IO_auto_jump_space
	while(__builtin_expect(!isdigit(*_IO_iptr),0))*_IO_iptr++;
#endif
	__builtin_expect(_IO_imp[*(uint16_t*)_IO_iptr],1)&&(v=_IO_imp[*(uint16_t*)_IO_iptr]-1,_IO_iptr+=2),
	_IO_imp[*(uint16_t*)_IO_iptr]&&(v=v*100+_IO_imp[*(uint16_t*)_IO_iptr]-1,_IO_iptr+=2),
	_IO_imp[*(uint16_t*)_IO_iptr]&&(v=v*100+_IO_imp[*(uint16_t*)_IO_iptr]-1,_IO_iptr+=2),
	_IO_imp[*(uint16_t*)_IO_iptr]&&(v=v*100+_IO_imp[*(uint16_t*)_IO_iptr]-1,_IO_iptr+=2),
	_IO_imp[*(uint16_t*)_IO_iptr]&&(v=v*100+_IO_imp[*(uint16_t*)_IO_iptr]-1,_IO_iptr+=2),
	_IO_imp[*(uint16_t*)_IO_iptr]&&(v=v*100+_IO_imp[*(uint16_t*)_IO_iptr]-1,_IO_iptr+=2);
	isdigit(*_IO_iptr)&&(v=v*10+(15&gc()));
	return v;
}
#define IO_next() (++_IO_iptr)
#undef gc
#undef isdigit
#undef isspace
#pragma endregion

unsigned pmin[2005][2005], smin[2005][2005];
unsigned pmax[2005][2005], smax[2005][2005];

char *ibf;

unsigned vqread()
{
    unsigned res = 0;
    char ch = *(ibf++);
    do
    {
        res = res * 10 + (ch - '0');
    } while((ch = *(ibf++)) >= '0' && ch <= '9');
    return res;
}
unsigned n, m, minn = 0x3f3f3f3f, maxn = 0;

bool check(unsigned val)
{
	unsigned lsty = m;
    unsigned tx = minn + val, ty = maxn - val;
	for(unsigned i=1;;i++)
	{
        if((i>n)) return true;
        while(pmax[i][lsty] > tx) lsty--;
        if(smin[i][lsty + 1] < ty) break;
	}
	lsty = m;
	for(unsigned i=n;;i--)
	{
        if((!i)) return true;
        while(pmax[i][lsty] > tx) lsty--;
        if(smin[i][lsty + 1] < ty) break;
	}
    lsty = m;
	for(unsigned i=1;;i++)
	{
        if((i>n)) return true;
        while(pmin[i][lsty] < ty) lsty--;
        if(smax[i][lsty + 1] > tx) break;
	}
	lsty = m;
	for(unsigned i=n;;i--)
	{
        if((!i)) return true;
        while(pmin[i][lsty] < ty) lsty--;
        if(smax[i][lsty + 1] > tx) return false;
	}
}

__attribute__((always_inline,hot)) unsigned min(unsigned x, unsigned y) { return x < y ? x : y; }
__attribute__((always_inline,hot)) unsigned max(unsigned x, unsigned y) { return x > y ? x : y; }

int main()
{
    // ibf = (char *)mmap(0, 50000000, PROT_READ, MAP_PRIVATE, 0, 0);
    // n = vqread(); m = vqread();
    n = IO_gui(); IO_next();
    m = IO_gui(); IO_next();
	for(unsigned i=1;i<=n;i++)
	{
        pmin[i][0] = smin[i][m+1] = 0x3f3f3f3f;
		for(unsigned j=1;j<=m;j++)
		{
            smin[i][j] = smax[i][j] = IO_gui(); IO_next();
            pmin[i][j] = pmin[i][j-1] > smin[i][j] ? smin[i][j] : pmin[i][j-1];
            pmax[i][j] = pmax[i][j-1] < smin[i][j] ? smin[i][j] : pmax[i][j-1];
		}
        for(unsigned j=m;j>=1;j--)
        {
            if(smin[i][j+1] < smin[i][j]) smin[i][j] = smin[i][j+1];
            if(smax[i][j+1] > smax[i][j]) smax[i][j] = smax[i][j+1];
        }
		if(pmin[i][m] < minn) minn = pmin[i][m];
		if(pmax[i][m] > maxn) maxn = pmax[i][m];
	}
	unsigned l = 0, r = maxn - minn;
	while(l < r)
	{
		unsigned mid = (l + r) / 2;
		if(check(mid)) r = mid;
		else l = mid + 1;
	}
	printf("%d\n", l);
	return 0;
}
```

:::
