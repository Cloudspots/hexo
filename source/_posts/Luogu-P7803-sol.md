---
title: P7803 [JOI Open 2021] 杂交 / Crossing 不用哈希
date: 2026-10-26 23:55:07
updated: 2026-10-26 23:55:07
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# P7803 [JOI Open 2021] 杂交 / Crossing 不用哈希

> 怎么 lihaochen 哈希被卡了，那我不用哈希你不炸了！！

---

考虑这个运算是什么。

将字符串视为模三意义下的序列，那么 $x,y$ 进行操作后即为 $(x,y)\equiv -x-y\pmod 3$。

考虑只有三个串 $x,y,z$，且 $(x,y)$ 是关于 $x,y$ 的线性组合，同时结果模 $3$，那么说明最多有 $3^3=27$ 种结果。同时注意到系数之和必然为 $1$（在模 $3$ 意义下），所以系数只能是下面九种（$\texttt +$ 代表 $1$，$\texttt -$ 代表 $-1$，$\texttt 0$ 代表 $0$）：

- $\texttt{++-}$；
- $\texttt{+-+}$；
- $\texttt{-++}$；
- $\texttt{00+}$；
- $\texttt{0+0}$；
- $\texttt{+00}$；
- $\texttt{--0}$；
- $\texttt{-0-}$；
- $\texttt{0--}$；

经过验证都是可以取到的。

同时每一位都是独立的，所以我们可以对于每一位，处理出可能是上面九种变换中的哪些；只要存在一种变换使得对于每一位都是合法的，最终就有解。

于是可以使用位掩码处理这个，使用数据结构维护九位的二进制数，每一位分别代表一种变换是否合法，只需要维护全局与就可以了。

但是发现这样并不能直接区间修改，因为 $s_A,s_B,s_C$ 对应的位可能不同，此时即使 $T$ 相同对应的位掩码也不同。所以注意到 $s_A,s_B,s_C$ 在某一位中最多有 $3^3=27$ 种不同可能性，那么开 $27$ 个数据结构即可。

数据结构可以用线段树或者 ODT，复杂度均为 $O(n\log n)$，带 $3^3=27$ 的常数，好处是不会被卡哈希。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/306118566)。

```cpp
/*
 |0 1 2
-+-----
0|0 2 1
1|2 1 0
2|1 0 2

∴ (x,y) -> -x-y

结合律？

((a,b),c) = -(-a-b)-c =  a+b-c
(a,(b,c)) = -a-(-b-c) = -a+b+c

并没有结合律。

只有交换律没有结合律，这是什么【】【】【】【】东西

考虑到这个一定是线性的。

将数字 k 描述为操作 +k。

That's Linear!

但是这不能表述为复合因为没有结合律。

【再次【】【】日本出题人】

((a,b),(b,c)) = -(-a-b)-(-b-c) = a+c-b = ((a,c),b)

欸？

好像很牛。

((a,b),((b,c),d)) = a+b-(b+c-d) = a+c-d = ((a,c),d)

欸？？

太有意思了。

每个位置的系数难道不是，(-1)^(所在的括号深度) 吗

那这个很牛了。

转为括号问题？

不妨钦定可以任意赋权。

1010
1102
0100

为什么无法转变为 0000.

考虑第一个行系数一定为 0（因为第三列），然后第二行（因为第二列）一定为 0，然后爆炸。

等等好像也不能任意赋权。

需要保证和为 1.

（如果能凑出全 0 就好了）

哦初始只有三个串串吗

/bangbangt

可行的系数就是：

- - 0
- 0 -
0 - -
- + +
+ - +
+ + -
+ 0 0
0 + 0
0 0 +

有且仅有这些是可行的

……是不是做完了？

考虑是区间赋值，上个 ODT，然后就做完了。

甚至不用 ODT。对于每个位置可以用一个 bitmask 表示可能的系数，然后全局 & 即可。

区间赋值，全局 &。

哦还有小细节就是 a, b, c 若对应位置不同则处理方法也不同，那就开 3 * 3 * 3 个线段树。
*/
#include <cstdio>
#include <string>
#include <iostream>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };
const auto getr = [](int l, int r, int id) { return id + ((l + r) / 2 - l + 1) * 2; };

class segtree
{
public:
	class node { public: unsigned vset, zand; bool pexist; } nodes[400005];
	void pushdown(int l, int r, int id) { if(nodes[id].vset != 114514) { nodes[id + 1].vset = nodes[id + 1].zand = (nodes[id + 1].pexist ? nodes[id].vset : 0x1ff); nodes[getr(l, r, id)].vset = nodes[getr(l, r, id)].zand = (nodes[getr(l, r, id)].pexist ? nodes[id].vset : 0x1ff); nodes[id].vset = 114514; } }
	void pushup(int l, int r, int id) { nodes[id].zand = nodes[id + 1].zand & nodes[getr(l, r, id)].zand; nodes[id].pexist = nodes[id + 1].pexist || nodes[getr(l, r, id)].pexist; if(!nodes[id].pexist) nodes[id].zand = 0x1ff; }
	void build(int n, const string &x, const string &y, const string &z, char px, char py, char pz) { U([&](auto &&self, int l, int r, int id) -> void { if(l == r) { nodes[id] = {114514, 0x1ff, x[l - 1] == px && y[l - 1] == py && z[l - 1] == pz}; return; } self(self, l, (l + r) / 2, id + 1); self(self, (l + r) / 2 + 1, r, getr(l, r, id)); pushup(l, r, id); })(1, n, 1); }
	void vset(int n, int L, int R, int val) { U([&](auto &&self, int l, int r, int vl, int vr, int id) -> void { if(l == vl && r == vr || !nodes[id].pexist) { nodes[id].vset = nodes[id].zand = (nodes[id].pexist ? val : 0x1ff); return; } pushdown(l, r, id); if(vl <= (l + r) / 2) self(self, l, (l + r) / 2, vl, min(vr, (l + r) / 2), id + 1); if(vr > (l + r) / 2) self(self, (l + r) / 2 + 1, r, max(vl, (l + r) / 2 + 1), vr, getr(l, r, id)); pushup(l, r, id); })(1, n, L, R, 1); }
	unsigned qaand() { return nodes[1].pexist ? nodes[1].zand : 0x1ff; }
} segs[30]; // 91MB

int main()
{
	int n;
	scanf("%d", &n);
	string sa, sb, sc;
	cin >> sa >> sb >> sc;
	auto cmask = [](char a, char b, char c, char t) -> unsigned
	{
		int va = (a == 'J' ? 0 : (a == 'O' ? 1 : 2));
		int vb = (b == 'J' ? 0 : (b == 'O' ? 1 : 2));
		int vc = (c == 'J' ? 0 : (c == 'O' ? 1 : 2));
		int vt = (t == 'J' ? 0 : (t == 'O' ? 1 : 2));
		unsigned res = 0;
		if((va + vb + vt) % 3 == 0) res |= 1 << 0;
		if((va + vc + vt) % 3 == 0) res |= 1 << 1;
		if((vb + vc + vt) % 3 == 0) res |= 1 << 2;
		if((vc + vt) % 3 == (va + vb) % 3) res |= 1 << 3;
		if((vb + vt) % 3 == (va + vc) % 3) res |= 1 << 4;
		if((va + vt) % 3 == (vb + vc) % 3) res |= 1 << 5;
		if(va == vt) res |= 1 << 6;
		if(vb == vt) res |= 1 << 7;
		if(vc == vt) res |= 1 << 8;
		// printf("returned %u\n", res);
		return res;
	};
	auto qid = [](char a, char b, char c) -> unsigned { return (a == 'J' ? 0 : (a == 'O' ? 1 : 2)) * 9 + (b == 'J' ? 0 : (b == 'O' ? 1 : 2)) * 3 + (c == 'J' ? 0 : (c == 'O' ? 1 : 2)); };
	for(char x : {'J', 'O', 'I'})
	{
		for(char y : {'J', 'O', 'I'})
		{
			for(char z : {'J', 'O', 'I'})
			{
				segs[qid(x, y, z)].build(n, sa, sb, sc, x, y, z);
			}
		}
	}
	int q;
	scanf("%d", &q);
	string t;
	cin >> t;
	for(int i=1;i<=n;i++)
	{
		segs[qid(sa[i-1], sb[i-1], sc[i-1])].vset(n, i, i, cmask(sa[i-1], sb[i-1], sc[i-1], t[i-1]));
	}
	auto qvalid = []() -> bool { unsigned vm = 0x1ff; for(int i=0;i<27;i++) if(!(vm &= segs[i].qaand())) return false; return true; };
	printf(qvalid() ? "Yes\n" : "No\n");
	while(q--)
	{
		int l, r;
		char c;
		scanf("%d%d %c", &l, &r, &c);
		for(char x : {'J', 'O', 'I'})
		{
			for(char y : {'J', 'O', 'I'})
			{
				for(char z : {'J', 'O', 'I'})
				{
					segs[qid(x, y, z)].vset(n, l, r, cmask(x, y, z, c));
				}
			}
		}
		printf(qvalid() ? "Yes\n" : "No\n");
	}
	return 0;
}
```

:::
