---
title: 云剪贴板解密 题解
date: 2025-2-14 21:54:12
categories:
  - Technology & Engineering
tags: []
updated: 2025-07-29 11:25:30
---
[云剪贴板解密](https://www.luogu.com/article/4njgcdl2)。

这里是答案。实在解不下去不行可以来这找解法。公开是主动公开的。

为了防止误点进来，这里插入一堆空白。

$\raisebox{250pt}{}$

# 第零关：犇犇入口

~~首先我们注意到图片没法看，然后稍微对我有些了解的人都会知道我的网站的网址之一是 <https://cloudspots-tools.pages.dev>，所以把 `--` 改为 `-` 即可查看。~~

由于这里是 Hexo，所以注意到 `jiemistrat.png` 拼错了，正确拼写是 `jiemistart.png`，这是真实图片。

然后我们发现那个云剪贴板链接进去是“你走错力！”，并且没有什么。

> LionBlaze 说：然后 LionBlaze 在做完入口之后感觉这条犇犇太难找了，并且 benben.sbs 因为不知名玄学原因没有保存。所以重发了一遍。

注意到犇犇中含有关键词“解密”，于是上 benben.sbs [查询](https://benben.sbs/search?keyword=%E8%A7%A3%E5%AF%86&senders=911054)。发现了[结果](https://benben.sbs/feed/5231124)。

# 第一关：帖子入口

注意到点击链接后进入了一个帖子页面。上 lglg.top [查看](https://lglg.top/1057907)。

> ~~LionBlaze 说：最初做这个解密的时候洛谷讨论区还在。当时更坑，原因见下。~~
>
> upd on 2026/07/29: 讨论区早就活了。

注意到第一条回复是消息“玄关”，但是 Ctrl+F 搜索“玄关”却并没有结果。F12 发现，玄关二字之间存在一个 $\KaTeX$，源码为 `%naisu0ac`。其中，`%` 是 $\KaTeX$ 注释，故没有显示。

显然是[云剪贴板](https://www.luogu.com/paste/naisu0ac) ID。

> LionBlaze 说：我原本在洛谷帖子中发表了带有私货的玄关，然后用 lglg 保存，然后删掉了。如果洛谷帖子还在，那么是没有这一条的。

# 第二关：云剪贴板 naisu0ac

查看源码秒了。不会有人点最后一个句号吧。

# 第三关：云剪贴板 h09om5dx

先看最后的 Reserve。我们知道小 $\beta$ 没有小 $\alpha$ 那么好心，所以故意把两个字母替换了。应为 Reverse，于是我们把第一个字符串翻转。得到 `q&'qw'！R！803%qwp1orzr&qw'R！000456`。

遇到乱码，先看一眼 Base64。

不同的是，这里使用 Base64 加密 :)

使用 base64.us 加密可得 `cSYncXcn77yBUu+8gTgwMyVxd3Axb3J6ciZxdydS77yBMDAwNDU2`，长度和 `0111010100001000110010100010001000100001100101001111` 相同，应当正确。

到这里就需要一点脑电波了。

我们尝试把第一个字符串的文字和第二个一一对应。容易猜到规则如下：

- 如果第一个字符是字母，那么第二个字符决定是否翻转大小写。如果翻转或不翻转之后是大写，则选择它。
- 如果第一个不是，那么第二个决定是否选择它。

Python 代码：

```python
word = "cSYncXcn77yBUu+8gTgwMyVxd3Axb3J6ciZxdydS77yBMDAwNDU2"
key = "0111010100001000110010100010001000100001100101001111"
def tp(ch): # 识别字符类型
	if ord(ch) >= ord('A') and ord(ch) <= ord('Z'):
		return 0 # 大写字母
	if ord(ch) >= ord('a') and ord(ch) <= ord('z'):
		return 1 # 小写字母
	if ord(ch) >= ord('0') and ord(ch) <= ord('9'):
		return 2 # 数字数码
	return -1 # 其它
def sw(ch): # 大小写转换，不是数字则不转换
	t = tp(ch)
	if t == 0:
		return chr(ord(ch) - ord('A') + ord('a'))
	if t == 1:
		return chr(ord(ch) - ord('a') + ord('A'))
	return ch
def solve(word, key):
	res = ""
	for i in range(len(word)):
		k = key[i]
		i = word[i]
		t = tp(i)
		if t == -1:
			continue
		if t == 2:
			if k == '1':
				res += i
			continue
		if k == '1':
			i = sw(i)
		if tp(i) == 0:
			res += sw(i)
	return res
print(solve(word,key))
```

输出为下一关[云剪贴板](https://www.luogu.com.cn/paste/nnbg7ma2) ID `nnbg7ma2`。