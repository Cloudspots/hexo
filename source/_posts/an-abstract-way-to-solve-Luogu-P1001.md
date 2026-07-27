---
title: An abstract way to solve Luogu P1001
date: 2026-1-1 15:34:52
categories:
  - Entertainment
tags: []
---
## Abstract

本文使用多层感知器（Multilayer Perceptron）实现了计算加法的程序，通过了洛谷（Luogu）的题目 P1001 A+B Problem。

Lionblaze 给大家的元旦礼物，大家喜欢吗 awa。

:::info[AI 摘要]
这篇文章总结了使用多层感知器（MLP）解决洛谷P1001（A+B Problem）的实现过程与成果，核心内容如下：

### **核心方法**  
采用无隐层的MLP架构，损失函数为均方误差（MSE），激活函数为线性函数（\(f(x)=x\)）。输入数据归一化至\([-1,1]\)区间，输出结果通过乘以\(10^9\)后四舍五入取整（避免`int(x+0.5)`的向零取整问题）。

### **训练配置**  
- 训练参数：30个batch，每个batch训练10次，batch大小为1000，学习率0.01。  
- 时间复杂度：\(O(abc)\)（\(a\)为batch数量，\(b\)为每batch训练次数，\(c\)为batch大小），例如\(abc=3\times10^5\)时约需650ms。  
- 代码与资源：单文件代码长度28.29KB（843行），总运行时间6.57s，内存占用1.03MB。

### **成果与结论**  
通过反向传播训练，该MLP模型成功通过洛谷P1001的AC验证（记录链接：https://www.luogu.com.cn/record/256027791）。文章验证了MLP在简单算术问题中的可行性，并指出其结合卷积与门控机制的改进架构（如ECgMLP）在病理图像分析等复杂任务中的潜力。

### **背景扩展**  
MLP作为前馈神经网络，由输入层、隐层和输出层构成，通过矩阵运算与激活函数传递信息。改进型gMLP通过门控机制控制信息流，ECgMLP进一步融合卷积操作，增强局部特征提取能力，已在癌症检测等高分辨率图像分析中展现优势。

综上，文章通过具体实现证明了MLP在基础算术问题中的有效性，并关联了神经网络在更复杂场景中的应用前景。
:::

## 1. Introduction

> 多层感知器（Multilayer Perceptron，MLP）是一种前馈人工神经网络模型，其将输入的多个数据集映射到单一的输出数据集上。2021年5月，Google Brain提出带有门控机制的改进型gMLP架构，通过控制层间信息流提升了模型性能。基于gMLP框架，研究者开发出ECgMLP模型，首次将卷积操作嵌入门控MLP结构中，结合了全局信息处理和局部特征提取的优势。该架构通过上下文感知的门控机制动态调整特征重要性，在高分辨率病理图像分析中展现出特定优势，应用于癌症检测领域。

:::align{right}
——[百度百科](https://baike.baidu.com/item/%E5%A4%9A%E5%B1%82%E6%84%9F%E7%9F%A5%E5%99%A8/10885549)。
:::

MLP（Multilayer Perceptron，多层感知器）是一种前馈神经网络，即其没有任何反馈。它拥有一个输入层，若干个隐层和一个输出层。输入通过输入层，通过矩阵操作和激活函数流向输出层，得出最终结果。训练一般使用反向传播（Back Propagation，BP）实现。

注意到神经网络比较万能，我们考虑用它解决 A+B problem。

## 2. Time Complexity Analysis

我们使用经典的 MLP 实现，使用若干个 batch，每个 batch 训练若干轮。

我们得到一种 $O(abc)+O(1)=O(abc)$ 的算法，其中 $a$ 是 batch 的数量，$b$ 是每个 batch 的训练次数，而 $c$ 是每个 batch 的大小。常数也不算大，大概就是 $abc=3\times 10^5$ 都要跑约 $650\mathrm{ms}$ 的常数。

## 3. Implementation

没有隐层，损失函数用的 MSE，激活函数用的 $f(x)=x$，一共 $30$ 个 batch，每个 batch 训 $10$ 次，每个 batch $1000$ 个数据，学习率 $0.01$。输入是 $-1\sim 1$ 的实数，然后求结果就是除以 $10^9$ 然后扔给 MLP 然后把结果乘 $10^9$ 再四舍五入（注意不能用 `int(x+0.5)` 因为 `int` 是向零取整）。

[AC 记录](https://www.luogu.com.cn/record/256027791)。你会发现代码中间有一些 `#include`，这是因为我把多文件直接展开成单文件了。

代码长度也就 $28.29\mathrm{KB}$（$843$ 行），总时间也就 $6.57\mathrm{s}$（没有进行任何优化……纯暴力），内存达到了整整 $1.03\mathrm{MB}$。

## 4. Conclusion

我们发现 MLP 可以用来实现 A+B Problem，拿下了 AC（Accepted，即通过）的成绩。

## References

- [Cloudspots 的 Github 仓库](https://github.com/Cloudspots/Tiny-MLP)。
- [P1001 A+B Problem - 洛谷](https://www.luogu.com.cn/problem/P1001)。
- [Lionblaze](https://www.luogu.com.cn/user/911054)。

AI 使用说明：生成了一个有趣的摘要。