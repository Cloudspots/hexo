---
title: 题解：P2459 [SDOI2007] 立体分割
date: 2025-1-16 16:53:46
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
显然，我们可以横着把蛋糕切成 $n$ 块。比如样例中的蛋糕我们就可以这样切（拜谢 desmos）：

[![](pEFya1x.png)](https://www.desmos.com/3d/kyfbtbe2aq)

所以，对于第 $i$ 块，最靠近原点的顶点坐标为 $\left(0,0,\dfrac{iz}{n}\right)$，而最远离原点的顶点坐标是 $\left(x,y,\dfrac{(i+1)z}{n}\right)$。$i$ 从 $0$ 开始。

注意到精度要求较高，我们可以使用 `long double` 并在输出时控制小数位数。

```cpp
#include <cstdio>

using namespace std;

int main()
{
    long double x, y, z;
    long long n;
    scanf("%Lf%Lf%Lf%lld", &x, &y, &z, &n);
    for(int i=0;i<n;i++)
    {
        // 其实不用这么多位，但是……
        printf("%.114Lf %.514Lf %.191Lf %.98Lf %.106Lf %.666Lf\n", (long double)0, (long double)0, i*z/n, x, y, (i+1)*z/n);
    }
    return 0;
}
```