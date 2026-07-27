---
title: 题解：P15573 [USACO26FEB] Clash! S
date: 2026-4-14 16:30:35
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
容易发现一般循环节长度比较小，进入循环也比较快。事实上，循环节长度为 $N-H+1$，最多 $N$ 次就能进入循环。

那么我们按照题意模拟（优先队列+队列），直到出现循环即可。

对于判断循环：使用哈希。对于每张牌赋一个随机权值，在场上的牌的所有权值的哈希值设为 $a$，不在场上的使用字符串哈希，设其和为 $b$。则哈希值为 $a\oplus b$。

有一个要注意的点，如果两张牌完全相同还是要定序（按照编号，哈希值或其他值，总之需要能够定序），不然会被 $a$ 值域很小的点卡。这是因为每次选择打出的牌是不确定的，尽管已经进入了循环但还是不知道进入了（因为认为两种情况不等价）。另一种解决方案是对于完全相同的牌，使其哈希值也相同。

询问是简单的。

时间复杂度 $O((n+q)\log n)$。

所以为什么这题是绿。我不会啊。

:::info[sub&code]

[sub](https://www.luogu.com.cn/record/273959413)。

```cpp
#include <cstdio>
#include <random>
#include <unordered_map>
#include <queue>
#include <algorithm>

using namespace std;

class card
{
public:
	long long t;
	bool winner;
	int id;
	unsigned long long hasher;
	friend bool operator<(const card &x, const card &y) { if(x.winner && !y.winner) return false; if(!x.winner && y.winner) return true; return x.t > y.t || x.t == y.t && x.id > y.id; }
} cards[200005]; // [a playing card. likely marked.]

unsigned long long bas = 1000000007, rbas = 13499267949257065399ull; // calculated by IPython & gmpy2.

long long ts[10000005];
long long gt[10000005];
unsigned long long hqk[200005]; // qqk

int main()
{
	// freopen("P15573.in", "r", stdin);
	// freopen("P15573.out", "w", stdout);
	int n, h;
	scanf("%d%d", &n, &h);
	// n = 1000, h = 800;
	mt19937_64 mt(random_device{}());
	hqk[0] = 1;
	// uniform_int_distribution<int> ud(1, 8);
	for(int i=1;i<=n;i++)
	{
		hqk[i] = hqk[i-1] * bas;
		scanf("%lld", &cards[i].t);
		// cards[i].t = ud(mt);
		cards[i].hasher = mt();
		cards[i].id = i;
	}
	int k;
	scanf("%d", &k);
	// k = 0;
	while(k--)
	{
		int s;
		scanf("%d", &s);
		// s = k + 2;
		cards[s].winner = true;
	}
	unordered_map<unsigned long long, int> um;
	priority_queue<card> gss;
	queue<card> qp;
	// 场上：无序。场下：有序。
	unsigned long long alpha = 0, beta = 0;
	for(int i=1;i<=h;i++)
	{
		gss.push(cards[i]);
		alpha ^= cards[i].hasher;
	}
	for(int i=h+1;i<=n;i++)
	{
		qp.push(cards[i]);
		beta += hqk[cards[i].id - h - 1] * cards[i].hasher;
	}
	int rotl = 0, rotr = 0;
	int cur = 0;
	int sum = 0;
	long long T = 0;
	while(++cur)
	{
		// fprintf(stderr, "cur = %d, hash = %llu\n", cur, alpha ^ beta);
		if(um[alpha ^ beta])
		{
			// 进入循环！
			rotl = um[alpha ^ beta];
			rotr = cur - 1;
			break;
		}
		um[alpha ^ beta] = cur;
		auto fst = gss.top(), scd = qp.front();
		T += fst.t;
		if(fst.winner) sum++;
		ts[cur] = T;
		gt[cur] = sum;
		// printf("ts[%d] = %lld, gt[%d] = %lld\n", cur, ts[cur], cur, gt[cur]);
		// printf("replace %lld (id = %d) by %lld (id = %d)\n", fst.t, fst.id, scd.t, scd.id);
		alpha ^= fst.hasher;
		alpha ^= scd.hasher;
		beta -= scd.hasher;
		beta *= rbas;
		beta += fst.hasher * hqk[n - h - 1];
		gss.pop(); qp.pop();
		qp.push(fst); gss.push(scd);
	}
	// fprintf(stderr, "rotl = %d, rotr = %d\n", rotl, rotr);
	int q;
	scanf("%d", &q);
	// q = 0;
	while(q--)
	{
		long long t;
		scanf("%lld", &t);
		if(t < ts[rotl - 1])
		{
			printf("%lld\n", gt[upper_bound(ts + 1, ts + rotl + 1, t) - ts - 1]);
			continue;
		}
		else
		{
			printf("%lld\n", gt[rotl - 1] + (t - ts[rotl]) / (ts[rotr] - ts[rotl - 1]) * (gt[rotr] - gt[rotl - 1]) + gt[upper_bound(ts + rotl, ts + rotr + 1, (t - ts[rotl]) % (ts[rotr] - ts[rotl - 1]) + ts[rotl]) - ts - 1] - gt[rotl - 1]);
		}
	}
	return 0;
}
```
:::