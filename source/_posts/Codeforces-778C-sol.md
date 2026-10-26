---
title: 题解：CF778C Peterson Polyglot
date: 2026-10-21 19:30:48
updated: 2026-10-21 19:30:48
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---

# 题解：CF778C Peterson Polyglot

> 水水水题。

---

对于一个深度 $d$，其节点数为下列三者之和：

- 深度 $< d$ 的节点数量。
- 对于每个深度 $=d$ 的节点 $u$，将其所有子树合并到一起后的节点数量之和。
- 深度 $=d$ 的叶子节点数量。

第一部分和第三部分直接做就行。第二部分考虑 Trie 合并，合并完撤销。

……等等合并完撤销这样的复杂度是什么是对的？

考虑合并 $u,v$ 的时间复杂度为 $O(\min(\text{size}_u,\text{size}_v))$，同时两个子树的大小之和为 $\text{size}_u+\text{size}_v\ge 2\min(\text{size}_u,\text{size}_v)$。换句话说如果从小到大合并（而在 Trie 合并的时候顺序是不影响复杂度的），每次合并两个子结点，这个节点本身的子树大小就会翻倍。所以总时间复杂度 $O(n\log n)$。

注意不能套用一般线段数合并线性（对于节点数量线性）的证明，因为有撤销。

然后就做完了。

:::info[sub&code]

[sub](https://codeforces.com/contest/778/submission/395454217)。

```cpp
// 可撤销 Trie 合并
// 势能存在
// 会了
// 等等
/*
考虑势能在哪

可以分析出一个带 log 的均摊复杂度

能不带 log 吗

应该不行，懒得 hack 了
*/
// 可撤销 Trie 合并有什么简单写法吗
// 哦还真有！使用一个伪 Trie 即可。
#include <cstdio>
#include <vector>
#include <utility>
#include <cassert>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

class rmtrie // roll & merge trie
{
public:
	class node { public: int ch[26]; int sz, dep; } nodes[300005], fake[300005];
	int ts[300005];
	int tsp;
	node &qfake(int x) { if(ts[x] != tsp) { fake[x] = nodes[x]; ts[x] = tsp; } return fake[x]; }
	int vmerge(int x, int y)
	{
		int res = U([&](auto &&self, int u, int v) -> int
		{
			int s = 1;
			node &un = qfake(u), &vn = qfake(v);
			for(int i=0;i<26;i++)
			{
				if(un.ch[i] && vn.ch[i])
				{
					un.sz -= qfake(un.ch[i]).sz;
					s += self(self, un.ch[i], vn.ch[i]);
					un.sz += qfake(un.ch[i]).sz;
				}
				else if(un.ch[i]) s += qfake(un.ch[i]).sz;
				else if(vn.ch[i])
				{
					s += qfake(vn.ch[i]).sz;
					un.ch[i] = vn.ch[i];
					un.sz += qfake(un.ch[i]).sz;
				}
			}
			assert(s == un.sz);
			return s;
		})(x, y);
		return res;
	}
} wsx;

vector<pair<int, char>> web[300005];
int ans[300005];

int main()
{
	int n;
	scanf("%d", &n);
	for(int i=2;i<=n;i++)
	{
		int u, v;
		char c;
		scanf("%d%d %c", &u, &v, &c);
		web[u].push_back({v, c});
		web[v].push_back({u, c});
	}
	U([&](auto &&self, int u, int fa) -> void
	{
		if(fa) web[u].erase(find_if(web[u].begin(), web[u].end(), [&](const auto &x) { return x.first == fa; }));
		wsx.nodes[u].dep = wsx.nodes[fa].dep + 1;
		ans[wsx.nodes[u].dep+1]++;
		wsx.nodes[u].sz = 1;
		for(const auto &[v, w] : web[u])
		{
			wsx.nodes[u].ch[w - 'a'] = v;
			self(self, v, u);
			wsx.nodes[u].sz += wsx.nodes[v].sz;
		}
		// printf("sz[%d] = %d\n", u, wsx.nodes[u].sz);
	})(1, 0);
	for(int i=1;i<=n;i++) ans[i] += ans[i-1];
	U([&](auto &&self, int u) -> void
	{
		int lsz = 1, lsp = 0, lc = 0;
		wsx.tsp++;
		for(int v : wsx.nodes[u].ch)
		{
			if(!v) continue;
			lc++;
			// printf("u = %d, lsp = %d, v = %d\n", u, lsp, v);
			if(!lsp)
			{
				lsp = v;
				lsz = wsx.nodes[v].sz;
			}
			else
			{
				lsz = wsx.vmerge(lsp, v);
				// printf("result of merge(%d, %d) is %d\n", lsp, v, lsz);
				// lsp = v;
			}
		}
		for(int v : wsx.nodes[u].ch)
		{
			if(v) self(self, v);
		}
		ans[wsx.nodes[u].dep] += lsz;
	})(1);
	// for(int i=1;i<=n;i++) printf("ans[%d] = %d\n", i, ans[i]);
	int minn = 0x3f3f3f3f, minx = 0;
	for(int i=1;i<=n;i++)
	{
		if(ans[i] < minn)
		{
			minn = ans[i];
			minx = i;
		}
	}
	printf("%d\n%d\n", minn, minx);
	return 0;
}
// Latin-1
```

:::
