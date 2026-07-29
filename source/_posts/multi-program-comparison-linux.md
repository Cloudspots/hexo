---
title: 适合 Linux 宝宝体质的多方对拍
date: 2026-5-16 18:15:56
categories:
  - Technology & Engineering
tags: []
---
racket.cpp（主程序）

```cpp
#include <cstdio>
#include <cstdlib>
#include <string>
#include <vector>
#include <chrono>
#include <filesystem>
#include <fstream>

using namespace std;

int sstm(const string &str) { return system(str.c_str()); }

bool do_compile(const string &x, const string &arg)
{
	const auto compute_checksum = [&]()
	{
		sstm("sha256sum ./" + x + ".cpp > ./" + x + ".hash");
		ofstream("./" + x + ".hash", ios_base::app) << arg;
	};
	if(filesystem::exists("./" + x + ".hash.bak"))
	{
		compute_checksum();
		if(!sstm("./mydiff ./" + x + ".hash ./" + x + ".hash.bak"))
		{
			filesystem::remove("./" + x + ".hash");
			// printf("Hash is the same. do not compile.\n");
			return true;
		}
		if(sstm("g++ " + arg + " ./" + x + ".cpp -o ./" + x))
		{
			filesystem::remove("./" + x + ".hash");
			// printf("Failed when compiling %s.cpp.\n", x.c_str());
			return false;
		}
		filesystem::remove("./" + x + ".hash.bak");
		filesystem::rename("./" + x + ".hash", "./" + x + ".hash.bak");
	}
	else
	{
		if(sstm("g++ " + arg + " ./" + x + ".cpp -o ./" + x))
		{
			printf("Failed when compiling %s.cpp.\n", x.c_str());
			return false;
		}
		compute_checksum();
		filesystem::rename("./" + x + ".hash", "./" + x + ".hash.bak");
	}
	return true;
}

class argument
{
public:
	bool valid;
	vector<string> names;
	string validator;
	string comparg;
	unsigned long long tl;
	bool get(const vector<string> &vs)
	{
		names.clear();
		tl = (unsigned)-1; // 1s
		valid = true;
		for(const string &x : vs)
		{
			if(x.substr(0, 6) == "-time=")
			{
				string num = x.substr(6);
				if(num.empty() || num.size() > 10 || (unsigned)tl + 1 != 0)
				{
					valid = false;
					return false;
				}
				tl = 0;
				for(char ch : num)
				{
					if(ch >= '0' && ch <= '9') tl = tl * 10 + (ch - '0');
					else
					{
						valid = false;
						return false;
					}
					if(tl >= 4294967296)
					{
						valid = false;
						return false;
					}
				}
				if(tl == 0)
				{
					valid = false;
					return false;
				}
			}
			else if(x.substr(0, 11) == "-validator=")
			{
				string nm = x.substr(11);
				if(nm.empty() || !validator.empty())
				{
					valid = false;
					return false;
				}
				validator = nm;
			}
			else if(x.substr(0, 9) == "-comparg=")
			{
				string nm = x.substr(9);
				if(nm.empty() || !comparg.empty())
				{
					valid = false;
					return false;
				}
				comparg = nm;
			}
			else names.push_back(x);
		}
		if(names.empty())
		{
			valid = false;
			return false;
		}
		if(names.size() == 1) names.push_back(names[0] + "-sol");
		if(comparg.empty()) comparg = "-std=c++26 -Ofast -march=native -pipe";
		return true;
	}
};

int main(int argc, char *argv[])
{
	vector<string> args;
	for(int i=1;i<argc;i++)
	{
		args.push_back(argv[i]);
	}
	argument arg;
	if(!arg.get(args))
	{
		printf("\033[31mILLEGAL ARGUMENT.\n\033[0mDo pressure test.\n");
		printf(R"(Usage:
  racket <NAME>... [options]
Options:
  -time=<timelimit>    An integer which sets the time limit of the problem (ms). Should be in [1, 4294967296). Default unlimited.
  -validator=<name>    The name of the validator. No '.cpp'
  -comparg=<argument>  Arguments for compiling. Default -std=c++26 -Ofast -march=native -pipe.
Should be at least 1 name. If there's only one, will use <NAME>.cpp and <NAME>-sol.cpp. Otherwise, will use all the <NAME>.cpp.
)");
		return 1;
	}
	printf("[log] Compile mydiff.cpp\n");
	if(!do_compile("mydiff", "-Ofast -march=native -pipe"))
	{
		printf("\033[31mError when compiling mydiff.cpp. You careless naughty boy.\n\033[0m");
		return 2;
	}
	printf("[log] Compile maker.cpp\n");
	if(!do_compile("maker", arg.comparg))
	{
		printf("\033[31mError when compiling maker.cpp\n\033[0m");
		return 4;
	}
	if(!arg.validator.empty())
	{
		printf("[log] Compile %s.cpp as validator\n", arg.validator.c_str());
		if(!do_compile(arg.validator, arg.comparg))
		{
			printf("\033[31mError when compiling %s.cpp\n\033[0m", arg.validator.c_str());
			return 8;
		}
	}
	for(const string &x : arg.names)
	{
		printf("[log] Compile %s.cpp\n", x.c_str());
		if(!do_compile(x, arg.comparg))
		{
			printf("\033[31mError when compiling %s.cpp\n\033[0m", x.c_str());
			return 16;
		}
	}
	unsigned long long cnt = 0;
	bool flag = true;
	do
	{
		printf("Trial #%llu\n", ++cnt);
		printf("[log] Execute maker\n");
		if(sstm("./maker > ./data.in"))
		{
			printf("\033[31mmaker raised a runtime error.\n\033[0m");
			return 32;
		}
		for(const string &x : arg.names)
		{
			printf("[log] Execute %s\n", x.c_str());
			auto bgn = chrono::high_resolution_clock::now();
			if(int res = sstm("./" + x + " < data.in > " + x + ".out"))
			{
				printf("%s returned %d\nData #%llu: \033[34mRuntime Error\n\033[0m", x.c_str(), res, cnt);
				return 0;
			}
			auto thyme = chrono::high_resolution_clock::now() - bgn;
			if(thyme > chrono::milliseconds(arg.tl + 10))
			{
				printf("\033[34m%s used %lu ms\n\033[0m", x.c_str(), chrono::duration_cast<chrono::milliseconds>(thyme).count());
				return 0;
			}
			else if(thyme > chrono::milliseconds(arg.tl)) printf("\033[33m[log] %s used %lu ms. Good luck.\n\033[0m", x.c_str(), chrono::duration_cast<chrono::milliseconds>(thyme).count());
			else printf("[log] %s used %lu ms\n", x.c_str(), chrono::duration_cast<chrono::milliseconds>(thyme).count());
		}
		for(int i=0;i+1<arg.names.size();i++)
		{
			printf("[log] Compare %s.out and %s.out\n", arg.names[i].c_str(), arg.names[i+1].c_str());
			if(sstm("./mydiff ./" + arg.names[i] + ".out ./" + arg.names[i] + ".out"))
			{
				printf("[log] Different.\n");
				flag = false;
				break;
			}
		}
	} while(flag);
	printf("Data #%llu: \033[34mAnswer different.\n\033[0m", cnt);
	return 0;
}
```

mydiff.cpp（辅助）

```cpp
// TODO: Optimize the speed.
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
		fprintf(stderr, "Error 1.\n");
		return 2;
	}
	string a = argv[1], b = argv[2];
	ifstream x(a), y(b);
	if(!x.is_open())
	{
		fprintf(stderr, "Cannot open %s\n", argv[1]);
		return 4;
	}
	if(!y.is_open())
	{
		fprintf(stderr, "Cannot open %s\n", argv[2]);
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
	return 1;
}

```