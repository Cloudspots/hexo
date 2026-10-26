---
title: 题解：P10785 [NOI2024] 集合
date: 2026-10-19 19:46:47
updated: 2026-10-19 19:46:47
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P10785 [NOI2024] 集合

> buff 叠满：结论猜错、哈希不会、码长超限，成功拿下 $0\mathrm{pts}$（去掉最后一点 $80\mathrm{pts}$）（猜错的结论是两个集合序列等价只需要看两两之间的交集大小）。

---

考虑这个变换是啥啊。

因为它是个排列所以它是个双射。

于是可以很容易（并非）地猜出一个结论：设 $S_i$ 为 $i$ 在集合序列中出现的下标集合，则 $\{S\}$ 相同等价于两个集合序列等价。

证明是显然的。

然后考虑到询问具有单调性，$[l,r]$ 合法则所有子区间合法，可以考虑双指针预处理。

集合哈希可以支持插入、删除，然后做完了，时间复杂度 $O(n+q)$。

代码极其好写。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/304206344)。

```cpp
// Luogu-P10785-sol
#include <cstdio>
#include <random>
#include <algorithm>

using namespace std;

mt19937_64 mt(random_device{}());
unsigned long long pval[200005];
unsigned long long sta[600005], stb[600005], vl[200005];

class tri { public: int a, b, c; } a[200005], b[200005];

char ibf[100000005];
unsigned li = 0;
unsigned qread() { unsigned res = 0; char ch; while((ch = ibf[li++]) < '0' || ch > '9'); do { res = res * 10 + ch - '0'; } while((ch = ibf[li++]) >= '0' && ch <= '9'); return res; }

int main()
{
	fread(ibf, 1, sizeof ibf, stdin);
	int n, m, q;
	n = qread(); m = qread(); q = qread();
	// scanf("%d%d%d", &n, &m, &q);
	for(int i=1;i<=n;i++)
	{
		a[i].a = qread(); a[i].b = qread(); a[i].c = qread();
		// scanf("%d%d%d", &a[i].a, &a[i].b, &a[i].c);
	}
	for(int i=1;i<=n;i++)
	{
		b[i].a = qread(); b[i].b = qread(); b[i].c = qread();
		// scanf("%d%d%d", &b[i].a, &b[i].b, &b[i].c);
	}
	for(int i=1;i<=n;i++)
	{
		pval[i] = mt();
	}
	int l = 1;
	unsigned long long s1 = 0, s2 = 0;
	for(int i=1;i<=n;i++)
	{
		s1 -= sta[a[i].a];
		s1 -= sta[a[i].b];
		s1 -= sta[a[i].c];
		s2 -= stb[b[i].a];
		s2 -= stb[b[i].b];
		s2 -= stb[b[i].c];
		sta[a[i].a] ^= pval[i];
		sta[a[i].b] ^= pval[i];
		sta[a[i].c] ^= pval[i];
		stb[b[i].a] ^= pval[i];
		stb[b[i].b] ^= pval[i];
		stb[b[i].c] ^= pval[i];
		s1 += sta[a[i].a];
		s1 += sta[a[i].b];
		s1 += sta[a[i].c];
		s2 += stb[b[i].a];
		s2 += stb[b[i].b];
		s2 += stb[b[i].c];
		while(s1 != s2)
		{
			s1 -= sta[a[l].a];
			s1 -= sta[a[l].b];
			s1 -= sta[a[l].c];
			s2 -= stb[b[l].a];
			s2 -= stb[b[l].b];
			s2 -= stb[b[l].c];
			sta[a[l].a] ^= pval[l];
			sta[a[l].b] ^= pval[l];
			sta[a[l].c] ^= pval[l];
			stb[b[l].a] ^= pval[l];
			stb[b[l].b] ^= pval[l];
			stb[b[l].c] ^= pval[l];
			s1 += sta[a[l].a];
			s1 += sta[a[l].b];
			s1 += sta[a[l].c];
			s2 += stb[b[l].a];
			s2 += stb[b[l].b];
			s2 += stb[b[l].c];
			l++;
		}
		vl[i] = l;
	}
	while(q--)
	{
		int l, r;
		// scanf("%d%d", &l, &r);
		l = qread(); r = qread();
		printf(vl[r] <= l ? "Yes\n" : "No\n");
	}
	return 0;
}
// 集合哈希：小集合异或、大集合求和，自然溢出，随机赋权。
```

:::
