---
title: 浅谈线段树——动态化分治
tags:
  - Segment Tree
  - Divide and Conquer
categories:
  - Algorithm & Theory
date: 2026-07-21 10:53:22
updated: 2026-07-21 10:53:22
---
# 浅谈线段树——动态化分治

## 单点加法，区间求和

### 分治

对于单点加法，我们暴力处理。

对于区间求和，我们考虑一个意义不明的分治。我们考虑每次把区间分成两部分，左右两边分别求和。

考虑到这个分治并不优秀。我们希望无论你查询什么区间，分治过程中分出的小区间都有很大一部分是相同的，这样就可以用一些方法处理这些相同的区间，然后遇到这样的区间就直接用答案，不递归分治下去现场算。

那我们先考虑询问整个区间。它遇到了什么区间？假设 $n=8$。

| $[1,8]$ | < | < | < | < | < | < | < |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| $[1,4]$ | < | < | < | $[5,8]$ | < | < | < |
| $[1,2]$ | < | $[3,4]$ | < | $[5,6]$ | < | $[7,8]$ | < |
| $\{1\}$ | $\{2\}$ | $\{3\}$ | $\{4\}$ | $\{5\}$ | $\{6\}$ | $\{7\}$ | $\{8\}$ |

我们现在考虑查询 $[2,6]$。

首先我们注意到，$[3,4]$ 和 $[5,6]$ 是我们算过的区间，直接用。$\{2\}$ 也是算过的。

那么我们就可以现在摒弃分治“分一半”的传统，改为“用若干个区间拼起来”。

现在我们就遇到两个问题。

- 怎么确定用哪些区间拼起来？
- 这些区间的个数是 $o(n)$ 吗？

如果第一个问题做不出来，那整个算法不可行。如果第二个问题是否，那么这个算法不如暴力。

我们先解决第一个问题。我们还是考虑 $[2,6]$，但是用一种更加程序化的思维去确定。

首先我们考虑区间 $[1,8]$，它包含 $[2,6]$。不行。

然后向左考虑 $[1,4]$，它仍然不被 $[2,6]$ 包含，不行。但是起码有交，所以 $[1,4]$ 的某个子区间是能派上用场的。

然后再向左考虑 $[1,2]$。它和 $[2,6]$ 的交集只有 $2$，不行。往左 $\{1\}$ 根本没有交集，不可。但是往右 $\{2\}$ 刚好就是 $[2,6]$ 的子集，可以。

回溯。从 $[1,4]$ 往右考虑 $[3,4]$，它是 $[2,6]$ 的子集，可以。

再回溯，从 $[1,8]$ 往右考虑 $[5,8]$，不被包含但是有交。

往左，$[5,6]$ 是子集。$[7,8]$ 无交，不递归。

我们统计途中遇到的所有 $[2,6]$ 的子集，就得到了拼出 $[2,6]$ 的集合 $\{2\},[3,4],[5,6]$。

这个方法还有一种特别直观的几何方法理解。

$$ \begin{aligned}&\color{blue}\hspace{8pt}\overline{\hspace{29pt}}\\&\color{normal}\underline{\hspace{61pt}}\\&\underline{\hspace{29pt}}\hspace{3pt}\underline{\hspace{29pt}}\\&\underline{\hspace{13pt}}\hspace{3pt}\underline{\hspace{13pt}}\hspace{3pt}\underline{\hspace{13pt}}\hspace{3pt}\underline{\hspace{13pt}}\\&\underline{\hspace{5pt}}\hspace{3pt}\underline{\hspace{5pt}}\hspace{3pt}\underline{\hspace{5pt}}\hspace{3pt}\underline{\hspace{5pt}}\hspace{3pt}\underline{\hspace{5pt}}\hspace{3pt}\underline{\hspace{5pt}}\hspace{3pt}\underline{\hspace{5pt}}\hspace{3pt}\underline{\hspace{5pt}}\end{aligned} % 用 \KaTeX 画线，你也是个神人
$$

读者可以自行想象上面这条蓝色的查询线段从上往下落下来，遇到它包含的区间就贴上去，否则直接忽略、掉下来。最终会是这样：

$$ \begin{aligned}&\color{normal}\underline{\hspace{61pt}}\\&\underline{\hspace{29pt}}\hspace{3pt}\underline{\hspace{29pt}}\\&\underline{\hspace{13pt}}\hspace{3pt}\color{blue}\underline{\hspace{13pt}}\hspace{3pt}\underline{\hspace{13pt}}\color{normal}\hspace{3pt}\underline{\hspace{13pt}}\\&\underline{\hspace{5pt}}\hspace{3pt}\color{blue}\underline{\hspace{5pt}}\color{normal}\hspace{3pt}\underline{\hspace{5pt}}\hspace{3pt}\underline{\hspace{5pt}}\hspace{3pt}\underline{\hspace{5pt}}\hspace{3pt}\underline{\hspace{5pt}}\hspace{3pt}\underline{\hspace{5pt}}\hspace{3pt}\underline{\hspace{5pt}}\end{aligned} % 神人 Lionblaze，快去做题 
$$

我们形式化描述一下这个算法！

$$ 
\begin{array}{l}
\textbf{Description.}\ \text{Find the devided intervals.}
\end{array} 
$$
