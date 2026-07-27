---
title: 题解：P13108 [GCJ 2019 #1A] Alien Rhyme
date: 2025-10-5 18:33:03
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
::anti-ai[催审核/fendou，明天就更新咕值了]

下面把押韵称为配对。

将字符串翻转可以把问题转化为前缀的问题。考虑 Trie。对所有字符串建出 Trie 树，我们考虑贪心。

性质：如果有两个字符串配对，那么在可能的情况下，应当选尽量长的前缀。这是因为，如果选比较短的，可能会和其它字符串冲突。

所以，对 Trie 树做 dfs，能在尽量深的地方配对就配对，不能就留到父节点配对。所以 dfs 有两个返回值：一个是目前还有多少个字符串没有配对，另一个是已经配对了多少个字符串。当然可以省略其中一个，但是为了便于理解就都存了，这题又不卡常。

dfs 大概是这样的。

```cpp
pair<int, int> dfs(node *rt, bool isr = true) // isr：是否是根节点（这个节点不能配对）
{
	int sz = rt->cnt; // cnt 代表 这个节点是多少个字符串的结尾字符。我不知道可不可能有相同的字符串，就开了 int。
	pair<int, int> ans; // first：还剩下多少个字符串没有配对。second：配对了多少个（也就是对数的两倍）字符串。
	for(const auto &[_, ch] : rt->ch)
	{
		auto res = dfs(ch, false);
		ans.second += res.second; // 子树上配对的当然也要算上。
		sz += res.first; // 子树的遗留屎山
		delete ch; // 是这样的，因为有多测，并且只需要一遍 dfs，dfs 完就直接删库跑路
	}
	rt->cnt = 0;
	rt->ch.clear(); // 同上，进行清理
	if(!isr)
	{
		if(sz >= 2) // 如果遗留屎山可以配对
		{
			ans.second += 2;
			ans.first = sz - 2;
		}
		else ans.first = sz; // 否则不能配对
	}
	return ans;
}
```

:::info[总代码&提交记录]
```cpp
#include <cstdio>
#include <vector>
#include <string>
#include <iostream>
#include <algorithm>
#include <map>
#include <unordered_map>
#include <utility>

using namespace std;

class node
{
public:
	int cnt = 0;
	map<char, node *> ch;
} *rt = new node;

void insert(const string &str)
{
	auto root = rt;
	for(char ch : str)
	{
		if(root->ch.count(ch)) root = root->ch[ch];
		else root = root->ch[ch] = new node;
	}
	root->cnt++;
}

pair<int, int> dfs(node *rt, bool isr = true)
{
	int sz = rt->cnt;
	pair<int, int> ans;
	for(const auto &[_, ch] : rt->ch)
	{
		auto res = dfs(ch, false);
		ans.second += res.second;
		sz += res.first;
		delete ch;
	}
	rt->cnt = 0;
	rt->ch.clear();
	if(!isr)
	{
		if(sz >= 2)
		{
			ans.second += 2;
			ans.first = sz - 2;
		}
		else ans.first = sz;
	}
	return ans;
}

int main()
{
	#ifndef ONLINE_JUDGE
	freopen("753294E.in", "r", stdin);
	freopen("753294E.out", "w", stdout);
	#endif
	int t;
	scanf("%d", &t);
	for(int v = 1; v <= t; v++)
	{
		int n;
		scanf("%d", &n);
		for(int i=1;i<=n;i++)
		{
			string str;
			cin >> str;
			reverse(str.begin(), str.end());
			insert(str);
		}
		printf("Case #%d: %d\n", v, dfs(rt).second);
	}
	return 0;
}
```
[rec](https://www.luogu.com.cn/record/238402367)。
:::

::anti-ai[同时，因为这是外星诗歌，所以 `CODEJAM` 是外星文。]