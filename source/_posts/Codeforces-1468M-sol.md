---
title: 题解：CF1468M Similar Sets
date: 2025-12-28 10:48:40
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
考虑根号分治。

下文中设 $S$ 为单个测试用例中所有集合总大小（也就是 $\sum k_i$，不超过 $2\times 10^5$）。

我们把大小 $\ge B$ 的集合称作大集合，否则称作小集合。容易发现，大集合不超过 $\dfrac{S}{B}$ 个。

那么我们就把集合对分为大集合对大集合，小集合对大集合和小集合对小集合。

我们暴力处理大集合对其它集合（包括大集合对大集合和大集合对小集合）。容易发现，每个大集合对应的其它集合的总大小不超过 $S$，那么总时间复杂度就是 $\mathcal O\left(\dfrac{S^2}{B}\right)$。

而对于小集合对小集合，由于它们都很小，我们可以对于每个集合中的所有二元组，看看其它集合中有没有这个二元组。

总共有 $\mathcal O(\sum k_i^2)$ 个二元组，然后我们知道 $k_i<B$，我们求这个式子的最大值（可以直接跳过看结论）。

:::info[推导过程]{open}

根据局部调整，如果存在两个 $k_i,k_j$ 满足 $1<k_j<k_i<B-1$，那么将 $k_i$ 增加 $1$，$k_j$ 减少 $1$ 之后显然还满足所有的 $k$ 都小于 $B$ 且 $k$ 的总和不变，而平方和从 $k_i^2+k_j^2$ 变成了 $(k_i+1)^2+(k_j-1)^2=k_i^2+k_j^2+2(k_i-k_j+1)$，增加了。

所以说，最终的最优解一定形如一堆 $B-1$，一堆 $1$ 和至多一个介于 $B-2$ 和 $2$ 之间的数字。

而如果我们把两个 $1$ 合并，则平方和从 $2$ 变成了 $4$ 且修改后必然满足条件（假设 $B>2$），这样 $1$ 的个数就减少了 $2$。把所有这样的 $1$ 合并，然后再重复上面的局部调整，最后至多有一个 $1$。

那么最终的最优解一定形如最多一个 $1$，最多一个介于 $2$ 和 $B-2$ 之间的数字和一堆 $B-1$。如果有 $1$ 和介于 $2$ 和 $B-2$ 之间的数字，将其合并，值增加。

最终得到 $\mathcal O\left(\dfrac{S}{B}\right)$ 个 $\Theta(B)$ 和至多一个无关紧要的数字。平方和为 $\mathcal O(BS)$。

:::

这个东西最大为 $\mathcal O(BS)$。

我们把当前遇到的所有二元组存入哈希表中，就可以实现 $\mathcal O(BS)$ 的处理。

总时间复杂度 $\mathcal O\left(\dfrac{S^2}{B}+BS\right)$。取 $B=\sqrt{V}$，得到总时间复杂度 $\mathcal O(S^{1.5})$。

但还有问题啊！The Evil Codeforces 会卡哈希。

用 `map`？TLE。

存数组然后 `sort`？额你需要一秒内对 $2\times 10^7$ 个整数排序（可以用一个完美哈希把两个 `int` 压成 `long long` 就可以转化为整数排序）……

可以用基数排序！我不会！

我的做法是先离散化然后对于每个二元组，把小的数字放前面，然后开一个 `vector` 数组，`vrt[i]` 表示第一个数字为 $i$ 的所有二元组。这样平均情况下非常优秀，实际上也没有被卡。

注意就是大集合的时候不要自作聪明用双指针，这样复杂度是 $\max$ 的，应该用二分，不然多一个 `log`。也不要用哈希表，首先会被卡，然后哈希表本来就很慢。

$66$ 次提交的血泪教训。

:::success[AC 记录&代码]

为什么是 success 框，因为我交了 $66$ 次结果在最后一次提交的时候看到了 403 Forbidden。最终还是 Happy New Year 了。

[submission](https://codeforces.com/contest/1468/submission/355446119)。

```cpp
#pragma GCC optimize("Ofast")
#include <cstdio>
#include <utility>
#include <vector>
#include <algorithm>
#include <cmath>
#include <random>
#include <chrono>
#include <tuple>
#include <map>

using namespace std;

vector<unsigned> st[100005];

vector<pair<int, int>> vrt[200005];

unsigned TheUniqueReadHasBeedForgedByLionblaze()
{
    char ch;
    while ((ch = _getchar_nolock()) < '0' || ch > '9');
    unsigned ans = 0;
    do
    {
        ans = ans * 10 + (ch ^ '0');
    } while ((ch = _getchar_nolock()) >= '0' && ch <= '9');
    return ans;
}

int main()
{
    auto bgn = chrono::high_resolution_clock::now();
    //mt19937_64 mt(random_device{}());
    //uniform_int_distribution<int> ud(1, 1000000000);
    int t = TheUniqueReadHasBeedForgedByLionblaze();
    //scanf("%d", &t);
    //t = 1;
    while (t--)
    {
        int n = TheUniqueReadHasBeedForgedByLionblaze();
        //scanf("%d", &n);
        //n = 50002;
        map<int, int> mp;
        int cru = 0;
        int sum = 0;
        for (int i = 1; i <= n; i++)
        {
            st[i].clear();
            int k = TheUniqueReadHasBeedForgedByLionblaze();
            //scanf("%d", &k);
            //k = 2;
            sum += k;
            while (k--)
            {
                int x = TheUniqueReadHasBeedForgedByLionblaze();
                //scanf("%d", &x);
                //x = ud(mt);
                if (!mp.count(x)) mp[x] = ++cru;
                st[i].push_back(mp[x]);
            }
            sort(st[i].begin(), st[i].end());
        }
        vector<int> vtr;
        for (int i = 1; i <= cru; i++)
        {
            vtr.push_back(i);
            vrt[i].clear();
        }
        unsigned b = sqrt(sum) / 2 + 1;
        unsigned cur = 0;
        //if (n == 50002) return 1;
        for (int i = 1; i <= n; i++)
        {
            if (st[i].size() >= b)
            {
                for (int j = 1; j <= n; j++)
                {
                    if (st[j].size() >= b && j >= i) continue;
                    unsigned cur = 0;
                    unsigned tt = 0;
                    for (unsigned k : st[j])
                    {
                        //while (k > st[i][cur] && cur + 1 < st[i].size()) cur++;
                        //if (st[i][cur] < k || st[j].back() < st[i][cur]) break;
                        auto it = lower_bound(st[i].begin(), st[i].end(), k);
                        if (it != st[i].end() && *it == k)
                        {
                            tt++;
                            if (tt >= 2) break;
                        }
                    }
                    if (tt == 2)
                    {
                        printf("%d %d\n", i, j);
                        goto ed;
                    }
                }
            }
            else
            {
                for (int j = 0; j + 1 < st[i].size(); j++)
                {
                    for (int k = j + 1; k < st[i].size(); k++)
                    {
                        //unsigned x = (st[i][j] < st[i][k] ? st[i][j] : st[i][k]), y = (st[i][j] < st[i][k] ? st[i][k] : st[i][j]);
                        unsigned x = st[i][j], y = st[i][k];
                        vrt[x].push_back({ y, i });
                    }
                }
            }
        }
        sort(vtr.begin(), vtr.end(), [&](int x, int y) { return vrt[x].size() > vrt[y].size(); });
        for (int i : vtr)
        {
            //if (chrono::duration_cast<chrono::milliseconds>(chrono::high_resolution_clock::now() - bgn).count() > 900) break;
            //if (vrt[i].size() >= 10000 && cru > 1) return 1;
            sort(vrt[i].begin(), vrt[i].end());
            for (int j = 0; j + 1 < vrt[i].size(); j++)
            {
                if (vrt[i][j].first == vrt[i][j + 1].first)
                {
                    printf("%d %d\n", vrt[i][j].second, vrt[i][j + 1].second);
                    goto ed;
                }
            }
        }
        printf("-1\n");
    ed:
        ;
    }
    //printf("Time used: %llu ms\n", chrono::duration_cast<chrono::milliseconds>(chrono::high_resolution_clock::now() - bgn));
    return 0;
}
```

:::