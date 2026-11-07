---
title: 题解：P14375 [JOISC 2018] 图书馆 / Library
date: 2026-11-02 03:36:13
updated: 2026-11-02 03:36:13
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P14375 [JOISC 2018] 图书馆 / Library

考虑先随机打乱必然不劣。

那么我们考虑一个前缀，我们已知它是若干个连续段。考虑如果插入一个数字之后能正确合并连续段，最终就可以还原整个序列。

考虑插入之后如果连续段数量增加 $1$，就说明和原本的连续段没有相邻；如果不变，说明有一个相邻；如果减少 $1$ 说明同时和两个相邻。

考虑怎么找到和哪个相邻，这个二分即可。

那么三个 case 的代价分别是 $1,\log n+2,2\log n+3$，考虑到这里的 $n$ 实际上是当前连通块数量且我们随机打乱了，所以这个做法非常优秀，实际上只有大约 $8200$ 的操作次数，简直比 $n\log_2 n$ 还优秀。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/307626590)。

```cpp
/*
来乱搞一发

考虑加入后的连续段个数（总代价 n）：

- 增加 1：直接加入（代价 0）。
- 不变：和恰好一个相邻，那么分治找到相邻点（代价 1 + log n）。
- 减少 1：和两个同时相邻，分治（代价 2 + 2 log n）。

看起来很棒。

随机打乱一下。

实测约 8200 次，非常优秀。
*/
#include <vector>
int Query(const std::vector<int>& M);
void Answer(const std::vector<int>& res);

#include <vector>
#include <random>
#include <cassert>
#include <algorithm>

using namespace std;

const auto U = [](auto x) { return [x](auto ...y) { return x(x, y...); }; };

void Solve(int n)
{
	vector<int> vt;
	for(int i=1;i<=n;i++) vt.push_back(i);
	shuffle(vt.begin(), vt.end(), mt19937_64(random_device{}()));
	vector<vector<int>> wsx;
	int vlst = 0;
	for(int x : vt)
	{
		// printf("hey x = %d\n", x);
		auto qr = [&](int l, int r) -> int { vector<int> msk(n); for(int i=l;i<=r;i++) for(int g : wsx[i]) msk[g-1] = true; msk[x-1] = true; return Query(msk); };
		vector<int> vr(n);
		for(const auto &v : wsx)
		{
			for(int w : v) vr[w-1] = true;
		}
		vr[x-1] = true;
		int vp = Query(vr);
		if(vp == vlst)
		{
			int l = 0, r = wsx.size()-1;
			while(l < r)
			{
				int mid = (l + r) / 2;
				if(qr(l, mid) == mid - l + 1) r = mid;
				else l = mid + 1;
			}
			if(wsx[l].size() == 1) wsx[l].push_back(x);
			else
			{
				vector<int> msk(n);
				msk[x-1] = true;
				msk[wsx[l][0]-1] = true;
				if(Query(msk) == 2) wsx[l].push_back(x);
				else
				{
					reverse(wsx[l].begin(), wsx[l].end());
					wsx[l].push_back(x);
				}
			}
		}
		else if(vp == vlst - 1)
		{
			vector<int> rs;
			U([&](auto &&self, int l, int r, bool kflag) -> void
			{
				if(l == r)
				{
					rs.push_back(l);
					return;
				}
				int mid = (l + r) / 2;
				int ree = qr(l, mid);
				if(kflag)
				{
					if(ree == mid - l) self(self, l, mid, true);
					else if(ree == mid - l + 1)
					{
						self(self, l, mid, false);
						self(self, mid + 1, r, false);
					}
					else self(self, mid + 1, r, true);
				}
				else
				{
					if(ree == mid - l + 1) self(self, l, mid, false);
					else self(self, mid + 1, r, false);
				}
			})(0, wsx.size()-1, true);
			assert(rs.size() == 2);
			int u = rs[0], v = rs[1];
			// printf("u = %d, v = %d\n", u, v);
			if(wsx[u].size() < wsx[v].size()) swap(u, v);
			if(wsx[u].size() == 1)
			{
				wsx[u].push_back(x);
				wsx[u].push_back(wsx[v][0]);
				wsx.erase(wsx.begin() + v);
			}
			else if(wsx[v].size() == 1)
			{
				vector<int> msk1(n);
				msk1[wsx[u][0] - 1] = true;
				msk1[x-1] = true;
				if(Query(msk1) == 1) reverse(wsx[u].begin(), wsx[u].end());
				wsx[u].push_back(x);
				wsx[u].push_back(wsx[v][0]);
				wsx.erase(wsx.begin() + v);
			}
			else
			{
				vector<int> msk1(n), msk2(n);
				msk1[wsx[u][0] - 1] = true; msk2[wsx[v][0] - 1] = true;
				msk1[x-1] = true; msk2[x-1] = true;
				if(Query(msk1) == 1) reverse(wsx[u].begin(), wsx[u].end());
				if(Query(msk2) == 2) reverse(wsx[v].begin(), wsx[v].end());
				wsx[u].push_back(x);
				for(int g : wsx[v]) wsx[u].push_back(g);
				wsx.erase(wsx.begin() + v);
			}
		}
		else wsx.push_back({x});
		vlst = vp;
		assert(vp == wsx.size());
		// printf("now connected: "); for(const auto &p : wsx) { printf("["); for(int g : p) printf("%d ", g); printf("] "); } printf("\n");
	}
	assert(wsx.size() == 1 && wsx[0].size() == n);
	Answer(wsx[0]);
}
```

:::
