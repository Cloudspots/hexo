---
title: 题解：P11226 [COTS 2019] 排名 Vezuv
date: 2025-10-5 21:32:59
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
经验：P3065，CF510C，P6286，ABC268G，和一堆本质相同的题。

容易发现，一个字符串 $A$（在组委会的字典序定义下，下同）要排在 $B$ 之前，需要满足 $A$ 是 $B$ 的前缀或者 $A,B$ 的第一个不同的位置下 $A$ 的对应字符在 $B$ 之前。$B$ 是 $A$ 的前缀则不可能。

好吧，又是前缀。建出 Trie 树。以样例 $3$ 为例。

![](pV7K7vV.png)

如果我们希望 `bcdff` 取的第一，那么：

- 没有任何字符串是它的前缀：已经满足。
- 和它第一个字符不同的，第一个字符要在它之后：`a,d` 都要在 `b` 之后。
- 和它第一个字符相同，第二个字符不同的，第二个字符要在它之后：`a,b` 要在 `c` 之后。
- 和它前两个字符相同，第三个字符不同的，第三个字符要在它之后：`a` 在 `d` 之后。
- 没有和它前三个字符相同的。

也就是说，如果我们用字母代表对应字母的排名：$b<a,b<d,c<a,c<b,d<a$。

显然，拓扑排序即可。

一般的，如果让某个字符串排第一，则字符串路径上的每个节点，都要满足其所有兄弟节点排名在它之后。拓扑排序解决。

注意还需要判一下有没有字符串在是它的前缀，这个不用我说了吧。

:::info[代码&提交记录]

```cpp
#include <cstdio>
#include <iostream>
#include <vector>
#include <queue>
#include <string>
#include <algorithm>
#include <map>

using namespace std;

class Trienode
{
public:
	int cnt = 0;
	map<char, Trienode *> mp;
} *root = new Trienode;

string str[25005];

vector<int> web[30];
int ind[30];
int ans[30];

void insert(const string &s)
{
	auto rt = root;
	for(char ch : s)
	{
		if(rt->mp.count(ch)) rt = rt->mp[ch];
		else rt = rt->mp[ch] = new Trienode;
	}
	rt->cnt++;
}

int main()
{
	#ifndef ONLINE_JUDGE
	freopen("753294I.in", "r", stdin);
	freopen("753294I.out", "w", stdout);
	#endif
	int n;
	scanf("%d", &n);
	for(int i=1;i<=n;i++)
	{
		cin >> str[i];
		insert(str[i]);
	}
	for(int i=1;i<=n;i++)
	{
		auto rt = root;
		for(int j=0;j<26;j++)
		{
			web[j].clear();
			ind[j] = 0;
		}
		bool flag = false;
		for(char ch : str[i])
		{
			if(rt->cnt) flag = true;
			for(const auto &[_,__] : rt->mp)
			{
				if(_ == ch) continue;
				web[ch - 'a'].push_back(_ - 'a');
				ind[_ - 'a']++;
				// printf("%c -> %c\n", ch, _);
			}
			rt = rt->mp[ch];
		}
		int cur = 0;
		queue<int> q;
		for(int j=0;j<26;j++)
		{
			if(ind[j] == 0) q.push(j);
		}
		while(!q.empty())
		{
			int u = q.front();
			q.pop();
			ans[cur++] = u;
			for(auto v : web[u])
			{
				if(!--ind[v]) q.push(v);
			}
		}
		if(!flag && cur == 26)
		{
			for(int j=0;j<26;j++)
			{
				putchar(ans[j] + 'a');
			}
		}
		else printf("nemoguce");
		printf("\n");
	}
	return 0;
} // This code has been submitted before /fn/fn/fn，刚刚识别的验证码不对/fn/fn/fn
```

[rec](https://www.luogu.com.cn/record/238476824)。

:::