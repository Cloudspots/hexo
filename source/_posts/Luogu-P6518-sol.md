---
title: 题解：P6518 [CEOI 2010] arithmetic (day1)
date: 2026-6-19 16:58:36
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
八百年前做的题……现在来补一下。

## 推理（错解）

如果某一行或某一列有 $\ge$ 两个已知数字，我们就可以确定这一整行（列）！

但如果不存在这样的行/列，我们可以猜！

$40\text{pts}$。

## 分析性质

欸每行每列都是等差数列……

直觉上，我们觉得每行（每列）的公差和首项也需要呈等差数列！

首项这个是显然的，第二项也需要是等差数列，两个等差数列做差还是等差数列，证毕！$\square$

那么我们设只需要知道左上角元素 $A_{0,0}$，第一行的公差 $r_0$，第一列的公差 $c_0$ 和每一列的公差的公差 $d$！

那么我们就容易知道第一行的元素 $A_{0,x}=A_{0,0}+xr_0$，第一列的元素 $A_{x,0}=A_{0,0}+xc_0$，每一列的公差 $c_i=c_0+id$，就可以知道每个元素 $A_{x,y}=A_{0,y}+xc_y=A_{0,0}+yr_0+xc_0+xyd$！

然后我们发现这个方程组关于 $A_{0,0},r_0,c_0$ 和 $d$ 是线性的（$x,y,A_{x,y}$ 为常数），可以列方程了！

现在我们有了若干个形如 $xyd+xc_0+yr_0+A_{0,0}=A_{x,y}$ 的方程，如何解出 $d,r_0,c_0$ 和 $A_{0,0}$ 呢？

直接高斯消元就做完了。简单分析一下，因为值域小，操作次数少，用 `long long` 写一个分数类就做完了。

这时候两年前的代码就发挥了作用。即使写的不是正解，但也提供了一个分数类。

时间复杂度 $O(RC)$。为什么跑这么快？

:::info[rec&code]

[rec](https://www.luogu.com.cn/record/282313588)。

```cpp
#include <cstdio>
#include <vector>
#include <cstdlib>
#include <iostream>
#include <exception>
#include <stdexcept>

using namespace std;

long long gcd(long long x, long long y) { return y ? gcd(y, x % y) : abs(x); }

class num
{
public:
	long long a = 0, b = 1;
	num() { a = 0; b = 1; }
	num(long long x) { a = x; b = 1; }
	num(num&& x) noexcept { a = x.a; b = x.b; }
	num(const num& x) { a = x.a; b = x.b; }
	num(long long x, long long y) { if (y == 0) abort(); long long v = gcd(x, y); a = x / v; b = y / v; if(b < 0) { a = -a; b = -b; } }
	friend num operator+(const num &x, const num &y) { return num{ x.a * y.b + x.b * y.a, x.b * y.b }; }
	friend num operator-(const num &x, const num &y) { return num{ x.a * y.b - y.a * x.b, x.b * y.b }; }
	friend num operator*(const num &x, const num &y) { return num{ x.a * y.a, x.b * y.b }; }
	friend num operator/(const num &x, const num &y) { return num{ x.a * y.b, x.b * y.a }; }
	friend bool operator==(const num &x, const num &y) { return x.a == y.a && x.b == y.b; }
	friend bool operator>(const num &x, const num &y) { return x.a * y.b > x.b * y.a; }
	friend bool operator<(const num &x, const num &y) { return x.a * y.b < x.b * y.a; }
	friend bool operator!=(const num &x, const num &y) { return !(x == y); }
	friend bool operator>=(const num &x, const num &y) { return x > y || x == y; }
	friend bool operator<=(const num &x, const num &y) { return x < y || x == y; }
	friend bool operator==(const num &x, long long y) { return x == num(y); }
	friend bool operator>(const num &x, long long y) { return x > num(y); }
	friend bool operator<(const num &x, long long y) { return x < num(y); }
	friend bool operator!=(const num &x, long long y) { return x != num(y); }
	friend bool operator>=(const num &x, long long y) { return x >= num(y); }
	friend bool operator<=(const num &x, long long y) { return x <= num(y); }
	num &operator-=(const num &y) { return *this = *this - y; }
	num &operator=(const num &y) { a = y.a; b = y.b; return *this; }
	friend ostream &operator<<(ostream &os, const num &x) { os << x.a; if (x.b != 1) os << "/" << x.b; return os; }
} nums[55][55];

class vk
{
public:
	num vx[4], x;
	vk &operator-=(const vk &r) { vx[0] -= r.vx[0]; vx[1] -= r.vx[1]; vx[2] -= r.vx[2]; vx[3] -= r.vx[3]; x -= r.x; return *this; }
	friend vk operator*(const vk &x, const num &k) { return {{x.vx[0] * k, x.vx[1] * k, x.vx[2] * k, x.vx[3] * k}, x.x * k}; }
	friend vk operator*(const num &k, const vk &x) { return {{x.vx[0] * k, x.vx[1] * k, x.vx[2] * k, x.vx[3] * k}, x.x * k}; }
} vs[2505];

num ans[4];

int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	int cur = 0;
	for (int i = 0; i < n; i++)
	{
		for (int j = 0; j < m; j++)
		{
			int x = 0x3f3f3f3f;
			scanf("%d", &x);
			nums[i][j] = x;
			if (x == 0x3f3f3f3f) getchar();
			else vs[cur++] = {{i * j, i, j, 1}, x};
		}
	}
	int cx = 0;
	vector<int> vr;
	for(int i=0;i<=3;i++)
	{
		bool flag = false;
		for(int j=cx;j<cur;j++)
		{
			if(vs[j].vx[i] != 0)
			{
				flag = true;
				swap(vs[cx], vs[j]);
				break;
			}
		}
		if(!flag) continue;
		for(int j=cx+1;j<cur;j++)
		{
			vs[j] -= vs[j].vx[i] / vs[cx].vx[i] * vs[cx];
		}
		cx++;
		vr.push_back(i);
	}
	for(int i=(int)vr.size()-1;i>=0;i--)
	{
		for(int j=vr[i]+1;j<4;j++)
		{
			vs[i].x -= vs[i].vx[j] * ans[j];
			vs[i].vx[j] = 0;
		}
		ans[vr[i]] = vs[i].x / vs[i].vx[vr[i]];
	}
	bool flag = true;
	// cout << "Solved d = " << ans[0] << ", c0 = " << ans[1] << ", r0 = " << ans[2] << ", A[0][0] = " << ans[3] << endl;
	for(int i=0;i<cur;i++)
	{
		if(vs[i].vx[0] * ans[0] + vs[i].vx[1] * ans[1] + vs[i].vx[2] * ans[2] + vs[i].vx[3] * ans[3] != vs[i].x) flag = false;
	}
	if(!flag) printf("No solution.\n");
	else
	{
		for(int i=0;i<n;i++)
		{
			for(int j=0;j<m;j++)
			{
				cout << i * j * ans[0] + i * ans[1] + j * ans[2] + ans[3] << " \n"[j + 1 == m];
			}
		}
	}
	return 0;
}
```

:::