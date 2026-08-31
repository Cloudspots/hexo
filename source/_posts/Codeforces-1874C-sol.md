---
title: 1874C 题解
tags:
  - Codeforces Problem Solution
  - Solution
  - Probability
  - Mathematics
  - Dynamic Programming
categories:
  - Solution
date: 2026-08-30 18:46:41
updated: 2026-08-30 18:46:41
---

非常好的题，想了一万年，这是蓝？？？？？？

---

显然是 dp，我们设 $f_i$ 为 $i\to n$ 成功概率。如何转移？

转移就是，给定一个序列 $a$，每个数字在 $[0,1]$ 之间（表示概率）。每次你可以选择一个下标 $i$，需要保证下标 $i$ 没有被禁用。然后会在所有目前没有被禁用的下标中随机选择一个 $k$，如果 $i=k$ 则最终权值为 $a_i$，否则同时禁用下标 $i$ 和 $k$，并重复以上操作。如果所有下标都被禁用则最终权值为 $0$，最大化最终权值的期望值。

为了搞出这个东西，我们先证明一个引理。

:::info[Lemma $1$：存在一个最优策略是确定性的，并且答案只和 $a$ 有关]{open}

很废话，考虑使用数学归纳法。

首先 $n=1,2$ 的时候是显然的。考虑 $n>2$：

考虑第一步 Jellyfish 选什么，然后看 Asuka。由于我们知道 Asuka 选择每一条路的概率，所以在给定 Jellyfish 选的路的情况下，最优策略和胜率也是确定的（因为此时 $n$ 减少了 $2$）。取胜率最大的即可得到此时最优策略。$\square$

:::

我们还需要知道答案的形式。提出如下猜想：

- Conjecture $1$：对于任意 $n$，存在一个序列 $p$，将 $a$ 从小到大排序后答案为 $\sum p_ia_i$。

感觉上这个对完了，提出一个感觉上稍微强一点的东西，看看能不能证明。

:::error[Conjecture $2$：对于任意两个单调不降的序列 $a,b$ 和两个和相等的序列 $x,y$，满足 $a,b,x,y$ 的长度都是 $n$，则 $\sum a_ix_i\ge \sum a_iy_i\iff \sum b_ix_i\ge \sum b_iy_i$]{open}

其实这个感觉上就不太靠谱，因为它太强了。

反例：$n=3,a=\langle 0,100,101\rangle, b=\langle 0,1,101\rangle, x=\langle 1,2,1\rangle, y=\langle 2,0,2\rangle$，此时 $\sum x=\sum y=4$，而 $\sum a_ix_i=301>\sum a_iy_i=202$，但是 $\sum b_ix_i=103<\sum b_iy_i=202$。

:::

那么需要对于最优解进行更加深入的分析，这个一看就是数学归纳。$n=1,2$ 是显然的。

:::info[Proof of Conjecture $1$ when $n=3$]

不妨 $a_1\le a_2\le a_3$。若 Jellyfish $a_1$，则有 $\dfrac{1}{3}$ 的概率 Asuka 选择 $a_1$，此时答案为 $a_1$；有 $\dfrac{1}{3}$ 的概率 Asuka 选择 $a_2$，答案为 $a_3$；有 $\dfrac{1}{3}$ 的概率 Asuka 选择 $a_3$，答案为 $a_2$，故 Jellyfish 选择 $a_1$ 答案的期望为 $\dfrac{a_1+a_2+a_3}{3}$。显然 Jellyfish 选择其它的 $a$ 答案仍然是 $\dfrac{a_1+a_2+a_3}{3}$。

故答案为 $\dfrac{a_1+a_2+a_3}{3}$，任意策略都是最优策略，$p=\left\langle \dfrac{1}{3},\dfrac{1}{3},\dfrac{1}{3}\right\rangle$。

:::

这个并不能看出什么东西，因为它太简单了。考虑一下 $n=4$（注意到 $n=2$ 的时候 $p=\left\langle 0,\dfrac{1}{2}\right\rangle$，最优策略为选择 $a_2$）：

:::info[Proof of Conjecture $1$ when $n=4$]{open}

不妨 $a_1\le a_2\le a_3\le a_4$，为了方便分别用 $a,b,c,d$ 代替 $a_1,a_2,a_3,a_4$。考虑 Jellyfish 选择：

- $a$：此时有四种概率均等的情况，分别为直接是 $a$，进入 $n=2,\langle b,c\rangle$ 的情况，进入 $\langle c,d\rangle$ 情况和进入 $\langle b,d$ 的情况，期望分别为 $a,\dfrac{c}{2},\dfrac{d}{2},\dfrac{d}{2}$，故最终期望为 $\dfrac{d+\frac{c}{2}+a}{4}$。
- $b$：同理可得期望为 $\dfrac{d+\frac{c}{2}+b}{4}$，显然比选择 $a$ 优秀。
- $c$：期望为 $\dfrac{d+c+\frac{b}{2}}{4}$，显然比 $b$ 优秀。
- $d$：期望为 $\dfrac{d+c+\frac{b}{2}}{4}$，和选择 $c$ 一样。

所以最终答案为 $\dfrac{1}{8}b+\dfrac{1}{4}c+\dfrac{1}{4}d$，最优策略为选择 $c$ 或 $d$，$p=\left\langle 0,\dfrac{1}{8},\dfrac{1}{4},\dfrac{1}{4}\right\rangle$。

:::

貌似选择 $a_n$ 一定是最优解。考虑 $n=5$？

:::info[Conjecture $1$ when $n=5$]{open}

不妨设 $a\le b\le c\le d\le e$。

- $a$：经计算答案为 $\dfrac{a+b+c+d+e}{5}$。

好的，不用算了，答案为 $\dfrac{a+b+c+d+e}{5}$，任意策略都是最优策略。

:::

奇数的时候貌似任意策略都是最优的。我们先放一放 $n=6$（看起来会非常难算），先给出 $n$ 是奇数时的一般性的结论。

:::success[Theorem $1$：$n$ 是奇数时答案为 $\overline{a}$，任意策略均为最优策略]

由数学归纳，显然。$\square$

:::

现在只需要解决偶数的情况。

:::info[Conjecture $1$ when $n=6$]{open}

$a_1\le a_2\le a_3\le a_4\le a_5\le a_6$。

选择 $a_1$ 的时候答案为 $\dfrac{a_1}{6}+\dfrac{a_3}{16}+\dfrac{a_4}{8}+\dfrac{a_5}{6}+\dfrac{a_6}{6}$。

考虑巧算一下。因为 $n=4$ 的时候 Conjecture $1$ 成立，所以我们可以考虑直接交换 $a_1,a_2$ 得到选择 $a_2$ 时为 $\dfrac{a_2}{6}+\dfrac{a_3}{16}+\dfrac{a_4}{8}+\dfrac{a_5}{6}+\dfrac{a_6}{6}$，$a_3$ 答案为 $\dfrac{a_2}{16}+\dfrac{a_3}{6}+\dfrac{a_4}{8}+\dfrac{a_5}{6}+\dfrac{a_6}{6}$，$a_4,a_5,a_6$ 答案均为 $\dfrac{a_2}{16}+\dfrac{a_3}{8}+\dfrac{a_4}{6}+\dfrac{a_5}{6}+\dfrac{a_6}{6}$。

显然选择 $a_4,a_5,a_6$ 答案最优，为 $\dfrac{a_2}{16}+\dfrac{a_3}{8}+\dfrac{a_4}{6}+\dfrac{a_5}{6}+\dfrac{a_6}{6}$，对应 $p=\left\langle 0,\dfrac{1}{16},\dfrac{1}{8},\dfrac{1}{6},\dfrac{1}{6},\dfrac{1}{6}\right\rangle$。

:::

看起来我们已经很接近了。应当是选择 $a_i$ 满足 $i>\dfrac{n}{2}$ 的时候都是最优的，并且 $p$ 单调不降，$i>\dfrac{n}{2}$ 时 $p_i=\dfrac{1}{n}$。考虑证明，因为我们实在不想算 $n=8$ 了。我们会证明一个弱一点的东西，这个东西已经足够做题了。

:::success[Theorem $2$：$n$ 是偶数时，$p$ 单调不降，$p_n=\dfrac{1}{n}$，选择 $a_n$ 最优]{open}

数学归纳，我们上面证明了 $n\le 6$ 成立。

显然交换 trick 仍然是成立的。

考虑对于每个 $i$ 都显然是可以构造出一个 $p$，并且显然所有的 $p$ 都是同一个 $p$ 的排列（因为交换）。显然 $p$ 单调不降时最优。

那么我们考虑选择 $a_n$。

此时在 $a_{1\dots n-1}$ 中选择一个元素，删除，然后和 $n-2$ 的 $p$（记作 $p'$）点积，求和，加上 $a_n$ 然后乘 $\dfrac{1}{n}$ 即可。那么考虑每个元素 $i$（$1\le i<n$）和它点积的 $p'$ 之和是多少。若删除的是 $<i$ 的数字，则是 $p_{i-1}$，否则是 $p_i$（不考虑删除 $i$ 的情况）。所以总共是 $(i-1)p'_{i-1}+(n-i-1)p'_i$，记作 $q_i$。考虑 $q_{i+1}-q_i=(n-i-2)p'_{i+1}+(2i-n+1)p'_i-(i-1)p'_{i-1}\ge (n-i-2)p'_{i-1}+(2i-n+1)p'_{i-1}-(i-1)p'_{i-1}=0$（当 $2i-n+1\ge 0$ 时，$2i-n+1<0$ 后面讲），所以 $q$ 单调不降。特别地，$q_n=1$，而 $q_{n-1}=(n-2)p'_{n-2}=1$，仍然单调不降。

当 $2i-n+1<0$ 的时候 $(2i-n+1)p'_i\ge (2i-n+1)p'_{i-1}$ 其实不太成立，但是我们仍然可以做：$q_{i+1}-q_i=(n-i-2)p'_{i+1}-(n-2i-1)p'_i-(i-1)p'_{i-1}\ge (n-i-2)p'_{i+1}-(n-i-2)p'_{i+1}=0$，这样就完成了完整的证明。

同时这个证明有还一些边界的细节可以由读者自行解决，此处略去。

同时 $p_i=\dfrac{q_i}{n}$ 亦单调不降，故选择 $a_n$ 最优，且 $p_n=\dfrac{1}{n}$。$\square$

:::

那么这个题就做完了！

所以这个题的结论是，对于奇数 $n$，任意策略均最优，答案为 $\overline{a}$。对于偶数 $n$，选择最大的 $a$ 最优。

那么 $O(n^2)$ 预处理一下每个偶数 $n$ 对应的 $p$ 即可（可以使用 Theorem $2$ 的证明中的方式计算），转移的时候直接算，时间复杂度 $O(n^2+m\log n)$，$\log$ 在于排序。

:::info[sub&code]

[sub](https://codeforces.com/contest/1874/submission/388881539)。

```cpp
// Finally...
#include <cstdio>
#include <vector>
#include <algorithm>

using namespace std;

long double p[2505][5005];

long double dp[5005];
vector<int> web[5005];

int main()
{
  p[1][2] = 0.5L;
  for(int i=2;i<=2500;i++)
  {
    for(int j=1;j<2*i;j++)
    {
      p[i][j] = ((j-1)*p[i-1][j-1] + (2*i-j-1)*p[i-1][j]) / (2*i);
    }
    p[i][2*i] = 1.0L / (2*i);
  }
  int t;
  scanf("%d", &t);
  while(t--)
  {
    int n, m;
    scanf("%d%d", &n, &m);
    for(int i=1;i<=n;i++) web[i].clear();
    for(int i=1;i<=m;i++)
    {
      int u, v;
      scanf("%d%d", &u, &v);
      web[u].push_back(v);
    }
    dp[n] = 1;
    for(int i=n-1;i>=1;i--)
    {
      dp[i] = 0;
      if(web[i].size() & 1)
      {
        for(int x : web[i]) dp[i] += dp[x];
        dp[i] /= web[i].size();
      }
      else
      {
        sort(web[i].begin(), web[i].end(), [](const auto &x, const auto &y) { return dp[x] < dp[y]; });
        for(int j=0;j<web[i].size();j++) dp[i] += p[web[i].size() / 2][j + 1] * dp[web[i][j]];
      }
    }
    printf("%.10Lf\n", dp[1]);
  }
  return 0;
}
```

:::