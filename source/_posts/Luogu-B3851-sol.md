---
title: B3851 图像压缩 题解
date: 2024-3-9 17:40:42
categories:
  - Solution
tags:
  - Solution
  - Luogu B Problem Solution
---
## 题目简述

给出一堆十六进制数，找出出现次数最多的 $16$ 个数字，将每个数字替换为 $16$ 个数字中最近的数字（最近的数字指与它绝对值最小的数字，如果多个数字与它的绝对值相同，则取最小）。

## 分析

1. 十六进制不好处理，转为十进制。
2. 如何找出出现最多的 $16$ 个数字：桶排
3. 如何找到最近的数字：可以用 `lower_bound`，但是不需要，可以直接找。
4. 细节！细节！细节！

## 代码

```cpp
#include <cmath> //abs
#include <cstdio> //scanf, printf
#include <string> //string
#include <iostream> //cin
#include <algorithm> //sort
using namespace std;

int mp[25][25], choose[25]; //choose：找出的16个数字

class cnter
{
public:
    int num, cnt; //还要知道是什么数字，排序之后才不会乱
} cnt[260];

int main()
{
    int n;
    scanf("%d", &n);
    int m;
    for(int i=1;i<=n;i++)
    {
        string str;
        cin >> str;
        m = str.size()/2;
        for(int j=1;j<=m;j++)
        {
            char c1 = str[j*2-2], c2 = str[j*2-1];
            int a1, a2;
            if(c1 >= '0' && c1 <= '9') a1 = c1 - '0';
            else a1 = c1 - 'A' + 10;
            if(c2 >= '0' && c2 <= '9') a2 = c2 - '0';
            else a2 = c2 - 'A' + 10;
            mp[i][j] = a1*16+a2; //16 to 10
            cnt[mp[i][j]].cnt++; //计数++
            cnt[mp[i][j]].num = mp[i][j]; //设置数字
        }
    }
    sort(cnt, cnt + 256, [](cnter x, cnter y) { return x.cnt > y.cnt || x.cnt == y.cnt && x.num < y.num; }); //排序
    for(int i=0;i<16;i++)
    {
        choose[i] = cnt[i].num;
        int a = choose[i]/16, b = choose[i]%16;
        printf("%c%c", (a <= 9)?(a + '0'):(a + 'A' - 10), (b <= 9)?(b + '0'):(b + 'A' - 10)); //10 to 16
        //printf(":%d\n", cnt[i].cnt); //debug语句
    }
    putchar('\n');
    for(int i=1;i<=n;i++)
    {
        for(int j=1;j<=m;j++)
        {
            int num = mp[i][j];
            int minn = 2147483647, mink;
            for(int k=0;k<16;k++)
            {
                if(abs(num - choose[k]) < minn)
                {
                    minn = abs(num - choose[k]);
                    mink = k;
                }
            }
            putchar(mink <= 9 ? mink+'0' : (mink + 'A' - 10)); //10 to 16
        }
        puts("");
    }
    return 0;
}
```