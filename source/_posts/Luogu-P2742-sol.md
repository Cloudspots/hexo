---
title: 题解：P2742 [USACO5.1] 圈奶牛Fencing the Cows /【模板】二维凸包
date: 2025-4-25 22:17:36
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
本文主要介绍二维凸包的 Graham 算法。

> 闲话：显然 Graham 是个人名，翻译过来是[葛立恒](https://baike.baidu.com/item/%E8%91%9B%E7%AB%8B%E6%81%92)，就是葛立恒数那个葛立恒。显然是巨佬。

# 算法介绍

任务：我们要求一个凸多边形（即每个内角均小于 $180^\circ$ 的多边形），包含平面上指定的所有点，并且周长最小。这个图多边形就叫做这个点集的凸包。

算法步骤（可能过于抽象）：

1. 定义一个栈 $T$。$S(T)$ 表示 $T$ 的元素个数。
2. 找出 $y$ 值最小的点 $M$。如果有重复，则找出 $x$ 最小的。如果再有重复，任取一个。
3. 按照点集 $S$ 中所有点与 $M$ 的极角从小到大扫描每个点 $P$。如果有极角相同的，则到 $M$ 的距离更小的优先。如果还有重复，顺序任意。
4. 对于每个点 $P$，然后如果 $S(T)\ge 2$ 则重复进行以下操作：  
   对于栈顶元素 $A$ 和栈顶之前的元素（即如果抛出栈顶元素，新的栈顶元素。$S(T) \ge 2$ 保证了存在这样的元素）$B$，如果 $\angle APB$“下凹”（有很多种定义，比如 $PA \times PB < 0$，其中 $\times$ 代表叉积，或者直接计算极角是否 $< \pi$）则弹出栈顶元素 $A$ 并且如果 $T$ 的元素个数仍然 $\ge 2$ 则重复这个操作。否则停止操作。
5. 将 $P$ 进栈。
6. 最终 $T$ 中所有的点就会构成凸包的所有顶点。

# 算法详解/正确性证明/时间复杂度分析

时间复杂度分析较为简单。每个元素至多被入栈和出栈一次，时间复杂度为 $\Theta(n)$，但是排序时间复杂度为 $\mathcal O(n \log n)$，故总时间复杂度为 $\mathcal O(n \log n)$。

关于正确性证明及算法本质：

首先，我们可以注意到，我们选的 $M$ 点必然在凸包上。这个是显然的。

算法就类似于有一根从 $M$ 点开始的绳子（无限长），刚开始朝着 $\theta=0$（$x$ 轴正方向，正右边）然后不停地往逆时针方向转动，把点视为钉子，绳子碰到之后就会改变旋转中心继续旋转。总共转一圈，最后显然会转回起点，形成凸包，正确性是显然的。类似于[这篇文章](https://www.luogu.com.cn/article/td3ah746)中说的~~打人算法~~ Jarvis 算法。

但是这样代码实现起来不太好。因为每次需要枚举这条绳子会碰到哪个点（以绳子目前的旋转中心为原点，求极角最小的点）。这样时间复杂度是 $\mathcal O(n^2)$ 的。

我们思考如何优化。我们发现以哪个点为原点的极角的相对差别都不是很大，于是我们想到直接让绳子打到极角比目前的点更大中的极角最小的点。显然，这是不对的（样例就可以 hack）。

我们发现这样每个点都会被加入凸包。我们需要去除一些没有必要的点。显然，对于连续的三个点，如果下凹则不仅违反凸包性质，还违反周长最小的限制。我们就可以直接把中间那个点弹出凸包，把线“拉直”。

这样我们发现我们还可以在线处理。建议查看[例子](https://www.desmos.com/calculator/2iqphgrmyg)（食用方法：单击 $t$ 左边的三角形按钮）。拜谢 desmos。

# 代码实现

C++。

工具函数&工具类：

```cpp
class point
{
public:
	long double x, y;
private:
	long double theta;
public:
	point(long double _x = 0, long double _y = 0) : x(_x), y(_y), theta(x == 0 && y == 0 ? 0 : atan2(y, x)) {}
	const point& operator=(const point& right) { x = right.x; y = right.y; theta = right.theta; return *this; }
	friend bool operator<(const point& x, const point& y) { return x.theta < y.theta || x.theta == y.theta && x.x * x.x + x.y * x.y < y.x * y.x + y.y * y.y; }
	long double gett() const { return theta; }
};

long double angle(const point &p1, const point &p2, const point &p3)
{
	return point{ p1.x - p2.x, p1.y - p2.y }.gett() - point{ p3.x - p2.x, p3.y - p2.y }.gett();
}
```

算法：

```cpp
vector<point> Graham_alg(vector<point> pts)
{
	vector<point> res;
	int id = 0;
	for (int i = 0; i < pts.size(); i++)
	{
		if (pts[i].y < pts[id].y || pts[i].y == pts[id].y && pts[i].x < pts[id].x) id = i;
	}
	res.push_back(pts[id]);
	pts.erase(pts.begin() + id);
	for (point& p : pts)
	{
		p = { p.x - res[0].x, p.y - res[0].y };
	}
	sort(pts.begin(), pts.end());
	for (point& p : pts)
	{
		p = { p.x + res[0].x, p.y + res[0].y };
	}
	for (const point& x : pts)
	{
		while (res.size() >= 2)
		{
			point t = res.back();
			point r = res[res.size() - 2];
			long double kk = angle(x, t, r);
			if (kk < 0) kk += numbers::pi_v<long double> * 2;
			if (kk > numbers::pi_v<long double>) break;
			else res.pop_back();
		}
		res.push_back(x);
	}
	return res;
}
```

# 例题

1. P2742 模板题。最终要求周长，我们就把凸包上的所有的相邻点对（多边形是一个环，为了方便我们可以求完凸包之后把凸包的第一个点再次加入到凸包点序列末尾）使用勾股定理求长度，再求和即可。
2. P3829 经典（？）小学奥数题。首先我们对所有信用卡角上四个四分之一圆的圆形求一遍凸包。然后因为凸包是凸的，所以凸包上的每个角贡献的圆弧加起来就会是一整个圆，所以求得的凸包周长在加上圆周长即可。

~~求硬币，求点赞，求收藏，求转发，最重要的是点一个……~~