---
title: 题解：P8079 [WC2022] 猜词
date: 2025-12-18 22:19:41
categories:
  - Solution
tags:
  - Solution
  - Luogu P Problem Solution
---
水黑啊，最多蓝吧。

考虑对每个单词进行估价，决定猜哪个单词。

如何估价？

## 法 $1$

显然的一种想法是，由于猜测一个单词可以把正解范围缩小，所以猜测对于每种可能的结果，如果是这种结果可能的答案的范围大小的最大值作为估价函数，但是此时要选择估价函数最小的。也就是收，每次选择当前可能的答案中，估价函数值最小的。

然后有一个（应该是必须使用的）trick 是，首先在本地把 $26$ 个字母分别的最佳开头打出一个表来，极大提升速度。

这样能够[拿下 $96.045 \mathrm{pts}$](https://www.luogu.com.cn/record/263637217)！

注意到有时候猜不可能是答案的单词反而更好。比如已经知道结果是 `axxxx`（`x` 是已经知道的，`a` 不知道），那可能就会各种可能的第一个字母猜一遍，实际上效果可能不如先猜一个包含了可能作为开头的各种字母的单词，然后直接得出结果。所以每次从整个词库中查找，而不是可能是答案的。

然后你会发现爆零了。因为有很多时候，比如说只剩下两种可能的单词，猜一个可能是答案的单词和猜另外一个单词都能确定结果，然后就猜了另外一个。实际上我们知道，猜测可能是答案的单词，直接猜有 $\dfrac{1}{2}$ 的概率是正确的。

所以以上面的估价作为第一关键字，是否可能是答案作为第二关键字。

[$98.110 \mathrm{pts}$](https://www.luogu.com.cn/record/263640479)。

这个东西可能被极端数据影响。可以改为算术平均值。同时就不能设第一、第二关键字了，直接设一个权值，比如 $0.01$。

[过了](https://www.luogu.com.cn/record/263636053)。在本地跑一下是 $100.14\mathrm{pts}$。好吧其实这个能过是因为运气好，我本地跑了一遍 $10000$ 组数据然后均分 $99.895$……

虽然可能被极端数据影响，但也不能完全忽略极端数据。改用平方平均值。洛谷上又过了，本地又没过，$99.675\mathrm{pts}$。

考虑加权。有可能某种情况可能确实会留下很多的可能性，但是概率不高。

所以我们要求的是这个：$\displaystyle\sum_{c\in\mathrm{counts}} \dfrac{c^2}{\sum \mathrm{counts}}$。

洛谷上……过了。本地……$99.7805\mathrm{pts}$。

## 法 $2$

使用信息熵。

我们注意到，如果一种情况有 $p$ 的概率，那么其能够给我们提供“$\log\left(\dfrac{1}{p}\right)$” 的信息（因为它可以区分出 $\dfrac{1}{p}$ 种情况）。

使用平均数？不，加权平均。就像上面所说的，权值因为 $p$ 本身。

所以我们的估价函数应该是，信息熵函数！

$$ E=-\sum_{c\in\mathrm{counts}} \dfrac{c}{\mathrm{counts}}\times\log_2\left(\dfrac{c}{\mathrm{counts}}\right) $$

过不了。还是因为上面说的，可能猜一个不是答案的单词，但是猜可能是答案的更好。和上面的做法一样，如果是则加上一个权值。我试了一下这个权值是 $0.01$ 还是 $0.1$ 好像都差不多……洛谷过了，本地得分忘了，没达到 $100$。

## 附件

:::info[改装版的 grader]

去除了得分上界为 $100$ 的限制，使用多进程（为什么不是多线程？我觉得你的 `guess` 函数不是线程安全的！），使用 `dT` 控制新建进程（不算主进程）数量，`T` 代表测试数量。需要保证 `dT` 是 `T` 的因子。

```cpp
/* This is a sample grader for the contestant */
#include "word.h"
#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <Windows.h>
#include <cstdlib>
#include <random>
#include <algorithm>

using namespace std;

constexpr int dT = 20;
constexpr int T = 10000;
static const int NUM_SCRAMBLE = 8869;
static const char SCRAMBLE[8869 * 5 + 1] = /*太长，不贴了！自己去看原 spj，或者把 scramble_pure 粘上来！*/;
static const int win_points[5] = {85, 90, 100, 120, 150};

int judge(int T)
{
	init(NUM_SCRAMBLE, SCRAMBLE);
	bool gold[5], silver[5];
	mt19937_64 mt(random_device{}());
	uniform_int_distribution<int> ud(0, NUM_SCRAMBLE - 1);
	int total_score = 0;
	// system("cls");
	for (int i = 1; i <= T; i++) {
		// if(i % (T / 100) == 0)
		// {
		// 	SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), {0, 0});
		// 	printf("Testing... %d%%\n", i / (T / 100));
		// }
		int answer = ud(mt);
		char init_letter = SCRAMBLE[answer * 5];
		const char *guess_word = guess(i, 5, init_letter, gold, silver);
		for (int j = 4; j >= 0; j--) {
			if (strlen(guess_word) != 5) {
				break;
			}
			bool correct = true;
			for (int k = 0; k < 5; k++) {
				gold[k] = guess_word[k] == SCRAMBLE[answer * 5 + k];
				if (!gold[k])
					correct = false;
			}
			bool is_valid_guess = false;
			for (int l = 0; l < NUM_SCRAMBLE; l++) {
				bool same = true;
				for (int k = 0; k < 5; k++) {
					if (guess_word[k] != SCRAMBLE[l * 5 + k]) {
						same = false;
						break;
					}
				}
				if (same) {
					is_valid_guess = true;
					break;
				}
			}
			if (!is_valid_guess) {
				break;
			}
			if (correct) {
				total_score += win_points[j];
				break;
			}
			if (j == 0) {
				break;
			}
			for (int k = 0; k < 5; k++) {
				silver[k] = false;
				for (int l = 0; l < 5; l++)
					if (!gold[k] && !gold[l] && guess_word[k] == SCRAMBLE[answer * 5 + l])
						silver[k] = true;
			}
			guess_word = guess(i, j, init_letter, gold, silver);
		}
	}
	return total_score;
}

PROCESS_INFORMATION pis[dT + 5];
int *anss[dT + 5];
HANDLE pbd[dT + 5];
char exe_path[256];

int main(int argc, char *argv[])
{
	if(argc == 1)
	{
		GetModuleFileName(NULL, exe_path, 256);
		for(int i=1;i<=dT;i++)
		{
			// printf("Starting Process #%d...\n", i);
			*(anss[i] = (int*)MapViewOfFile(pbd[i] = CreateFileMappingA(INVALID_HANDLE_VALUE,NULL,PAGE_READWRITE,0,4,(string("OhYeahMyDeskmateUniformAKedIOIButIGot100PointsInNOIP2025") + to_string(i)).c_str()),FILE_MAP_ALL_ACCESS,0,0,4)) = 0;
			// anss[i] = (int*)MapViewOfFile(pbd[i] = CreateFileMappingA(INVALID_HANDLE_VALUE,NULL,PAGE_READWRITE,0,4,(string("OhYeahMyDeskmateUniformAKedIOIButIGot100PointsInNOIP2025") + to_string(i)).c_str()),FILE_MAP_ALL_ACCESS,0,0,4);
			// printf("anss[%d]: %p\n", anss[i]);
			// CreateFileMappingA(INVALID_HANDLE_VALUE,NULL,PAGE_READWRITE,0,4,(string("OhYeahMyDeskmateUniformAKedIOIButIGot100PointsInNOIP2025") + to_string(i)).c_str());
			// printf("%d\n", GetLastError());
			// printf("ERROR_FILE_INVALID: %d\nERROR_INVALID_HANDLE : %d\nERROR_ALREADY_EXISTS : %d\n", ERROR_FILE_INVALID, ERROR_INVALID_HANDLE, ERROR_ALREADY_EXISTS);
			// *anss[i] = 0;
			// exit(0);
			// printf("h1\n"); fflush(stdout);
			STARTUPINFO si = {sizeof si};
			// printf("h2\n"); fflush(stdout);
			char *cmdLn = new char[256];
			// printf("h3\n"); fflush(stdout);
			strcpy(cmdLn, string(string("\"") + exe_path + "\" " + to_string(i)).c_str());
			// printf("Command line: %d\n", cmdLn); fflush(stdout);
			CreateProcess(NULL, cmdLn, NULL, NULL, FALSE, 0, NULL, NULL, &si, pis + i);
			delete [] cmdLn;
		}
		int total_score = 0;
		for(int i=1;i<=dT;i++)
		{
			// printf("Waiting for process #%d...\n", i);
			WaitForSingleObject(pis[i].hProcess, INFINITE);
			total_score += *anss[i];
			UnmapViewOfFile(anss[i]); CloseHandle(pbd[i]);
		}
		printf("Total score: %d\n", total_score);
		double final_score = total_score * 1.0 / T;
		// if (final_score > 100)
		// 	final_score = 100;
		printf("Final score: %.3f\n", final_score);
	}
	else
	{
		int r = atoi(argv[1]);
		// printf("Here is process #%d!\n", r); fflush(stdout);
		*(int*)MapViewOfFile(OpenFileMappingA(FILE_MAP_ALL_ACCESS, FALSE, (string("OhYeahMyDeskmateUniformAKedIOIButIGot100PointsInNOIP2025") + to_string(r)).c_str()), FILE_MAP_ALL_ACCESS, 0, 0, 0) = judge(T / dT);
	}
	return 0;
}
```
:::