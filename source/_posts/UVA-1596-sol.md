---
title: 题解：UVA1596 找bug Bug Hunt
date: 2024-8-5 22:33:45
categories:
  - Solution
tags:
  - Solution
  - UVA Problem Solution
---
首先，因为题目要求说是输出**第一个 bug 所在行**，所以我们读入完一行之后如果发现之前已经找到了 bug，那么不做任何处理。

我们要区别一下两种语句，最简单的方法是判断有没有赋值符号 `=`。

## 定义数组

如果没有，说明是定义一个数组，那么直接找到 `[` 符号所在的位置，其左边是数组名，其右边到语句的倒数第二个字符是长度。

当然，我们不可能真的定义一个数组。看看样例里面的 `a[2147483647]` 吧。

但是，定义了一个长度为 `2147483647` 的数组，实际上真正用到了多少个呢？

输入不超过 $1000$ 行，每行不超过 $80$ 个字符。而每次访问数组使用最少的方式是 `a[...]`，其中 `a` 是数组名，最少一个字符。于是就可以这样：`a[a[a[...]]] = ...`（禁止套娃），于是每个就最少有 $3$ 个字符，也就是每行最多有 $\lfloor \frac{80}{3} \rfloor = 26$ 次使用数组，而总共最多就是有 $1000 \times 26 = 26000$ 次使用。

也就是，有非常多的元素是未使用的。所以我们可以使用一个哈希表，也就是 STL 中的 `unordered_map` 来保存一个数组，吗？

这样可以轻松地检测出是否使用了未初始化的元素，看看哈希表中是否有对应的键即可。但是越界访问呢？

所以，我们保存一个数组还需要记录一个数组长度，使用一个 `pair<int, unordered_map<int, int>>` 就可以搞定啦~

当然，我们可不是只有一个数组，所以我们需要再使用一个哈希表，所有数组一起可以这样：`unordered_map<string, pair<int, unordered_map<int, int>>> arr;`，然而禁止套娃。

所以，最终的定义数组：
```cpp
string arrname = str.substr(0, zkh), arrlen_s = str.substr(zkh + 1, str.size() - zkh - 2);
int arrlen = stoi(arrlen_s);
arr[arrname] = { arrlen, {} };
```
其中，`str` 表示输入的语句，`zkh` 表示 `str` 中 `[` 符号的下标，`arr` 就是上面定义的哈希表。
## 赋值语句

先放主函数里的代码，其中 `str` 表示这条语句，`arr` 表示上面定义的哈希表，`pos` 代表 `=` 赋值符号在 `str` 中的下标。

```cpp
int b = get(str.substr(pos + 1), arr, true);
int& a = get(str.substr(0, pos), arr, false);
if (a == -1 || b == -1)
{
  answer = i;
  continue;
}
a = b;
```

而 `get` 函数是用来获取一个数组中的值的，比如 `get("a[b[a[b[1]]]]")` 的返回值就是输入程序中的 `a[b[a[b[1]]]]`。

`get` 函数就是整个程序的精髓所在：

```cpp
int nul = -1, tmp;
//nul 代表错误，包括题目中说的两种错误
//而 tmp 是专门用来存放常数的，因为返回值是引用，所以不能返回函数中的变量。

//str 表示访问的语句，比如 a[b[a[b[a[c[c[11231]]]]]]]
//arr 对应主函数中的哈希表，用于存放数组。
//pd 用于判断当遇到未初始化的变量时是否报错，如果在等号的前方就不需要报错，因为是要赋值的数字。如果是等号右边就需要报错，因为是要赋值成的数字。（禁止绕口令）
int& get(const string& str, unordered_map<string, pair<int, unordered_map<int, int>>> &arr, bool pd)
{
  int pos = str.find('[');
  if (pos == string::npos) return tmp = stoi(str); //纯数字
  string arrname = str.substr(0, pos), arrlen_s = str.substr(pos + 1, str.size() - pos - 2);
  int res = get(arrlen_s, arr, false); //获取下标代表的数字
  if (res == nul) return nul; //如果获取下标时出错
  if (res >= arr[arrname].first || pd && arr[arrname].second.count(res) == 0) return nul; //判断报错
  else return arr[arrname].second[res]; //访问
}
```