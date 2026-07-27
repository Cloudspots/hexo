---
title: 多方对拍
date: 2026-5-1 15:20:34
categories:
  - Unclassified
tags: []
---
racket.cpp

之前的 hash 存储管理有些问题，会炸掉，现在好了。

```cpp
#include <string>
#include <cstdio>
#include <vector>
#include <cstdlib>
#include <iostream>
#include <fstream>
#include <filesystem>

using namespace std;

int sstm(const string &str) { return system(str.c_str()); }

bool do_compile(const string &x)
{
	if(filesystem::exists("D:\\working\\" + x + ".hash.bak"))
	{
		sstm("certutil -hashfile D:\\working\\" + x + ".cpp SHA256 > D:\\working\\" + x + ".hash");
		if(!sstm("D:\\working\\diff.exe D:\\working\\" + x + ".hash D:\\working\\" + x + ".hash.bak"))
		{
			filesystem::remove("D:\\working\\" + x + ".hash");
			// printf("Hash is the same. do not compile.\n");
			return true;
		}
		if(sstm("g++ -std=c++17 -Ofast -march=native D:\\working\\" + x + ".cpp -o D:\\working\\" + x + ".exe"))
		{
			filesystem::remove("D:\\working\\" + x + ".hash");
			// printf("Failed when compiling %s.cpp.\n", x.c_str());
			return false;
		}
		filesystem::remove("D:\\working\\" + x + ".hash.bak");
		filesystem::rename("D:\\working\\" + x + ".hash", "D:\\working\\" + x + ".hash.bak");
	}
	else
	{
		if(sstm("g++ -std=c++17 -Ofast -march=native D:\\working\\" + x + ".cpp -o D:\\working\\" + x + ".exe"))
		{
			printf("Failed when compiling %s.cpp.\n", x.c_str());
			return false;
		}
		sstm("certutil -hashfile D:\\working\\" + x + ".cpp SHA256 > D:\\working\\" + x + ".hash.bak");
	}
	return true;
}

int main(int argc, char *argv[])
{
	if(argc < 2)
	{
		printf("ILLEGAL ARGUMENTS\n");
		return 1;
	}
	vector<string> names;
	if(argc == 2) names = {argv[1], string(argv[1]) + "-sol"};
	else
	{
		for(int i=1;i<argc;i++)
		{
			names.push_back(argv[i]);
		}
	}
	// string name = argv[1];
	printf("[log] build diff.cpp\n");
	if(!do_compile("diff"))
	{
		printf("Failed when compiling diff.cpp.\n");
		return 2;
	}
	printf("[log] build maker.cpp\n");
	if(!do_compile("maker"))
	{
		printf("Failed when compiling maker.cpp.\n");
		return 4;
	}
	printf("[log] build validator.cpp\n");
	if(!do_compile("validator"))
	{
		printf("Failed when compiling validator.cpp.\n");
		return 8;
	}
	for(const auto &x : names)
	{
		printf("[log] build %s.cpp\n", x.c_str());
		if(!do_compile(x))
		{
			printf("Failed when compiling %s.cpp.\n", x.c_str());
			return 16;
		}
	}
	do
	{
		printf("[log] execute maker.exe\n");
		int stat = 0;
		if(stat = sstm("D:\\working\\maker.exe > D:\\working\\data.in"))
		{
			printf("maker returned %d\n", stat);
			return 32;
		}
		printf("[log] execute validator.exe\n");
		if(sstm("D:\\working\\validator.exe < D:\\working\\data.in"))
		{
			printf("Data invalid.\n");
			continue;
		}
		for(const auto &x : names)
		{
			printf("[log] execute %s.exe\n", x.c_str());
			if(stat = sstm("D:\\working\\" + x + ".exe < D:\\working\\data.in > D:\\working\\" + x + ".out"))
			{
				printf("%s.exe returned %d\n", x.c_str(), stat);
				return 64;
			}
		}
		for(int i=0;i+1<names.size();i++)
		{
			printf("[log] compare %s.out and %s.out\n", names[i].c_str(), names[i+1].c_str());
			if(sstm("D:\\working\\diff.exe D:\\working\\" + names[i] + ".out D:\\working\\" + names[i+1] + ".out"))
			{
				printf("%s.out != %s.out.\n", names[i].c_str(), names[i+1].c_str());
				goto ed;
			}
		}
		printf("Accepted.\n");
	} while(true);
	ed:
	printf("Wrong Answer.\n");
	return 0;
}

```

diff.cpp（fc 太慢）

```cpp
#include <cstdio>
#include <string>
#include <iostream>
#include <fstream>
#include <vector>

using namespace std;

int main(int argc, char *argv[])
{
	if(argc != 3)
	{
		printf("Error 1.\n");
		return 2;
	}
	string a = argv[1], b = argv[2];
	ifstream x(a), y(b);
	if(!x.is_open())
	{
		printf("Cannot open %s\n", argv[1]);
		return 4;
	}
	if(!y.is_open())
	{
		printf("Cannot open %s\n", argv[2]);
		return 8;
	}
	vector<string> v1, v2;
	string now;
	while(getline(x, now)) v1.push_back(now);
	while(getline(y, now)) v2.push_back(now);
	for(string &g : v1) while(!g.empty() && g.back() == ' ') g.pop_back();
	for(string &g : v2) while(!g.empty() && g.back() == ' ') g.pop_back();
	while(!v1.empty() && v1.back().empty()) v1.pop_back();
	while(!v2.empty() && v2.back().empty()) v2.pop_back();
	if(v1 == v2) return 0;
	return 16;
}
```