---
title: 电路/nandgame 相关
date: 2025-2-10 19:11:26
categories:
  - Technology & Engineering
tags: []
---
看到了一个叫做 [nandgame](https://nandgame.com/) 的游戏，觉得很有意义，于是准备玩的时候顺便写一下每一关的题解+思路，顺便讲一下电路相关知识和一些有趣的历史。

本文没那么追求最优解。

# Hardware 硬件

## 1 Logic Gates 逻辑门

### 1.1 Nand 与非门

第一关是这样的：

![](pEndmFg.png)

看起来很复杂的样子，实际上也没那么简单。

这两个叫做 relay 的东西是**继电器**，看起来很高大尚，我们结合历史来讲一讲。

以下内容是传说，不一定真实，并且经过了作者的加工。参（摘）考（抄）了《穿越计算机的迷雾》第二版的第 $43-44$ 页。

在 $1832$ 年秋，一个叫做摩尔斯（塞缪尔·芬利·布里斯·摩尔斯，发明摩尔斯电码的那个，关于摩尔斯电码稍后会讨论）的画家（当时是公认的绘画一流）坐一艘游轮从法国前往美国。

然而，船上有一个美国医生杰克逊。至于他医术好不好，这就不知道了。但是，他居然懂得**电磁铁**的原理和制造技术，甚至知道线圈匝数越多，电磁铁磁力越强。

然后这个医生也没事干，就玩起了电磁铁。于是医生把钉子这类铁的东西放在桌子上，把电磁铁拿在自己的手里，大家就惊讶地看着医生让它们吸住它们就吸住，让它们落下它们就落下。当然，摩尔斯也在人群中探头探脑地观看。

于是他们就就此结为了好兄弟。两人在电学方面谈的十分投机，甚是欢洽。

于是，摩尔斯也就喜欢上了电学。他发明了一种叫做**电报**的东西，是这样的：

![甚是抽象](pEndJTU.png)

（我不是不会画电路图，但是我觉得这个非常生动形象）

当开关接通时，电磁铁就有了磁力，会把上面的铁片吸到自己上面。松开时，由于有弹簧，铁片又会松开，回到原位。

那么，我们就可以通过机械装置实时查看铁片的状态，进而查看开关的状态。比如给铁片连上一只笔，下面放一个匀速前进的纸，这样就可以在纸上打点，或者画线。

那么打点和画线是怎么做到传输信息的呢？摩尔斯电码。

具体细节无需详谈，都是学 OI 的人了，自然想象得出摩尔斯电码长啥样。

但是，如果电线太长，那么会导致电流减弱，电磁铁可能就吸不住铁片了。

所以，这就需要一个叫做**继电器**的装置。

![](pEnd061.png)

这样，当电磁铁电源接通的时候，右边的电路就会接通。这样，当电比较小但是还可以支撑电磁铁吸力的时候，就可以用一个这样的装置，把电力复原。

然后 nandgame 的图片甚抽象。但是我们勉强能看出来，左边的线圈是电磁铁，右边是开关。

而 c 就代表电磁铁的电源是否有电，in 则表示图片（上图）右下方的电源是否有电。

我们发现，标有 default on 的继电器在默认情况下电源是接通的（也就是说，如果 c 有电，则不接通），而 default off 是不接通的（如果 c 有电，则接通）。

同时，继电器的符号是：

- default off：![](pEndjcn.png)
- default on：![](pEndzn0.png)

非常不生动也不形象。

这里要求实现一个**与非门**，记为 $\operatorname{nand}$，则 $x\operatorname{nand}y=\operatorname{not} (x \operatorname{and} y)$。

我们发现，default off 的 relay 起到一个**与门**的作用。当且仅当 c 和 in 都有电时，这个 relay 才输出有电。

而如何实现非门呢？也很简单。default on 的 relay 在 c 有电的情况下输出没电，否则输出 in。这样，我们只需要让 in 始终有电（右下角的 Power +），就可以实现非门了。

非门和与门拼起来，就得到了一个与非门。

附此题答案：

![](pEndf1A.png)

#### 关于电子管&晶体管

使用电子管和晶体管也可以实现逻辑门。

待补。

### 1.2 Invert 非门

我们要求实现一个非门。注意到 $x \operatorname{and} x = x$，故 $\operatorname{not} x = x \operatorname{nand} x$。

![](pEndh6I.png)

家庭作业 $1$：用继电器实现一个与门。不需要发给我，但是发给我也行。下同。提示：$\color{white}\text{前面说过啊。}$

### 1.3 And 与门

注意到 $\operatorname{not}(\operatorname{not}(x\operatorname{and}y))=x\operatorname{and}y$，所以我们只需要用一个 nand 门接上一个 inv 门就好。

家庭作业 $2$：首先在 nandgame 上完成这道题的电路，然后用继电器实现一遍。

## 1.4 Or 或门

注意到两个数同时成立，相当于两个数的反面都不成立。都不成立的反面是至少有一个成立，即或门。

也就是说：

$$\def\and{\operatorname{and}}\def\or{\operatorname{or}}\def\not{\operatorname{not}}\def\nand{\operatorname{nand}}\begin{aligned}
x\and y&=(\not \not x) \and (\not \not y)\\
&=\not(\not x \or \not y)
\end{aligned}$$

于是我们就可以反着推出来，$\def\and{\operatorname{and}}\def\or{\operatorname{or}}\def\not{\operatorname{not}}\def\nand{\operatorname{nand}}x \or y=\not(\not x \and \not y)=\not x \nand \not y$。

家庭作业 $3$：完成这道题的电路。不要求使用继电器实现。

### 1.5 Xor 异或门

由于异或门是两个输入不一样时为 $1$，否则为 $0$，所以我们可以对两个输入分别取反然后取或再对于两个输出取与。

这样的描述太抽象了，我们直接上公式：

$$\def\and{\operatorname{and}}\def\or{\operatorname{or}}\def\nnot{\operatorname{not}}\def\nand{\operatorname{nand}}\def\xor{\operatorname{xor}}\begin{aligned}
x \xor y&=[x \neq y]\\
&=[x=0 \and y=1]\or[x=1 \and y=0]\\
&=(\nnot x \and y) \or (x \and \nnot y)
\end{aligned}$$

但是这样需要的逻辑门太多了，我们从另一种方向考虑。

我们注意到，输出为 $0$ 当且仅当两个数字相同，即都为 $0$ 或 $1$。

所以，我们就得到了另一个公式：$\def\and{\operatorname{and}}\def\or{\operatorname{or}}\def\nnot{\operatorname{not}}\def\nand{\operatorname{nand}}\def\xor{\operatorname{xor}}x \xor y=\nnot((x \and y) \or (\nnot x \and \nnot y))$。

注意到右式其实是 $\operatorname{not}(x \operatorname{or} y)$，于是我们就得到了：

![](pEnwcD0.png)

仍然不是最优解。

事实上，我们可以这样。

注意到，当 $x \neq y$ 时 $x \operatorname{or} y$ 和 $\operatorname{not} x \operatorname{or} \operatorname{not} y$ 都为真。

同时注意到 $\def\o#1{\operatorname{#1}}\o{not}x\o{or}\o{not}y=x\o{nand}y$，我们就可以成功设计电路：

![](wufashangchuan.png)

气死人（指猫）了，只能上传到 <https://cloudspots.github.io/images/>（指 <https://cloudspots.github.io/images/>）了。

![](nandgame-2025.2.11.1.png)

> 看到一种做法：$\def\nand{\operatorname{nand}}x \operatorname{xor} y = (x \nand (x \nand y)) \nand ((x \nand y) \nand y)$，其中 $x \operatorname{nand} y$ 是公用子表达式，只需要四个 $\operatorname{nand}$ 门，是 $\operatorname{nand}$ 门最少的解，列真值表发现是正确的，思考如何解释。

### 此章总结

本章使用继电器造了 nand 门，然后使用 nand 门造了各种算术原件。

## 2 Arithmetics 算术

### 2.1 Half Adder 半加器

给出两个比特，将其相加。

显然低位就是异或值，高位就是与值。

太简单，连作业都不留了。

### 2.2 Full Adder 全加器

三个比特的加法。

显然可以先用一个半加器把两个加起来，再用一个把第一个半加器的结果的低位和第三个数加起来，再用一个把高位加起来。

那个把高位加起来的，因为没有进位，所以可以直接用一个或门。

![](nandgame-2025.2.11.3.png)

### 2.3 Multi-bit Adder 多位数加法

两个两位数和一个一位数做加法，显然可以用一个全加器把最后一位都加起来，然后再用一个把高位（包括进位）加起来。

家庭作业 $4$：完成这一关。

同时，我们可以用相似的办法完成十六进制数加法，命名为 add 16（不需要你自己完成，当然想完成也可以）。

### 2.4 Increment 自增

将一个数字自增 $1$。

显然加上 inv 0 即可。

家庭作业 $5$：完成这一关。

同时，我们可以使用 $16$ 个 T 触发器完成这一个。这个比标准答案简单，但是它这一关并没有给出分解十六个数字的东西，只好作罢。

关于 T 触发器，后面会讲。

### 2.5 Subtraction 减法

显然，一个 $16$ 位二进制数取反就是 `0xffff` 减去它。那么，我们可以用被减数加上减数取反的结果，然后加上 $1$ 即可。

家庭作业 $6$：完成这一关。

### 2.6 Equal to Zero 判断是否为零

给出一个四位的二进制数，判断其是否为 $0$。

显然判断其所有位都为 $0$ 即可。判断为 $0$ 是直接取反。最后用 and 连接即可。

![](nandgame-2025.2.11.4.png)

### 2.7 Less than Zero 判断是否为负

显然判断最高位（符号位）即可，用一个 splitter 就行。

家庭作业 $7$：完成这一关。

## 3 Switching 选择

### 3.1 Selector 选择器

输入 $s,d_0,d_1$，输出 $d_{s}$。

使用 inv 和 and 即可。

这个 trick 还挺常用的，我造 desmos 计算机的时候用过。

![](nandgame-2025.2.11.5.png)

### 3.2 Switch 选择输出器

这两个好像翻译都是选择器啊……

给出 $s,d$，把 $d$ 输出到 $c_{s}$，而 $c_{1-s}$ 置空。

使用和上一关相似的 trick 即可。

家庭作业 $8$：完成这一关。

## 4 Arithmetic Logic Unit 算术逻辑多用计算单元

想不出好名字.jpg

### 4.1 Logic Unit 逻辑单元

非常复杂的东西来了。

给出 op0，op1，X 和 Y，要求使用 op0 和 op1 判断要进行什么操作并且进行到 X 和 Y 上。

如何判断是否符合操作？

也就是判断某个 op 是否是某一个值，然后用一个 and 连接即可。如何判断是否是某一个值？如果是真，那么直接使用。否则，加一个 inv。

解法我就先放出来，虽然也没什么意义。

挑战 $1$：自行完成这一关。

![我想试探一下你能不能访问 Github](nandgame-2025.2.11.6.png)

### 4.2 Arithmetic Unit 算术单元

这一关就简单很多。

首先判断是不是 $\pm 1$，然后判断加减即可。

最后如果是加，则直接加。如果是减，则用 sub，其中左操作数是 $0$ 即可，然后再加即可。

判断使用 select 16。

家庭作业 $9$：完成这一关。

### 4.3 ALU 算术逻辑多用单元

**这个关卡非常重要，后面很多关卡都需要理解它才可以做。**

题目大意是，给定三个参数 u，op0，op1，要求你做一堆运算。

注意到当 u 为 $0$ 时就是一个逻辑单元，否则是算术单元。用一个 select 16 即可。

但是注意到还有 zw（未知全称）和 sw（swap）两个参数，其中若 sw 为 $1$ 则交换左右两个参数的位置，而如果 zw 为 $1$ 则把左边的参数（可能是交换过后的）设置为 $0$。

那么我们先用两个 select 16 判断 sw，然后用一个 select 16 判断 zx 即可。

![](nandgame-2025.2.11.2.png)

### 4.4 Condition 判断大小

给出一个数，判断是否满足为正/负/零/前面的某几项中的任意一项。

对于负和零可以直接判断，对于正我们排除掉负和零即可。然后使用 or 连接即可。

家庭作业 $10$：完成这一关。

## 5 Memory 记忆

这个记忆的翻译真的不是生草的啊，我觉得记忆比较好。

### 5.1 SR Latch 触发器

SR 是指 set/reset。

这是一个有着记忆功能的电路。

我们前面讲的都是，输出只依赖于输入，不依赖于前面的结果或者前面的输入。要使它有记忆功能，必须要让它不是 DAG 图。

> 注意到此 SR 触发器不同于《穿越计算机的迷雾》（以下简称《穿》）中的 RS 触发器，在《穿》中 $s=r=0$ 是保存的输出，而 $s=r=1$ 是未使用。

由于这个设计实在是太天才了，我是试出来的，所以下面的解释是硬加的。

我们先不管 $s=r=1$ 的时候

### 5.2 D Latch D 触发器

这里的 D 是指 Data。

### 5.3 Data Flip-Flop 上升沿触发器

下降沿触发器，就是在 cl 从 $0$ 升到 $1$ 的一瞬间进行触发，存储数据的玩意儿。

cl 代表时钟周期，其中：

- cl 为 $0$：st（store）和 d（data）可以进行改变。
- cl 从 $0$ 变为 $1$：若 st 为 $1$，则存储 d 中的数据。否则，啥都不干。
- cl 从 $1$ 变为 $0$：如果当 cl 为 $1$ 时存储了新的数据，则此时把新的数据输出。

注意到改变的一瞬间很不好弄，可以尝试使用“错觉”来搞。

我们可以使用两个 D 触发器，一个存储真正的数据，一个存储输出数据。

当 cl 为 $0$ 时，存储输出数据的从真正的数据中获取数据。

当 cl 为 $1$ 且 st 为 $1$ 时，存储真正的数据。

最终结果：

![](pEnwOUO.png)

### 5.4 Register 寄存器

类似上升沿触发器，但是可以存储两个比特。

使用两个上升沿触发器即可。

### 5.5 Counter 计数器

按道理来说应该先弄 T 触发器的，这里一并讲了。

T 触发器就是这样的一个东西：

![](pEn0ka8.png)

这里，我们令 $c = \text{st} \operatorname{and} \text{cl}$。

当 $c=0$ 时，不改变。

当 $c=1$ 时，dff 里的值异或 $1$。

这样，如果给 $c$ 连上一个按钮，那么每次按下 dff 里的值都会异或 $1$，就像一个不停增加的二进制数的末位一样。

一个**计数器**指的是，一个可以随时自增和重置的存储器。

具体来讲，它有三个参数 st 和 cl，还有一个 $X$。

cl 照样表示时钟周期，只有在它为 $0$ 时才可以进行操作。

而对于每个时钟周期，若 st 为 $1$ 则将计数器重置为 $X$，否则将计数器自增。

当 cl 切换为 $0$ 时输出答案。

显然，我们可以用一个 select 16 依 st 选择下一个输入是 $X$ 还是当前数字加一。加一使用 inc 16，存储使用 register。

家庭作业【序号待补】：完成这题。

### 5.6 RAM 随机访问存储器

这个东西就是，它存储两个二进制数，然后你可以根据 ad（address）来访问（查询或修改）某个元素。

那么这个就很显然了，用一个 switch 选择哪个的 st 是 $1$，然后用 select 选择查询的元素。

![](pEn03IU.png)

## 6 Processor 处理器

### 6.1 Combined Memory 内存

三种操作：a，d 和 *a。分别表示设置寄存器 A，设置寄存器 D 和设置内存位置 A 处。

查询就是寄存器 A 和 D，还有内存位置 A 处的值。

显然，模拟即可。线很乱。左边表示 A，中间是内存，右边是 D。

![](pEn0siD.png)

### 6.2 ALU Instruction 算术逻辑指令万能处理器

具体要求详见相关页面。

两个字概括：状压。

家庭作业【序号待补】：解决这题。很简单的，不要怕。

### 6.3 Control Selector 选择控制器

太简单，留作作业。

### 6.4 Control Unit 控制单元

很简单，先用 splitter 分割，每个输出都用 select/select 16 选择即可。

作业太多不好。

![](pEn0OLq.png)

### 6.5 Computer 微型计算机

先不讲

### 6.6 Input and Output 外部交互

有时间再讲

# Software 软件

卧槽打完 Hardware 以为大功告成了结果还有个 Software？？
