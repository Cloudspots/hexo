---
title: 如何防止带密码的 down.zip 被热心学生破解
date: 2026-7-10 15:52:03
categories:
  - Technology & Engineering
tags: []
---
前情提要：

```plaintext
PS 【数据删除】> bkcrack -C 【数据删除】.zip -P 【数据删除】 -p 【数据删除】 -c 【数据删除】
bkcrack 1.8.1 - 2025-10-25
[【数据删除】] Z reduction using 【数据删除】 bytes of known plaintext
100.0 % (【数据删除】 / 【数据删除】)
[【数据删除】] Attack on 【数据删除】 Z values at index 【数据删除】
Keys: 【数据删除】
【数据删除】 % (【数据删除】 / 【数据删除】)
Found a solution. Stopping.
You may resume the attack with the option: --continue-attack 【数据删除】
[【数据删除】] Keys
【数据删除】 【数据删除】 【数据删除】
PS 【数据删除】> bkcrack -k 【数据删除】 【数据删除】 【数据删除】 -r 1..8 ?p
bkcrack 1.8.1 - 2025-10-25
[【数据删除】] Recovering password
length 0-6...
length 7...
length 8...
Password: 【数据删除】
Found a solution. Stopping.
[【数据删除】] Password
as bytes: 【数据删除】
as text: 【数据删除】
```

（另外，这场比赛居然有人场切黑，还是太厉害了）。

- 错误示范：双层压缩包。  
  死因：KPA 模板攻击，支持 zip 格式。
- 【推荐】正确示范：不使用传统加密方法（什么年代了还在用 ZipCrypto）。使用 AES 或者其它加密方法（比如 WinRAR 压缩的时候不勾选使用传统压缩方法），配合双层压缩包（外层用 AES，内层随意）。  
  活因：可以防御 KPA。双层是为了防止搜出题目。
- 错误示范：把密码设的很长，很复杂。  
  死因：解压不需要密码，你 `bkcrack` 出来就完了。只要有长度足够的已知明文，你就炸了。只是破出来了压缩包没破出来密码没什么成就感。当然你可以改密码。
- 正确示范：改题目 ID，改样例。  
  活因：这样难以搜题。

已知明文是怎么来的？洛谷提供了一个 `ndjson` 格式的题库，包含主题库所有题目（不包含 RMJ）。ZIP 压缩包提供了 CRC32。枚举每个样例，判断 CRC32 即可。

关于破解：

- 错误示范：使用 `-j 24` 跑 `bkcrack`，并且赋予最高运行优先级。  
  死因：我自己试了一遍，死机了，只好重启，Windows 太烂了。你也来试试吧！另外 `bkcrack` 对于多线程好像实际上支持的不佳，好像没有比单线程快，反正我 CPU 都跑满了。这个真不如 Linux。
- 错误示范：在 `bkcrack` 崩溃后认为这玩意儿怎么这么垃圾。  
  死因：安装 VC Redistributable，不然会炸。