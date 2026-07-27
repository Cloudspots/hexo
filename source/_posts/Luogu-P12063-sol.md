---
title: 题解：P12063 [THUPC 2025 决赛] 我的围棋
date: 2025-4-7 11:39:54
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
> - 诶？？？
> - 能过。

首先我们知道 $n \le 10^5$。我们考虑 $\mathcal O(n \log n)$ 的做法。

考虑二分。每次判断如果都没有输就在右半部分搜索，如果都输了就在左半部分搜索，否则直接停止。

根据[等比数列求和公式](https://www.luogu.com/article/dx3vl9lm)，时间复杂度为 $\Theta(n)$，时间复杂度不为 $\omega(n)$。

考虑在线做法。

维护两棵动态开点的线段树，每次如果在某人的棋盒上添加 $x$ 个棋子时，就把线段树维护的区间的 ID 在 $[r,r+x)$ 之内的元素统统 $+1$，其中 $r$ 是 $[1,10^9]$ 的随机数。

那么每次区间求和查询即可。

时间复杂度 $\mathcal O(n \log n)$，对于 $n \le 10^5$ 能过。

应要求补充代码。

```cpp
#include <bit>
#include <cmath>
#include <cstdio>
#include <random>
#include <chrono>
#include <cstdlib>
#include <iostream>
#include <algorithm>

using namespace std;

// 线段/区间
template<typename T>
class segment
{
public:
	T l, r; // [l, r)
	size_t size() { return r - l; } // 长度
	bool fail() { return l >= r; } // 是否不合规
	template<typename Han_Si_Ying>
	friend bool operator==(const segment<Han_Si_Ying>& x, const segment<Han_Si_Ying>& y) { return x.l == y.l && x.r == y.r; } // Han_Si_Ying：？
};

// 区间交
template<typename T>
segment<T> seg_and(segment<T> l1, segment<T> l2)
{
	return { max(l1.l, l2.l), min(l1.r, l2.r) };
}

template<typename _Valt>
class segtree
{
	class segnode
	{
		segment<size_t> seg; // 负责区间
		_Valt s, tag; // S, lazytag
		segnode* lp = nullptr, * rp = nullptr; // 左右子树
	public:
		segnode(segment<size_t> _seg = { 0,0 }, _Valt _s = _Valt(), _Valt _tag = _Valt(), segnode* _lp = nullptr, segnode* _rp = nullptr) { seg = _seg; s = _s; tag = _tag; lp = _lp; rp = _rp; }
		segment<size_t>& getseg() { return seg; }
		_Valt& gets() { return s; }
		_Valt& gettag() { return tag; }
		segnode *getlp()
		{
			if (lp != nullptr || seg.size() == 1) return lp;
			else
			{
				size_t l = seg.l;
				size_t r = (seg.l + seg.r) >> 1;
#ifdef L7W_AB
				printf("build left child of [%d, %d), child = [%d, %d).\n", seg.l, seg.r, l, r);
#endif
				return lp = new segnode({ {l, r}, static_cast<_Valt>(s / seg.size() * (r - l)), _Valt(), nullptr, nullptr });
			}
		}
		segnode* getrp()
		{
			if (rp != nullptr || seg.size() == 1) return rp;
			else
			{
				size_t l = (seg.l + seg.r) >> 1;
				size_t r = seg.r;
#ifdef L7W_AB
				printf("build right child of [%d, %d), child = [%d, %d).\n", seg.l, seg.r, l, r);
#endif
				return rp = new segnode({ {l, r}, static_cast<_Valt>(s / seg.size() * (r - l)), _Valt(), nullptr, nullptr });
			}
		}
		void pushdown() // 下放标记
		{
			s += tag * seg.size();
			if (getlp()) lp->tag += tag;
			if (getrp()) rp->tag += tag;
			tag = 0;
		}
	};
	segnode* rt;
	// void init(segnode* root, size_t l, size_t r) // 初始化
	// {
	// 	root->seg = { l, r };
	// 	root->s = root->tag = _Valt();
	// 	if (l + 1 == r) return;
	// 	else
	// 	{
	// 		init(root->lp = new segnode, l, (l + r) >> 1);
	// 		init(root->rp = new segnode, (l + r) >> 1, r);
	// 	}
	// }
	_Valt inn_query(segnode* root, segment<size_t> seg) // 区间查询
	{
		root->pushdown(); // 下放懒标记
		if (root->getseg() == seg) return root->gets();
		segment<size_t> segl = seg_and(root->getlp()->getseg(), seg),
			segr = seg_and(root->getrp()->getseg(), seg); // 区间交
		_Valt sum = 0; // 和
		if (!segl.fail()) sum += inn_query(root->getlp(), segl);
		if (!segr.fail()) sum += inn_query(root->getrp(), segr);
		return sum;
	}
	void inn_add(segnode* root, segment<size_t> seg, _Valt val) // 区间修改
	{
#ifdef L7W_AB
		printf("call seg_and on [%d, %d), root = [%d, %d)\n", seg.l, seg.r, root->getseg().l, root->getseg().r);
#endif
		root->pushdown();
		if (root->getseg() == seg)
		{
			root->gettag() += val;
			return;
		}
		root->gets() += val * seg.size();
		segment<size_t> segl = seg_and(root->getlp()->getseg(), seg),
			segr = seg_and(root->getrp()->getseg(), seg);
		if (!segr.fail()) inn_add(root->getrp(), segr, val);
		if (!segl.fail()) inn_add(root->getlp(), segl, val);
	}
public:
	segtree(size_t sz)
	{
		rt = new segnode({ { 0, sz }, 0, 0, nullptr, nullptr });
		// 动态开点，只需要建一个根节点即可
		// init(rt, 0, sz);
	}
	_Valt query(size_t l, size_t r)
	{
		return inn_query(rt, { l, r + 1 });
	}
	void add(size_t l, size_t r, _Valt x)
	{
		inn_add(rt, { l, r + 1 }, x);
	}
};

int main()
{
	srand(time(NULL));
	random_device rd;
	// 好随机啊...
	mt19937_64 mt(rd() + chrono::high_resolution_clock::now().time_since_epoch().count() + rand() * rand());
	uniform_int_distribution<int> um(1, 1000000000);
	segtree<int> sg1(2000000005);
	segtree<int> sg2(2000000005);
	int n, m;
	scanf("%d%d", &n, &m);
	for (int i = 1; i <= n; i++)
	{
		int a;
		scanf("%d", &a);
		int v = um(rd);
		if (i & 1) sg1.add(v, v + a - 1, 1);
		else sg2.add(v, v + a - 1, 1);
		if (sg1.query(1, 2000000000) > m)
		{
			printf("White\n");
			return 0;
		}
		if (sg2.query(1, 2000000000) > m)
		{
			printf("Black\n");
			return 0;
		}
	}
	printf("Draw\n");
	return 0;
}
```

[AC 记录](https://www.luogu.com.cn/record/212577849)。

后记：

> Warning：可能含有虚假/推测的/未经证实的信息，请谨慎甄别。

首先解释一下为什么要 $\omega(n)$ 的算法。

可能有读者不知道什么是 $\omega(n)$（毕竟时间复杂度中不常用），就是不满足 $\mathcal O(n)$。注意不要把 $\mathcal O(n)$ 和 $\Theta(n)$ 混淆，后者是同时满足 $\mathcal O(n)$ 和 $\Omega(n)$（不要和 $\omega(n)$ 混淆）的意思。

因为 $1 \le n \le 10^5$，所以如果我们使用线性或更快的做法（即 $\mathcal O(n)$ 做法）出题人会因为被爆标而感到不高兴。

为什么会被爆标？如果标程是 $\mathcal O(n)$ 的，那么数据范围肯定会比 $10^5$ 大，但实际上并没有，所以标程时间复杂度应当为 $\omega(n)$。

如果出题人不高兴，你可能会因为没有及时清除上一位整活人带来的[宇宙射线](https://www.luogu.com.cn/record/213110949)而导致 CE。

综上，我们必须使用 $\omega(n)$ 的做法。

再解释一下为什么一道难度为普及-的题目我会使用普及+/提高的做法（动态开点线段树）。

因为普及-和普及+/提高的最长公共子段的长度是普及-的超过 $\dfrac{1279873}{1919810}$，所以我看花了，看成了后者。

最后我把考虑劣化四个字删掉了，改成了时间复杂度，因为从前者中看不出什么东西来。