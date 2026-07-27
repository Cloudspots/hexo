---
title: 题解：P3378 【模板】堆
date: 2025-4-19 23:25:22
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
# 什么是优先队列

优先队列是一种抽象数据结构（指没有规定操作具体实现，只规定了操作），支持三种操作：

- INSERT：往优先队列中插入一个元素 $x$。
- MINIMUM/MAXIMUM：求优先队列中的最小值/最大值。
- EXTRACT-MIN/EXTRACT-MAX：删除优先队列中的最小值/最大值。这里，最小值/最大值要和 MINIMUM/MAXIMUM 中相同。下同。
- DECREASE-KEY/INCREASE-KEY：把一个元素 $x$ 的值增加/减少。给定 $x$ 的位置。

最大优先队列指操作为 INSERT/MAXIMIM/EXTRACT-MAX/INCREASE-KEY 的优先队列，最小优先队列同理。

优先队列在 C++ STL 中被封装为 `priority_queue`（**不支持 DECREASE/INCREASE-KEY**，并且**默认为最大优先队列**），可以直接使用。但是，我们并不满足于此。不知道一个数据结构的原理，我们怎么可以安心使用呢？？

> 这也是这题被我提议升黄的原因。

优先队列的一种优秀实现是使用**二叉堆**，

# 数据结构介绍

二叉堆（以下简称堆，本文并没有介绍其它种类的堆）是一棵完全二叉树。我们定义堆的“末尾元素”和“超尾元素”为，如果根节点编号为 $1$，一个节点 $i$ 的左子结点和右子节点（如果存在）编号为 $2i$ 和 $2i+1$，则“末尾元素”是编号为堆的大小的节点，“超尾元素”为，如果堆中再多一个节点时的末尾元素的位置。

几种操作的实现，以最小堆为例：

- INSERT：把节点插入到堆的超尾元素处，然后不停和父节点交换直到自身成为根节点或者自身节点的值不小于父节点的值（即，每次如果可以交换则交换，并且下一次要判断的节点变为这次交换完毕的节点，即交换之前的父节点）。
- MINIMUM：根结点的值。
- EXTRACT-MIN：把根节点和末尾元素交换，然后直接删除交换之后的末尾元素。不停将自身节点和子节点中更小的交换，直到自身没有子节点或者自身比一个或两个子节点的值都小。
- DECREASE-KEY：不停和父节点交换直到自身成为根节点或者自身节点的值不小于父节点的值。

# 数据结构本质/正确性证明/时间复杂度分析

同样以最小优先队列（具体实现为最小堆）为例。

首先说明时间复杂度为什么优。$n$ 为二叉堆中当前元素个数。

- INSERT 时间复杂度为 $\mathcal O(\log n)$。
- MINIMUM 时间复杂度为 $\Theta(1)$。
- EXTRACT-MIN 时间复杂度为 $\mathcal O(\log n)$。
- DECREASE-KEY 时间复杂度为 $\mathcal O(\log n)$。

这些都是显然的。

对于最小堆，关键在于一个重要性质：自身的节点的值都不大于自身的若干个子节点的值。一个重要的推论就是，自身节点的值是以自身为根的整棵子树的值的最小值（可能不唯一）。

我们假设堆在每次操作开始前和结束后都满足最小堆性质。则 MINIMUM 正确性显然。

对于 INSERT 操作正确性显然，并且之后显然满足堆性质。顺带一提，INSERT 操作也可以解释为，堆大小为无穷大（但是虚拟元素的大小不计入堆真正大小），则此时超尾元素显然存在，我们让虚拟节点的值都为正无穷大，则此时只是把超尾节点的值减小到了想要的值而已。

> ~~不是吧不会还有人不会证吧~~为了严谨我们来证明一下。
>
> 我们设当前节点（在开始的时候是超尾节点，后面不断提升）为 $x$。假设 $x$ 的子树满足堆性质，且 $x$ 的任何祖先节点的值都不大于 $x$ 的任何子节点的 $v$（$v(k)$ 代表节点 $k$ 的值），而整个堆中唯一可能违反堆性质的只能是 $x$ 和 $x$ 的父节点 $p(x)$。开始的时候显然满足。
>
> 那么如果 $v(x)\ge v(p(x))$，则无需调整。整个堆中唯一可能违反堆性质的地方也没有违反，直接退出即可。
>
> 否则，$v(x)<v(p(x))$，而交换之后，$v(x)$ 增加了而 $v(p(x))$ 减少了，$v(x)$ 和 $v(p(x))$ 满足了堆性质，而显然这只会影响到 $v(x)$ 和 $v(p(x))$ 周围的元素的堆性质。
>
> $x$ 的子节点：根据归纳假设显然。
>
> $v(p(x))$ 的父节点：可能矛盾，需要进一步维护。
>
> 把 $x$ 变为 $p(x)$ 之后归纳假设是否仍然成立：画个图可能会理解得更好一些，唯一可能出毛病的地方就是交换前的 $x$ 是否满足。而因为 $v(p(x))$ 和其祖先节点满足堆性质（此时 $x$ 是交换之前的），所以不会出问题，归纳假设仍然成立。

DECREASE-KEY 操作正确性根据上面也是显然成立的。

EXTRACT-MIN 为什么正确？考虑一次调整。画图可知显然成立，具体证明留作习题。

另一个习题：最小堆是否能够高效支持 INCREREASE-KEY？如果能，设计出算法。

# 代码实现

此题 C++ 代码实现。本题不需要支持 DECREASE-KEY 操作。

这是无封装的二叉堆写法。

```cpp
#include <stack>
#include <cstdio>

using namespace std;

int arr[2000005];

int main()
{
	int n;
	scanf("%d", &n);
	int num = 0;
	while (n--)
	{
		int op;
		scanf("%d", &op);
		if (op == 1)
		{
			scanf("%d", arr + ++num);
			int i = num;
			while (i != 1 && arr[i / 2] > arr[i])
			{
				int t = arr[i];
				arr[i] = arr[i / 2];
				arr[i /= 2] = t;
			}
		}
		if (op == 2) printf("%d\n", arr[1]);
		if (op == 3)
		{
			arr[1] = arr[num--];
			int i = 1;
			while (i * 2 <= num && arr[i * 2] < arr[i] || i * 2 + 1 <= num && arr[i * 2 + 1] < arr[i])
			{
				if (i * 2 + 1 > num || arr[i * 2] < arr[i * 2 + 1])
				{
					int t = arr[i];
					arr[i] = arr[i * 2];
					arr[i = i * 2] = t;
				}
				else
				{
					int t = arr[i];
					arr[i] = arr[i * 2 + 1];
					arr[i = i * 2 + 1] = t;
				}
			}
		}
	}
	return 0;
}
```

这是带封装的二叉堆写法。

注意最后的节点只有左子结点的时候的特殊情况。

```cpp
#include <functional>
#include <cstdio>
#include <queue>

using namespace std;

template<typename T, typename C = vector<T>, typename P = less<T>>
class my_priority_queue
{
	C c{};
	P p{};
public:
	my_priority_queue() {}
	void insert(const T& x)
	{
		c.push_back(x);
		int id = c.size() - 1;
		while (id && p(c[id], c[(id - 1) / 2]))
		{
			swap(c[id], c[(id - 1) / 2]);
			id = (id - 1) / 2;
		}
	}
	T top() { return c[0]; }
	void pop()
	{
		swap(c[0], c[c.size() - 1]);
		c.pop_back();
		int id = 0;
		while (id * 2 + 1 < c.size() && p(c[id * 2 + 1], c[id]) || id * 2 + 2 < c.size() && p(c[id * 2 + 2], c[id]))
		{
			int mx = id * 2 + 2 >= c.size() || p(c[id * 2 + 1], c[id * 2 + 2]) ? id * 2 + 1 : id * 2 + 2;
			swap(c[id], c[mx]);
			id = mx;
		}
	}
};

int main()
{
	my_priority_queue<int> q;
	int n;
	scanf("%d", &n);
	while (n--)
	{
		int op;
		scanf("%d", &op);
		if (op == 1)
		{
			int x;
			scanf("%d", &x);
			q.insert(x);
		}
		if (op == 2) printf("%d\n", q.top());
		if (op == 3) q.pop();
	}
	return 0;
}
```

这是两种 `priority_queue` 写法。

第一种是因为 `priority_queue` 是最大堆，所以把所有元素取相反数然后存入。

```cpp
#include <cstdio>
#include <queue>

using namespace std;

int main()
{
	priority_queue<int> q;
	int n;
	scanf("%d", &n);
	while (n--)
	{
		int op;
		scanf("%d", &op);
		if (op == 1)
		{
			int x;
			scanf("%d", &x);
			q.push(-x);
		}
		if (op == 2) printf("%d\n", -q.top());
		if (op == 3) q.pop();
	}
	return 0;
}
```

第二种是自定义比较器[^1]。

```cpp
#include <functional>
#include <cstdio>
#include <queue>

using namespace std;

int main()
{
	priority_queue<int, vector<int>, greater<int>> q;
	int n;
	scanf("%d", &n);
	while (n--)
	{
		int op;
		scanf("%d", &op);
		if (op == 1)
		{
			int x;
			scanf("%d", &x);
			q.push(x);
		}
		if (op == 2) printf("%d\n", q.top());
		if (op == 3) q.pop();
	}
	return 0;
}
```

# 注解

[^1]: 为什么要写成 `priority_queue<int, vector<int>, greater<int>>` 呢？实际上 `priority_queue` 的原型通常形如 `template <class _Ty, class _Container = vector<_Ty>, class _Pr = less<typename _Container::value_type>> class priority_queue`，第一个参数代表元素类型，第二个代表内部容器（即如何存储二叉树，默认使用变长数组 `vector`），第三个参数代表比较器。比较器实际上是反的，如果你传入 `less` 则实际上是最大堆，`greater` 是最小堆，这个很难受。我手写的带封装 `my_priority_queue` 也使用了类似设计。