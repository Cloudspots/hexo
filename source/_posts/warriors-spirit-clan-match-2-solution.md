---
title: 猫武士灵族 切磋赛 #2 题解
date: 2024-11-28 22:06:18
categories:
  - Solution
tags: []
---
# 休闲·娱乐

T1：

大模拟。

T2：

我的数据生成器没有问题。

T3：

输出 $\texttt{YE5}$

T4：

诈骗题。

# T1 题解

没啥好讲的，为什么没有人做呢？难道是表达式计算太毒瘤了？

## 矩阵运算

写一个矩阵类即可。

### 类声明

```cpp
class matrix
{
public:
    vector<vector<int>> val;
    matrix() {}
    matrix(int n) { val = vector<vector<int>>(n, vector<int>(n, 0)); }
    vector<int> &operator[](size_t x) { return val[x]; }
    const vector<int> &operator[](size_t x) const { return val[x]; }
    friend matrix operator+(const matrix &x, const matrix &y);
    friend matrix operator-(const matrix &x, const matrix &y);
    friend matrix operator*(const matrix &x, const matrix &y);
    friend matrix operator-(const matrix &x);
    friend ostream &operator<<(ostream &x, const matrix &y);
    friend istream &operator>>(istream &x, const matrix &y) = delete;
      
} matrixs[105];
```

### 加法

```cpp
matrix operator+(const matrix &x, const matrix &y)
{
    if(x.val.size() != y.val.size()) throw length_error("Error in operator+; @Lionblaze on luogu for help;");
    matrix answer;
    answer.val = vector<vector<int>>(x.val.size(), vector<int>(x.val.size(), 0));
    for(int i=0;i<x.val.size();i++)
    {
        for(int j=0;j<x.val.size();j++)
        {
            answer[i][j] = (x[i][j] + y[i][j]) % 998244353;
        }
    }
    return answer;
}
```

### 减法

```cpp
matrix operator-(const matrix &x, const matrix &y)
{
    if(x.val.size() != y.val.size()) throw length_error("Error in operator-. @Lionblaze on luogu for help.");
    matrix answer;
    answer.val = vector<vector<int>>(x.val.size(), vector<int>(x.val.size(), 0));
    for(int i=0;i<x.val.size();i++)
    {
        for(int j=0;j<x.val.size();j++)
        {
            answer[i][j] = ((x[i][j] - y[i][j]) % 998244353 + 998244353) % 998244353;
        }
    }
    return answer;
}
```

### 乘法

```cpp
matrix operator*(const matrix &x, const matrix &y)
{
    if(x.val.size() != y.val.size()) throw length_error("Error in operator*. @Lionblaze on luogu for help.");
    matrix answer;
    answer.val = vector<vector<int>>(x.val.size(), vector<int>(x.val.size(), 0));
    for(int i=0;i<x.val.size();i++)
    {
        for(int j=0;j<x.val.size();j++)
        {
            for(int k=0;k<x.val.size();k++)
            {
                answer[i][j] = (answer[i][j] + 1ll * x[i][k] * y[k][j]) % 998244353;
            }
        }
    }
    return answer;
}
```

### 输出

```cpp
ostream &operator<<(ostream &x, const matrix &y)
{
    for(int i=0;i<y.val.size();i++)
    {
        for(int j=0;j<y.val.size();j++)
        {
            x << y[i][j] << (" \n"[j == y.val.size()-1]);
        }
    }
    return x;
}
```

### 负号（本质就是拿零矩阵减）

```cpp
matrix operator-(const matrix &x)
{
    matrix answer = x.val.size();
    for(int i=0;i<x.val.size();i++)
    {
        for(int j=0;j<x.val.size();j++)
        {
            answer[i][j] = -x[i][j];
        }
    }
    return answer;
}
```

## 主函数

### 输入&预处理

```cpp
    int n, m;
    scanf("%d%d", &n, &m);
    while(m--)
    {
        char ch;
        while((ch = getchar()) < 'A' || ch > 'Z');
        matrix &mx = matrixs[ch - 'A'];
        mx = matrix(n);
        for(int i=0;i<n;i++)
        {
            for(int j=0;j<n;j++)
            {
                scanf("%d", &mx[i][j]);
            }
        }
    }
    matrixs[30] = n;
```

### 表达式计算&输出

```cpp
    string str;
    cin >> str;
    stack<matrix> stk;
    str = "+" + str;
    for(int i=0;i<str.size();i+=2)
    {
        if(str[i] == '+') stk.push(matrixs[str[i+1] - 'A']);
        else if(str[i] == '-') stk.push(-matrixs[str[i+1] - 'A']);
        else stk.top() = stk.top() * matrixs[str[i+1] - 'A'];
        //cout << "stk.top() = \n" << stk.top() << endl;
    }
    matrix sum = n;
    while(!stk.empty())
    {
        sum = sum + stk.top();
        stk.pop();
    }
    cout << sum << endl;
```

## 总结

每个部分都很简单。这题很简单。

# T2 题解

非常好的一道题，考查选手的基本素养。

考查到的知识点：

- 如何登录洛谷
- 如何进入团队
- 如何找到比赛
- 如何报名比赛
- 如何找到此题
- 如何写出代码
- 如何提交代码
- **如何开 `long long`**

我希望没有人在最后一个点被坑，但是希望落空了。

luogu1357924680 的代码：

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    int a,b;
    cin>>a>>b;
    cout<<a+b;
    return 0;
}
```

Ricardo_MLu 的第一份代码（后面改过来了）：

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    int a, b;
    cin>>a>>b;
    cout<<a+b;
    return 0;
}
```

0x3f3f3f3f3f3f 的第一份代码（不是在最后一个点被坑的，在第六个点）：

```cpp
print(int(input())+int(input()))
```

# T3 题解

大家的语文阅读理解能力都很好。pop_l 在第一份代码中输出了 `YES`，我就说总会有人被坑的。

大家都会我就不讲了。

# T4 题解

巨佬亮光爪（Finchpaw）AC 了，小编很惊讶呢。

首先理解题意并不难。

## 坑点 $1$

你知道 $20\mathrm{pts}$ 是干嘛的吗，因为答案远不到 $992844353$，这是用来给打错模数的人的分。

模数是 $99\bm{28}44353$，而不是 $99\bm{82}44353$。

为什么我要用 $P$ 呢，就是防止 $992844353$ 出现次数过多而被发现。

## 坑点 $2$

这么反人类的输入顺序.jpg

但是似乎没人被坑。提交记录懒得翻了。某位神仙甚至在代码里进行了吐槽。

## 坑点 $3$，但是没有构造数据

没时间构造了，问题在于数据范围中是 $998244353$，比 $P$ 大，所以对于大部分代码输入 $p \in [1,3]$，$a_{1\cdots 3}\not \in (-998244353,998244353)$ 会寄掉。

## 那一大坨算式究竟是什么

我们把 $\lceil \rceil$ 去掉，绘出其函数图像，发现是一条笔直的 ${45}^\circ$ 直线。

这个时候，我们就需要发挥人类智慧，把图像缩小看到上面，结果是 $x \bmod P$，这里的 $\bmod$ 指的是 C++ 中的 `(x%p+p)%p`，而不是 `x%p`，即答案一定为正。

为什么要改成这个呢，因为我不会判断最终结果的正负，然后如果每步取模符号可能不同。

## 所以，这题怎么做

原本向量：

$$\begin{bmatrix} a_{i-3}\\a_{i-2}\\a_{i-1} \end{bmatrix}$$

转以后向量：

$$\begin{bmatrix} a_{i-2}\\a_{i-1}\\k_1a_{i-3}+k_2a_{i-2}+k_3a_{i-1}\end{bmatrix}$$

构造转移矩阵：

$$\begin{bmatrix}0&1&0\\0&0&1\\k_1&k_2&k_3\end{bmatrix}$$

然后【模板】矩阵快速幂就完了。如何使用矩阵快速幂见 T1，这里不再赘述。