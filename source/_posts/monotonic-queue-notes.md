---
title: 单调队列学习笔记
date: 2025-2-5 11:21:25
categories:
  - Algorithm & Theory
tags:
	- Monotonic Queue
---
# 被单调队列了

我怎么这么晚才学单调队列，要被单调队列了：

![](pEemaTO.png)

# 什么是单调队列

单调队列是一种好吃的数据结构，\(和小 $\beta$ 一样好吃，\)经常用于优化多个有关联（“滑动”）的区间的最值。

单调队列实际上是一种特殊的双端队列，内部元素满足单调性（以下默认从队首到队尾单调不减），故要求最小值就可以直接取队首。

如何保证这个特性呢？我们考虑如果区间右端点扩展 $1$ 个元素会怎么样。

原本的队列是这样的：

![](pEem6Xt.png)

满足 $a_1\le a_2\le \dots\le a_k$。

现在如果我们要增加一个元素 $a_{k+1}$，会怎么样呢？

首先如果 $a_{k+1}\ge a_k$，则直接增加就满足单调性，可以直接放入队尾。

然后如果 $a_{k+1}<a_k$ 但是 $a_{k+1}\ge a_{k-1}$，则把 $a_k$ 从队尾弹出后再把 $a_{k+1}$ 放入队尾满足单调性。

以此类推，不停从队尾弹出，直到遇到第一个 $\le a_{k+1}$ 的数字，再放入。

为什么可以随便弹出，正确性能够得到保证？

如果区间内有一个元素 $a_i$ 满足 $a_{i-1} < a_i > a_{i+1}$，那么我们发现无论区间怎么移动，都会包含 $a_{i-1}$ 和 $a_{i+1}$ 中的至少一个，而有了这两个中的一个，$a_i$ 就不起作用了！它对答案没有任何贡献！所以可以直接弹出。

而由于单调性，$a_{i-1} < a_i$ 必然成立，所以如果 $a_i > a_{i+1}$，则 $a_i$ 无用，可以弹出。

解释一下“被单调队列”这个梗：我们按照入坑 OI 的顺序把人加入单调队列，而实力值作为排序依据，从大到小。

则如果有一个人比你晚加入，但是实力值比你高，则你这个“元素”就会被弹出（意为被吊打）。

## 时间复杂度

注意到每个元素最多入队一次，出队一次，故均摊复杂度 $\Theta(1)$。

---

这就是单调队列的基本用法了。

那么，现在你已经对单调队列有了一定了解，就让我们来看一看下面这个简单的例子，来把我们刚刚学到的东西运用到实践中吧。

# 试试看！

## 例题 $1$

$\boxed{\stackrel{\normalsize\quad\textbf{试试看！}\quad}{\quad\text{例题 }1.1\;\quad}}$

[P1886 滑动窗口 /【模板】单调队列](https://www.luogu.com.cn/problem/P1886)

~~我绝对不会告诉你我是因为想写这题题解才写这篇文章的~~

题目大意：给定数列 $a_{1\dots n}$ 和数字 $k$，对于每个 $i \le n - k + 1$ 求 $\displaystyle\max_{j=i}^{i+k-1}a_i$ 和 $\displaystyle\min_{j=i}^{i+k-1}a_i$。

虽然这题可以 ST 表做，但是使用单调队列可以做到线性时间复杂度。

以下讨论 $\min$ 的问题，$\max$ 的同理。

首先我们定义单调队列的节点：

```cpp
class node
{
public:
	int num, bgntime; // num 表示数字，bgntime 表示入队时间
};
```

首先，我们把前 $k$ 个数字加入单调队列，注意此时也要维持单调队列的单调性。

```cpp
deque<node> dq;
for (int i = 1; i <= k; i++)
{
	while (!dq.empty() && arr[i] < dq.back().num) dq.pop_back(); // 注意队列为空的时候不要继续
	dq.push_back({ arr[i], i });
}
```

然后我们对于每个元素，放入单调队列并弹出“过期”元素（这个元素的入队时间太早，现在已经不在 $[i,i+k-1]$ 中了）：

```cpp
for (int i = k; i <= n; i++)
{
	printf("%d%c", dq.front().num, " \n"[i == n]); // 输出最小元素（队首）
	while (dq.front().bgntime + k <= i + 1) dq.pop_front(); // 弹出队首（这里也可以用 if，因为最多只有一个元素过期）
	while (!dq.empty() && arr[i + 1] < dq.back().num) dq.pop_back(); // 单调它！
	dq.push_back({ arr[i + 1] , i + 1 }); // 放入队列
}
```

### 封装 yyds

首先双端队列不建议使用 STL 的 `deque`。

因为这里不需要随机访问，所以可以自己用链表手写双端队列。

```cpp
template<typename T, typename _Container = dedequeue<T>, typename _Compare = less<T>>
class Monotone
{
private:
	_Compare _Pred{};
	_Container ct;
public:
	Monotone() {}
	void push(const T& x)
	{
		while (!empty() && _Pred(x, ct.back())) ct.pop_back();
		ct.push_back(x);
	}
	T front() { return ct.front(); }
	void pop() { ct.pop_front(); }
	int size() { return ct.size(); }
	bool empty() { return ct.empty(); }
	virtual ~Monotone() {}
};
```

其中 `dedequeue` 是手写的双端队列。

顺便送一个双端队列：

```cpp
// 由于 deque 实在是太垃圾了，我们这里实现一个双端队列。
template<typename T>
class dedequeue
{
protected:
	class linknode
	{
	public:
		linknode* prev, * next;
		T val;
	};
private:
	linknode* _vend;
	int _sz;
public:
	dedequeue()
	{
		_vend = new linknode;
		_vend->prev = _vend->next = _vend;
		_sz = 0;
	}
	void push_front(T x)
	{
		linknode* newnode = new linknode;
		newnode->val = x;
		newnode->prev = _vend;
		newnode->next = _vend->next;
		_vend->next->prev = newnode;
		_vend->next = newnode;
		_sz++;
	}
	void push_back(T x)
	{
		linknode* newnode = new linknode;
		newnode->val = x;
		newnode->next = _vend;
		newnode->prev = _vend->prev;
		_vend->prev->next = newnode;
		_vend->prev = newnode;
		_sz++;
	}
	bool pop_back()
	{
		if (!_sz) return false;
		linknode* todelete = _vend->prev;
		_vend->prev = todelete->prev;
		todelete->prev->next = _vend;
		_sz--;
		return true;
	}
	bool pop_front()
	{
		if (!_sz) return false;
		linknode* todelete = _vend->next;
		_vend->next = todelete->next;
		todelete->next->prev = _vend;
		_sz--;
		return true;
	}
	T front()
	{
		return _vend->next->val;
	}
	T back()
	{
		return _vend->prev->val;
	}
	size_t size() { return _sz; }
	bool empty() { return size() == 0; }
	~dedequeue()
	{
		while (pop_back());
		delete _vend;
	}
};
```

## 例题 $2$

[P1714 切蛋糕](https://www.luogu.com.cn/problem/P1714)

不妨从“子段和”开始思考，一眼想到前缀和。

当固定 $l$ 时，相当于找 $\left(\displaystyle \max_{i=l}^{l+m-1} S_i\right)-S_{l-1}$，其中 $\displaystyle S_i=\sum_{j=1}^i p_i$。

然后就变成了单调队列模板题（滑动窗口最大值）。

注意，这里窗口右端点可以超，但是左端点不可以。

另外，$m=n$ 的情况就是最大子段和。