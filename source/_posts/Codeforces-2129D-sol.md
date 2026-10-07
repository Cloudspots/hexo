---
title: 题解：CF2129D Permutation Blackhole
date: 2026-10-05 11:57:11
updated: 2026-10-07 21:52:03
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---

# 题解：CF2129D Permutation Blackhole

考虑到将一个格子涂黑之后它两边都变得无关了。具体地，左边的格子不会影响到右边，右边的格子也不会影响到左边，但是左右两边都可能影响到中间。

暴力设 $f_{l,r,x,y}$ 表示 $[l,r]$，对于 $l-1$ 有 $x$ 贡献，$r+1$ 有 $y$ 贡献。转移需要枚举分界点和左右两边贡献，$O(n^2)$，总共 $O(n^6)$，Jeff 来了都过不了。

注意到每个节点被贡献到的次数是 $O(\log n)$ 的（本题中最多为 $14$），所以可以优化到 $O(n^3\log^3 n)$。

稍微注意以下常数。实际上并不是很卡常。

:::info[rec&code]

[rec](https://codeforces.com/contest/2129/submission/393245956)。

```cpp
#include <cstdio>
#ifdef AFTERWSXBIRTHDAY
#include <signal.h>
#define __debugbreak() raise(SIGTRAP)
#endif

using namespace std;

long long f[105][105][20][20];
int a[105];
long long fact[105], ifact[105];

long long qpow(long long x, long long y) { long long ans = 1; do { if(y & 1) ans = ans * x % 998244353; x = x * x % 998244353; } while(y >>= 1); return ans; }

int main()
{
	fact[0] = 1;
	for(int i=1;i<=102;i++) fact[i] = fact[i-1] * i % 998244353;
	ifact[102] = qpow(fact[102], 998244351);
	for(int i=101;i>=0;i--) ifact[i] = ifact[i+1] * (i+1) % 998244353;
	auto comb = [](int x, int y) { return x < y || y < 0 ? 0 : fact[x] * ifact[y] % 998244353 * ifact[x-y] % 998244353; };
	int t;
	scanf("%d", &t);
	while(t--)
	{
		int n;
		scanf("%d", &n);
		bool fg = false;
		for(int i=1;i<=n;i++)
		{
			scanf("%d", a + i);
			if(a[i] > 14) fg = true;
		}
		if(fg)
		{
			printf("0\n");
			continue;
		}
		a[0] = a[n+1] = 0;
		for(int i=1;i<=n+1;i++)
		{
			for(int j=1;j<=n+1;j++)
			{
				for(int x=0;x<=19;x++)
				{
					for(int y=0;y<=19;y++)
					{
						f[i][j][x][y] = 0;
					}
				}
			}
		}
		for(int i=1;i<=n+1;i++) f[i][i-1][0][0] = f[i][i-1][0][19] = f[i][i-1][19][0] = f[i][i-1][19][19] = 1;
		for(int l=n;l>=1;l--)
		{
			for(int r=l;r<=n;r++)
			{
				// if(l == 1 && r == 2) __debugbreak();
				// bool f1l = a[l-1] == -1, f1r = a[r+1] == -1;
				for(int x=0;x<=14;x++)
				{
					for(int y=0;y<=14;y++)
					{
						for(int m=l;m<=r;m++)
						{
								// if(l == 1 && r == 2 && x == 0 && y == 0 && m == 2) __debugbreak();
							int gl = (l > 1 && (r == n || m - l <= r - m) ? 1 : 0), gr = (r < n && (l == 1 || m - l > r - m) ? 1 : 0);
							if(x < gl || y < gr) continue;
							if(a[m] == -1) f[l][r][x][y] = (f[l][r][x][y] + f[l][m-1][x-gl][19] * f[m+1][r][19][y-gr] % 998244353 * comb(r-l, m-l)) % 998244353;
							else
							{
								for(int v=0;v<=a[m];v++)
								{
									f[l][r][x][y] = (f[l][r][x][y] + f[l][m-1][x-gl][v] * f[m+1][r][a[m]-v][y-gr] % 998244353 * comb(r-l, m-l)) % 998244353;
								}
							}
						}
						f[l][r][x][19] = (f[l][r][x][19] + f[l][r][x][y]) % 998244353;
						f[l][r][19][y] = (f[l][r][19][y] + f[l][r][x][y]) % 998244353;
						f[l][r][19][19] = (f[l][r][19][19] + f[l][r][x][y]) % 998244353;
						// if(f[l][r][x][y]) printf("f[%d][%d][%d][%d] = %lld\n", l, r, x, y, f[l][r][x][y]);
					}
				}
			}
		}
		printf("%lld\n", f[1][n][19][19]);
	}
	return 0;
}
```

:::
