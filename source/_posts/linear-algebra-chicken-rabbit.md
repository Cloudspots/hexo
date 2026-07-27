---
title: 线性代数解鸡兔同笼（大雾）
date: 2024-9-27 21:57:25
categories:
  - Technology & Engineering
tags: []
---
灵感来自：[bilibili](https://www.bilibili.com/video/BV1wu411T7dj)，巨佬！

我们有 $14$ 个头，$32$ 只脚，所有鸡和兔都没有变异，头和脚都完整，没有数错。

# 小学奥数

假设全是鸡，则有 $14 \times 2 = 28$ 只脚。

但是少了 $4$ 只脚，因为我们看到一只兔子就施展膜法将其变成了鸡，导致所有兔子都变成了鸡。

每只兔子变成鸡，头数不变，少了两只脚，所以有 $4 \div 2 = 2$ 只兔子，有 $14 - 2 = 12$ 只鸡。

# 初中

解：设有 $x$ 只鸡，$y$ 只兔。

则有：

$$ \begin{cases} 
x+y=14 \\
2x+4y=32
\end{cases} $$

解得（过程太简单不写了）：

$$ \begin{cases}
x=12 \\
y=2
\end{cases} $$

# 进入正题！

线性变换（线性映射）是什么：一个函数，输入输出都是向量，满足如下性质：

$$ \begin{aligned} f(k\vec x)&=kf(\vec x) \\
f(\vec x + \vec y) &= f(\vec x) + f(\vec y)
\end{aligned} $$

这个 $f$ 就是一个线性映射，通常记为 $A$。

向量是什么：一个 `vector`，还不懂吗。哦读者可能不是 C艹 党，所以说一下：向量就是一系列数，类似我们幼儿园就学过的数对。

向量也可以用来表示一个点，学习时通常是 $2$ 维或 $3$ 维的：

![忽略那个箭头，忘记 `hideturtle()` 了](pAcCTcq.png)

我们要表示图中的 `O` 点，就可以用数对，注意到 `O` 点在第 $3$ 列，第 $2$ 行，所以可以表示为 $(3, 2)$。

如果我们想换种方法呢？

$$ \begin{bmatrix}
3 \\
2
\end{bmatrix} $$

记为 $\vec{O}$ 怎么样？$O$ 是名字，上面的箭头 $\vec{}$ 表示它是一个向量。

实际上，向量可以理解为一个点，也可以理解为一条从原点指向某个点的箭头。

向量的数乘（就是一个数字乘上一个向量）就是把这个向量的长度乘上这个数，也就是把 $x$ 和 $y$ 坐标分别乘上这个数。

向量的加法（两个向量之和）就是把两个向量头尾拼起来，然后记录它们最终指向的点，它们的和就是这个点。

是不是感觉和[复数](https://www.luogu.com.cn/article/7o02q8ms)有点像？没错，复数可以表示向量，但是仅限二维，然而向量可以是三维，四维，一维，零维，甚至 $114514$ 维（我乱说的）和 $12288$ 维（据说 GPT-3 内部的向量就是这个）。

现在我们有一个神奇的线性映射 $A$，作用是把向量的长度乘 $2$。容易验证它满足线性映射的条件。

则对 $\vec{O}$ 进行 $A$ 映射会怎么样？原本要记作 $A(\vec{O})$ 的，但是我们可以省略括号（真的吗，函数也可以吗），记作 $A\vec{O}$（不管你是怎么想的，反正目前数学界就是这么写的），也可以记作 $A$ 和 $\vec{O}$ 的积，也就是它们相乘的结果。

其实，一个线性映射就是一个矩阵，它的具体含义暂且不谈，这里只需要知道两个矩阵相乘就是两个矩阵相继作用的结果，比如 $A$ 和 $B$ 相乘，就是 $AB$，表示先进行 $B$ 变换再进行 $A$ 变换，很奇怪，但是函数不就是这样的吗？$A(B(\vec{u}))$ 嘛，省略掉括号。

我们来看看这种运算是否满足交换律，结合律（显然满足分配律，因为就是定义）：

$f(g(x)) \not = g(f(x))$，不满足交换律。

$f(g(h(x))) = f(g(h(x)))$，满足结合律。

不过好像有点不太好？我们来详细地说一下。

$$(AB)C = A(BC)$$

对于前者：依次进行 $C$，$B$，$A$ 变换。

对于后者：依次进行 $C$，$B$，$A$ 变换。

有什么可以证明的？

接下来讲讲矩阵里面具体是什么。

对于一个二维空间，所有点都可以由两个向量 $\vec{u}$ 和 $\vec{v}$ 分别乘上两个数 $a$ 和 $b$ 的和得到，具体来讲是 $\vec{x}=a\vec{u}+b\vec{v}$。

通常，这个 $\vec{u}$ 就是 $\begin{bmatrix} 1\\0\end{bmatrix}$，一条指向正右方的长度为 $1$ 的向量，$\vec{v}$ 就是 $\begin{bmatrix} 0 \\ 1 \end{bmatrix}$，而你会惊喜地发现 $a$ 和 $b$ 就分别是 $x$ 坐标和 $y$ 坐标，而这个向量就记作 $\begin{bmatrix} a \\ b \end{bmatrix}$。

而这里的 $\vec{u}$ 和 $\vec{v}$ 就称作二维空间中的两个基向量，两个二维的基向量可以张成一个二维空间（就是可以控制 $a$ 和 $b$ 到达二维空间上的每一个点），这个二维空间记作 $\mathrm{span}(\vec{u},\vec{v})$，不过超纲了（大小写我也不大记得了）。

但如果 $\vec{u}$ 或者 $\vec{v}$ 不是这两个向量，那么还可不可以这样呢？绝大多数（无法这样的情况存在，但是是一个零测集）情况下，可以。但是就不会是 $x$ 坐标和 $y$ 坐标了。

比如加入 $\vec{u} = \begin{bmatrix} 3 \\ 0 \end{bmatrix}$，$\vec{v} = \begin{bmatrix} 0 \\ 2 \end{bmatrix}$，那么这里 $a$ 和 $b$ 就都是 $1$，可以记作由我们的新的基向量张成的空间上的点 $\begin{bmatrix} 1 \\ 1 \end{bmatrix}$，此时 $a=b=1$。

而一个矩阵就是两个基向量拼起来，输入的向量在表达上不变。

具体来讲，设原来的（通常是由上面提到的最经典的使得 $a=x,b=y$ 的两个基向量）空间上有一个向量 $\vec{u}$，然后这个矩阵所含有的两个向量张成的空间上找到一个向量 $\vec{v}$，使得两个向量字面上一样。

比如原本的空间是这样的，两个基向量分别是 $\begin{bmatrix} 1 \\ 0 \end{bmatrix}$ 和 $\begin{bmatrix} 0 \\ 1 \end{bmatrix}$：

![这下想起 `hideturtle()` 了](pAcPS3R.png)

矩阵的两个向量张成的空间是这样的，两个基向量分别是 $\begin{bmatrix} 1 \\ 0 \end{bmatrix}$ 和 $\begin{bmatrix} 0 \\ \color{red}2 \end{bmatrix}$：

![](pAcPpg1.png)

其中 $O$ 点和 $P$ 点在字面上都是 $\begin{bmatrix} 3 \\ 2 \end{bmatrix}$，但是它们的位置却完全不一样。

而实际上，如果把第二个空间直接平移到第一个空间上面，使得原点重合（线性映射的性质保证了原点必然不变），那么 $P$ 点会移动到 $A$ 点的位置，而这个 $A$ 点就是这个结果，也就是 $\begin{bmatrix} 3 \\ 4 \end{bmatrix}$。

那么，如何计算呢？每算一个都画两个网格完全没必要吧？没事，我们来跟踪一下 $x$ 和 $y$，设两个基向量为 $\begin{bmatrix} a \\ b \end{bmatrix}$ 和 $\begin{bmatrix} c \\ d \end{bmatrix}$。

那么先看 $x$ 坐标，原本的基向量的 $x$ 分别是 $1$ 和 $0$，显然因为右边是 $0$，所以第一个基向量的系数（如果你记忆力还不错的话，$a$）就是原本的 $x$，而现在变成了 $ax$。而第二个基向量的系数为 $y$，所以 $x$ 又增加了 $cy$，最终的 $x$ 坐标为 $ax+cy$。

再看 $y$ 坐标，同理，是 $bx+dy$。

而一个矩阵到底如何表示呢？很简单，把两个基向量拼到一起即可。

所以我们就得到了公式（注意，我把各个数的位置调换了一下，原本是 $\begin{bmatrix} a & c \\ b & d \end{bmatrix}$）：

$$ \begin{bmatrix} a & b \\ c & d \end{bmatrix} \begin{bmatrix} e \\ f \end{bmatrix} = \begin{bmatrix} ae+bf \\ ce+df \end{bmatrix}$$

鼓掌！

那么我们如何计算两个矩阵相继作用的结果，也就是它们的积呢？

$$ \begin{bmatrix} a & b \\ c & d \end{bmatrix} \begin{bmatrix} e & f \\ g & h \end{bmatrix} = \text{what?}$$

我们可以看看两个基向量的去向。

首先，原本的基向量为 $\begin{bmatrix} e \\ g \end{bmatrix}$ 和 $\begin{bmatrix} f \\ g \end{bmatrix}$。

第一个基向量变换后为 $\begin{bmatrix} ae+bg \\ ce + dg\end{bmatrix}$。

第二个基向量变换后为 $\begin{bmatrix} af+bh \\ cf+dh \end{bmatrix} $。

所以最终的矩阵为 $\begin{bmatrix} ae+bg & af+bh \\ ce+dg & cf+dh\end{bmatrix}$。

当然，多次用矩阵乘法也可以证明结合律（这里只能证明二阶的，就已经如此困难了），试试看！

$$ \begin{aligned} &\left(\begin{bmatrix}a&b\\c&d\end{bmatrix}\begin{bmatrix}e&f\\g&h\end{bmatrix}\right)\begin{bmatrix}i&j\\k&l\end{bmatrix}\\
=&\begin{bmatrix}ae+bg&af+bh\\ce+dg&cf+dh\end{bmatrix}\begin{bmatrix}i&j\\k&l\end{bmatrix}\\
=&\begin{bmatrix}aei+bgi+afk+bhk&aej+bgj+afl+bhl\\cei+dgi+cfk+dhk&cej+dgj+cfl+dhl\end{bmatrix}
\end{aligned}$$

$$ \begin{aligned} &\begin{bmatrix}a&b\\c&d\end{bmatrix}\left(\begin{bmatrix}e&f\\g&h\end{bmatrix}\begin{bmatrix}i&j\\k&l\end{bmatrix}\right)\\
=&\begin{bmatrix}a&b\\c&d\end{bmatrix}\begin{bmatrix}ei+fk&ej+fl\\gi+hk&gj+hl\end{bmatrix}\\
=&\begin{bmatrix}aei+afk+bgi+bhk&aej+afl+bgj+bhl\\cei+cfk+dgi+dhk&cej+cfl+dgj+dhl\end{bmatrix}
\end{aligned}$$

我还是用回我的 $f(g(h(x)))$ 吧。

矩阵除法咋办？$\dfrac{A}{B}=A \cdot \dfrac{1}{B} = AB^{-1}$

矩阵求逆如何求？$A^{-1}=?$。

先介绍一个单位矩阵的概念，其实就是多个最纯粹的基向量拼起来。比如二阶单位矩阵为 $\begin{bmatrix} 1& 0 \\ 0 & 1 \end{bmatrix}$，三阶单位矩阵为 $\begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1  \end{bmatrix}$，$n$ 阶单位矩阵同理，但是可以记为 $I_n$，如果只给了一个 $I$ 那么 $n$ 就看上下文。如果上下文也没说那你就去和作者干。

介绍一种方法：先把这个矩阵和单位矩阵拼起来，类似这样：$ \left[\begin{array}{c c|c c} a&b&1&0 \\ c&d&0&1 \end{array}\right] $（这 $\KaTeX$ 好难打），然后进行初等行变换直到左边为单位矩阵，类似这样：$ \left[\begin{array}{c c|c c} 1&0&e&f \\ 0&1&g&h \end{array}\right] $，右边的就是 $A$ 的逆。

初等行变换是什么？
1. 交换两行，记作 $r_a \leftrightarrow r_b$。
2. 把一行所有元素同时变成原来的某一倍，记作 $kr_a$。
3. 把两行元素相加，存到这两行中的某一行中，记作 $r_a+r_b$。

其实第三种和第二种结合可以变成一种更厉害的，一般用这种：

3. 把两行元素同时扩倍不同的（相同也可以）倍数后相加，结果存到这两行中的某一行中，记作 $k_1r_a+k_2r_b$。

于是我们就可以这样干：

将鸡兔同笼的矩阵记为 $\begin{bmatrix} 1 & 1 \\ 2 & 4 \end{bmatrix}$。

将题目记为 $\begin{bmatrix}14 \\ 32 \end{bmatrix}$。

我们对矩阵求个逆：
$$ \begin{aligned} & \left[\begin{array}{c c|c c} 1&1&1&0 \\ 2&4&0&1 \end{array}\right] \\
\xrightarrow{r_2-2r_1} & \left[\begin{array}{c c|c c} 1&1&1&0 \\ 0&2&-2&1 \end{array}\right] \\
\xrightarrow{r_1-{1 \over 2} r_2} & \left[\begin{array}{c c|c c} 1&0&2&-{1\over 2} \\ 0&2&-2&1 \end{array}\right] \\
\xrightarrow{{1 \over 2}r_2} & \left[\begin{array}{c c|c c} 1&0&2&-{1\over 2} \\ 0&1&-1&1 \over 2 \end{array}\right]
\end{aligned}$$
故逆矩阵为 $\begin{bmatrix} 2 & -{1 \over 2} \\ -1 & 1 \over 2 \end{bmatrix}$。

将逆矩阵乘上 $\begin{bmatrix}14 \\ 32 \end{bmatrix}$：

$$\begin{bmatrix} 2 & -{1 \over 2} \\ -1 & 1 \over 2 \end{bmatrix}\begin{bmatrix}14 \\ 32 \end{bmatrix}=\begin{bmatrix}28-16 \\ 16-14 \end{bmatrix}=\begin{bmatrix}12 \\ 2 \end{bmatrix}$$

我们成功地用 $193$ 行 Markdown 代码解出了超级难的鸡兔同笼问题！鼓掌！