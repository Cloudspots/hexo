---
title: test $\LaTeX$
date: 2026-07-19 19:44:08
category:
  - Test
tags:
  - test
---

:::info[case -2]

[$](http://$)

:::

:::info[case -1]

:::warning[:::success[k]
1
:::]

:::error[???]

啊？

:::

:::

反正我也不指望这能对，毕竟 `newRenderer.js` 是按行来的。。。

:::

:::info[case 0]

`\\`

\\

$\\$

:::

:::info[test case \#1]

:::warning[test 1]

:::info[123]
123
:::::info[456]
456
::::info[789]
789
::::
789
:::::
:::warning[qwq]
awa
:::
456
:::

---

:::info[123]
```cpp
:::info[456]
qwqawa
:::
```

# !!!
---

$$\sum_{i=1}^n\dfrac{n(n+1)}{2}$$
:::

# 123

::anti-ai[no showing]

:::

| table | 1 | $2$ | 3 |
|:-----:|:--:|:---|-----:|
| a | # b | c | `d` $123$ |
| qwq | awa | akaka | --- |


```cpp
::anti-ai[xxx]
:::info[123]
456
:::

:::align{center}
123
:::
```

:::info[testing]
::::info[我是标题]
大家好啊，我是说的道理，今天来点大家想看的东西。
::::

::::info[我是默认展开的折叠框]{open}
使用 `{open}` 使折叠框默认展开。
::::

::::success[$$\displaystyle\sum_{i = 1}^n \sum_{j = 1}^n \gcd(i, j)$$]
数学公式也是可以出现在标题上的。
::::

::::success[$\displaystyle\sum_{i = 1}^n \sum_{j = 1}^n \gcd(i, j)$ 1 2]
数学公式也是可以出现在标题上的。
::::


::::warning[警告]
这是一个警告框。
::::

::::error[错误]
这是一个错误框。
::::

:::epigraph[——otto]
大家好啊，我是说的道理，今天来点大家想看的东西。
:::

:::align{right}

![](https://cdn.luogu.com.cn/upload/usericon/1.png)
 123
#### 标题 4
:::

:::align{center}

![](https://cdn.luogu.com.cn/upload/usericon/1.png)
 123
#### 标题 4
:::

::cute-table{tuack}

| 测试点编号 | $n, m \leq$ | $k \leq$ | 特殊性质 |
| :-: | :-: | :-: | :-: |
| $1, 2$ | $6$ | $6$ | C |
| $3 \sim 5$ | $10^3$ | $10^3$ | ^ |
| $6 \sim 8$ | $5 \times 10^4$ | $10^2$ | 无 |
| $9, 10$ | $10^5$ | $10^5$ | AB |
| $11, 12$ | ^ | ^ | A |
| $13 \sim 15$ | ^ | ^ | C |
| $16 \sim 18$ | ^ | ^ | 无 |
| $19, 20$ | $3 \times 10^5$ | $2.5 \times 10^5$ | ^ |

| 标题 1| 标题 2           | 标题 3            |标题 4|
|:----:|:----------------:|:----------------:|:--:|
|1     |$\le 10$          |$\le 10$          |无   |
|2     |^                 |^                 |无   |
|3     |^                 |^                 |无   |
|4     |$\le 3\times 10^5$|^                 |无   |
|5     |^                 |^                 |无   |
|6     |^                 |$\le 3\times 10^5$|无   |
|7     |^                 |^                 |无   |
|8     |^                 |^                 |无   |
|9     |^                 | 跨列合并 1        |<   |
|10    |跨列合并 2         |<                 |无   |

  :::info[1[2]3::[link](https://www.luogu.com.cn)]  
2
:::  

::anti-ai[123]

:::info[test case \#2]

$\begin{bmatrix}1&2\\3&4\end{bmatrix}$

$$\begin{bmatrix}1&2\\3&4\end{bmatrix}$$

$\begin{bmatrix}1&2&3\\4&5&6\\7&8&9\end{bmatrix}$

$$\begin{bmatrix}1&2&3\\4&5&6\\7&8&9\end{bmatrix}$$

$$\left\lfloor\dfrac{1}{2}\right\rfloor=0$$

$\left\lfloor\dfrac{1}{2}\right\rfloor=0$

$$\left\lceil\dfrac{1}{2}\right\rceil=1$$

$\left\lceil\dfrac{1}{2}\right\rceil=1$

:::

|a|b|c|d|
|:--|:--|:--|:--|
|1|<|<|2|
|^|^|<|4|
