---
title: 如何卡常
date: 2025-10-30 18:09:11
categories:
  - Algorithm & Theory
tags: []
---
# 如何卡常

友情提醒：先尝试优化你的时间复杂度。

## 输入输出卡常（快读快写）

### 快读

大家都会 `getchar` 快读对吧。这里以只能读非负数的快读为例。

```cpp
long long fr() // 为什么不叫 read 呢，因为 read 函数在 Linux 的 unistd.h 里面声明了，并且超级快读要用到
{
    long long res = 0;
    int flag;
    char ch;
    while(((ch = getchar()) < '0' || ch > '9') && ch != '+' && ch != '-');
    if(ch == '-') flag = -1;
    else flag = 1;
    if(ch >= '0' && ch <= '9') res = ch - '0';
    while((ch = getchar()) >= '0' && ch <= '9') res = res * 10 + ch - '0';
    return res * flag;
}
```

它很慢，过不了 [P10815 【模版】快速读入](https://www.luogu.com.cn/problem/P10815)。总时间 $4.37\mathrm{s}$。

我们对它优化。

首先我们知道有一个叫 `getchar_unlocked` 的东西，是无锁（也就是无线程安全，但是线程安全在 OI 中【】用没有）的 `getchar`（一些地方叫做 `_getchar_nolock`），用它代替这个可爱的 `getchar` 可以获得 $3.38\mathrm{s}$ AC 的好成绩。

继续？

我们发现大家都在用这样一个东西替代 `getchar`。

```cpp
char buf[1<<23],*p1=buf,*p2=buf;
#define gc() (p1==p2&&(p2=(p1=buf)+fread(buf,1,1<<21,stdin),p1==p2)?EOF:*p1++)
```

实际上只是用 `fread` 读文件，自己加了个缓冲区而已。但是它跑的飞快，获得了 $2.333333333\mathrm{s}$ AC 的好成绩（真的是 $2.33\mathrm{s}$，后面的就不知道了）。

我们很高兴，在 `fread` 后面加了一个可爱的 `_unlocked`，获得了 $2.30\mathrm{s}$ AC 的好成绩（可能是评测机波动？）。

这提示我们往更底层的方向考虑，越底层越好。

参见[此题解](https://www.luogu.com.cn/article/awzq5g4d)，虽然作者很菜但是这个快读还是比较强的。这样能获得 $1.78\mathrm{s}$ AC 的好成绩。

~~我该在哪停留？我问我自己~~。可以止步于此了，但是……

我们注意到[这个帖子里面](https://www.luogu.com.cn/discuss/918742)有一种神秘的快读黑科技，只需要 $1.01\mathrm{s}$ 即可通过。可惜我们在洛谷 IDE 中测试会 WA 样例。稍加观察即可发现是最前面那个 `++c;++c;` 的问题，默认了第一行最后是 `\r\n`，也就是程序依赖数据 bug 运行……不过没事，我们可以改一下。然后进行了一大堆无关紧要的魔改，得到了这个代码。

```cpp
#include <cstdio>
#include <sys/mman.h>
#include <sys/stat.h>

unsigned a[0x10000];

int main()
{
    unsigned char *c = (unsigned char *)mmap(nullptr, 1000000000, PROT_READ, MAP_PRIVATE, 0, 0); // 将 stdin（即文件描述符 0）的内容映射到内存中，起始地址为 c
    unsigned n = 0; // 字面意思，n
    while (*c>='0') n = n * 10 + (*(c++) ^ '0'); // 输入 n
    while (*(c++) != '\n'); // 跳过直到换行符
    unsigned s = 0; // 题目要求的和
    for(int i = '0'; i <= '9'; i++) // 预处理两位数，之后两位两位处理
    {
        for(int j = '0'; j <= '9'; j++)
        {
            a[(i<<8) + j] = (j^'0')*10 + (i^'0') + 1;
        }
    }
    unsigned v, p;
    while(n--)
    {
        v = 0; // 当前数字
        p = (*c == '-'); // 是否为负数
        c += p; // 如果是负数则跳过一个字符
        while(~(a[*(unsigned short*)(c)] - 1)) //一直输入，直到遇到不是正确的两个数码的数字
        {
            v = v * 100 + a[*(unsigned short*)(c)] - 1;
            c += 2; // 往后跳两位
        }
        while(*c>='0') v = v * 10 + (*(c++) ^ '0'); // 处理最后可能还有的一位数字
        s += (p ? -v : v); // 处理符号位，加到和中
        c++; // 跳过空格
    }
    printf("%d", (int)s);
    return 0;
}
```

大概能理解了吧。

### 快输

其实我没见过卡输出的题，可能是我用 `printf` 的缘故。一般需要大量输出的题目都会对所有输出进行一些操作，比如异或。如果真的需要大量的输出，那么你会 OLE。而输出不大量则优化量小于评测机波动，你还不如 v 我 $50$ 攒 rp。不过真要写的话用 `putchar_unlocked` 或者 `_putchar_nolock`，模仿 `read` 用 `write` 大概也可以，但是感觉不如 v 我 $50$。

## 可能被编译器自动完成的优化

### cache 友好

cache 开心了，你的程序就能跑得飞快。

一个技巧是，如果你在循环中使用一个二维数组 `arr[i][j]`，然后 `j` 是不变量，那么你可以尝试把 `arr` 的两维交换。典型案例：矩阵乘法。

```cpp
// 数组 a,b,c
for(int i=1;i<=n;i++)
{
  for(int j=1;j<=n;j++)
  {
    for(int k=1;k<=n;k++)
    {
      c[i][j] += a[i][k] * b[k][j];
    }
  }
}
```

其中，`a` 数组很开心（因为 `i` 是不变量）而 `b` 需要优化。交换 `j,k` 两维，代码：

```cpp
// 数组 a,b,c
for(int i=1;i<=n;i++)
{
  for(int k=1;k<=n;k++)
  {
    for(int j=1;j<=n;j++)
    {
      c[i][j] += a[i][k] * b[k][j];
    }
  }
}
```

这样，`a` 数组还是满足条件，而 `b` 数组也满足了条件。能快很多。

换句话说，这样的优化让程序更加满足局部性原理（一个程序在短时间内访问的内存次数可能很多，但是范围比较小。感觉很多 OI 程序都不满足这个？）。而 cache 就是利用了程序的局部性原理进行的内存访问优化。

### 循环展开

把一些小循环进行展开。比如：

```cpp
for(int i=1;i<=3;i++)
{
  printf("Lionblaze is jvruo.\n");
}
```

被展开成：

```cpp
printf("Lionblaze is jvruo.\n");
printf("Lionblaze is jvruo.\n");
printf("Lionblaze is jvruo.\n");
```

（当然还可以被优化成 `puts("Lionblaze is jvruo.\nLionblaze is jvruo.\nLionblaze is jvruo.")`，但这就不属于循环展开的范畴了。）

### 循环判断外提

就是如果循环里面有一个分支 `if`，但是里面的东西是一个在循环中不变的常量（循环外可能变化），则这个 `if` 可以被提出。

```cpp
int x;
scanf("%d", &x);
for(int i=1;i<=10;i++)
{
  printf("begin. i = %d\n", i);
  if(x == 114514) printf("smelly.\n");
  printf("end. i = %d\n", i);
}
```

可以被优化成：

```cpp
int x;
scanf("%d", &x);
if(x == 114514)
{
  for(int i=1;i<=10;i++)
  {
    printf("begin. i = %d\n", i);
    printf("smelly.\n");
    printf("end. i = %d\n", i);
  }
}
else
{
  for(int i=1;i<=10;i++)
  {
    printf("begin. i = %d\n", i);
    printf("end. i = %d\n", i);
  }
}
```

### 分支预测（冷热代码分离）

如果一个 `if` 或者 `if-else` 中，某一个条件经常被触发，那么可以用 `[[likely]]`，否则可以使用 `[[unlikely]]`（C++20 以上）。如果没到 C++20 可以用 `__builtin_expect`（非标准，GCC 可以用，也就是 CCF 评测环境可以用）。

```cpp
int x = rand() % 100;
if(x == 55) printf("x is 55\n");
else printf("x isn't 55.\n");
```

可以被优化成：

```cpp
int x = rand() % 100;
if(x == 55) [[likely]] printf("x is 55\n");
else [[unlikely]] printf("x isn't 55.\n");
```

或者：

```cpp
int x = rand() % 100;
if(__builtin_expect(x == 55, true)) printf("x is 55\n"); // __builtin_expect(a, b) 代表 a 很可能 b，返回值为 a 
else printf("x isn't 55.\n");
```

这没有改变语义，但是会改变 CPU 的分支预测，同时促进编译器冷热代码分离（而为什么这比较快，因为长跳转比较慢）。参考[此成功案例](https://www.luogu.com.cn/record/126396155)（注意看 #2，时间限制是 $500\mathrm{ms}$）。~~不过这样干还不如 v 我 $\text{\sout{50}}$ 增加 rp，非常容易被评测机波动干废。~~ 对于一些情况很有用。可以让你稳定卡进 AC！

:::info[歌词]

我们的【数据删除】O\~J\~ 慢的一批\~

一秒 $10^7$\~

（上面那一句的那个数字读作“一 E 七”）

:::

### 内联

乱内联坏文明（可能扰乱代码布局，破坏编译器的冷热代码分离）。编译器非常聪明，尤其是面对短代码。一般来讲，你能想到要内联的所有函数它都会自动给你内联（除非你乱内联，递归函数都要写个 `inline`，/bangbangt（尾递归除外））。

`inline` 关键字在内联方面已经差不多没了作用。但是因为它在语义上是 `inline` 啊！所以它不会被其它编译单元调用……大概就是说它不支持多文件编程，刚好 OI 也不支持多文件编程，于是编译器就可以进行优化。具体可以看[这篇文章](https://www.luogu.com.cn/article/7tx7d47i)，orz。

如果你真的要内联……在 `inline` 后面加上 `__attribute__((always_inline))` 即可。然而通常情况下编译器是比你聪明的。慎用。一个更加不常见的场景：你要禁止编译器对一个函数进行内联。此时使用 `__attribute__((noinline))` 即可。

### 强度削减

很高大上的名字对吧，实际上就是类似把 `x / 2` 优化成 `x >> 1`（前提是 `x` 是非负的，一种花哨的方法是 `assume`，正常的方法是声明为 `unsigned`，奇怪的方法是 `if(x < 0) abort();`，明知故问的方法是 `if((x / 2) != (x >> 1)) exit(1919810/114514);`，让读者大脑爆炸的方法是 `if(x < 0) { unsigned a = 0; for(unsigned i=0;;i++) a+=i; }`[^1]，后面忘了）。

[^1]: 非平凡的无副作用的无限循环。在比较低的版本（指 C++23 及以下））可以直接写成 `for(;;);`，因为没有非平凡的要求。参见 [cppref](https://en.cppreference.com/w/cpp/language/ub.html#:~:text=Infinite%20loop%20without%20side%2Deffects)。

编译器会自动帮你进行类似优化。但是如果可能不是非负的，则可能会出锅，所以编译器不敢。解决方法：该 `unsigned` 就 `unsigned`，比如索引就不应该是负数。

Barrett 约简也算是一种强度削减，但是如果模数不是常数可能无法进行，此时需要手动进行。~~然而我学不懂/ll~~

用数列求和公式对常见数列（如等差数列）求和也是强度削减。你也可以对一些复杂的公式进行强度削减。比如 [这份代码](https://www.luogu.com.cn/record/207058445) 的 `S` 函数（推了好久呢 qwq）。这个大概属于复杂度级别的优化？

### 尾递归/尾调用！

在函数末尾如果出现了一个 `return xxx(yyy,zzz,qwq,...);` 则可以直接把函数调用改成跳转，准备好参数后直接跳转到对应函数的开头。如果 `xxx` 就是原本的函数则又叫做尾递归。

有些东西看起来是尾递归实际上不是，仔细一想其实也是。比如 `int asum(int x) { if(x == 0) return 0; return x + asum(x - 1); }`，其实不满足尾递归。但可以改写为 `int asum_qwq(int x, int y) { if(x == 0) return y; return asum(x - 1, y + x); }`，然后就是尾递归了。编译器是很聪明的，也会自动帮你完成这个操作。

而编译器比你想象的更聪明。上面的代码会被编译器直接改写为循环，也就是 `int asum_clever(int x) { int sum = 0; for(int i=0;i<=x;i++) sum += i; return sum; }`，最后强度削减一次，直接优化成 `return x * (x + 1) / 2;`，然后内联掉。~~然而人类看一眼原本的函数就能够完成上面的所有优化。~~

### 额……lambda？

一些函数改写为 `lambda` 函数相当于加了 `static` 关键字，也就是没有内联语义的 `inline` 关键字。**不如 v 我 $\bm{50}$**。

### 指令集优化

我不会，但是真的很牛。

## 一些只能人工完成的优化

### 上面编译器在小数据下能够完成的优化，在长代码下的情况

rt。

### 算法层面优化

很多。例如：

- 欧拉序 -> dfs 序 LCA。
- 递归线段树 -> 非递归线段树。
- 线段树 -> 树状数组（可以的情况下）。
- 追忆过去（指 `bitset`）。
- `set` 和 `unordered_set`（或 `map` 和 `unordered_map`）转换（看数据大小，比较小通常用 `set` 或者干脆用 `vector` 暴力找，打的话就用哈希表 `unordered_set`）。

对于状压 dp 一类的东西，如果要枚举是 $1$ 的位，那么可以使用 `for(int j = i; j; j -= j & -j)`，每次 `j & -j` 就是位权值最低的位。

::::info[案例]

这是最初的代码：

:::info[代码]
```cpp
#include <cstdio>
#include <string>
#include <bitset>

using namespace std;

long long f[(1<<20)+5], g[(1<<20)+5], s[(1<<20)+5];
int a[25];

int main()
{
	int n;
	scanf("%d", &n);
	for(int i=0;i<n;i++) scanf("%d", a + i);
	for(int i=0;i<(1<<n);i++)
	{
		for(int j=0;j<n;j++)
		{
			if(i&(1<<j)) s[i] += a[j];
		}
		if(i == 0)
		{
			f[i] = g[i] = 1;
			continue;
		}
		long long ss = 0;
		for(int j=0;j<n;j++)
		{
			if(i&(1<<j)) ss += a[j];
		}
		// if(!(i & (i-1))) g[i] = 1;
		if(ss < 0)
		{
			for(int j=0;j<n;j++)
			{
				if(i&(1<<j))
				{
					g[i] = (g[i ^ (1 << j)] + g[i]) % 998244353;
				}
			}
		}
		for(int j=0;j<n;j++)
		{
			if((i&(1<<j)) && (s[i ^ (1 << j)]) >= 0)
			{
				f[i] = (f[i ^ (1 << j)] + f[i]) % 998244353;
			}
		}
		// printf("f[%s] = %lld, g[%s] = %lld\n", bitset<3>(i).to_string().c_str(), f[i], bitset<3>(i).to_string().c_str(), g[i]);
	}
	long long sum = 0;
	for(int i=0;i<(1<<n);i++)
	{
		sum += s[i] * f[i] % 998244353 * g[((1<<n)-1) ^ i] % 998244353;
        // printf("i = %s, sum += %lld * %lld * %lld\n", bitset<3>(i).to_string().c_str(), s[i], f[i], g[((1<<n)-1)^i]);
	}
	printf("%lld\n", (sum % 998244353 + 998244353) % 998244353);
	return 0;
}
```
:::

有很多问题。比如每一步都取模，还有枚举是暴力枚举。

先从 `s` 下手，注意到 `s[i] = s[i - (i & -i)] + a[__lg(i)]`（单独拆出最后一位），那么设 `b[i] = a[1 << i]`。

然后看 `f` 和 `g`。先把取模搞到循环外面，然后按照上面的讲方法转移。对于 `g` 的转移条件可以变为 `s[i] >= b[j & -j]`。

最后再优化一下 `g`。条件判断很费时，我们设一个 `h`。

最终的代码（本题最优解）：

:::info[代码]
```cpp
#include <cstdio>
#include <string>
#include <bitset>

using namespace std;

long long f[(1<<20)+5], g[(1<<20)+5], h[(1<<20)+5], s[(1<<20)+5];
int b[(1<<20)+5];

int main()
{
	unsigned n;
	scanf("%u", &n);
	for(unsigned i=1;i<=(1<<n);i<<=1)
    {
        scanf("%d", b + i);
        // b[1<<i] = a[i];
    }
	for(unsigned i=0;i<(1<<n);i++)
	{
		if(i == 0)
		{
			f[i] = g[i] = h[i] = 1;
			continue;
		}
        s[i] = s[i - (i & -i)] + b[i & -i];
		if(s[i] < 0)
		{
			for(unsigned j=i;j;j-=j&-j)
			{
                g[i] += g[i ^ (j&-j)];
			}
            g[i] %= 998244353;
		}
		for(unsigned j=i;j;j-=j&-j)
		{
			f[i] += h[i ^ (j&-j)];
		}
        f[i] %= 998244353;
        if(s[i] >= 0) h[i] = f[i];
	}
	long long sum = 0;
	for(int i=0;i<(1<<n);i++)
	{
		sum += s[i] * f[i] % 998244353 * g[((1<<n)-1) ^ i] % 998244353;
	}
	printf("%lld\n", (sum % 998244353 + 998244353) % 998244353);
	return 0;
}
```
:::

::::

### 对于 STL 容器的优化

比如 `vector` 预分配内存（`reserve` 函数，可以用于 `vector` 存图），小数据 `unordererd_map` 改 `map`，防卡哈希使用手写 `unordered_map` 哈希函数（OI 中冷门的语言 feature）。必要时手写，如果没给你开 O2 则如果要卡常必须手写（STL 容器速度极慢，在开了 O2 之后变得很快，点名表扬 `vector`，点名批评 `deque`）。`deque` 尽量不要使用，作为其衍生物（即使用容器为 `deque` 的容器适配器，比如 `queue`，**不包括** `priority_queue`）的容器尽量使用 `vector` 等。

【此处应有一张图：明明都是 `<queue>`，怎么差距就这么大呢？】

关于手写哈希函数：

```cpp
#include <unordered_map>
#include </*其它头文件*/>

namespace std // 如果你用 using namespace std，则这个一定要放在它之前
{
  template <>
  class hash</*你的数据类型，比如*/ pair<unsigned, unsigned>>
  {
  public:
    size_t operator()(const pair<unsigned, unsigned> &x) const /*这个 const 不能少！*/ { return (x.first << 32) | x.second; } // 这个只是用来演示的，这个是个完美哈希，因为 size_t 通常是 64 位。
  }
}

///* // 可能有
using namespace std;
//*/

// 你的其它神仙代码……
```

关于用 `vector` 作为 `queue` 的容器：`queue</*你的神秘类型*/, vector</*你的神秘类型*/>>`（`>>` 没有问题，在高版本不需要写作 `> >`）。

### 开无符号数/常量！

无符号运算比有符号快（存疑，但至少不会更慢），无符号有利于编译器优化，除非你写出了 ub。上面有例子：`x / 2 == x >> 1` 在 `x` 为负数的时候不一定成立。

实际上真正有用的是取模。模一个无符号数比模一个有符号数快多了。因为 C++ 的取模不是数学意义上的取模。

（此条存疑，我不知道编译器有没有这个聪明能自动完成这个优化）在模数固定的情况下一般不建议使用全局变量 `int mod = xxx;`，编译器可能不能确定 `mod` 会不会修改。可以改成 `const int` 或者 `constexpr int`，两者都表示常量（后者是编译期常量），模数为常数可以 Barrett 约简然后卡常。速度真的快！如果模数要输入就只能放弃或者手写 Barrett 约简了。

### 偷开优化（被禁赛我不负责）

rt。

## 一些可能影响正确性的优化

人话：假算法。

比如该 dp 的地方不 dp 或者只 dp 一部分，不知道用什么顺序的最优化问题随机打乱几次取最优解等。

## 案例

顺便说一句，为什么我卡常还算行呢，因为我天生常数大。所以需要卡。

### 案例 $1$

CF489F。

[这是最初的提交记录](https://codeforces.com/contest/489/submission/352806102)，[这是最终的 AC 记录](https://codeforces.com/contest/489/submission/352810552)。

卡常要遵循一个宗旨：不重要的地方不要卡。不仅可能坏了正确性调更久，效果还不好。不重要的地方你就算只用 $0\mathrm{ms}$ 对总时间影响都不大。

最里面那个 `c` 和 `d` 的循环我们看上去就牙痒痒。直接进行展开。还是过不了？首先前面有能够确定的 `continue` 的直接删除。有不能确定的 `continue` 的用 `if` 判断。然后这个可爱的 `vr` 先算不要用变量，并且能不取模就不取模（取模就算用上 Barrett 约简还是不快，至少不比不做运算快）。还要开无符号数。

还是过不了？我们发现一些条件有依赖性，比如一个条件是 `a >= 1` 另一个是 `a >= 2`，那么另一个的判断就可以放在前一个里面。就得到了最终的代码。

### 案例 $2$

题意：给定 $n\times m$ 的网格，有一些障碍，选择若干个格子，满足每个选择的格子都不在障碍上且没有两个选择的格子的曼哈顿距离为 $2$。求最多选择多少格子。$n\le 1000, m\le 10$。多测，$T\le 15$。时间限制 $2\mathrm{s}$。

代码在[这](https://www.luogu.com.cn/paste/nmz4hil2)。

说实话这个的优化有点不符合我们的“哪里瓶颈优化哪里”原则。这里只讲重要的优化。

首先原代码第 $106\sim 107$ 行有关于 `i` 的判断，这个在这个循环里面是常量，所以提到外面（对于 `(j | k)` 和 `j` 当然要保留，详见改后代码 $110,122$ 行）。然后我们就可以删除原代码第 $108$ 行的判断中关于 `i` 的项了。

然后我们注意到后面的转移发生的次数其实并不多。因为条件满足的不多，使用 `__builtin_expect` 优化，成功获得 Accepted。

## 结语

应该还有其他的，想起来再写。最后再说一次，先试着优化你的算法。

## 致谢

排名不分先后。

- [（10.28）OI 考场易错点&卡常整合](https://www.luogu.com.cn/article/u99oll2a)。
- [题解：P10815 【模板】快速读入](https://www.luogu.com.cn/article/awzq5g4d)。
- [godbolt](https://godbolt.org/)。
- [OI-wiki](https://oi-wiki.org/lang/optimizations/)。
- [C++ inline 与内联优化
](https://www.luogu.com.cn/article/7tx7d47i)。
- [cppreference](htttps://en.cppreference.com/)。
