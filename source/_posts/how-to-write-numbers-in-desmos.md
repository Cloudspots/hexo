---
title: 如何在 desmos 里写数字？
date: 2024-10-1 19:01:58
categories:
  - Technology & Engineering
tags: []
---
> 众所周知，desmos 图灵完备。

如果不想看过程的直接看这：[click me](https://www.desmos.com/calculator/5dgsf7tola)（附带了其他功能，一个特别难玩的小游戏）。

想看过程的也推荐看，辅助理解。

# 单个数码

第一个想法是，写 $10$ 个函数：

$$p_{n0}\left(x,y,l\right)=\left[\operatorname{polygon}\left(\left(x,y\right),\left(x,y+2l\right)\right),\operatorname{polygon}\left(\left(x,y\right),\left(x+l,y\right)\right),\operatorname{polygon}\left(\left(x+l,y\right),\left(x+l,y+2l\right)\right),\operatorname{polygon}\left(\left(x,y+2l\right),\left(x+l,y+2l\right)\right)\right]$$
$$p_{n1}\left(x,y,l\right)=\left[\operatorname{polygon}\left(\left(x,y\right),\left(x,y+2l\right)\right)\right]$$
$$p_{n2}\left(x,y,l\right)=\left[\operatorname{polygon}\left(\left(x+l,y\right),\left(x,y\right)\right),\operatorname{polygon}\left(\left(x,y\right),\left(x,y+l\right)\right),\operatorname{polygon}\left(\left(x,y+l\right),\left(x+l,y+l\right)\right),\operatorname{polygon}\left(\left(x+l,y+l\right),\left(x+l,y+2l\right)\right),\operatorname{polygon}\left(\left(x+l,y+2l\right),\left(x,y+2l\right)\right)\right]$$
$$p_{n3}\left(x,y,l\right)=\left[\operatorname{polygon}\left(\left(x,y+2l\right),\left(x+l,y+2l\right)\right),\operatorname{polygon}\left(\left(x+l,y+2l\right),\left(x+l,y\right)\right),\operatorname{polygon}\left(\left(x,y+l\right),\left(x+l,y+l\right)\right),\operatorname{polygon}\left(\left(x,y\right),\left(x+l,y\right)\right)\right]$$
$$p_{n4}\left(x,y,l\right)=\left[\operatorname{polygon}\left(\left(x,y+2l\right),\left(x,y+l\right)\right),\operatorname{polygon}\left(\left(x,y+l\right),\left(x+l,y+l\right)\right),\operatorname{polygon}\left(\left(x+l,y+2l\right),\left(x+l,y\right)\right)\right]$$
$$p_{n5}\left(x,y,l\right)=\left[\operatorname{polygon}\left(\left(x,y\right),\left(x+l,y\right)\right),\operatorname{polygon}\left(\left(x+l,y\right),\left(x+l,y+l\right)\right),\operatorname{polygon}\left(\left(x+l,y+l\right),\left(x,y+l\right)\right),\operatorname{polygon}\left(\left(x,y+l\right),\left(x,y+2l\right)\right),\operatorname{polygon}\left(\left(x,y+2l\right),\left(x+l,y+2l\right)\right)\right]$$
$$p_{n6}\left(x,y,l\right)=\left[\operatorname{polygon}\left(\left(x+l,y+2l\right),\left(x,y+2l\right)\right),\operatorname{polygon}\left(\left(x,y+2l\right),\left(x,y\right)\right),\operatorname{polygon}\left(\left(x,y\right),\left(x+l,y\right)\right),\operatorname{polygon}\left(\left(x+l,y\right),\left(x+l,y+l\right)\right),\operatorname{polygon}\left(\left(x+l,y+l\right),\left(x,y+l\right)\right)\right]$$
$$p_{n7}\left(x,y,l\right)=\left[\operatorname{polygon}\left(\left(x+l,y\right),\left(x+l,y+2l\right)\right),\operatorname{polygon}\left(\left(x+l,y+2l\right),\left(x,y+2l\right)\right)\right]$$
$$p_{n8}\left(x,y,l\right)=\left[\operatorname{polygon}\left(\left(x,y\right),\left(x,y+2l\right)\right),\operatorname{polygon}\left(\left(x,y+2l\right),\left(x+l,y+2l\right)\right),\operatorname{polygon}\left(\left(x+l,y+2l\right),\left(x+l,y\right)\right),\operatorname{polygon}\left(\left(x+l,y\right),\left(x,y\right)\right),\operatorname{polygon}\left(\left(x,y+l\right),\left(x+l,y+l\right)\right)\right]$$
$$p_{n9}\left(x,y,l\right)=\left[\operatorname{polygon}\left(\left(x,y+l\right),\left(x,y+2l\right)\right),\operatorname{polygon}\left(\left(x,y+2l\right),\left(x+l,y+2l\right)\right),\operatorname{polygon}\left(\left(x+l,y+2l\right),\left(x+l,y\right)\right),\operatorname{polygon}\left(\left(x+l,y\right),\left(x,y\right)\right),\operatorname{polygon}\left(\left(x,y+l\right),\left(x+l,y+l\right)\right)\right]$$

但是这样每一个数字还是要手动写 $p_{nk}$，不方便。

注意到每个数字最多用 $5$ 条线，所以先对其进行一些神奇的操作，变成：（这里不加 $\KaTeX$ 了）

```katex
p_{n0} \left( x , y , l \right)= \left[ \operatorname{polygon} \left( \left( x , y \right) , \left( x , y+2l \right) \right) , \operatorname{polygon} \left( \left( x , y \right) , \left( x+l , y \right) \right) , \operatorname{polygon} \left( \left( x+l , y \right) , \left( x+l , y+2l \right) \right) , \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x+l , y+2l \right) \right) , \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x , y+2l \right) \right) \right]
p_{n1} \left( x , y , l \right)= \left[ \operatorname{polygon} \left( \left( x , y \right) , \left( x , y+2l \right) \right) , \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x , y+2l \right) \right) , \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x , y+2l \right) \right) , \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x , y+2l \right) \right) , \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x , y+2l \right) \right) \right]
p_{n2} \left( x , y , l \right)= \left[ \operatorname{polygon} \left( \left( x+l , y \right) , \left( x , y \right) \right) , \operatorname{polygon} \left( \left( x , y \right) , \left( x , y+l \right) \right) , \operatorname{polygon} \left( \left( x , y+l \right) , \left( x+l , y+l \right) \right) , \operatorname{polygon} \left( \left( x+l , y+l \right) , \left( x+l , y+2l \right) \right) , \operatorname{polygon} \left( \left( x+l , y+2l \right) , \left( x , y+2l \right) \right) \right]
p_{n3} \left( x , y , l \right)= \left[ \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x+l , y+2l \right) \right) , \operatorname{polygon} \left( \left( x+l , y+2l \right) , \left( x+l , y \right) \right) , \operatorname{polygon} \left( \left( x , y+l \right) , \left( x+l , y+l \right) \right) , \operatorname{polygon} \left( \left( x , y \right) , \left( x+l , y \right) \right) , \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x , y+2l \right) \right) \right]
p_{n4} \left( x , y , l \right)= \left[ \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x , y+l \right) \right) , \operatorname{polygon} \left( \left( x , y+l \right) , \left( x+l , y+l \right) \right) , \operatorname{polygon} \left( \left( x+l , y+2l \right) , \left( x+l , y \right) \right) , \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x , y+2l \right) \right) , \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x , y+2l \right) \right) \right]
p_{n5} \left( x , y , l \right)= \left[ \operatorname{polygon} \left( \left( x , y \right) , \left( x+l , y \right) \right) , \operatorname{polygon} \left( \left( x+l , y \right) , \left( x+l , y+l \right) \right) , \operatorname{polygon} \left( \left( x+l , y+l \right) , \left( x , y+l \right) \right) , \operatorname{polygon} \left( \left( x , y+l \right) , \left( x , y+2l \right) \right) , \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x+l , y+2l \right) \right) \right]
p_{n6} \left( x , y , l \right)= \left[ \operatorname{polygon} \left( \left( x+l , y+2l \right) , \left( x , y+2l \right) \right) , \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x , y \right) \right) , \operatorname{polygon} \left( \left( x , y \right) , \left( x+l , y \right) \right) , \operatorname{polygon} \left( \left( x+l , y \right) , \left( x+l , y+l \right) \right) , \operatorname{polygon} \left( \left( x+l , y+l \right) , \left( x , y+l \right) \right) \right]
p_{n7} \left( x , y , l \right)= \left[ \operatorname{polygon} \left( \left( x+l , y \right) , \left( x+l , y+2l \right) \right) , \operatorname{polygon} \left( \left( x+l , y+2l \right) , \left( x , y+2l \right) \right) , \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x , y+2l \right) \right) , \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x , y+2l \right) \right) , \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x , y+2l \right) \right) \right]
p_{n8} \left( x , y , l \right)= \left[ \operatorname{polygon} \left( \left( x , y \right) , \left( x , y+2l \right) \right) , \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x+l , y+2l \right) \right) , \operatorname{polygon} \left( \left( x+l , y+2l \right) , \left( x+l , y \right) \right) , \operatorname{polygon} \left( \left( x+l , y \right) , \left( x , y \right) \right) , \operatorname{polygon} \left( \left( x , y+l \right) , \left( x+l , y+l \right) \right) \right]
p_{n9} \left( x , y , l \right)= \left[ \operatorname{polygon} \left( \left( x , y+l \right) , \left( x , y+2l \right) \right) , \operatorname{polygon} \left( \left( x , y+2l \right) , \left( x+l , y+2l \right) \right) , \operatorname{polygon} \left( \left( x+l , y+2l \right) , \left( x+l , y \right) \right) , \operatorname{polygon} \left( \left( x+l , y \right) , \left( x , y \right) \right) , \operatorname{polygon} \left( \left( x , y+l \right) , \left( x+l , y+l \right) \right) \right]
```
然后用 Python 处理出每一项：
```plaintext
x y x y x y+2l x y x+l y x+l y x+l y+2l x y+2l x+l y+2l x y+2l x y+2l
x y x y x y+2l x y+2l x y+2l x y+2l x y+2l x y+2l x y+2l x y+2l x y+2l
x y x+l y x y x y x y+l x y+l x+l y+l x+l y+l x+l y+2l x+l y+2l x y+2l
x y x y+2l x+l y+2l x+l y+2l x+l y x y+l x+l y+l x y x+l y x y+2l x y+2l
x y x y+2l x y+l x y+l x+l y+l x+l y+2l x+l y x y+2l x y+2l x y+2l x y+2l
x y x y x+l y x+l y x+l y+l x+l y+l x y+l x y+l x y+2l x y+2l x+l y+2l
x y x+l y+2l x y+2l x y+2l x y x y x+l y x+l y x+l y+l x+l y+l x y+l
x y x+l y x+l y+2l x+l y+2l x y+2l x y+2l x y+2l x y+2l x y+2l x y+2l x y+2l
x y x y x y+2l x y+2l x+l y+2l x+l y+2l x+l y x+l y x y x y+l x+l y+l
x y x y+l x y+2l x y+2l x+l y+2l x+l y+2l x+l y x+l y x y x y+l x+l y+l
```
再处理一波，处理出系数：
```plaintext
0 0 0 0 0 2 0 0 1 0 1 0 1 2 0 2 1 2 0 2 0 2
0 0 0 0 0 2 0 2 0 2 0 2 0 2 0 2 0 2 0 2 0 2
0 0 1 0 0 0 0 0 0 1 0 1 1 1 1 1 1 2 1 2 0 2
0 0 0 2 1 2 1 2 1 0 0 1 1 1 0 0 1 0 0 2 0 2
0 0 0 2 0 1 0 1 1 1 1 2 1 0 0 2 0 2 0 2 0 2
0 0 0 0 1 0 1 0 1 1 1 1 0 1 0 1 0 2 0 2 1 2
0 0 1 2 0 2 0 2 0 0 0 0 1 0 1 0 1 1 1 1 0 1
0 0 1 0 1 2 1 2 0 2 0 2 0 2 0 2 0 2 0 2 0 2
0 0 0 0 0 2 0 2 1 2 1 2 1 0 1 0 0 0 0 1 1 1
0 0 0 1 0 2 0 2 1 2 1 2 1 0 1 0 0 0 0 1 1 1
```
转置：
```plaintext
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 1 0 0 0 1 1 0 0
0 0 0 2 2 0 2 0 0 1
0 0 0 1 0 1 0 1 0 0
2 2 0 2 1 0 2 2 2 2
0 0 0 1 0 1 0 1 0 0
0 2 0 2 1 0 2 2 2 2
1 0 0 1 1 1 0 0 1 1
0 2 1 0 1 1 0 2 2 2
1 0 0 0 1 1 0 0 1 1
0 2 1 1 2 1 0 2 2 2
1 0 1 1 1 0 1 0 1 1
2 2 1 1 0 1 0 2 0 0
0 0 1 0 0 0 1 0 1 1
2 2 1 0 2 1 0 2 0 0
1 0 1 1 0 0 1 0 0 0
2 2 2 0 2 2 1 2 0 0
0 0 1 0 0 0 1 0 0 0
2 2 2 2 2 2 1 2 1 1
0 0 0 0 0 1 0 0 1 1
2 2 2 2 2 2 1 2 1 1
```
然后再存到列表中，最后弄一下格式上的问题就好啦！
```katex
p_{n0}\left(x,y,l,p\right)=\left[\operatorname{polygon}\left(\left(x+k_{g1}[p+1]l,y+k_{g2}[p+1]l\right),\left(x+k_{g3}[p+1]l,y+k_{g4}[p+1]l\right)\right),\operatorname{polygon}\left(\left(x+k_{g5}[p+1]l,y+k_{g6}[p+1]l\right),\left(x+k_{g7}[p+1]l,y+k_{g8}[p+1]l\right)\right),\operatorname{polygon}\left(\left(x+k_{g9}[p+1]l,y+k_{g10}[p+1]l\right),\left(x+k_{g11}[p+1]l,y+k_{g12}[p+1]l\right)\right),\operatorname{polygon}\left(\left(x+k_{g13}[p+1]l,y+k_{g14}[p+1]l\right),\left(x+k_{g15}[p+1]l,y+k_{g16}[p+1]l\right)\right),\operatorname{polygon}\left(\left(x+k_{g17}[p+1]l,y+k_{g18}[p+1]l\right),\left(x+k_{g19}[p+1]l,y+k_{g20}[p+1]l\right)\right)\right]
```
$$ p_{n0}\left(x,y,l,p\right)=\left[\operatorname{polygon}\left(\left(x+k_{g1}[p+1]l,y+k_{g2}[p+1]l\right),\left(x+k_{g3}[p+1]l,y+k_{g4}[p+1]l\right)\right),\operatorname{polygon}\left(\left(x+k_{g5}[p+1]l,y+k_{g6}[p+1]l\right),\left(x+k_{g7}[p+1]l,y+k_{g8}[p+1]l\right)\right),\operatorname{polygon}\left(\left(x+k_{g9}[p+1]l,y+k_{g10}[p+1]l\right),\left(x+k_{g11}[p+1]l,y+k_{g12}[p+1]l\right)\right),\operatorname{polygon}\left(\left(x+k_{g13}[p+1]l,y+k_{g14}[p+1]l\right),\left(x+k_{g15}[p+1]l,y+k_{g16}[p+1]l\right)\right),\operatorname{polygon}\left(\left(x+k_{g17}[p+1]l,y+k_{g18}[p+1]l\right),\left(x+k_{g19}[p+1]l,y+k_{g20}[p+1]l\right)\right)\right] $$

# 多个数字

递归。

```katex
F_{print}\left(x,y,l,p\right)=F_{print}\left(x,y,l,\operatorname{floor}\left(\frac{p}{10}\right)\right).\operatorname{join}\left(p_{n0}\left(x+2l\operatorname{floor}\left(\log_{10}\left(p\right)\right),y,l,\operatorname{mod}\left(p,10\right)\right)\right)
```
$$ F_{print}\left(x,y,l,p\right)=F_{print}\left(x,y,l,\operatorname{floor}\left(\frac{p}{10}\right)\right).\operatorname{join}\left(p_{n0}\left(x+2l\operatorname{floor}\left(\log_{10}\left(p\right)\right),y,l,\operatorname{mod}\left(p,10\right)\right)\right) $$