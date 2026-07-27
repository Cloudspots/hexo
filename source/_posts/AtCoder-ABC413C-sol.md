---
title: 题解：AT_abc413_c [ABC413C] Large Queue
date: 2025-7-6 10:26:37
categories:
  - Solution
tags:
  - Solution
  - Atcoder Problem Solution
---
> 咋感觉做过类似的题。

显然不能一个一个往队列里加数字，因为：

> **Large** Queue

考虑到每次加的数字都是一样的，所以我们可以把“$c$ 个 $x$”当做一个元素直接加入队列中。

那么有关操作 $2$？

如果队首元素的“元素个数”（也就是 $c$）超过了 $k$（实际上等于也可以），那么说明把队首的这一整块弹出都可以，而每次都是在队首取的，所以答案加上队首的元素和（也就是 $c \times x$）并将 $k$ 减去 $c$（因为已经弹出了 $c$ 个元素）然后弹出队首（因为已经加过了）并继续操作。否则，如果 $k<c$，那么虽然不能直接整块弹出队首，但是我们可以弹出前 $k$ 个元素！此时将答案加上 $k$ 乘队首的 $x$ 并将队首的 $c$ 减去 $x$ 即可。

记得开 `long long`。代码：

```cpp
#include <cstdio>
#include <utility>
#include <queue>

using namespace std;

int main()
{
  int q;
  scanf("%d", &q);
  queue<pair<int, int>> qp;
  while(q--)
  {
    int o;
    scanf("%d", &o);
    if(o == 1)
    {
      int x, y;
      scanf("%d%d", &x, &y);
      qp.push({x, y});
    }
    else
    {
      int x;
      scanf("%d", &x);
      long long sum = 0;
      while(x && qp.front().first <= x)
      {
        x -= qp.front().first;
        sum += 1ll * qp.front().first * qp.front().second;
        qp.pop();
      }
      if(x)
      {
        qp.front().first -= x;
        sum += 1ll * x * qp.front().second;
      }
      printf("%lld\n", sum);
    }
  }
  return 0;
}
```

[sub](https://atcoder.jp/contests/abc413/submissions/67312983)。