---
title: 题解：P12603 RuShiA
date: 2025-8-28 11:31:24
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
## Subtask 1

这么小的数据直接上 Pollard-rho 暴力算。对于不会 Pollard-rho 的可以直接找个质因子分解网站（如 <https://factordb.com/>，下同）解密出来是 `{VerY51mpl3RSA}`。

## Subtask 2

$p,q$ 相差太大，$q$ 太小，直接 Pollard-rho 暴力算（复杂度是 $\sqrt{q}$ 的）。解密出来是 `Your flag is {P0lL4rD_RhO_is_OK}. STOP BF RSA NOW`。

## Subtask 3

$p,q$ 差距太小，所以范围不大。不妨假设 $p\ge q$，那么 $q\ge p-1000$，所以 $p(p-1000)\le pq=n\le p^2$。枚举一下即可。解密出来是 `Actually there is another way to do this. Flag is {FeRmat_i5_AWeS0m3}`。

## Subtask 4

$p_1=p_2$？那么因为 $n_1\neq n_2$，所以 $q_1\neq q_2$，所以 $p_1=p_2=\gcd(n_1,n_2)$。第一组解密出来是 `Be careful with primes. Here is your flag {GCD_solves_th1S_Quiz}`，第二组是 `USELESSSSSSSSSSSSSSSSSSSSSSSSSSShahahaha`。

## Subtask 5

$c\ll n$，是不是没有取模？对 $c$ 开三次方根，解密出来 `{E_1s_n0t_useLE55}`。

## Subtask 6

上难度了。我们还需要观察到 $n_1=n_2$。这样我们知道 $m^{e_1}\pmod n$ 和 $m^{e_2}\pmod n$，并且 $e_1,e_2$ 互质，辗转相除就能得到结果。解密结果是 `So you understand {D0_Not_S4y_it_2_T1m3s}.`。

```python
def boomer6(me1,me2,e1,e2,n):
    if e1 == 1: return me1
    if e2 == 1: return me2
    return boomer6(me2,me1*pow(invert(me2,n),e1//e2,n)%n,e2,e1%e2,n) # invert 是 gmpy2.invert
```

## Subtask 7

解法和 Subtask 5 一样。三组数据解密结果都是 `Here you know that {3_t1m35_is_Al50_wE4k}.`。

## Subtask 8

$a=pq+2p+2q+4,n=pq,r=pq-p-q+1$。注意到 $\dfrac{a-n-4}{2}=p+q$，然后 $r=n-(p+q)+1$，所以能够知道 $r$。结果是 `As said, {AtT3nT10n_1s_4LL_U_need}`。

## Subtask 9

数据里提供了 `m`。结果是 `{THX_FOR_YOUR_PLAYING}`。

[AC 记录](https://www.luogu.com.cn/record/233517734)。为什么都是 $4\mathrm{ms}$，洛谷又退化了吗/fn。

总结：因为 Pollard-rho 是紫，所以这题是紫。但如果可以用其他方法质因子分解则大概是绿。