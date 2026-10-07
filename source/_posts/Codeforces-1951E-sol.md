---
title: 题解：CF1951E No Palindromes
date: 2026-10-05 14:50:07
updated: 2026-10-07 21:52:30
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---

# 题解：CF1951E No Palindromes

分讨。

1. 所有字符均相同：显然无解。
2. 如果整个字符串非回文：直接分为一组即可。
3. 字符串为偶回文串：
   - 如果其左半边非回文：直接分为两组即可。
   - 如果其左半边回文：则左半边在左右边删除/添加任意一个字符后，由于原字符串不是所有字符均相同，故得到的新的左半边非回文。那么按照分界点为正中间的右边一个字符分为两段即可。
4. 字符串为奇回文串：
   - 首先这种情况是比较复杂的。会出现 `aba,ababa,abababa,...`，这样都是无解的。同时，`aabaa,aaaabaaaa,aaaaabaaaaa` 这种也是无解的。但是 `aabaabaabaa` 并不是无解的（`aaba` `abaa` `baa`）。
   - 仿照偶回文串的处理方式是不好做的。两边并不好考虑。
   - 但是偶回文串的结论是可以使用的：长度为偶数的字符串如果不是所有字符均相同（下称平凡串），那么必然有解。
   - 注意到若有一段长度为奇数的非回文串，删除掉它后分出的两个字符串长度均为偶非平凡串，那么直接得到一个解。
   - 同时若空串也为平凡串，那么所有解中必然会有这样的奇非回文串。
   - 设空串为 $t$。由于空串比较特殊，讨论一下 $t$ 在最左边的情况（由対称性，最右边是一样的）。
   - 若还是无解，考虑从右往左第一个出现不同的位置，结合奇前缀均为回文串，整个串要么为 `abababa...aba`，要么为 `aaaa...aba...aaaa`。
   - 这两种情况都是无解的，所以可以得到若有解则必然有这样的解。那么就做完了。

结论是，若字符串非回文，直接得到解；若长度为偶数，则无解当且仅当所有字符均相同；若长度为奇数，则无解当且仅当字符串形如 `ababababa...aba` 或 `aaaa...aba...aaaa`，想得到解可以从左往右寻找第一个奇非回文串，将其分为一组，剩下的再分为一组即可。

可以不使用 Manacher（所有奇前缀都是回文的，这一条件太强了，可以直接判定），时间复杂度都是 $O(n)$。

分讨好玩！

:::info[rec&code]

[rec](https://codeforces.com/contest/1951/submission/393257260)。

```cpp
// 5342312 42312
// 2345 2345 2345 65 1234 1234 1234 53
// 1324354 23134 2431234 53423
// 12354 31243542 12312 3543425
// 3543423142345 4231243543212
// 1345 2456 3567 5432 3212 2342 34534231
#include <cstdio>
#include <string>
#include <iostream>
#include <algorithm>

using namespace std;

int main()
{
	int t;
	scanf("%d", &t);
	while(t--)
	{
		string str;
		cin >> str;
		int n = str.size();
		string rts = str; reverse(rts.begin(), rts.end());
		if(rts != str)
		{
			printf("YES\n1\n%s\n", str.c_str());
			continue;
		}
		auto als = [](const string &x) { for(int i=1;i<x.size();i++) if(x[i] != x[0]) return false; return true; };
		if(als(str))
		{
			printf("NO\n");
			continue;
		}
		if(n % 2 == 0)
		{
			string st = str.substr(0, n/2);
			string ts = str.substr(n/2);
			if(st != ts) printf("YES\n2\n%s %s\n", st.c_str(), ts.c_str());
			else printf("YES\n2\n%s %c%s\n", st.substr(0, st.size()-1).c_str(), st.back(), ts.c_str());
			continue;
		}
		if(als(str.substr(0, n/2)))
		{
			printf("NO\n");
			continue;
		}
		for(int i=2;i<=n;i++)
		{
			if(i == n)
			{
				printf("NO\n");
				break;
			}
			if(str[i] != str[i-2])
			{
				if(i % 2 == 1) i++;
				int l1 = i+1;
				string pl = str.substr(0, l1);
				string st = str.substr(l1);
				string ts = st; reverse(ts.begin(), ts.end());
				if(st != ts) printf("YES\n2\n%s %s\n", pl.c_str(), st.c_str());
				else
				{
					string vs = st.substr(0, st.size() / 2), sv = st.substr(st.size() / 2);
					if(vs != sv) printf("YES\n3\n%s %s %s\n", pl.c_str(), vs.c_str(), sv.c_str());
					else printf("YES\n3\n%s %s %c%s\n", pl.c_str(), vs.substr(0, vs.size()-1).c_str(), vs.back(), sv.c_str());
				}
				break;
			}
		}
	}
	return 0;
}
```

:::
