---
title: VIM 键位小练习
date: 2026-5-24 11:56:49
categories:
  - Unclassified
tags: []
---
其实是推箱子。

```cpp
/*
O: Player
X: Box (not on target)
Y: Box (on target)
.: Target with no box
#: Wall
 : blank

0-indexed

VIM-style move :)
h: left
j: down
k: up
l: right
*/
#include <cstdio>
#include <string>
#include <vector>
#include <cstdlib>
#include <fstream>
#include <iostream>
#include <unistd.h>
#include <algorithm>
#include <termios.h>

using namespace std;

class level
{
public:
	int n, m, x, y;
	vector<basic_string<bool>> wall;
	vector<basic_string<bool>> box;
	vector<basic_string<bool>> target;
};

int main(int argc, char *argv[])
{
	vector<string> names;
	if(argc == 1)
	{
		fprintf(stderr, "No level!\n");
		return 1;
	}
	for(int i=1;i<argc;i++)
	{
		names.push_back(argv[i]);
	}
	vector<level> lvls;
	for(const string &x : names)
	{
		ifstream fs(x);
		int t;
		fs >> t;
		// printf("t = %d\n", t);
		while(t--)
		{
			int n, m;
			fs >> n >> m;
			lvls.push_back({n, m, -1, -1, {}});
			string buf;
			getline(fs, buf);
			int cbox = 0, ctarget = 0;
			for(int i=0;i<n;i++)
			{
				// printf("i = %d\n", i);
				getline(fs, buf);
				if(buf.size() != m)
				{
					// printf("%s!\n", buf.c_str());
					fprintf(stderr, "File %s Invalid!\n", x.c_str());
					return 2;
				}
				basic_string<bool> wall, box, target;
				for(int j=0;j<m;j++)
				{
					switch(buf[j])
					{
					case 'O': wall += false; box += false; target += false; if(lvls.back().x == -1) { lvls.back().x = i; lvls.back().y = j; } else { fprintf(stderr, "File %s Invalid!\n", x.c_str()); return 2; } break;
					case 'X': wall += false; box += true;  target += false; cbox++; break;
					case 'Y': wall += false; box += true;  target += true;  cbox++; ctarget++; break;
					case '.': wall += false; box += false; target += true;  ctarget++; break;
					case '#': wall += true;  box += false; target += false; break;
					case ' ': wall += false; box += false; target += false; break;
					default: fprintf(stderr, "File %s Invalid!\n", x.c_str()); return 2; break;
					}
				}
				lvls.back().wall.push_back(wall);
				lvls.back().box.push_back(box);
				lvls.back().target.push_back(target);
			}
			if(cbox != ctarget || cbox == 0)
			{
				fprintf(stderr, "File %s Invalid!\n", x.c_str());
				return 2;
			}
		}
	}
	termios ol, rw;
	tcgetattr(STDIN_FILENO, &ol);
	rw = ol;
	rw.c_lflag &= ~(ICANON | ECHO);
	tcsetattr(STDIN_FILENO, TCSANOW, &rw);
	for(int id=0;id<lvls.size();id++)
	{
		level bw = lvls[id];
		int x = bw.x, y = bw.y;
		auto genmap = [&]() -> string
		{
			string res = "Level #" + to_string(id + 1);
			for(int i=0;i<bw.n;i++)
			{
				res += "\n";
				for(int j=0;j<bw.m;j++)
				{
					int stat = (int(bw.wall[i][j]) << 2) | (int(bw.box[i][j]) << 1) | int(bw.target[i][j]);
					if(i == x && j == y)
					{
						res += 'O';
						continue;
					}
					switch(stat)
					{
					case 0: res += ' '; break;
					case 2: res += 'X'; break;
					case 3: res += 'Y'; break;
					case 1: res += '.'; break;
					case 4: res += '#'; break;
					default: fprintf(stderr, "Internal Error.\n"); tcsetattr(STDIN_FILENO, TCSANOW, &ol); exit(4);
					}
				}
			}
			return res;
		};
		auto proceedmove = [&](char op) -> void
		{
			int dx, dy;
			switch(op)
			{
			case 'h': dx = 0; dy = -1; break;
			case 'j': dx = 1; dy = 0; break;
			case 'k': dx = -1; dy = 0; break;
			case 'l': dx = 0; dy = 1; break;
			case 'r': bw = lvls[id]; x = bw.x; y = bw.y; break;
			default: return; // Invalid move
			}
			if(x + dx < 0 || x + dx >= bw.n || y + dy < 0 || y + dy >= bw.m) return; // Invalid move * 2
			if(bw.wall[x + dx][y + dy]) return; // Invalid move * 3
			if(!bw.box[x + dx][y + dy])
			{
				x += dx;
				y += dy;
				return; // Valid move
			}
			else if(x + 2 * dx < 0 || x + 2 * dx >= bw.n || y + 2 * dy < 0 || y + 2 * dy >= bw.m) return; // Invalid push
			else if(bw.wall[x + 2 * dx][y + 2 * dy] || bw.box[x + 2 * dx][y + 2 * dy]) return; // Invalid push * 2
			else
			{
				bw.box[x + 2 * dx][y + 2 * dy] = true;
				bw.box[x + dx][y + dy] = false;
				x += dx; y += dy; // Valid push
			}
		};
		auto finished = [&]() -> bool
		{
			for(int i=0;i<bw.n;i++)
			{
				for(int j=0;j<bw.m;j++)
				{
					if(bw.box[i][j] ^ bw.target[i][j]) return false;
				}
			}
			return true;
		};
		while(!finished())
		{
			printf("\033[2J\033[H%s", genmap().c_str());
			proceedmove(getchar());
		}
		printf("\033[2J\033[H%s", genmap().c_str());
		printf("\nCongratulations! Press any key to go to the next level...\n");
		getchar();
	}
	printf("\033[2J\033[H");
	printf("Congratulations! You win all the levels!\n");	
	tcsetattr(STDIN_FILENO, TCSANOW, &ol);
	return 0;
}
```