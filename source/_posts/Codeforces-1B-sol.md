---
title: CF1B Spreadsheets 题解
date: 2025-4-16 16:15:49
categories:
  - Solution
tags:
  - Solution
  - Codeforces Problem Solution
---
看题解区目前没有预处理的做法，我们考虑预处理。

因为这题正推十分困难，超出了橙题难度，于是我们考虑橙题难度以内的做法——预处理。

我们可以预处理出一个列表，含有 $10^6$ 项（因为题目中说所有单元格行号/列号不会超过 $10^6$），第 $i$ 项表示第 $i$ 列在 excel 下表示什么（如第 $10$ 项就是 `J`）。

如何求出这个表格？考虑递推。有一些进制基础的人应该能秒出递推的方式，但是考虑到这题是一道橙题，这里详细讲一讲递推的方式。

- 一般情况下，把列表中某一项的**最后一个字符**“向后移动”一位就可以得到下一项。如，`AA` 变为 `AB`，`CCF` 变为 `CCG`，`CFF` 变为 `CFG`。
- 但是如果最后一个字符是 `Z`，则改变完毕之后最后一个字符变为 `A`，而倒数第二个字符向后移动一位。如，`AZ` 变为 `BA`，`CZ` 变为 `DA`，`CRZ` 变为 `CSA`。
- 但是如果最后一个字符**和**倒数第二个字符都是 `Z`，则需要把倒数第三个字符后移，最后两个字符多变为 `A`。如 `CZZ` 变为 `DZZ`，`RRZZ` 变为 `RSAA`。
- 以此类推，直到不是最后若干位都是 `Z` 为止。
- 但如果所有位都是 `Z`，则最后的字符串是所有位都是 `A`，但是长度比原本字符串多 $1$。如 `Z` 变为 `AA`，`ZZ` 变为 `AAA`。

在代码实现上，这个过程可以用一个 `while` 循环解决：先把最后一位 $+1$，然后从后往前枚举每一位，如果越界（即，$+1$ 之前为 `Z`）则强制设为 `A`，并且把前一位 $+1$。否则如果没有越界，则**直接退出**循环。

最后，如果所有位都被循环了一遍，则需要按照规则的最后一条处理。

这样我们就可以解决这道题了。至于查询，从数字转换到字母很简单（直接查表即可），从字母转换到数字需要二分查找。如何判断两个字符串在“excel 意义”下哪个比哪个小？显然是位数小的小，如果位数相同就看第一位，还相同就看第二位，以此类推。就像普通十进制数字大小比较一样。

关于时间复杂度？我们不如设 $V$ 为值域。

- 预处理显然是 $\Theta(V \log V)$ 的。
- 显然，每次查询要么是 $\mathcal O(1)$ 查表，要么是 $\mathcal O(\log V)$ 二分查找，总时间复杂度是 $\mathcal O(n \log V)$。
- 故我们总的时间复杂度是 $\Theta(V \log V)+\mathcal O(n \log V)=\mathcal O((n+V) \log V)$。显然，对于 $n \le 10^5$，$V \le 10^6$ 是能过的。

同时显然空间复杂度是 $\Theta(V \log V)$ 的。

下面是代码。

```cpp
#include <cstdio>
#include <string>
#include <iostream>

using namespace std;

string tablet[1000005];

int main()
{
	tablet[1] = 'A';
	for (int i = 2; i <= 1000000; i++)
	{
		tablet[i] = tablet[i - 1]; // 首先 copy 一份出来
		tablet[i].back()++;
		for (int j = tablet[i].size() - 1; j >= 1; j--)
		{
			if (tablet[i][j] > 'Z')
			{
				tablet[i][j] = 'A';
				tablet[i][j - 1]++;
			}
		}
		if (tablet[i][0] > 'Z') tablet[i] = string(tablet[i].size() + 1, 'A');
	}
	int n;
	scanf("%d", &n);
	while (n--)
	{
		string str;
		cin >> str;
		int r, c;
		if (sscanf(str.c_str(), "R%dC%d", &r, &c) == 2)
		{
			printf("%s%d\n", tablet[c].c_str(), r);
		}
		else
		{
			string ry, ri;
			for (char ch : str)
			{
				if (ch >= '0' && ch <= '9') ri += ch;
				else ry += ch;
			}
			// 二分可以使用 lower_bound，虽然速度据说没那么快但是方便。
			printf("R%sC%d\n", ri.c_str(), lower_bound(tablet + 1, tablet + 1000000 + 1, ry, [](const string& x, const string& y) { return x.size() < y.size() || x.size() == y.size() && x < y; }) - tablet);
		}
	}
	return 0;
}
```

题外话：这个技巧在 OI 中其实没那么常用，但是还是挺有用的。比如恶臭数字论证器就把许多数字的构造直接写在了源代码里。