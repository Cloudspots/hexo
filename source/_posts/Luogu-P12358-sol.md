---
title: 题解：P12358 [eJOI 2024] 奶酪交易 / Cheese
date: 2026-7-16 15:06:56
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
首先，显然信息 $i\ j\ A\ B$ 的意思是 $v_i-v_j\equiv A\pmod B$（$v_i$ 为奶酪 $i$ 的价值，当 $B\neq -1$ 时）。而 $B=-1$ 时可以看作直接给了 $v_i-v_j$。

我们先考虑特殊性质。

## $B=2$

此时是给定奇偶性，我们带权并查集即可。

### 拓展：所有 $B$ 相同且不为 $-1$

此时是给定余数，带权并查集。

### 拓展：没有 $B=-1$

维护 $16$ 个带权并查集，分别维护权值之差模 $1,2,4,8,\dots,2^{15}$ 即可。

## $B=-1$

此时直接给定差值，带权并查集即可。

## 正解

像没有 $B=-1$ 的情况一样维护 $16$ 个带权并查集，再像 $B=-1$ 一样维护一个带权并查集即可。

$B=-1$ 直接看作 $B=+\infty$ 或 $B=998244353$（当然后者会被卡；这里只是为了方便理解 $B=-1$ 和 $B\neq -1$ 的相似性），然后仿照没有 $B=-1$ 的做法。

时间复杂度 $O((n+m\alpha(n))V)$，其中 $V=16$。轻微卡常。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/286398184)。

```cpp
// ZQOI（
/*
考虑实际上钱的差值

B = -1 是非常友善的，直接给了你差值。

B != -1 说明实际的价值差（jzc）和 A 的差是 B 的倍数（0 也是）。

具体地：v[i] 为 i 的价值。

B = -1:  v[j] - v[i] == A.
B != -1: v[j] - v[i] === A (mod B).

性质：B 一定是 2 的幂，并且不会很大（最多 2^15 = 32768）

---

B = 2 或 B = -1: 给出了每个 v[j] 和 v[i] 奇偶性是否相同，或者干脆数值相同。

使用一个种类并查集维护奇偶性和一个普通并查集维护值。

如果有数值相同，那么：

- 奇偶性并查集判相同：没有矛盾，普通并查集合并。
- 奇偶性并查集判不同：矛盾。
- 奇偶性并查集无法确定：没有矛盾，普通并查集和奇偶性并查集合并。

如果有奇偶性相同，那么：

- 普通并查集判相同：没有矛盾，无需操作，已合并过。
- 普通并查集无法确定，奇偶性并查集判不同：矛盾。
- 否则：没有矛盾，奇偶性并查集合并。

如果有奇偶性不同：

- 普通并查集判相同：矛盾。
- 奇偶性并查集判相同：矛盾。
- 否则：没有矛盾，奇偶性并查集合并。

---

启示我们使用普通并查集判相等和若干个并查集判二进制末尾。

---

我去，是不是要写带权并查集了，我没写过啊 :(，你们欺负我 :[

>_<

---

现在考虑正解做法。

Key Observation：我可以现场发明带权并查集。

如果遇到值相同：

- 先去所有 16 个带权并查集中判断是否有不等，如果有就矛盾。
- 否则，所有 16 个带权并查集合并，值并查集合并。

如果遇到差的余数：

- 如果余数不为 0 且值并查集判相同：矛盾。
- 如果余数为 0 且值并查集判相同：正确，但忽略。
- 如果 <= B 的并查集判矛盾：矛盾。
- 如果这个并查集判相同：正确，但忽略。
- 否则，所有 <= B 的并查集合并。

时间复杂度 O(n + mValpha(n))，其中 V = 16。显然可过。
*/
#include <cstdio>
#include <cassert>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

class valuedsu
{
public:
	long long val[500005];
	unsigned fa[500005], rk[500005];
	long long mod;
	valuedsu()
	{
		for(unsigned i=1;i<=500000;i++) fa[i] = i;
	}
	unsigned getfa(unsigned x) // 这下路径折半不是很好做了，做路径压缩吧
	{
		if(fa[x] == x)
		{
			assert(!val[x]);
			return x;
		}
		unsigned res = getfa(fa[x]);
		assert(fa[res] == res && fa[fa[x]] == res);
		val[x] = mod ? (val[x] + val[fa[x]]) % mod : val[x] + val[fa[x]];
		fa[x] = res;
		return res;
	}
	long long qval(unsigned x, unsigned y) // x - y
	{
		if(x == y) return 0;
		getfa(x); getfa(y);
		assert(fa[x] == fa[y] && fa[fa[x]] == fa[x] && !val[fa[x]]);
		return mod ? (val[x] + mod - val[y]) % mod : val[x] - val[y];
	}
	bool merge(unsigned x, unsigned y, long long v) // 声明 x - y === v
	{
		if(getfa(x) == getfa(y)) return qval(x, y) == v;
		// printf("[log] mod = %d, v[%d] - v[%d] => %d\n", mod, x, y, v);
		v -= val[x] - val[y] + mod;
		if(mod) v = (v + 2 * mod) % mod;
		x = fa[x]; y = fa[y];
		assert(!val[x] && !val[y] && fa[x] == x && fa[y] == y);
		if(rk[x] < rk[y])
		{
			fa[x] = y;
			val[x] = v;
		}
		else if(rk[y] < rk[x])
		{
			fa[y] = x;
			val[y] = mod ? (mod - v) % mod : -v;
		}
		else
		{
			fa[x] = y;
			rk[y]++;
			val[x] = v;
		}
		return true;
	}
} vals[17];

int main()
{
	// freopen("cheese.in", "r", stdin);
	// freopen("cheese.out", "w", stdout);
	unsigned n, m;
	scanf("%d%d", &n, &m);
	for(unsigned i=0;i<16;i++) vals[i].mod = (1u << i);
	// vals[16].mod = 998244353;
	while(m--)
	{
		unsigned i, j, a, b;
		scanf("%d%d%d%d", &i, &j, &a, &b);
		// printf(vals[3].getfa(2) == vals[3].getfa(3) ? "Connected\n" : "Disconnected\n");
		if(b == -1) // INF
		{
			if(vals[16].getfa(i) == vals[16].getfa(j))
			{
				if(vals[16].qval(i, j) == a) printf("1\n");
				else printf("0\n");
				continue;
			}
			bool flag = true;
			for(unsigned k=15;k<=16;k--)
			{
				if(vals[k].getfa(i) == vals[k].getfa(j) && vals[k].qval(i, j) != a % (1 << k))
				{
					// if(k == 3) __debugbreak();
					// printf("[i = %d, j = %d] k = %d Failed. qval = %d, expected %d\n", i, j, k, vals[k].qval(i, j), a % (1 << k));
					flag = false;
					break;
				}
			}
			if(!flag)
			{
				printf("0\n");
				continue;
			}
			vals[16].merge(i, j, a);
			for(unsigned k=15;k<=16;k--) vals[k].merge(i, j, a % (1 << k));
			printf("1\n");
		}
		else // not inf
		{
			unsigned g = __lg(b);
			if(vals[16].getfa(i) == vals[16].getfa(j) && (vals[16].qval(i, j) % b + b) % b != a % b)
			{
				printf("0\n");
				continue;
			}
			bool flag = true;
			for(unsigned k=g;k<=16;k--)
			{
				if(vals[k].getfa(i) == vals[k].getfa(j) && vals[k].qval(i, j) != a % (1 << k))
				{
					// printf("k = %d Failed. qval = %d, expected %d\n", k, vals[k].qval(i, j), a % (1 << k));
					flag = false;
					break;
				}
			}
			if(!flag)
			{
				printf("0\n");
				continue;
			}
			for(unsigned k=g;k<=16;k--)
			{
				// if(i == 1 && j == 3 && a == 1 && b == 8) __debugbreak();
				vals[k].merge(i, j, a % (1 << k));
			}
			printf("1\n");
		}
		// printf(vals[3].getfa(2) == vals[3].getfa(3) ? "Connected\n" : "Disconnected\n");
	}
	return 0;
}
```

:::