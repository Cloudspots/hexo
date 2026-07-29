---
title: Tarjan 的一堆算法学习笔记
date: 2025-1-14 14:34:20
categories:
  - Algorithm & Theory
tags: []
---
# For all

Tarjan 算法是一类特殊的深度优先搜索算法。时间复杂度通常为 $\mathcal O(n+m)$（$n$ 代表边数，$m$ 代表点数，下同）

$\mathrm{dfn}_i$ 代表在搜索过程中 $i$ 被搜索到的次序。

在 DFS 树中，会出现三种边：

1. 树边。当搜索到 $u$ 时有一条边 $u \rightarrow v$ 且选择了这条边且 $v$ 还没有走过时会产生这类边。
2. 后向边。当搜索到 $u$ 时有一条边 $u \rightarrow v$ 且选择了这条边且 $v$ 走过且 $v$ 是 $u$ 的祖先时会产生这类边。
3. 横叉边。当搜索到 $u$ 时有一条边 $u \rightarrow v$ 且选择了这条边且 $v$ 走过且 $v$ 不是 $u$ 的祖先时会产生这类边。

三种，好像有点多，但其实在**无向图**中横叉边是不存在的，建议大家先想想怎么证明，如果想不出来可以看看[这篇题解](https://www.luogu.com/article/d7cwb5v8)。

注意：就算图是无向的（Tarjan 算法可以处理有向和无向图）dfs 树中的边都是有向的。都是在定义中从 $u$ 指向 $v$。

$\mathrm{low}_i$ 代表 $i$ 的子树中的节点经过**最多一条**非树边能够到达的 $\mathrm{dfn}$ 最小的节点的 $\mathrm{dfn}$。

至于为什么是最多一条，稍后解释。

注意：dfs 树并不是唯一的。

# 例子

## 一（无向图）

我们就拿 [Graph Editor](https://csacademy.com/app/graph_editor/) 的默认图来举例吧。

![](pEFBmQS.png)

其 dfs 树（之一）是（Graph Editor 的 Config 页面的 Run Command 的 Arrange as tree 选项可以一键生成 dfs 树）：

![](pEFBGWV.png)

## 二（有向图）

P3609 的样例图。

![](pEFBtQU.png)

dfs 树（之一）：

![](pEFBjTs.png)

# 割边（又称桥）

## 定义

把图中的连通块中的中的一条边去掉，连通块变得不连通。

仅限无向图，因为有向图没有“连通”与“连通块”概念。

## 求法

想象一个人在连通块上行走。

显然，因为是一个连通块，所以这个人可以走到任何地方。

现在，有人在这个图上跑了一遍 dfs，生成了一个 dfs 树。注意，dfs 树（包括后向边）的形态和原图一样。

首先我们发现，显然后向边不可能是割边。

我们发现，如果一个人在一条树边的下面，他不经过树边无法到达树边的上面，那么这条树边是割边。证明略。

也就是说，如果 $u \rightarrow v$ 是一条树边，且 $\mathrm{low}_v > \mathrm{dfn}_u$，换种说法就是 $\mathrm{low}_v \ge \mathrm{dfn}_v$，再换种说法就是 $\mathrm{low}_v = \mathrm{dfn}_v$，则 $u \rightarrow v$ 是割边（实际上因为是无向图，应该是 $u \leftrightarrow v$）。

“等等。”小 $\alpha$[^1] 说，“$\mathrm{low}$ 的定义是只能经过一条后向边，既然跳一次不能跳到 $u$ 或 $u$ 上面，为什么不跳多次呢？”

小 $\beta$[^2] 解释道：

首先，我们知道，一个节点的 $\mathrm{low}$ 值有两种情况：

1. 不经过后向边。此时 $\mathrm{low} = \mathrm{dfn}$，因为只能在它的子树中走，而其子树的 $\mathrm{dfn}$ 值全都大于这个节点的 $\mathrm{dfn}$ 值，所以最佳情况就是不走。
2. 经过一条后向边。此时 $\mathrm{low}$ 就是那条后向边所指向的节点的 $\mathrm{dfn}$。证明略，可仿照上面。

那么，如果一个节点满足 $\mathrm{low}$ 值不小于 $\mathrm{dfn}$ 值，那么显然 $\mathrm{low} = \mathrm{dfn}$，并且这整个子树中都没有指向这个节点上面的后向边。

所以，从子树中开始，经过一条后向边只能在子树中，那么经过两条也是，三条，四条，不管经过多少条都是。

证毕。

### 如何求出 $\mathrm{low},\mathrm{dfn}$

求 $\mathrm{dfn}$ 很简单，按照定义求即可。

求 $\mathrm{low}$ 的朴素方法是 $\mathcal O(n^2)$ 的（枚举每一个可以到达的点，每个点中途可能经过 $\mathcal O(n)$ 个点）。

但是，我们发现：

- 对于后向边，因为已经走了一条后向边了，不能再走，所以就是边的终点的 $\mathrm{dfn}$ 值。
- 对于树边，可以再走最多一条后向边，所以是边的终点的 $\mathrm{low}$ 值。

于是我们就可以在 dfs 过程中求出 $\mathrm{dfn}$ 和 $\mathrm{low}$ 了。

同时注意，因为是无向图，所以一条边会拆成两条，那么会有从子节点到父节点的“后向边”，但这条边实际上是不存在的，所以需要记录父节点，遇到这类边就跳过。

伪代码：

$$ \begin{array}{ll}
0&\textbf{Note.} \text{ Arrays and variables are }0\text{ before use.}\\
1&\text{tmpdfn}\gets 0\\
2&\text{Tarjan}(u,\text{fa}(\text{default}=-1))\\
3&\qquad \text{tmpdfn}\gets\text{tmpdfn}+1\\
4&\qquad \mathrm{dfn}_u \gets \text{tmpdfn}\\
5&\qquad \mathrm{low}_u \gets \text{tmpdfn}\\
6&\qquad\textbf{for}\text{ each }v\text{ adjacent to }u\\
7&\qquad\qquad \textbf{if}\text{ }v=\text{fa}\\
8&\qquad\qquad\qquad \text{Don't deal with }v\\
9&\qquad\qquad \textbf{if}\text{ }\text{dfn}_v=0\\
10&\qquad\qquad\qquad \text{Tarjan}(v,u)\\
11&\qquad\qquad\qquad \text{low}_u \gets \min(\text{low}_u,\text{low}_v)\\
12&\qquad\qquad \textbf{else}\\
13&\qquad\qquad\qquad \text{low}_u\gets\min(\text{low}_u,\text{dfn}_v)
\end{array} $$

代码好写，但是伪代码实在太难写了（指 $\KaTeX$）！

## 重边

我们发现，如果有两条 $u\leftrightarrow v$ 的边，则这样会判断为错误。

解决方法很简单，给每条边绑上一个编号，然后判断是不是编号相同即可。

伪代码懒得写了。

## 总伪代码

$$ \begin{array}{ll}
0&\textbf{Note.} \text{ Arrays and variables are }0\text{ before use.}\\
1&\text{tmpdfn}\gets 0\\
2&\text{Tarjan}(u,\text{fa}(\text{default}=-1))\\
3&\qquad \text{tmpdfn}\gets\text{tmpdfn}+1\\
4&\qquad \mathrm{dfn}_u \gets \text{tmpdfn}\\
5&\qquad \mathrm{low}_u \gets \text{tmpdfn}\\
6&\qquad\textbf{for}\text{ each }v\text{ adjacent to }u\\
7&\qquad\qquad \textbf{if}\text{ }v=\text{fa}\\
8&\qquad\qquad\qquad \text{Don't deal with }v\\
9&\qquad\qquad \textbf{if}\text{ }\text{dfn}_v=0\\
10&\qquad\qquad\qquad \text{Tarjan}(v,u)\\
11&\qquad\qquad\qquad \text{low}_u \gets \min(\text{low}_u,\text{low}_v)\\
12&\qquad\qquad\qquad \textbf{if} \text{ } \\
13&\\
14&\qquad\qquad \textbf{else}\\
15&\qquad\qquad\qquad \text{low}_u\gets\min(\text{low}_u,\text{dfn}_v)
\end{array} $$

## Extend

### 边双连通图

没有割边的图就叫做边双连通图。

容易证明，边双连通图的任意两个点之间都有至少两条相互没有公共点的路径。

如何判断？显然根据定义即可。

### 边双连通分量

一个图的子图，如果是边双连通图，并且是极大的，则称之为这个图的边双连通分量。

# 割点

## 定义

在连通块中去掉这个点变得不连通。仅限无向图。

## 求法

待补。

# 最近公共祖先 LCA/NCA

## 定义

在一个树中，两个节点的公共祖先中深度最大的称为它们的最近公共祖先。容易发现，最近公共祖先唯一。

## 问题

树上有 $n$ 个点，$m$ 次询问，每次询问两个点的 LCA。不强制在线。

Tarjan 的 LCA 算法可以做到 $\mathcal O(n\alpha(n) +m)$ 离线回答。

## 算法

待补待补待补

# $\alpha\&\beta$

[^1]: 小 $\alpha$ 精于 whk，会 OI。  
[^2]: 小 $\beta$ 精于 OI 但是比较菜，会一点 whk。