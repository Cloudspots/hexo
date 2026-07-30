---
title: 浅谈模板元编程
date: 2024-11-16 20:05:39
categories:
  - Technology & Engineering
tags: []
---
C++ 的模板功能非常多，已经被证明了是**图灵完备**的。

具体地，可以看看 `<type_traits>` 头文件，里面几乎都是模板元，STL 中大幅度用到了这些。

当然，为了验证我们的模板元是否起效而不用运行，我们可以使用 `static_assert`。

首先介绍 `static_assert`，语法是：

```cpp
static_assert(a); // 据说要 C++17 以上
static_assert(a, "xxx");
```

当 `a` 成立时，这行代码相当于没有。放心，这样也不会占用代码的运行时间导致 TLE，因为所有判断都是在编译时进行的。

当 `a` 不成立时，就会直接给你报个编译错误。在 VS 下，如果是第一种，那么会报 `error C2607: 静态断言失败`，如果是第二种，会报 `error C2338: static_assert failed: 'xxx'`，翻译过来就是 “静态断言失败，原因是：xxx”。

然后我们来学习一下模板。

模板的本意是，减少代码量。

# 函数模板

## 类型模板

比如你写了一个程序，计算两个 `int` 类型的数字之和：

```cpp
int add_int(int a, int b) { return a + b; }
```

但是过了一会儿，又需要很多函数函数计算两个 `double` 类型的数字之和，`string` 类型之和，`float` 类型之和……你的代码就变成了：

```cpp
int add_int(int a, int b) { return a + b; }
double add_double(double a, double b) { return a + b; }
string add_string(string a, string b) { return a + b; }
float add_float(float a, float b) { return a + b; }
long double add_long_double(long double a, long double b) { return a + b; }
// ...
```

此时你就会发现，每次都打一遍很不方便。这时候，就可以用模板元编程：

```cpp
template<typename T>
T add(T a, T b) { return a + b; }
```

这样，无论是什么类型的，都可以使用 `add`，比如 `add(1,2)`，`add(1.3f,2.2f)`，`add(string("|A|<"),string("|O|"))`，`add(1.3, 2.3)`，`add(1.24L, 1.29L)`，都可以快乐地使用。

这里有几个关键字：

- `template`：代表模板，用于声明这是一个模板函数 / 模板类。
- `typename`：代表类型，用来声明后面的是一个类型。

这样，翻译一下就是：

定义模板函数，有一个模板参数 `T`，是一个类型，其返回值为 `T` 类型，有两个参数 `a` 和 `b`，也都是 `T` 类型的，函数体为 `{ return a + b; }`。

你可能会很好奇，这是怎么做到的，难不成编译器把所有类型都带进 `T` 里面挨个生成了一遍对应的函数？差不多，只是不是所有类型，而是所有真正用到了的类型，还有一些细节：

这个模板函数的不同类型版本不是都叫 `add`，`add(1,2)` 的全名的是 `add<int>(1,2)`，`add(1.24L, 1.29L)` 对应的全名是 `add<long double>(1.24L, 1.29L)`，明显是在函数名称后面加上了对应的模板参数。

但是，为什么写成 `add` 也可以呢？这是因为善解人意的编译器发现 `1` 和 `2` 都是 `int` 类型的，自动推断出了 `T = int`。但是，如果你用 `add(1, 2.0)` 就会报错，编译器不知道 `T` 是什么，你可以用 `add<int>(1, 2.0)`，强制指定 `T = int`，这样运行时（或者编译时，取决于你有没有开优化）就会把 `2.0` 自动转换成 `2`，或者使用 `add<double>(1, 2.0)`，就会把 `1` 转换成 `1.0`。同时，`add<int>(1.2, 3.4)` 会把 `1.2` 和 `3.4` 都转化为 `int` 类型。

当然，单纯定义一个 `add` 没啥意思，还可以动用你的奇思妙想定义出复杂的函数，比如下面的 Dijkstra 算法：

```cpp
template<typename T>
vector<T> Dijkstra(const vector<vector<pair<int, T>>>& web, int s)
{
	constexpr T T_max = numeric_limits<T>::max();
	vector<T> res = vector<T>(web.size(), T_max);
	class point
	{
	public:
		int id;
		T cost;
		bool operator<(const point& y) const { return cost > y.cost; }
	};
	priority_queue<point> pq;
	res[s] = T();
	pq.push({ s, res[s]});
	while (!pq.empty())
	{
		point u = pq.top();
		pq.pop();
		for (const pair<int, T>& line : web[u.id])
		{
			if (line.second == T_max) continue;
			if (u.cost + line.second < res[line.first])
			{
				res[line.first] = u.cost + line.second;
				pq.push({ line.first, res[line.first] });
			}
		}
	}
	return res;
}
```

## 数值模板

感谢 @[Grammar__hbw](luogu://user/856004) 提供的例子。

众所周知快速幂是非常简单的东西，我们可以这么写：

```cpp
long long qpow_mod998244353(int x, int y)
{
  if(y == 0) return 1;
  if(x == 0) return 0;
  if(y == 1) return x;
  long long res = qpow_mod998244353(x, y / 2);
  return res * res % 998244353 * ((y&1)?x:1) % 998244353;
}
```

于是凉心的出题人准备卡你模数，把模数改成了 $99\color{red}28\color{black}44353$，当然，对应的代码也很好写：

```cpp
long long qpow_mod992844353(int x, int y)
{
  if(y == 0) return 1;
  if(x == 0) return 0;
  if(y == 1) return x;
  long long res = qpow_mod992844353(x, y / 2);
  return res * res % 992844353 * ((y&1)?x:1) % 992844353;
}
```

于是，出题人把模数改成了 $10^9+7$。

当然这样也是可以的，但是我们可以使用数值模板：

```cpp
template<int modern> // 想到 mod，想到 moder（取模的东西），然后想到 modern
long long qpow(int x, int y)
{
  if(y == 0) return 1;
  if(x == 0) return 0;
  if(y == 1) return x;
  long long res = qpow<modern>(x, y / 2);
  return res * res % modern * ((y&1)?x:1) % modern;
}
```

这个显然也是很好理解的，只是把“类型”改成了“数值”。

# 类模板

看到了上面的全名，你可能就知道常用的 `vector<int>`，`queue<int>`，`priority_queue<long long>`，`list<double>` 是干什么的了。但是 `vector` 这些是类，又不是函数，怎么能有模板呢？

可以的。比如说：

```cpp
template<typename T1, typename T2>
class _Mypair // 你猜我为什么要用 _Mypair，谜底文末揭晓
{
  T1 first;
  T2 second;
};
```

这样，就可以用 `_Mypair<int, int>` 定义一个包含 `int` 和 `int` 的二元组，用 `_Mypair<double, string>` 定义一个包含 `double` 和 `string` 的二元组。

## 数值模板

我们定义一个类，其中包含若干个 `int`：

```cpp
template<int _Size>
class array_of_int
{
public:
  int value[_Size];
};
```

非常简单，作用也一目了然，这里就不多说了。

## 数值类型混合模板

我觉得 STL 中的 `array` 是个很不错的例子，大家可以去看看，这是它的超级简化版本：

```cpp
template<typename _Ty, size_t _Size>
class array
{
public:
  // 若干函数
  _Ty _Elems[_Size];
};
```
# 模板判断

我们想要在编译时判断一个数 `x` 是否很臭：

```cpp
template<int x>
class is114514 { public: static constexpr bool value = false; };
template<>
class is114514<114514> { public: static constexpr bool value = true; };
```

这是怎么做到的呢？

~~首先，动用大脑这一神奇工具，得出“很臭”的定义是 $\text{\sout{114514}}$。~~

在有多个模板匹配时，编译器会使用最容易匹配的，也就是模板参数最少的，当 $x=114514$ 时，明显第二个参数更少（没有参数），当 $x\not =114514$ 时，虽然第二个没有参数，但是不可以匹配，此时只能退而求其次用第一个。

最后，我们使用 `static_cast(!is114514<xxx>::value, "the number is so smelly!");` 就可以去除掉恶臭的数字啦！

## 模板优先级

真正的优先级并不是模板参数最少就最容易匹配。

由于我并没有在 cppreference 的模板页面查找到优先级，所以我是找的 C++ Primer Plus，在第六版中文版中，在第 $237$ 页。

### 函数

书中的原话，但是 /\* \*/ 包括的是小 $\beta$ 的注解：

> 接下来，编译器必须确定那个可行函数是最佳的。它查看为使函数调用参数与可行的候选参数匹配所需要进行的转换。通常，从最佳到最差的顺序如下所述：
>
> 1. 完全匹配 /\* 不一定完美匹配，具体规则见下 \*/，但常规函数 /\* 非模板函数 \*/ 优于模板。
> 2. 提升转换（例如，`char` 和 `short` 自动转换为 `int`，`float` 自动转换为 `double`）/\* 可以在任何情况下都不丢失任何信息的转换 \*/。
> 3. 标准转换（例如，`int` 转换为 `char`，`long` 转换为 `double`）

# 模板元编程

我们可以在编译时求出很多东西，神奇吧！

对于[P5739 【深基7.例7】计算阶乘](https://www.luogu.com.cn/problem/P5739)，我们需要用这些：

```cpp
int factorials[15];

template<int x>
class factorial
{
public:
	static constexpr int value = factorial<x - 1>::value * x;
	int _ = factorials[x] = value;
	factorial <x - 1> _Lst = factorial<x - 1>();
};
template<>
class factorial<0>
{
public:
	static constexpr int value = 1;
	int _ = factorials[0] = 1;
};
factorial<12> _;
```

先别急着抄，抄了你不知道怎么用也不行。

这里定义了一个模板类 `factorial`，显然是用于计算阶乘的。而其中的 `value` 就是阶乘到底是几。

比如，`factorial<0>::value` 是多少呢，明显是后一个定义匹配得更好，所以 `value = 1`。

而 `factorial<1>::value` 是几呢，是 `factorial<1 - 1>::value * 1`，也就是 `factorial<0>::value * 1`，也就是 $1 \times 1 = 1$。

相应地，`factorial<2>::value` 就是 `factorial<1>::value * 2`，也就是 $2$。

`factorial<3>::value` 就是 $2 \times 3 = 6$。

我们发现 `factorial<n>::value = factorial<n-1>::value * n`，而 `factorial<0> = 1`，这不就是阶乘的定义吗！

当然，我们需要把答案记录下来，于是就有了 `long long _ = factorials[x] = value;` 这一句，用来在对象构造时给 `factorials[x]` 赋值。

最后，`factorial<12>` 是为了预处理出 `factorials[0...12]`。完美！

建议配合主函数食用：

```cpp
int main()
{
	int x;
	scanf("%d", &x);
	printf("%d\n", factorials[x]);
	return 0;
}
```
