---
title: 题解：P16461 [UOI 2026] Lazy Student
tags:
  - Solution
  - Luogu P Problem Solution
  - Greedy
  - Sorting
categories:
  - Solution
date: 2026-09-22 21:40:58
updated: 2026-09-22 21:40:58
---
# 题解：P16461 [UOI 2026] Lazy Student

简单题，红！

首先对于这种先比较第一个，然后比较第二个，……类型的东西，我们考虑贪心。

首先第一列如果有足够的操作次数，那么一定先让第一列最优（也就是所有行的 $\min$ 都排到第一列）。所以前几次操作一定是将第一列中非本行 $\min$ 的和这一行 $\min$ 交换。

如果这样还剩下一些操作次数，就考虑第二列，第三列，……。如果到某一列的时候操作数量不够了，那么考虑所有需要交换的列：

- 假设交换前后的差值是 $c$，则 $c$ 更大的更优。
- 如果有两个的 $c$ 相同，那么看交换的是哪一列（显然其中一列就是当前考虑的列，所以考虑的是另外一列）。交换的列号较小则更优。
- 如果都相同就是等价的。

排个序就做完了。

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/298692905)。

```cpp
#include <map>
#include <cstdio>
#include <vector>
#include <utility>
#include <cassert>
#include <algorithm>

using namespace std;

int a[1005][1005];
pair<int, int> pos[1000005];
int sorted[1005][1005];

int main()
{
  int n, m, k;
  scanf("%d%d%d", &n, &m, &k);
  k = min(k, n * m);
  for(int i=1;i<=n;i++)
  {
    for(int j=1;j<=m;j++)
    {
      scanf("%d", a[i] + j);
      sorted[i][j] = a[i][j];
      pos[a[i][j]] = {i, j};
    }
    sort(sorted[i] + 1, sorted[i] + m + 1);
  }
  if(k)
  {
    for(int j=1;j<=m;j++)
    {
      if(!k) break;
      class _
      {
      public:
        int id, val, cr;
      };
      vector<_> todo;
      for(int i=1;i<=n;i++)
      {
        if(a[i][j] == sorted[i][j]) continue;
        int v1 = a[i][j], v2 = sorted[i][j], v1id = j, v2id = pos[v2].second;
        assert(a[i][v2id] == v2 && pos[v1].second == v1id);
        todo.push_back({i, v1 - v2, v2id});
      }
      sort(todo.begin(), todo.end(), [](const auto &x, const auto &y) { return x.val > y.val || (x.val == y.val && x.cr > y.cr); });
      for(auto _i : todo)
      {
        int i = _i.id;
        // printf("j = %d, i = %d\n", j, i);
        int v1 = a[i][j], v2 = sorted[i][j], v1id = j, v2id = pos[v2].second;
        swap(a[i][v1id], a[i][v2id]);
        swap(pos[v1], pos[v2]);
        if(!--k) break;
      }
    }
  }
  for(int j=1;j<=m;j++)
  {
    long long s = 0;
    for(int i=1;i<=n;i++)
    {
      s += a[i][j];
    }
    printf("%lld%c", s, " \n"[j == m]);
  }
  return 0;
}
```

:::
