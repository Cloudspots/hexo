---
title: 题解：UVA658 这不是bug，而是特性 It's not a Bug, it's a Feature!
date: 2024-7-30 17:18:15
categories:
  - Solution
tags:
  - Solution
  - UVA Problem Solution
---
update：增加时间复杂度分析。

这道题拿到手一看就能发现是一道最短路题。显然，所有 Bug 的状态是图中的节点，而补丁就是边。

但是这道题比较特殊的地方，就是：如何表达一种状态，比如“有第 $1, 3, 4$ 个 Bug，没有第 $2, 5$ 个 Bug”呢？

我们可以显而易见地想到一种方法：用一个字符串表达，字符串中的字符就表示一个 Bug 是否存在。比如上面所说的状态就可以表示为 $\texttt{YNYYN}$。

但是，我们的节点可是要直接当做下标来用的，这时怎么办？难不成直接一个 `arr["YNYYN"]`？虽然 C++ 里有 $\Theta(\log n)$ 的自动排序的基于红黑树的 `map` 或者 $\Theta(1)$ 的不会自动排序的基于哈希表的 `unordered_map`，可以做到这一点。但这莫非也太费空间了一点，并且常数很大。

但是，我们注意到数据范围 $n \le 20$，我们就可以使用一个数字来存储一个状态，比如前面说的状态就可以使用 $10110$ 来表达。

但是这样似乎更不行了，因为这里的数字最大需要是 $11,111,111,111,111,111,111$（别数了，有 $20$ 个 $1$），数组都开不下。

但是，我们看到一长串的 $0$ 和 $1$，发现：

**这不完全是二进制吗？**

于是我们就可以用一个二进制数来存储。最大值是 $(11,111,111,111,111,111,111)_2$，也就是 $2^{20} - 1 = 1048575$，完全可以开的下。

所以，我们的问题就完全转化为了一个正权图上的最短路问题，可以使用堆优化的 Dijkstra 算法解决。

最终代码（只放关键部分）：
```cpp
class patch //补丁
{
public:
	int dist; //打补丁的时间
	string before, after; //打补丁的条件以及修复的 Bug
} patches[105];

int step[1 << 21]; //最短路径长度

bool can(int num, string str) //现在状态为 num，可不可以打条件为 str 的补丁
{
	for (int i = 0; i < str.size(); i++)
	{
		if (str[i] == '0') continue;
		if (str[i] == '-' &&  (num & (1 << i))) return false;
		if (str[i] == '+' && !(num & (1 << i))) return false;
	}
	return true;
}

int go(int num, string str) //现在状态为 num，打了修复 str 表示的 Bug 之后的状态
{
	for (int i = 0; i < str.size(); i++)
	{
		if (str[i] == '0') continue;
		if (str[i] == '+') num |=  (1 << i);
		if (str[i] == '-') num &= ~(1 << i);
	}
	return num;
}

int Dijkstra(int s, int t, int m) //Dijkstra 算法
{
	memset(step, 0x3f, sizeof step); //初始化为正无穷大
	step[s] = 0;
	class node
	{
	public:
		int id, dist;
		bool operator<(const node& y) const { return dist > y.dist; } //重载小于号，因为要用 priority_queue
	};
	priority_queue<node> pq;
	pq.push({ s, 0 });
	while (!pq.empty())
	{
		node u = pq.top();
		pq.pop();
		if (u.dist > step[u.id]) continue;
		for (int i = 1; i <= m; i++)
		{
			if (!can(u.id, patches[i].before)) continue; //如果不能打补丁，直接跳过
			int v = go(u.id, patches[i].after); //打完补丁之后的状态
			if (u.dist + patches[i].dist < step[v]) //松弛
			{
				step[v] = u.dist + patches[i].dist;
				pq.push({ v, step[v] });
			}
		}
	}
	return step[t];
}
```
时间复杂度：

Dijkstra 是 $\Theta(m \log n)$，其中 $m$ 在极端情况下，每个补丁都可以从任何一个节点到其他节点（也就是所有补丁都是 `x 000 xxx`，所有状态都可以使用），则一共有 $100n$ 条边，时间复杂度也就是 $\Theta(n \log n)$（虽然常数有点大）。

而每次松弛都要判断是否可以使用，时间复杂度 $\Theta(n)$。

总时间复杂度 $\Theta(n^2 \log n)$，对于此题的 $n \le 20$ 可以通过。