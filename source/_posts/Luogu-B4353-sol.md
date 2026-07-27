---
title: 题解：B4353 [信息与未来 2025] 程序套娃（暂无 SPJ）
date: 2025-7-15 16:18:53
categories:
  - Solution
tags:
  - Solution
  - Luogu B Problem Solution
---
> 此题暂无 SPJ，并且在目前的情况中不太可能加上 SPJ，所以目前加题解不需要 AC 此题。

应该是对的。

# 做法 $1$

思路：在输出的程序中给定 $n$ 和 $k$。然后用一些类似于 Quine 的技巧做到 $\Theta(1)$ 的程序大小。

## Quine

Quine，即一个能够输出自己的源代码的程序。通常来讲，标准是不需要输入任何内容，即 `print(input())[NEWLINE]`（`[NEWLINE]` 代表换行，下同）并不是一个 Quine 程序，因为需要手动输入 `print(input())`。同时，程序也不能够通过读取自己的源代码的方式通过此题。

模版题：[LibreOJ #4](https://loj.ac/p/4)。

我们首先想到的思路就是，直接输出源代码。这样是不可行的，因为在程序中套一个自己的源代码必然会让程序变长，这样输出的源代码就不对了（在这题中可以这么做因为只需要有限次，但是代码会很长）。

实际上，造成这个问题的只是这个源代码字符串。我们发现这个字符串和字符串之外的东西（其余代码）几乎相同（因为这也是源代码），就有思路了：用一个特殊的字符串（如 `IAKIOI`）代替这个源代码，然后把 `IAKIOI` 替换原本的源代码字符串。

使用 Python 比较好写。代码：

```python
s = '''s = 看啥看，做题去
s = s.replace("看啥看"+"，做题去", "'" + "''" + s + "'" + "''")
print(s)'''
s = s.replace("看啥看"+"，做题去", "'" + "''" + s + "'" + "''")
print(s)

```

最后必须要有一个空行（换行符），因为 Python `print` 会输出换行符。

> LOJ 并没有拦截使用读取自己源代码的方式通过此题的做法。参考代码：`print(open(__file__).read()[:-1])[NEWLINE]`。

当然这题还是用 C++ 比较好。字符串替换不想写，可以用 `printf` 代替。C++ Quine 代码：

```cpp
#include <cstdio>
#include <string>

using namespace std;

string str = R"(#include <cstdio>
#include <string>

using namespace std;

string str = R"(%s)%c;

int main()
{
    printf(str.c_str(), str.c_str(), '\"');
    return 0;
})";

int main()
{
    printf(str.c_str(), str.c_str(), '\"');
    return 0;
}
```

## 回到本题

对 Quine 代码加以改装。代码逻辑基本相同，一个需要注意的点是代码中也需要 `%` 符号了（输出 $k$ 需要），而如果使用 `'%'` 会陷入无限套娃，所以使用 ASCII 码。

```cpp
#include <cstdio>
#include <string>

using namespace std;

string str = R"(#include <cstdio>
#include <string>

using namespace std;

string str = R"(%s)%c;
int n = %d, k = %d;

int main()
{
    if(n == 2) printf("%cd\n", k);
    else printf(str.c_str(), str.c_str(), '\"', n - 1, k, (char)37);
    return 0;
})";
int n = 【填入 n】, k = 【填入 k】;

int main()
{
    if (n == 2) printf("%d\n", k);
    else printf(str.c_str(), str.c_str(), '\"', n - 1, k, (char)37);
    return 0;
}
```

所以本题程序：

```cpp
#include <cstdio>

using namespace std;

int main()
{
    int n, k;
    scanf("%d%d", &n, &k);
    if (n == 1) printf("%d\n", k);
    else printf(R"(#include <cstdio>
#include <string>

using namespace std;

string str = R"(#include <cstdio>
#include <string>

using namespace std;

string str = R"(%%s)%%c;
int n = %%d, k = %%d;

int main()
{
    if(n == 2) printf("%%cd\n", k);
    else printf(str.c_str(), str.c_str(), '\"', n - 1, k, (char)37);
    return 0;
})" ")" R"(";
int n = %d, k = %d;

int main()
{
    if (n == 2) printf("%%d\n", k);
    else printf(str.c_str(), str.c_str(), '\"', n - 1, k, (char)37);
    return 0;
})", n, k);
    return 0;
}
```

# 做法 $2$

朴素的做法，将程序嵌套。

大概想法就是写一个简单的输出某个字符串的程序，然后重复把这个程序本身套到要输出的字符串中。最里面的字符串就是 $k$。

但是直接使用字符串需要转义，于是写了一个转义换行符、双引号和反斜杠的函数。

```cpp
#include <cstdio>
#include <string>

using namespace std;

string tplt_left = R"(#include <cstdio>

using namespace std;

int main()
{
    printf("%s", )", tplt_right = R"()
    return 0;
})";

string zy(const string &x)
{
    string res = "\"";
    for(char ch : x)
    {
        if(ch == '"') res += "\\\"";
        else if(ch == '\\') res += "\\\\";
        else if(ch == '\n') res += "\\n";
        else res += ch;
    }
    return res + "\"";
    // 好抽象的字符串转义。
}

int main()
{
    int n, k;
    scanf("%d%d", &n, &k);
    string v = to_string(k);
    for(int i=1;i<n;i++)
    {
        v = tplt_left + zy(v) + tplt_right;
    }
    printf("%s\n", v.c_str());
    return 0;
}
```

你会发现输入 `8 1000000000` 的长度不足 $2\mathrm{KB}$，可喜可贺！当然我们也可以压一压。稍微做一做可以干到 $858\mathrm B$，方案是把 `tplt_left` 和 `tplt_right` 改成：

```cpp
string tplt_left = R"(#include <cstdio>
int main(){printf("%s",)", tplt_right = R"();})";
```

这个做法看上去代码长度是线性的，实际上是指数级的。原因是 `\` 转义之后会变成两个 `\`，然后指数级增加，但是在 $n$ 很小的时候可以忽略不计。这个做法还是很优的。