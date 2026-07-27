---
title: 线段树 学习笔记
date: 2025-1-7 20:39:08
categories:
  - Algorithm & Theory
tags: []
---
# 前言

蒟蒻终于学会线段树（指【模板】线段树 $1$）啦！

# 线段树思想

我们先来考虑 [P3372](https://www.luogu.com.cn/problem/P3372)（基础线段树模板题）给的操作：

1. 区间修改（增加）/弱化版：单点修改
2. 区间查询（求和）

很重要的一点是，两者是交叉的，要不然可以使用好写时间复杂度又优秀又好吃的前缀和秒了。

$\mathcal O(1)$ 是困难的，所以我们思考可不可以 $\bm{\mathcal O(\log n)}$ 实现。

## 分段

### 目标

我们可以把一个区间**分割成 $\bm{\mathcal O(\log n)}$ 个小区间**（这一点非常重要），如果每个区间都可以 $\bm{\Theta(1)}$ 完成（当然也很重要，但是如果是均摊 $\Theta(1)$ 也行），则总时间复杂度为 $\mathcal O(\log n)$。

### 较为失败的分段

我们的第一反应是把整个序列分割成几块，但是这样显然是不行的，哪里没割我们就可以把区间的一个端点设置为那个点，然后就**无法分割**了。如果把整个区间分割成每一个长度都是 $1$，则和数组无异，分割成的块数是 $\bm{\mathcal O(n)}$ 的。

看起来不太有希望，但是我们可以换种思路。

### 线段树思想

一个位置可以被多个区间包含，而分割的方法是类似**二进制**。

这样做的好处：**一个数字 $\bm k$ 有 $\bm{\Theta(\log k)}$ 个二进制位**，完美符合我们“一个序列被分割成 $\mathcal O(\log k)$ 个小序列”的要求。

这就是线段树的思想了。

这里插一句，为了发扬 STL 的传统美德，我们这里使用 $[a,b)$ 左闭右开区间，同时下标从 $0$ 开始。

我们假设序列长度是 $2^k$：

- 一个线段是 $[0,2^k)$
- 一个线段是 $[0,2^{k-1})$
- 一个线段是 $[2^{k-1},2 \times 2^{k-1})$
- 一个线段是 $[0,2^{k-2})$
- 一个线段是 $[2^{k-2},2 \times 2^{k-2})$
- 一个线段是 $[2^{k-1},3 \times 2^{k-2})$
- 一个线段是 $[3 \times 2^{k-2}, 4 \times 2^{k-2})$
- ......

我们把它以树的形式组织起来：

- $[0,2^k)$
  - $[0,2^{k-1})$
    - $[0,2^{k-2})$
      - ...
      - ...
    - $[2^{k-2},2 \times 2^{k-2})$
      - ...
      - ...
  - $[2^{k-1},2 \times 2^{k-1})$
    - $[2^{k-1},3 \times 2^{k-2})$
      - ...
      - ...
    - $[3 \times 2^{k-2}, 4 \times 2^{k-2})$
      - ...
      - ...


或者，使用 [Graph Editor](https://csacademy.com/app/graph_editor)？为了不让文字太长，这里令 $k = 3$。

![`[0,8) [0,4)
[0,8) [4,8)
[0,4) [0,2)
[0,2) [0,1)
[0,2) [1,2)
[0,4) [2,4)
[2,4) [2,3)
[2,4) [3,4)
[4,8) [4,6)
[4,8) [6,8)
[4,6) [4,5)
[4,6) [5,6)
[6,8) [6,7)
[6,8) [7,8)`](https://s21.ax1x.com/2025/01/07/pE9TLLt.png)

空间复杂度 $\Theta(k2^k)$，若 $n = 2^k$ 则为 $\Theta(n \log n)$，可以完美承受。

这里，我们每一个节点不仅记录 $[l,r)$ 范围，还要记录一个东西：范围里所有数字的和，以下称作 $S$。

#### 单点修改复杂度

显然，会影响到 $\Theta(\log n)$ 级别的节点，每个节点修改耗时 $\Theta(1)$。复杂度正确。

#### 区间修改复杂度

假设整个区间为 $[0,8)$，我们要把 $[3,6)$ 这个区间的所有数字加一，我们可以：

- 把区间 $[0,8)$ 的 $S$ 加 $3$；
- 把区间 $[0,4)$ 的 $S$ 加 $1$；
- 把区间 $[2,4)$ 的 $S$ 加 $1$；
- 把区间 $[3,4)$ 的 $S$ 加 $1$；
- 把区间 $[4,8)$ 的 $S$ 加 $2$；
- 把区间 $[4,6)$ 的 $S$ 加 $2$；
- 把区间 $[4,5)$ 的 $S$ 加 $1$；
- 把区间 $[5,6)$ 的 $S$ 加 $1$。

看起来加了很多，复杂度真的是正确的吗？

很不幸，把区间内所有数字加上某个数字的时间复杂度为 $\bm{\Theta(n \log n)}$，还不如直接在数组上操作呢。

那么，这个思路就不行了吗？**当然不是**，我们刚才已经看到过这个思路的一次绝处逢生，为什么这一次就不行？

> LtR：随手练练文笔，简称随笔。
>
> 小 $\alpha$：其实你（指小 $\beta$）文笔不怎么样。
>
> 小 $\beta$：你\*\*。

我们注意到，把 $[4,6)$ 加 $2$ 可以不涉及到原来的区间就推出后面的把 $[4,5)$ 和 $[5,6)$ 加一这两件事。

#### 疑似小 trick

所以，我们有一个优化的小 trick（至于为什么要加双引号，待会儿就知道了）：在每次区间加的时候，如果是把整个区间加某个值，则**先记录下来要加**，并不把下面的整个子树都加上某一个值。

事实上，专门用来记录这个值的变量叫做 $\textbf{lazytag}$，以下为了节省 $\KaTeX$ 的码量，则把它称作 $\textbf{tag}$~~（$\text{\sout{\KaTeX}}$ 中 `\text` 内怎么加粗啊？/fn）~~（使用 `\textbf` 即可）。

那么，加上这个 $\text{tag}$ 之后，变成了什么样呢？

- 把区间 $[0,8)$ 的 $S$ 加 $3$；
- 把区间 $[0,4)$ 的 $S$ 加 $1$；
- 把区间 $[2,4)$ 的 $S$ 加 $1$；
- 把区间 $[3,4)$ 的 $S$ 加 $1$；
- 把区间 $[4,8)$ 的 $S$ 加 $2$；
- 把区间 $[4,6)$ 的 $S$ 加 $2$；
- 把区间 $[4,6)$ 的 $\text{tag}$ 加 $1$。

看起来还是很多，但是我们惊喜的发现，如果在整个区间中都加上 $v$，我们只需要把 $[0,8)$ 的 $\text{tag}$ 加上 $v$ 即可。

接下来进入 hack 模式。

# hack

## hack $1$：左边少一个元素

也就是 $[1,n)$。

分成两部分：$[1,\frac{n}{2})$ 和 $[\frac{n}{2},n)$，第二部分直接改一下 $\text{tag}$，$\Theta(1)$ 处理掉了。

第一部分分成两部分：$[1,\frac{n}{4})$ 和 $[\frac{n}{4},\frac{n}{2})$，第二部分直接改一下 $\text{tag}$，$\Theta(1)$ 处理掉了。

第一部分分成两部分：$[1,\frac{n}{8})$ 和 $[\frac{n}{8},\frac{n}{4})$，第二部分直接改一下 $\text{tag}$，$\Theta(1)$ 处理掉了。

第一部分分成两部分：$[1,\frac{n}{16})$ 和 $[\frac{n}{16},\frac{n}{8})$，第二部分直接改一下 $\text{tag}$，$\Theta(1)$ 处理掉了。

以此类推，时间复杂度：$T(n)=T(\frac{n}{2})+\Theta(1)$，显然 $T(n)=\Theta(\log n)$，也就是时间复杂度是 $\bm{\Theta(\log n)}$。

完美接招。

## hack $2$：右边少一个元素

完美接招，把左边的稍微改改，变成每次第一部分直接 $\Theta(1)$ 处理掉了，时间复杂度 $\bm{\Theta(\log n)}$。

## hack $3$：左右边都少一个元素

本来以为可以成功 hack 的，但是分成两半之后我们发现：

左边：相当于 hack $1$。

右边：相当于 hack $2$。

然后 $2 \times \Theta(\log n) = \bm{\Theta(\log n)}$，又是一次完美地应对。

# 如何查询

显然，只能修改还不行，还得查询。

查询也就不难了，按照相似的方式，在树上递归求解，遇到和原本序列完全一样的直接加。

时间复杂度？我们不乱 hack 了，直接求时间复杂度吧。

## 时间复杂度

首先感性理解一下，层数是 $\Theta(\log n)$ 的，所以时间复杂度是 $\mathcal O(\log n)$ 的。下面是严谨的证明，不想看可以跳过。

有几种情况：

1. 序列和当前节点负责区间完全重合，直接返回，时间复杂度 $\Theta(1)$，不会继续递归。
2. 序列左端点就是目前节点负责的区间左端点，右端点不到区间中点。此时递归可能会变成情况 $1,2,3,4$。
3. 序列左端点就是目前节点负责的区间左端点，右端点恰好为区间中点。此时递归可能会变成情况 $1$，也就是时间复杂度还是 $\Theta(1)$。
4. 序列左端点就是目前节点负责的区间左端点，右端点超过区间中点。此时左边递归可能会变成情况 $1$，右边递归可能变成情况 $2,3,4$。
5. 序列右端点就是目前节点负责的区间右端点，左端点不到区间中点。此时递归可能会变成情况 $1,5,6,7$。
6. 序列右端点就是目前节点负责的区间右端点，左端点恰好为区间中点。此时递归可能会变成情况 $1$，也就是时间复杂度还是 $\Theta(1)$。
7. 序列右端点就是目前节点负责的区间右端点，左端点超过区间中点。此时右边递归可能会变成情况 $1$，左边递归可能变成情况 $5,6,7$。
8. 区间左端点和右端点都不是目前节点负责的左右端点，但是范围符合，左边可能递归成 $5,6,7$，右边可能是 $2,3,4$。
9. 区间左端点和右端点都在左半部分，可能递归为 $8,9,10$
10. 区间左端点和右端点都在右半部分，可能递归为 $8,9,10$

是不是看的有点晕？配合图片理解一下，黑色代表节点负责的区间，黑色中间的线代表中点，蓝色代表查询的点。

第一种：![若无法加载请关闭 VPN](pE97mYF.png)

第二种：![若无法加载请关闭 VPN](pE97Ml9.png)

第三种：![若无法加载请关闭 VPN](pE97lO1.png)

第四种：![若无法加载请关闭 VPN](pE973ex.png)

第五种：![若无法加载请关闭 VPN](pE97dld.png)

第六种：![若无法加载请关闭 VPN](pE97w6A.png)

第七种：![若无法加载请关闭 VPN](pE970OI.png)

第八种：![若无法加载请关闭 VPN](pE97I00.png)

第九种：![若无法加载请关闭 VPN](pEZWdm9.png)

第十种：![若无法加载请关闭 VPN](pEZWwwR.png)

~~看个文章怎么跟个打音游一样~~

我们发现：只有第八种需要担心——有两个递归，可能导致时间复杂度变为 $\Theta(n)$。当然，第 $9$ 和第 $10$ 也需要担心，但是如果第 $8$ 种解决了，这两种也就迎刃而解了。

我们发现，一旦经过一次第 $8$ 中，就必然不会再经过第 $8,9$ 或 $10$ 种了。所以，如果我们把第 $1 \sim 7$ 种和第 $9,10$ 中当做两个组的话，那么 $8$ 就是连接这两个组的桥梁。其中，第一个组花费的时间是 $\mathcal O(\log n)$ 的，第二个组也是，而“桥梁”最多被调用一次，所以最终时间复杂度是 $\mathcal O(\log n) + \mathcal O(\log n) + 2\mathcal O(\log n) + \mathcal O(1) = \bm{\mathcal O(\log n)}$。

查询时间复杂度也是 $\bm{\mathcal O(\log n)}$ 的。

# 修改时间复杂度

我们发现和查询几乎没有区别，原本时间复杂度假掉的原因只是第一种情况会变成和第八种一样的 $T(n) = 2T(\frac{n}{2}) + \Theta(1)$，并且会变成两个第一种，时间复杂度直接废掉。加入 tag 之后就好啦！

时间复杂度证明和上述相同，是 $\mathcal O(\log n)$ 的。

这真的只是一个小 trick 吗？当然不是，这就是**线段树的精髓**，可以说，上面讲的思想就是线段树的灵魂，而这个 lazytag 就是线段树的骨架，缺一不可。

# tag 的细节

在查询和修改时，如果一个标记已经有了 tag，那么这个 tag 可能会被使用，则需要把子树的标记加上本身的标记，然后修改 $S$，然后把标记清空，这一过程称作**把标记下放**（pushdown）。

# 代码

动态分配内存，然而静态开点。

这就是最朴素的线段树了。

```cpp
// 需要 C++20 的 <bits> 头文件中的 bit_ceil 函数，作用是找到最小的 >= x 的 2 的幂，如果没有 C++20 也可以手写。

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
	public:
		segment<size_t> seg; // 负责区间
		_Valt s, tag; // S, lazytag
		segnode* lp = nullptr, * rp = nullptr; // 左右子树
		void pushdown() // 下放标记
		{
			s += tag * seg.size();
			if (lp) lp->tag += tag;
			if (rp) rp->tag += tag;
			tag = 0;
		}
	};
	segnode* rt;
	void init(segnode* root, size_t l, size_t r) // 初始化
	{
		root->seg = { l,r };
		root->s = root->tag = _Valt();
		if (l + 1 == r) return;
		else
		{
			init(root->lp = new segnode, l, (l + r) >> 1);
			init(root->rp = new segnode, (l + r) >> 1, r);
		}
	}
	_Valt inn_query(segnode* root, segment<size_t> seg) // 区间查询
	{
		root->pushdown(); // 下放懒标记
		if (root->seg == seg) return root->s;
		segment<size_t> segl = seg_and(root->lp->seg, seg), 
			segr = seg_and(root->rp->seg, seg); // 区间交
		_Valt sum = 0; // 和
		if (!segl.fail()) sum += inn_query(root->lp, segl);
		if (!segr.fail()) sum += inn_query(root->rp, segr);
		return sum;
	}
	void inn_add(segnode* root, segment<size_t> seg, _Valt val) // 区间修改
	{
		root->pushdown();
		if (root->seg == seg)
		{
			root->tag += val;
			return;
		}
		root->s += val * seg.size();
		segment<size_t> segl = seg_and(root->lp->seg, seg),
			segr = seg_and(root->rp->seg, seg);
		if (!segr.fail()) inn_add(root->rp, segr, val);
		if (!segl.fail()) inn_add(root->lp, segl, val);
	}
public:
	segtree(size_t sz)
	{
		sz = bit_ceil(sz); // 需要 2 的幂
		rt = new segnode{ 0, sz };
		init(rt, 0, sz);
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
```

---

update on 2025/9/12：发现上面代码过于 modern 了（但是可扩展性比较强……吧），这不好。贴一个 OI 中能用的代码（已经经过下面的通用化了），可以通过 P3372：

```cpp
// 区间加法、区间查询
#include <cstdio>
#include <algorithm>

using namespace std;

long long a[1000005];
long long s[2000005], tag[2000005];

void build(int id, int l, int r)
{
	if (l == r)
	{
		s[id] = a[l];
		return;
	}
	build(id * 2, l, (l + r) / 2);
	build(id * 2 + 1, (l + r) / 2 + 1, r);
	s[id] = s[id * 2] + s[id * 2 + 1];
}

void add(int id, int vl, int vr, int l, int r, long long k)
{
	int mdpt = (vl + vr) / 2;
	if (l == vl && r == vr) tag[id] += k;
	else
	{
		s[id] += (r - l + 1) * k;
		if (mdpt >= l) add(id * 2, vl, mdpt, l, min(mdpt, r), k);
		if (r > mdpt) add(id * 2 + 1, mdpt + 1, vr, max(mdpt + 1, l), r, k);
	}
}

long long query(int id, int vl, int vr, int l, int r)
{
	if (l == vl && r == vr) return s[id] + tag[id] * (r - l + 1);
	else
	{
		long long sum = (r - l + 1) * tag[id];
		int mdpt = (vl + vr) / 2;
		if (mdpt >= l) sum += query(id * 2, vl, mdpt, l, min(mdpt, r));
		if (r > mdpt) sum += query(id * 2 + 1, mdpt + 1, vr, max(mdpt + 1, l), r);
		return sum;
	}
}

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	for (int i = 1; i <= n; i++)
	{
		scanf("%lld", a + i);
	}
	build(1, 1, n);
	for (int i = 1; i <= m; i++)
	{
		int op, l, r;
		scanf("%d%d%d", &op, &l, &r);
		if (op == 1)
		{
			long long k;
			scanf("%lld", &k);
			add(1, 1, n, l, r, k);
		}
		else printf("%lld\n", query(1, 1, n, l, r));
	}
	return 0;
}
```

# 通用化

我们注意到，上面的线段树的实现要求长度为 $2$ 的幂。

如果我们要通用化，那么我们可以让线段树的形态不是满二叉树，而是完全二叉树。

代码几乎不需要进行任何改动。只需要把 `segtree` 构造函数中 `sz = bit_ceil(sz);` 删去即可。这都得益于 C++ 中 `size_t` 的除法是向下取整，而右移也是。

# 动态开点

其实也是一种 lazy 的技巧。

我们注意到在构造函数中刚开始就把节点建出来了，但是我们不需要这么做。我们可以使用的时候再建。

[板子题](https://www.luogu.com.cn/problem/U536018)。还没造数据。

代码（建议细细品味。仅更改了 `segtree` 类，不用管 `L7W_AB`（Lionblaze & Warrior，$\alpha \beta$）宏）：

```cpp
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
```
