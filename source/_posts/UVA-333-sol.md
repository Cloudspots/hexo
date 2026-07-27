---
title: 题解：UVA333 Recognizing Good ISBNs
date: 2025-5-11 13:19:12
categories:
  - Solution
tags:
  - Solution
  - UVA Problem Solution
---
这题翻译我写的，但是目前还没穿。催审工单 [KECV380608](https://www.luogu.com.cn/ticket/KECV380608) 喵。

---

这题十分简单但是有十分简单的做法。

# 检查方法 / Check Method

令 $a_i$ 为合法 ISBN 的第 $i$ 位（$\text X \to 10$）。

注意到 $s2_i=s1_1+s1_2+s1_3+\dots+s1_i=a_1+(a_1+a_2)+(a_1+a_2+a_3)+\dots+(a_1+a_2+a_3+\dots+a_i)=ia_1+(i-1)a_2+(i-2)a_3+\dots+a_i$，故 $s2_{10}=10a_1+9a_2+8a_3+7a_4+6a_5+5a_6+4a_7+3a_8+2a_9+a_{10}$。

> 这样也就可以算出 $a_{10}$ 了，前面的那一长串记为 $k$ 则 $a_{10}=(-k) \bmod 11$。虽然在本题没用。

# 本题算法 / Algorithm

## 检查格式 / Check Format

首先去掉所有的 `-` 和开头或结尾的空格（注意如果全都是空格可能会寄掉），然后检查长度，然后检查前九个字符和最后一个字符即可。

## 校验 / Check

如果通过上面的格式检查，则按照上面的方式计算 $10a_1+9a_2+\dots+a_{10}$ 即可。

# 代码 / Code

```cpp
#include <cstdio>
#include <string>
#include <iostream>
#include <algorithm>

using namespace std;

int cti(char ch) { return '0' <= ch && ch <= '9' ? ch - '0' : (ch == 'X' ? 10 : -1); }

int main()
{
	string str;
	while (getline(cin, str))
	{
		// 首先去除首尾空格
		// 使用一种常用的方法（时间复杂度为 O(n)）：
		// 首先去除末尾空格。然后翻转字符串并去除末尾空格。然后再翻转回来。
		// 直接去除末尾然后去除开头是 O(n^2) 的。
		while (!str.empty() && str.back() == ' ') str.pop_back();
		reverse(str.begin(), str.end());
		while (!str.empty() && str.back() == ' ') str.pop_back();
		reverse(str.begin(), str.end());
		string s; // 去除连字符
		for (char ch : str)
		{
			if (ch != '-') s += ch;
		}
		int sum = 0;
		if (s.size() != 10) goto ed; // 长度校验
		for (int i = 0; i < 10; i++)
		{
			int res = cti(s[i]);
			if (res == -1 || i != 9 && res == 10) // 转换的同时顺便进行检查
				goto ed; // 便捷的跳出循环的方法
			sum += res * (10 - i);
		}
		if (sum % 11 == 0) printf("%s is correct.\n", str.c_str());
		else goto ed;
		continue;
	ed:
		printf("%s is incorrect.\n", str.c_str());
	}
	return 0;
}
```

# 坑点 / Holes

> My English is not very well, ok? --from my CSP $2024$ code.

我的第一发记录 WA 了，原因是没有判断是否是中间字符有 `X`。比如 `1234X98763`。

然后各种判断不要忘加。在循环内跳出这个循环并进入外层循环（指 `for(...) { for(...) { /*here*/ } a; }` 在 `/*here*/` 处跳出内层循环且不执行 `a;` 直接进入外层循环的下一次）不要直接用 `continue;` 或 `break;`，可以使用一个标记变量 `flag` 或者（在简单的情况）使用 `goto`。

> 有人说 C++ 不要用指针和 `goto`，感觉只是因为那些人没办法驾驭它们。