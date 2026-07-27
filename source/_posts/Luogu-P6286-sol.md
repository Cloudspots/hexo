---
title: 题解：P6286 [COCI 2016/2017 #1] Cezar
date: 2025-10-4 15:52:55
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
> 不是，为啥要用 Trie 啊……

首先我们根据给出的序号对字符串进行排序，比如样例 $1$ 变为 `bc` 和 `ab`，样例 $2$ 不变，样例 $3$ 变为 `ccc`，`ddd`，`bbb`。

考虑有序的充要条件（$<$ 代表按照加密后的字典序下的排序）：$s_1<s_2<s_3<\dots<s_n$。接着考虑字典序的比较：显然加密后相等等价于加密前相等，所以判断一个字符串是否是另一个的前缀是和加密前一样的，找到第一个不同的字符也是一样的。唯一不同的就是比较不同的字符，但是只需要对一个字符进行比较。

我们就得到了最多 $n-1$ 条限制（为什么可能不到 $n-1$ 条呢，因为前面的字符串是后面的前缀就相当于没有限制），每条都形如“某一个字符排在另外某个字符前面”。拓扑排序板子。然而我们得到的拓扑序列是“xx 字符应当排在 yy 字符之后”，我们要对结果进行逆置换来得到最终答案。

无解只有两种情况：后面的字符串是前面的前缀，和最终的图不是 DAG。都很好处理。

时间复杂度？显然是线性（$\displaystyle O\left(\sum \lvert s \rvert\right)$）的。

```cpp
#include <cstdio>
#include <string>
#include <iostream>
#include <vector>
#include <queue>

using namespace std;

string _s[105], s[105];
int a[105];

vector<int> web[30];
int ind[30];
int ans[30];

int main()
{
	#ifndef ONLINE_JUDGE
	freopen("753294J.in", "r", stdin);
	freopen("753294J.out", "w", stdout);
	#endif
	int n;
	scanf("%d", &n);
	for(int i=1;i<=n;i++)
	{
		cin >> _s[i];
	}
	for(int i=1;i<=n;i++)
	{
		int a;
		scanf("%d", &a);
		s[i] = _s[a];
	}
	for(int i=1;i<n;i++)
	{
		if(s[i+1].size() > s[i].size() && s[i+1].substr(0, s[i].size()) == s[i]) continue;
		if(s[i].size() > s[i+1].size() && s[i].substr(0, s[i+1].size()) == s[i+1])
		{
			printf("NE\n");
			return 0;
		}
		for(int j=0;;j++)
		{
			if(s[i][j] != s[i+1][j])
			{
				web[s[i][j] - 'a'].push_back(s[i+1][j] - 'a');
				ind[s[i+1][j] - 'a']++;
                // printf("%c -> %c\n", s[i][j], s[i+1][j]);
				break;
			}
		}
	}
	queue<int> q;
	for(int i=0;i<26;i++)
	{
		if(ind[i] == 0) q.push(i);
	}
	int cur = 0;
	while(!q.empty())
	{
		int u = q.front();
		ans[u + 1] = cur++;
		q.pop();
		for(int v : web[u])
		{
			if(!--ind[v]) q.push(v);
		}
	}
	if(cur == 26)
	{
		printf("DA\n");
		for(int i=1;i<=26;i++)
		{
			printf("%c", ans[i] + 'a');
		}
	}
	else printf("NE\n");
	return 0;
}
```

> 这题 $800$ 吧。