---
layout: blog
title: SIMD 指令集编程入门（AVX2）
date: 2026-07-22 22:11:46
tags:
  - SIMD
  - Optimization
categories:
  - Algorithm & Theory
updated: 2026-07-22 22:11:46
---
本文只包含基础的 SIMD 指令集用法和思想，不包含真正的工业级指令集优化技巧。

---

# AVX2

## 什么是 SIMD 指令集？

SIMD（Single Instruction Multiple Data，单指令多数据）指令集，顾名思义能够让你在一条指令内操作多个数据。

为什么会有这样的东西？一个东西的发明必然是有对应的需求。

最初，有人开发图像处理的软件。比如如果你用 Windows，就有自带的画图（`mspaint`）。这些软件的特点是，其使用的运算很多都是对于大量的数据进行相同的运算，比如一个矩形范围内所有数字灰度值 $+1$。

CPU 开发厂商（Intel）注意到了这一点，于是开发了 MMX（MultiMedia eXtension，多媒体增强。很多 extension 缩写里都用的 X）指令集。

后面指令集一路扩展，现在 AVX2（Advanced Vector Extensions 2，高级矢量扩展 2）很常用。在 Linux 下可以从 `/proc/cpuinfo` 看 `flags` 得到启用的指令集。以下是在洛谷上进行的一次测试的输出：

:::info[有点长]
```plaintext
processor	: 0
vendor_id	: GenuineIntel
cpu family	: 6
model		: 85
model name	: Intel(R) Xeon(R) Platinum 8369HC CPU @ 3.30GHz
stepping	: 11
microcode	: 0x1
cpu MHz		: 3688.231
cache size	: 33792 KB
physical id	: 0
siblings	: 6
core id		: 0
cpu cores	: 6
apicid		: 0
initial apicid	: 0
fpu		: yes
fpu_exception	: yes
cpuid level	: 22
wp		: yes
flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm constant_tsc rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq monitor ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch invpcid_single pti fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid avx512f avx512dq rdseed adx smap clflushopt clwb avx512cd avx512bw avx512vl xsaveopt xsavec xgetbv1 xsaves avx512_bf16 ida arat avx512_vnni
bugs		: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs itlb_multihit mmio_stale_data retbleed gds bhi its
bogomips	: 6599.99
clflush size	: 64
cache_alignment	: 64
address sizes	: 46 bits physical, 48 bits virtual
power management:

processor	: 2
vendor_id	: GenuineIntel
cpu family	: 6
model		: 85
model name	: Intel(R) Xeon(R) Platinum 8369HC CPU @ 3.30GHz
stepping	: 11
microcode	: 0x1
cpu MHz		: 3688.236
cache size	: 33792 KB
physical id	: 0
siblings	: 6
core id		: 1
cpu cores	: 6
apicid		: 2
initial apicid	: 2
fpu		: yes
fpu_exception	: yes
cpuid level	: 22
wp		: yes
flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm constant_tsc rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq monitor ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch invpcid_single pti fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid avx512f avx512dq rdseed adx smap clflushopt clwb avx512cd avx512bw avx512vl xsaveopt xsavec xgetbv1 xsaves avx512_bf16 ida arat avx512_vnni
bugs		: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs itlb_multihit mmio_stale_data retbleed gds bhi its
bogomips	: 6599.99
clflush size	: 64
cache_alignment	: 64
address sizes	: 46 bits physical, 48 bits virtual
power management:

processor	: 4
vendor_id	: GenuineIntel
cpu family	: 6
model		: 85
model name	: Intel(R) Xeon(R) Platinum 8369HC CPU @ 3.30GHz
stepping	: 11
microcode	: 0x1
cpu MHz		: 3688.236
cache size	: 33792 KB
physical id	: 0
siblings	: 6
core id		: 2
cpu cores	: 6
apicid		: 4
initial apicid	: 4
fpu		: yes
fpu_exception	: yes
cpuid level	: 22
wp		: yes
flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm constant_tsc rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq monitor ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch invpcid_single pti fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid avx512f avx512dq rdseed adx smap clflushopt clwb avx512cd avx512bw avx512vl xsaveopt xsavec xgetbv1 xsaves avx512_bf16 ida arat avx512_vnni
bugs		: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs itlb_multihit mmio_stale_data retbleed gds bhi its
bogomips	: 6599.99
clflush size	: 64
cache_alignment	: 64
address sizes	: 46 bits physical, 48 bits virtual
power management:

processor	: 6
vendor_id	: GenuineIntel
cpu family	: 6
model		: 85
model name	: Intel(R) Xeon(R) Platinum 8369HC CPU @ 3.30GHz
stepping	: 11
microcode	: 0x1
cpu MHz		: 3687.933
cache size	: 33792 KB
physical id	: 0
siblings	: 6
core id		: 3
cpu cores	: 6
apicid		: 6
initial apicid	: 6
fpu		: yes
fpu_exception	: yes
cpuid level	: 22
wp		: yes
flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm constant_tsc rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq monitor ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch invpcid_single pti fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid avx512f avx512dq rdseed adx smap clflushopt clwb avx512cd avx512bw avx512vl xsaveopt xsavec xgetbv1 xsaves avx512_bf16 ida arat avx512_vnni
bugs		: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs itlb_multihit mmio_stale_data retbleed gds bhi its
bogomips	: 6599.99
clflush size	: 64
cache_alignment	: 64
address sizes	: 46 bits physical, 48 bits virtual
power management:

processor	: 8
vendor_id	: GenuineIntel
cpu family	: 6
model		: 85
model name	: Intel(R) Xeon(R) Platinum 8369HC CPU @ 3.30GHz
stepping	: 11
microcode	: 0x1
cpu MHz		: 3688.659
cache size	: 33792 KB
physical id	: 0
siblings	: 6
core id		: 4
cpu cores	: 6
apicid		: 8
initial apicid	: 8
fpu		: yes
fpu_exception	: yes
cpuid level	: 22
wp		: yes
flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm constant_tsc rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq monitor ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch invpcid_single pti fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid avx512f avx512dq rdseed adx smap clflushopt clwb avx512cd avx512bw avx512vl xsaveopt xsavec xgetbv1 xsaves avx512_bf16 ida arat avx512_vnni
bugs		: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs itlb_multihit mmio_stale_data retbleed gds bhi its
bogomips	: 6599.99
clflush size	: 64
cache_alignment	: 64
address sizes	: 46 bits physical, 48 bits virtual
power management:

processor	: 10
vendor_id	: GenuineIntel
cpu family	: 6
model		: 85
model name	: Intel(R) Xeon(R) Platinum 8369HC CPU @ 3.30GHz
stepping	: 11
microcode	: 0x1
cpu MHz		: 3688.184
cache size	: 33792 KB
physical id	: 0
siblings	: 6
core id		: 5
cpu cores	: 6
apicid		: 10
initial apicid	: 10
fpu		: yes
fpu_exception	: yes
cpuid level	: 22
wp		: yes
flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm constant_tsc rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq monitor ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch invpcid_single pti fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid avx512f avx512dq rdseed adx smap clflushopt clwb avx512cd avx512bw avx512vl xsaveopt xsavec xgetbv1 xsaves avx512_bf16 ida arat avx512_vnni
bugs		: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs itlb_multihit mmio_stale_data retbleed gds bhi its
bogomips	: 6599.99
clflush size	: 64
cache_alignment	: 64
address sizes	: 46 bits physical, 48 bits virtual
power management:
```
:::

重点提取 `avx` 开头的，这是我们想要的。可以发现，洛谷支持 AVX，AVX2，AVX512F，AVX512DQ，AVX512CD，AVX512BW，AVX512VL，AVX512-BF16，AVX512-VNNI。还有一些其他的，比如 popcnt。

洛谷还是先进，支持 AVX512 系列的部分指令集。但是这篇文章不会讨论。

在 OI 中，能接触到的指令集基本只有 SIMD 指令集，所以 OI 范围内“指令集”通常都是“SIMD 指令集”的同义词。

## 为什么要使用 SIMD 指令集？

[Computers are fast nowadays](https://qoj.ac/problem/8616)。你的树剖+暴力能过。快来 upvote 这个题！

等等，这个编译器自动优化了，有没有需要手动开指令集的例子？

P2617 和 P4278 $O(n^2)$ 暴力过不了，但是指令集优化的 $O(n^2\log n)$ 能过（假设 $n,q$ 同阶）。

P11831 指令集+暴力能过。

## 如何使用它？

需要使用 `#pragma GCC target("...")` 指定用到的指令集，比如 `#pragma GCC target("avx2")`。

同时，为了调用对应函数，需要引入 `<immintrin.h>`。

可以查看 [Intel Intrinsics Guide](https://www.intel.com/content/www/us/en/docs/intrinsics-guide/index.html) 查看所有可用的函数。当然，也可以下载离线版。

我们这里不着重讨论如何使用（调用对应函数），这样的资料一抓一大把，问 AI 也可以。

这篇文章要讨论的是，如何写出高效的 SIMD 程序。

是的，SIMD 不是神，它也需要优化。

## 优化策略

使用 SIMD 的条件：如果涉及到数组，内存访问必须连续。同时，运算不能太复杂。

像“取模”这些就是复杂的操作。不过……

### SIMD 取模

Barrett 一般是不行的，除非你的模数非常小。所以一般来讲需要用 Montgomery。

这也就是为什么编译器遇到取模就没法自动 SIMD 优化了。

### 一些构造 SIMD 的策略

通常来讲我们会遇到“比较”（或“判断”）操作，此时编译器难以自动优化，手写也需要费一点脑子。

注意 AVX2 是有比较功能的，会输出掩码，$0$ 或 `0xFFFFFFFF`。如果是计数，可以把后者视为 $-1$，直接累加求和即可。如果是作判断，直接按位与/或。

对于三目运算符，使用 `blend` 操作。不过如果比较的操作源是一个标量掩码，由于通常来讲你操作的是 $32$ 位数字，也就是只有 $2^8$ 种可能的 `blend` 操作，直接设一个 blend flag 数组，存储对应的 blend 向量即可。

### SIMD 速度

对 SIMD 的效率大约有这些制约：

- 运算本身速度（耗时）。
- 运算依赖链。
- 内存带宽。
- 缓存行分裂。

接下来依次讲如何解决这些问题，除了第一个问题和第三个问题。

#### 运算依赖链

首先我们可以缩短依赖链，尽可能利用 CPU 的并行。比如，`(((a + b) + c) + d) + e` 不好（这里为了演示方便使用了标量的写法），可以换成 `((a + b) + ((c + d) + e))`。

实在不行我们可以直接循环展开，然后交错使用循环变量。

比如，[直接这样写](https://www.luogu.com.cn/record/286107318)很慢。[这样暴力循环展开](https://www.luogu.com.cn/record/286133819)也不够快。[明智地使用中间变量](https://www.luogu.com.cn/record/286134506)快了很多。

#### 缓存行分裂

你在看 Intel Intrinsics Guide 的时候可能看到 load 之类的指令有 `load` 和 `loadu` 两种版本。

`loadu` 可以适配内存不对齐的情况。而你会发现，虽然一些资料提到理论上它们（带和不带 `u`）的速度相同，但是实际上 `loadu` 还会快一点。

这是因为如果你一次 `load` 的内存跨越了 CPU 的 cache（没错，又是它！）每次装载的内存区域，就会让 CPU 搬两次数据。

所以内存对齐还是要好一些。

### `bitset`

[此人 SIMD 技艺远在我之上](https://www.luogu.com.cn/article/v68rtwc9)。我没什么可讲的了。

## 结语

就写到这吧。我对 SIMD 掌握的也不是很熟练。

小练习：追忆，P3372，P2617，P4278，和其它很多数据范围不大时限不紧操作简单的数据结构题。
