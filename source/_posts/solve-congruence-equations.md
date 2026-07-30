---
title: 解同余方程
date: 2024-4-24 20:57:33
categories:
  - Algorithm & Theory
tags:
  - CRT
updated: 2026-07-30 11:44:45
---

upd on 2026/7/30：修正 $\KaTeX$。

> $\lceil$ 今有物不知其数，三三数之余二；五五数之余三；七七数之余二。问物几何？$\rfloor$\
\
答曰：二十三。 \
\
$\lceil$ 三人同行七十稀，五树梅花廿一枝，七子团圆月正半，除百零五便得知。$\rfloor$

咋算？

$$\def \threety#1#2#3{ \begin{cases} x \equiv #1 \pmod 3 \\x \equiv #2 \pmod 5 \\x \equiv #3 \pmod 7 \end{cases} } \threety{2}{3}{2}$$

你别说，你还真别说，$\KaTeX$ 的 $\operatorname{\backslash def}$ 还挺好用（详见源码）

# 解法 #1

## 引入

先解以下三个同余方程：

$$\def \threety#1#2#3{ \begin{cases} x \equiv #1 \pmod 3 \\x \equiv #2 \pmod 5 \\x \equiv #3 \pmod 7 \end{cases} } \boxed{1. \threety{1}{0}{0}} \boxed{2. \threety{0}{1}{0}} \boxed{3. \threety{0}{0}{1}}$$

以 $1$ 为例：

首先，第二条和第三条可以合并（既为五的倍数又为七的倍数），变为：

$$\def \twoty#1#2{ \begin{cases} x \equiv #1 \pmod 3 \\x \equiv #2 \pmod {35} \end{cases} } \twoty{1}{0}$$

因为 $x$ 是 $35$ 的倍数，所以可以设 $y$ 为 $\frac{x}{35}$，方程变为（省略 $35y = x, \lfloor y\rfloor = y$）：

$$ 35y \equiv 1 \pmod 3 $$

$$ \because 35y = \underbrace{3 + 3y + 3y + \cdots + 3y}_{11\ \text{个}\ 3y}+_{}2y $$

$$ \because 3y \equiv 0 \pmod 3$$

$$ \therefore 35y \equiv 2y \pmod 3$$

所以可变为：

$$ 2y \equiv 1 (\operatorname{mod} 3) $$

尝试 $y$ 即可，$y \equiv 2 \pmod 3$，$x \equiv 2y \pmod {3 \times 5 \times 7}$，$x \equiv 70 \pmod{105}$

剩余两个方程同理，分别解得 $x \equiv 21 \pmod{105}$ 与 $x \equiv 15 \pmod{105}$

## 更进一步

继续！

$$ \def \threety#1#2#3{ \begin{cases} x \equiv #1\pmod 3 \\x \equiv #2\pmod 5 \\x \equiv #3\pmod 7 \end{cases} } \boxed{1. \threety{2}{0}{0}} \boxed{2. \threety{0}{3}{0}} \boxed{3. \threety{0}{0}{2}} $$

非常好，一点都不难，将解 $\times\ 3$ 或 $\times\ 2$ 即可：

$$ \boxed{1.x \equiv 140 \pmod{105}} \boxed{2.x \equiv 63 \pmod{105}} \boxed{3.x \equiv 30 \pmod{105}} $$

注意到解 $1$ 中， $\lfloor \frac{140}{105}\rfloor \not = 0$，所以可以简化：

$$ \boxed{1.x \equiv 35 \pmod {105}} \boxed{2.x \equiv 63 \pmod {105}} \boxed{3.x \equiv 30 \pmod {105}} $$

## ——完——

将三个解相加，得：

$$ x \equiv 128 \pmod{105} $$

即：

$$ x \equiv 23 \pmod{105} $$

# 解法 #2

试呗，就这样：

| 除以 $7$ 余 $2$ | $2$ | $9$ | $16$ | $23$ |
|--|--|--|--|--|
| 除以 $5$ 的余数 | $2$ | $4$ | $1$ | $3$ |
| 正确？ | $\color{red}\text F$ | $\color{red}\text F$ | $\color{red}\text F$ |$\color{green}\text T$ |

OK，我们的得出了：
$$ \begin{cases}x \equiv 3 \pmod 5 \\x \equiv 2 \pmod 7\end{cases} $$

等价于：

$$ x \equiv 23 \pmod{35} $$

再与前面的 $x \equiv 2 \pmod 3$ 合并：

| 除以 $35$ 余 $23$ | $23$ |
|--|--|
| 除以 $3$ 的余数 | $2$ |
| 正确？| $\color{green}\text T$ |

看，这不就出来了吗？

$$ x \equiv 23 \pmod{105} $$

#### 本人既是 xxs 又是蒟蒻，请多关照 QwQaQoQuQvQnQmQ