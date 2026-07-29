---
title: 炸炸你的编译器
date: 2026-5-23 08:45:33
categories:
  - Entertainment
tags: []
---
```cpp
#define a auto
#define t return
int main(){a r=[]<a c>(a f,a l,a k){if constexpr(c)t l(f.template operator()<c-1>(f,l,k));else t l(k);};t r.operator()<99>(r,[](a g){t[g](a...k){t g(k...,k...);};},[](a x){t[x](a...y){t x(x,y...);};}([](a f,a s,a...x){t s+f(f,x...);}))(1);}
```
欢迎 codegolf