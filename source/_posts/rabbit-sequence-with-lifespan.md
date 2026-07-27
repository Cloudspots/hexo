---
title: 兔子数列，但是限制存活时间
date: 2024-10-5 17:15:33
categories:
  - Unclassified
tags: []
---
> 前置知识：兔子数列，就是第一年有一只兔子，每只兔子出生 $2$ 年之后（包括第 $2$ 年）都会产下 $1$ 只小兔子。很容易推导出第 $m$ 年的递推公式是 $f_i = f_{i-2} + f_{i-1}$，即斐波那契数列。

斐波那契数列有一种用到矩阵快速幂的 $\Theta(\log n)$ 求法：

原本 $2$ 年的兔子数量为 $\begin{bmatrix} f_{i-2} \\ f_{i-1} \end{bmatrix}$，后两年的兔子数量为 $\begin{bmatrix} f_{i-1} \\ f_{i-2} + f_{i-1} \end{bmatrix}$。

用一些 ~~玄学~~ 构造方法可以得出，变换后的向量刚好为变换前的向量乘上 $\begin{bmatrix} 0 & 1 \\ 1 & 1 \end{bmatrix}$，第 $n$ 项即为 $\begin{bmatrix} 0 & 1 \\ 1 & 1 \end{bmatrix}^n \begin{bmatrix} 0 \\ 1 \end{bmatrix}$，因为矩阵相乘具有结合律，所以可以用矩阵快速幂求出左边的 $\begin{bmatrix} 0 & 1 \\ 1 & 1 \end{bmatrix}^n $。

现在，@[NightTide](user/547908) 巨佬说了：

> 但是“兔子永生”这一点始终令人疑惑。假如我们加上一个兔子只能存活 m 年的限制条件，斐波那契数列会变成什么样子呢。

我们可以这样：

既然兔子只能存活 $m$ 年，那么前 $m$ 年的公式都是一样的，而 $m+1$ 年及以后都是 $f_i = f_{i-1} + f_{i-2} - f_{i-m} $。

如果要快速求出，那么先用一遍矩阵快速幂求出 $f_m$，再搞一些神奇的操作。

具体来讲：

原本的向量是 $\begin{bmatrix} f_{i-m} \\ f_{i-m+1} \\ \vdots \\ f_{i-2} \\ f_{i-1} \end{bmatrix}$，经过一年后的向量是 $\begin{bmatrix} f_{i-m+1} \\ f_{i-m+2} \\ \vdots \\ f_{i-1} \\ f_{i-1}+f_{i-2}-f_{i-m} \end{bmatrix}$。

于是构造一个矩阵。

构造出的这个矩阵是：

$$ \begin{bmatrix} 0&1&0&0&0&\cdots&0&0\\0&0&1&0&0&\cdots&0&0\\0&0&0&1&0&\cdots&0&0\\0&0&0&0&1&\cdots&0&0\\\vdots&\vdots&\vdots&\vdots&\vdots&\ddots&\vdots&\vdots\\0&0&0&0&0&\cdots&1&0\\0&0&0&0&0&\cdots&0&1\\\color{red}-1&0&0&0&0&\cdots&1&1 \end{bmatrix} $$

这是一个 $m$ 行 $m$ 列的矩阵，再用矩阵快速幂求一遍即可。

首先用一遍矩阵快速幂求出 $f_m$，耗时 $\Theta(\log m)$。

然后用矩阵快速幂 $\log n$ 次矩阵乘法，每次耗时 $\Theta(m^3)$。

总时间复杂度 $\Theta(\log m + m^3 \log n)=\Theta(m^3\log n)$，可见当 $m$ 较大时效率仍然不高。
