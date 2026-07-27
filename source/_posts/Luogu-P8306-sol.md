---
title: 题解：P8306 【模板】字典树
date: 2025-6-5 20:58:28
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
# 数据结构简介

字典树，又名 Trie 树、字符树，是一种保存多个字符串且能够方便地获取前缀的数据结构。

是一种树形数据结构，工作原理有点类似自动机，一个保存了 `ba`，`bi`，`bag`，`ban`，`bat`，`big`，`bil`，`bit` 的 trie 树是这样的：

![图摘自此文章：https://www.luogu.com.cn/article/ccwvmnlt，侵删](v2-c6c00f279fb8a978ba6a7b08820e92e8_r.jpg)

除了根节点之外，每个节点都代表一个字母（显然可能重复）。

对于每个单词，都能够在树上找到一条从根到某个节点的路径，满足这条路径上经过的所有节点的字符串起来就是这个单词。

小练习：如果在上图中的字典树中添加一个单词 `LB`，会变成什么样？

查询前缀就很简单了：只需要沿着根节点向下走即可。

对于洛谷模版题，我们需要在每个节点上记录一个值，代表从根节点到这个节点上的字符串是多少个字符串的前缀，即有多少个字符串插入这个 trie 的过程中经过了这个节点。

# 正确性证明

显然，略去。

# 代码实现

```cpp
#include <cstdio>
#include <string>
#include <iostream>
#include <map>

using namespace std;

class node
{
public:
    char ch;
    int cnt = 0;
    map<char, node *> c;
    void clr() { for(pair<char, node*> v : c) { v.second->clr(); delete v.second; } c.clear(); }
} rt;

void addstr(node *rt, string str)
{
    for(char ch : str)
    {
        if(!rt->c.count(ch)) rt->c[ch] = new node{ch, 0};
        rt = rt->c[ch];
        rt->cnt++;
    }
}

int query(node *rt, string str)
{
    for(char ch : str)
    {
        if(!rt->c.count(ch)) return 0;
        rt = rt->c[ch];
    }
    return rt->cnt;
}

void solve()
{
    int n, q;
    scanf("%d%d", &n, &q);
    rt.clr();
    for(int i=1;i<=n;i++)
    {
        string str;
        cin >> str;
        addstr(&rt, str);
    }
    for(int i=1;i<=q;i++)
    {
        string str;
        cin >> str;
        printf("%d\n", query(&rt, str));
    }
}

int main()
{
    int t;
    scanf("%d", &t);
    while(t--) solve();
    return 0;
}
```

警示后人：不要用 `unordered_map` 和开同步流的 `cin` 读入，会被卡常。用 `map`。~~打死不关同步流。~~