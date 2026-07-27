---
title: 题解：AT_abc425_f [ABC425F] Inserting Process
date: 2025-9-28 21:55:44
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
$N\le 22$，显然是状压 dp。根据套路，使用二进制第 $i$ 位来代表 $T$ 的第 $i$ 位选没选。

状态转移方程？注意到可能有重复计数（多个前驱状态代表的字符串相同但是掩码不同），需要去重。这里使用一个数组记录每个状态的最小与其代表字符串相同的状态编号，使用这个来计算，然后使用 STL 的 `set` 或 `unordered_set` 去重即可。虽然 `set` 会多一个 $\log$，但是实际上因为 $N$ 很小所以和 `unordered_set` 差距不大。

差评：本机样例三 $9\mathrm{s}$，提交过了。

:::info[代码&提交记录]

```cpp
#include <cstdio>
#include <string>
#include <vector>
#include <iostream>
#include <algorithm>
#include <set>

using namespace std;

int f[(1 << 22) + 5];
int lst[(1 << 22) + 5];

int main()
{
	int n;
	scanf("%d", &n);
	string str;
	cin >> str;
	f[0] = 1;
	for (int i = 1; i < (1 << n); i++)
	{
		vector<int> vt;
		for (int j = 0; j < n; j++)
		{
			if (i & (1 << j)) vt.push_back(j);
		}
		int sum = 0, cur = 0;
		for (int j = 0; j < n; j++)
		{
			if (cur < vt.size() && str[j] == str[vt[cur]])
			{
				sum += (1 << j);
				cur++;
			}
		}
		lst[i] = sum;
		set<int> us;
		for (int j : vt)
		{
			us.insert(lst[i ^ (1 << j)]);
		}
		for (int x : us)
		{
			f[i] = (f[i] + f[x]) % 998244353;
		}
	}
	printf("%d\n", f[(1 << n) - 1]);
	return 0;
}
```

[sub](https://atcoder.jp/contests/abc425/submissions/69689956)。

:::