---
title: montgomery-modulo
tags:
  - Modulo Algorithm
  - Optimization
categories:
  - Algorithm & Theory
date: 2026-07-22 19:58:33
updated: 2026-07-22 19:58:33
---
基本上翻译自[此](https://www.ams.org/journals/mcom/1985-44-170/S0025-5718-1985-0777282-X/S0025-5718-1985-0777282-X.pdf)。

主播主播，你的时间复杂度是优秀的，但是你被卡常了！

主播主播，你的 Barrett 约简很快速，computers 也很 fast，但是我又缩小了实现，所以你必须用 SIMD；Barrett 需要 `__int128`（或 `unsigned __int128`），难以 SIMD！

---

Montgomery 取模，在 $64$ 位整数范围内完成 $\Z_p$（模 $p$ 整数环；通俗地讲，一切运算均在模 $p$ 意义下进行的整数环。不要求 $p$ 是质数）。在 OI 中，通常 $p$ 需要是奇数（大多数情况下模数都是质数，所以只需要或不需要特判 $p=2$）。

其原理是，构造一个 Montgomery 空间，包含一个参数 $R$ 足够大（通常 $R>p$ 即可。这里“足够大”是指首先 $R>p$，然后对于任意需要取模的数字 $x$，$x\le Rp$），$R$ 与 $p$ 互质，满足除 $R$ 和对 $R$ 取模可以快速进行（通常 $R$ 取 $2$ 的幂，比如使用 $2^{32}$ 自然溢出）。

所有整数进入这个 Montgomery 空间需要乘 $R$ 模 $p$，出来自然就是反过来，乘 $R^{-1}$ 模 $p$。

欸你这里是不是用到了模法？不急，我们有快速计算的方法。

$$ \begin{array}{l}
\textbf{Description. }\text{Given }x\text{, calculate }xR^{-1}\bmod p\text{.}\\
\textbf{Input. }x\text{.}\\
\textbf{Output. }xR^{-1}\bmod p\text{.}\\
\textbf{Algorithm. }\\
\begin{array}{ll}
&\textbf{function}\ \text{REDUCT}(x)\\
1&\text{precalculate }p^{-1}<R\text{ s.t. }pp^{-1}\equiv 1\pmod R,R^{-1}<p\text{ s.t. }RR^{-1}\equiv 1\pmod p\\
2&v\gets ((x\bmod R)\times p^{-1})\bmod R\\
3&a\gets \dfrac{x+vp}{R}\\
4&\textbf{if}\ a<p\\
5&\qquad\textbf{return}\ a\\
6&\textbf{else}\\
7&\qquad\textbf{return}\ a-p
\end{array}
\end{array} $$

该算法的正确性如下：

首先，$vp$ 具有“双重余数性质”（非常奇妙！）。对于模 $R$，有 $v=xp^{-1}\bmod R$，所以 $vp\equiv x\pmod R$，这保证了 $a$ 是整数；同时，对于模 $p$，有 $vp\equiv 0\pmod p$，这保证了 $a\equiv xR^{-1}\pmod p$。

同时，对于 $a$ 的大小，由于 $v<R$，所以 $vp<pR$，换句话说 $\dfrac{x+vp}{R}<\dfrac{x}{R}+p$。这里，只要 $x$ 不太大（超过 $pR$），就可以保证 $a<2p$，从而后面只需要判断一次就能保证在 $[0,p)$ 的范围内了。

那么考虑进入 Montgomery 空间。注意到 $xR\equiv xR^{-1}R^2\pmod p$，我们预处理 $R^2\bmod p$，和 $x$ 相乘后塞进 $\text{REDUCT}$ 即可。为了方便，我们简记做 $\text{TRANS}(x)$（Transform）。

退出 Montgomery 空间就是 $\text{REDUCT}$ 过程。

现在考虑三则运算。

对于加减法，显然直接加减即可。记得判断是否超出范围，调整。

对于乘法，我们有 $(xR)(yR)R^{-1}\equiv (xy)R\pmod p$，换句话说 $\text{TRANS}(xy)=\text{REDUCT}(\text{TRANS}(x)\text{TRANS}(y))$。

最后我们使用 $0$ 次取模操作解决了取模的问题。

在 OI 中，通常我们只需要在中间运算的时候使用取模意义下的加减乘（可能表述的不太好。可以类比一下 FFT 的时候可以最开始 FFT，后面也是加减乘都在点值意义下进行，最后需要求值或者输出系数的时候再 IFFT）。所以其实 $\text{TRANS}$ 操作不会很多。$\text{REDUCT}$ 还是比较多，但是考虑到它只用了两次乘法，一次加法，一次对 $R$ 的除法（通常是移位）和两次对 $R$ 的取模（通常是位运算或者直接转成 `unsigned` 截断），可能还需要一次判断，还是很快速的（主要是这个【】除法太耗时了）。相比之下 Barrett 约简虽然简洁，但是毕竟还是需要用 `__int128`，不利于 SIMD 优化，在我以前的机子上也用不了。

当然如果是普通情况，比如没法 SIMD 并且模数固定，那么通常编译器自动 Barrett 已经够优秀了。
