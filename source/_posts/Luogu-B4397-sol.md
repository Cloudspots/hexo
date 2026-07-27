---
title: 题解：B4397 [蓝桥杯青少年组国赛 2025] 第二题
date: 2025-8-29 19:34:52
categories:
  - Solution
tags:
  - Solution
  - Luogu B Problem Solution
---
我记得这题赛时题面是给每个节点有标号的？我们在代码中将节点从上到下，同一行从左到右的顺序 $1\sim 12$ 标号。

这题可以是数学题，但是我们不管那么多直接暴力一下。如果你对语法比较熟悉那么直接暴力在赛场上会是比推式子再写代码消耗时间更短的做法。不过显然右下方的未知数是可以直接算出的，可以算完再枚举排列。

C++ 中 `next_permutation` 可以计算给定序列的下一个排列，如果不存在下一个排列则返回 `false`。利用 do-while 循环可以这样枚举 `a` 的排列：

```cpp
sort(begin(a), end(a)); // 如果已经有序则不用排序。有序状态是所有排列的第一个状态。
do
{
    // do something...
} while(next_permutation(begin(a), end(a)));
// 如果 a 有 begin/end 成员函数，则 begin(a) 和 end(a) 可以用 a.begin() 和 a.end() 代替。
```

同样 `prev_permuation` 可以求前一个排列，同样是不存在返回 `false`，不过这题不用。

:::info[完整代码&提交记录]
```cpp
#include <cstdio>
#include <vector>
#include <algorithm>

using namespace std;

bool flag[15];
int a[15];

int main()
{
    int s;
    scanf("%d", &s);
    for(int i=1;i<=12;i++)
    {
        if(i == 2 || i >= 7 && i <= 9) continue;
        scanf("%d", a + i);
        flag[a[i]] = true;
    }
    // 下面两行不加也行。
    a[7] = s - a[1] - a[3] - a[5] - a[12];
    flag[a[7]] = true;
    vector<int> vt;
    for(int i=1;i<=12;i++)
    {
        if(!flag[i]) vt.push_back(i);
    }
    do
    {
        a[2] = vt[0];
        a[8] = vt[1];
        a[9] = vt[2];
        if(a[1] + a[2] + a[4] + a[6] + a[8] == s && a[8] + a[9] + a[10] + a[11] + a[12] == s)
        {
            printf("%d %d %d %d\n", a[2], a[7], a[8], a[9]);
            return 0;
        }
    } while(next_permutation(vt.begin(), vt.end()));
    return 0;
}
```

[record](https://www.luogu.com.cn/record/233751968)。

:::