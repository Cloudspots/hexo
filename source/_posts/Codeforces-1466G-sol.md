---
title: 题解：CF1466G Song of the Sirens
date: 2026-10-11 13:14:01
updated: 2026-10-11 13:14:01
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---

# 题解：CF1466G Song of the Sirens

> 简单题，绿！

---

一般来讲这种“分形计数”问题都比较好想，但是写起来可能较为麻烦。可能有一些细节。

对于这个题，首先假设 $\lvert s_0\rvert\ge \lvert w\rvert$。那么匹配可以分为两类：$w$ 为 $s_0$ 的子串和 $w$ 为 $s_0+t_i+s_0$ 的子串且经过 $s_0$。

前者是比较好做的，考虑到整个串中有 $2^k$ 个 $s_0$，那么 $w$ 在 $s_0$ 中的每次出现都会带来 $2^k$ 的出现次数。可以用 KMP 或者哈希。

后者也不难，考虑到这个相当于，选中 $w$ 的一个位置 $i$，设其左边为 $w_l$ 右边为 $w_r$（均不包含 $i$），那么要求 $w_l$ 为 $s_0$ 的后缀且 $w_r$ 为 $s_0$ 的前缀，此时的贡献为 $s_k$ 中原本在 $t$ 中的字符 $w_i$ 的数量，也就是 $\displaystyle\sum_{1\le j\le k}[t_j=w_i]2^{k-j}$。这个可以预处理。

那么这样就可以做到 $O(\lvert s_0\rvert)$ 的时间复杂度单次询问。

考虑 $\lvert s_0\rvert < \lvert w\rvert$。注意到若从 $s_1$ 开始则整个问题的结构不变。那么我们就可以不断扩充 $s_0$，换句话说找到最小的 $i$ 使得 $\lvert s_i\rvert \ge \lvert w\rvert$。

对于 $2^k$ 的处理是显然的，转化为 $2^{k-i}$ 即可。而对于后面的 $\sum$ 的处理可以计算前缀和乘 $2^i$ 解决。

那么扩充和计算时间复杂度均为 $O(\lvert w\rvert+\lvert s_0\rvert)$，处理贡献时间复杂度是 $O(\Sigma+\log n)$，预处理前缀和时间复杂度 $O(n\Sigma)$，预处理哈希逆元 $O(\log p)$，总时间复杂度即为 $O(n\Sigma+\sum \lvert w\rvert + q(\lvert s_0\rvert+\Sigma+\log n)+\log p)$，去掉无关紧要的项之后可以看作 $O(n\Sigma +\sum \lvert w\rvert + q\lvert s_0\rvert)$，可以通过。

:::info[rec&code]

[rec](https://codeforces.com/contest/1466/submission/393849383)。

```cpp
/*
感觉并不是很难。

可以转化为这样一个问题，有一个通配符，求这个通配符是每一个字符的时候匹配个数。

这是好做的。找到模板串中它的所有出现位置并哈希匹配即可。
*/
#include <string>
#include <cstdio>
#include <random>
#include <cassert>
#include <iostream>
#include <algorithm>

using namespace std;


mt19937_64 mt(random_device{}());
const unsigned long long mod1 = 998244853, mod2 = 1000000009; // 没有人会卡这个！
const unsigned long long b1 = uniform_int_distribution<int>(2, mod1-1)(mt), b2 = uniform_int_distribution<int>(2, mod2-1)(mt);
constexpr long long qpow(long long x, long long y, long long m) { long long res = 1; do { if(y & 1) res = res * x % m; x = x * x % m; } while(y >>= 1); return res; }
const unsigned long long r1 = qpow(b1, mod1-2, mod1), r2 = qpow(b2, mod2-2, mod2);

unsigned long long h1x[2000005], h2x[2000005], v2ray[2000005];
unsigned long long rsum[100005][30]; // 22MB
unsigned long long vrs[30];

class hasher
{
public:
	unsigned long long h1, h2;
	int len;
	hasher() : h1(0), h2(0), len(0) {}
	hasher(const hasher &r) : h1(r.h1), h2(r.h2), len(r.len) {}
	hasher(const string &s) { h1 = 0; h2 = 0; len = s.size(); for(int i=0;i<s.size();i++) { h1 = (h1 * b1 + (s[i] - 'a')) % mod1; h2 = (h2 * b2 + (s[i] - 'a')) % mod2; } }
	void push_back(char ch) { h1 = (h1 * b1 + ch - 'a') % mod1; h2 = (h2 * b2 + ch - 'a') % mod2; len++; }
	void push_front(char ch) { h1 = (h1 + h1x[len] * (ch - 'a')) % mod1; h2 = (h2 + h2x[len] * (ch - 'a')) % mod2; len++; }
	void pop_back(char ch) { len--; h1 = (h1 - (ch - 'a') + mod1) % mod1 * r1 % mod1; h2 = (h2 - (ch - 'a') + mod2) % mod2 * r2 % mod2; }
	void pop_front(char ch) { len--; h1 = (h1 - h1x[len] * (ch - 'a') % mod1 + mod1) % mod1; h2 = (h2 - h2x[len] * (ch - 'a') % mod2 + mod2) % mod2; }
	friend bool operator==(const hasher &x, const hasher &y) { return x.h1 == y.h1 && x.h2 == y.h2 && x.len == y.len; }
};

int main()
{
	h1x[0] = h2x[0] = v2ray[0] = 1;
	for(int i=1;i<=2000000;i++) h1x[i] = h1x[i-1] * b1 % mod1;
	for(int i=1;i<=2000000;i++) h2x[i] = h2x[i-1] * b2 % mod2;
	for(int i=1;i<=2000000;i++) v2ray[i] = v2ray[i-1] * 2 % 1000000007;
	int n, q;
	scanf("%d%d", &n, &q);
	string s0, t;
	cin >> s0 >> t;
	t = ' ' + t;
	for(int i=1;i<=n;i++)
	{
		for(int j=0;j<26;j++)
		{
			rsum[i][j] = rsum[i-1][j] * 2 % 1000000007;
		}
		rsum[i][t[i] - 'a'] = (rsum[i][t[i] - 'a'] + 1) % 1000000007;
	}
	while(q--)
	{
		int k;
		scanf("%d", &k);
		string str;
		cin >> str;
		string vbase = s0;
		int vc = 0;
		while(vbase.size() < str.size() && vc < k)
		{
			vbase = vbase + t[++vc] + vbase;
			// vc++;
		}
		if(vbase.size() < str.size())
		{
			printf("0\n");
			continue;
		}
		// in.
		// i don't want to write kmp anyway so hashing is always the best XD
		// so what
		// hash is not easy to write too :(
		// I DON'T LIKE STRING ALGORITHMS AT ALL > <
		// just implement it and get AC!
		// (you will win! this is just a *2600)
		//
		// Wait, what?
		// .
		// yeah oh what oh but wait what's this ho ? oh s**t what's that .
		// .
		// so stop writine your english homework here.
		// (yeah. yeah. exactly.)
		// but it's not my homework today??????
		// (and so hash it now.)
		hasher tgt = str;
		hasher lx = vbase.substr(0, str.size());
		long long ans = 0;
		if(tgt == lx) ans = v2ray[k - vc];
		for(int i=str.size();i<vbase.size();i++)
		{
			lx.push_back(vbase[i]);
			lx.pop_front(vbase[i-str.size()]);
			if(tgt == lx) ans = (ans + v2ray[k - vc]) % 1000000007;
		}
		// i just... get a little bit tired.
		// i should sleep more :(
		// sleepsleepsleep
		// but i'm soooo tired. can i really solve this problem today?
		// efficiency: 0.01%
		for(int i=0;i<26;i++)
		{
			vrs[i] = (rsum[k][i] - rsum[vc][i] * v2ray[k - vc] % 1000000007 + 1000000007) % 1000000007;
		}
		lx.pop_front(vbase[vbase.size() - str.size()]);
		hasher rx;
		hasher ly = str.substr(0, str.size() - 1), ry;
		if(lx == ly && rx == ry) ans = (ans + vrs[str.back() - 'a']) % 1000000007;
		for(int i=1;i<str.size();i++)
		{
			rx.push_back(vbase[i-1]);
			lx.pop_front(vbase[vbase.size() - str.size() + i]);
			ly.pop_back(str[str.size() - i - 1]);
			ry.push_front(str[str.size() - i]);
			if(lx == ly && rx == ry) ans = (ans + vrs[str[str.size()-i-1] - 'a']) % 1000000007;
		}
		printf("%lld\n", ans);
	}
	return 0;
}
// qaqxqaqyqaqxqaqzqaqxqaqyqaqxqaq
```

:::
