---
title: 题解：P9891 [ICPC 2018 Qingdao R] Repair the Artwork
date: 2026-11-07 00:16:51
updated: 2026-11-07 00:16:51
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---

# 题解：P9891 [ICPC 2018 Qingdao R] Repair the Artwork

看起来非常不可做，实则不然。

---

考虑没有 $a=2$。

哦对不起走错片场了。只需要计算不包含 $1$ 的区间数量。

现在考虑暴力。

考虑容斥，枚举哪些 $2$ 没有被覆盖到即可。

现在考虑正解。

考虑对于每个不包含 $1$ 的区间数量 $s$，没覆盖到的 $2$ 的个数是奇数/偶数，有多少种方案。

按 $1$ 分段，对于每段 dp。$f_{i,s,0/1}$ 表示考虑这一段的前 $i$ 个 $2$，其中最后一个一定没被覆盖到，目前的总区间个数为 $s$，没被覆盖的 $2$ 个数是奇数/偶数的方案数。

状态数 $O(n^3)$，转移只需要枚举前一个 $2$ 的位置，合并精细实现，$O(n^4)$。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/308554637)。

```cpp
// 看我完全不会做，打个 O(64^n log m)
// 等等这个好像没分
// 招笑。
/*
二项式定理处理掉自环。

然后 2^n 个点，最长链 n 的 DAG。

直接 dp 即可。O(n2^n)。
*/
/*
好的，假了。

我能在 23min 内打完 sub1 吗？？（x
*/
/*
sub1 提示性怎么这么强啊

容斥一下直接解决掉 sub2
*/
#include <cstdio>
#include <vector>
#include <cstring>

using namespace std;

long long qpow(long long x, long long y) { long long ans = 1; do { if(y & 1) ans = ans * x % 1000000007; x = x * x % 1000000007; } while(y >>= 1); return ans; }

int a[105];
long long dp[105][10005][2];
long long dx[10005][2];
long long px[10005][2];
long long hypo[10005][2];

int main()
{
	// freopen("artwork.in", "r", stdin);
	// freopen("artwork.out", "w", stdout);
	int t;
	scanf("%d", &t);
	while(t--)
	{
		int n, m;
		scanf("%d%d", &n, &m);
		vector<vector<int>> segs;
		segs.push_back({});
		for(int i=1;i<=n;i++)
		{
			scanf("%d", a + i);
			if(a[i] == 1) segs.push_back({});
			else segs.back().push_back(a[i]);
		}
		memset(dx, 0, sizeof dx);
		dx[0][0] = 1;
		unsigned s1 = 0;
		for(const auto &s : segs)
		{
			if(s.empty()) continue;
			vector<int> v2pos;
			for(int i=0;i<s.size();i++) if(s[i] == 2) v2pos.push_back(i);
			unsigned s2 = s.size() * (s.size() + 1) / 2;
			for(int k=0;k<=s1+s2;k++) px[k][0] = px[k][1] = hypo[k][0] = hypo[k][1] = 0;
			for(int i=0;i<v2pos.size();i++)
			{
				for(int k=0;k<=s2;k++) dp[i][k][0] = dp[i][k][1] = 0;
				for(int j=0;j<i;j++)
				{
					for(int k=0;k+(v2pos[i]-v2pos[j]-1)*(v2pos[i]-v2pos[j])/2<=s2;k++)
					{
						// if(!dp[j][k][0]) continue;
						dp[i][k+(v2pos[i]-v2pos[j]-1)*(v2pos[i]-v2pos[j])/2][0] = (dp[i][k+(v2pos[i]-v2pos[j]-1)*(v2pos[i]-v2pos[j])/2][0] + dp[j][k][1]) % 1000000007;
						dp[i][k+(v2pos[i]-v2pos[j]-1)*(v2pos[i]-v2pos[j])/2][1] = (dp[i][k+(v2pos[i]-v2pos[j]-1)*(v2pos[i]-v2pos[j])/2][1] + dp[j][k][0]) % 1000000007;
					}
				}
				dp[i][v2pos[i]*(v2pos[i]+1)/2][1]++;
				for(int k=0;k<=s2 - (s.size()-v2pos[i])*(s.size()-v2pos[i]-1)/2;k++)
				{
					// printf("dp[%d][%d] = {%lld, %lld}\n", i, k, dp[i][k][0], dp[i][k][1]);
					px[k+(s.size()-v2pos[i])*(s.size()-v2pos[i]-1)/2][0] = (px[k+(s.size()-v2pos[i])*(s.size()-v2pos[i]-1)/2][0] + dp[i][k][0]) % 1000000007;
					px[k+(s.size()-v2pos[i])*(s.size()-v2pos[i]-1)/2][1] = (px[k+(s.size()-v2pos[i])*(s.size()-v2pos[i]-1)/2][1] + dp[i][k][1]) % 1000000007;
				}
			}
			px[s.size()*(s.size()+1)/2][0]++;
			for(int x=0;x<=s1;x++)
			{
				// printf("! px[%d] = {%lld, %lld}\n", x, px[x][0], px[x][1]);
				for(int y=0;y<=s2;y++)
				{
					hypo[x+y][0] = (hypo[x+y][0] + dx[x][0] * px[y][0] + dx[x][1] * px[y][1]) % 1000000007;
					hypo[x+y][1] = (hypo[x+y][1] + dx[x][1] * px[y][0] + dx[x][0] * px[y][1]) % 1000000007;
				}
			}
			s1 += s2;
			for(int k=0;k<=s1;k++)
			{
				dx[k][0] = hypo[k][0];
				dx[k][1] = hypo[k][1];
			}
		}
		long long ans = 0;
		for(int i=0;i<=s1;i++)
		{
			// printf("dx[%d] = {%lld, %lld}\n", i, dx[i][0], dx[i][1]);
			ans = (ans + dx[i][0] * qpow(i, m) % 1000000007 + 1000000006 * dx[i][1] % 1000000007 * qpow(i, m)) % 1000000007;
		}
		printf("%lld\n", ans);
	}
	return 0;
}
/*
How to use Sublime Text:

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
*/
```

:::
