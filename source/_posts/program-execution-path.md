---
title: 程序执行路径
date: 2024-7-22 08:32:49
categories:
  - Technology & Engineering
tags: []
---
note：蒟蒻写的不好请见谅。

# Visual Studio

## 发现过程

发现某些情况下（我的旧电脑下可以，新电脑就不行了，文章的大多部分都是在旧电脑上写的），在 `main` 函数结束后按下 F11 会跳到 exe_common.inl 中。

于是我们使用这个程序来测试：

```cpp
int main()
{
  return 0;
}
```

简单不？这个不是重点，我们现在开始调试。

## 研究过程

### exe_common.inl

按 $4$ 下 F11 就跳到了 exe_common.inl 里：

[![pk7YZuR.png](pk7YZuR.png)](https://imgse.com/i/pk7YZuR)

这里的高亮似乎有问题，将就着看吧。

upd：显然直接在这里浏览，那么 Intellisense 是不知道有这个宏的。事实上，在 exe_main.cpp 中是有的。所以高亮出现问题。

#### telemetry.cpp

又按 $4$ 下 F11，VS 提示未找到 telemetry.cpp，于是手动创建了一个空的。

[![pk7Yk34.png](pk7Yk34.png)](https://imgse.com/i/pk7Yk34)

#### traceloggingprovider.h

又按了大约 $10$ 次 F11，VS 又提示需要  traceloggingprovider.h，于是又创建了一个：

[![pk7YAgJ.png](pk7YAgJ.png)](https://imgse.com/i/pk7YAgJ)


#### 又回到 telemetry.cpp 里了？

又按了 $5$ 下 F11，它跳回了 telemetry.cpp 里面。又按了两下，它又跳到了 exe_common.inl 中。

[![pk7YEv9.png](pk7YEv9.png)](https://imgse.com/i/pk7YEv9)

#### 又跳到 exe_common.inl 里了

又按两下，跳到 utility_desktop.cpp 里了:

[![pk7YeD1.png](pk7YeD1.png)](https://imgse.com/i/pk7YeD1)

#### utility_desktop.cpp

再按11下，又跳回（exe_common.inl）去了。

[![pk7YKUK.png](pk7YKUK.png)](https://imgse.com/i/pk7YKUK)


#### exe_common.inl 他又来了

再次跳到 exe_common.inl 里面时，我有一种不祥的预感：下一行就是 exit 函数了……

#### exit 函数——程序的退出

再按两下，运行到了函数调用 `exit(main_result);` 里面，跳到这里程序才算退出了。

### 继续探索——main 函数的调用者

#### exe_common.inl

但我的实验还没结束，我再次定位到 exe_common.inl 里，发现 `main` 函数是在那里被调用的：

```cpp
static int __cdecl invoke_main() throw()
{
  return main(__argc, __argv, _get_initial_narrow_environment());
}
```

然后启动搜索大法（注意是所有的 `Visual C++` 目录），发现有 $4$ 个源文件都导入了这个模块：
- exe_main.cpp
- exe_wmain.cpp
- exe_winmain.cpp
- exe_wwinmain.cpp

他们的名字都是 exe_ 加上主函数名称。

#### exe_main.cpp

要的当然是 exe_main.cpp 啊！点进去一看，（不算空行和注释）居然只有 $6$ 行！

```cpp
#define _SCRT_STARTUP_MAIN
#include "exe_common.inl"
extern "C" int mainCRTStartup()
{
  return __scrt_common_main();
}
```

### 结果

#### 结论

然后再次启动搜索大法，没搜到那里使用 exe_main.cpp，于是得出结论：

`main` 函数不是操作系统调用的，是 exe_common.inl 调用的！

exe_common.inl 也不是操作系统调用的，是 exe_main.cpp 调用的！

exe_main.cpp 才是操作系统调用的！

#### 函数/模块调用次序

最后我整理了一下函数/模块使用次序（括号里的是模块，不在括号里的是函数）：

1. （exe_main.cpp）
2. （exe_common.inl）
3. （你的代码.cpp）`main`
4. （exe_common.inl）`invoke_main`
5. （exe_common.inl）`__telemetry_main_return_trigger`
6. （telemetry.cpp）
7. （traceloggingprovider.h）
8. （telemetry.cpp）
9. （exe_common.inl）
10. （utility_desktop.cpp）`__scrt_is_managed_app`
11. （exe_common.inl）`exit`

## 继续探索

提示：以下代码有点长，可以配合后面的程序注解看看。

以下是“程序不从 `main` 函数开始，不从 `main` 函数结束”的另一个证明方法（原谅我英语不太好，如果英文有语法错误，请指出）：

```cpp
#include <cstdio>
#include <iostream>
#include <string>
#include <cstdlib

using namespace std;

string str("aa");
class my_class
{
public:
  int n;
  my_class()
  {
    printf("default ctor.\n");
  }
  my_class(int n)
  {
    printf("one arg:int n ctor\n");
    this -> n = n;
  }
  ~my_class()
  {
    printf("dtor.\n");
  }
};

my_class a,b(1);

int func()
{
  printf("func() called.\n");
  return 0;
}

int aaa=func();

void func2()
{
  printf("func2() called.\n");
}

int main(int argc,char *argv[])
{
  printf("start of main.\n");
  cout << "Before the main function is called,IO initialization was completed." << endl;
  printf("a and b is right. b.n = %d\n",b.n);
  int *p=new int;
  printf("Heap initialization was completed too.\n");
  delete p; //防止内存泄露
  printf("argc and argv's value is right,too.\nargc = %d,argv[0]=%s,argv[1]=%s,argv[2]=%s\n",argc,argv[0],argv[1],argv[2]);
  int n;
  scanf("%d",&n);
  atexit(&func2);
  printf("Input initialization was completed!\nn=%d!\n",n);
  printf("str + to_string(n) = %s\n",(str+to_string(n)).c_str());
  cout << "end of main.\n";
  return 1;
}
```
其实这个程序的逻辑还是比较清晰的：

1. 定义一个 `string` 型变量（调用了 `string` 型变量的构造函数）。
2. 定义一个类 `my_class`，有两个构造函数，一个析构函数和一个成员变量 `n`。
3. 定义 `my_class` 类的两个实例，分别叫 `a` 和 `b`，对 `a` 调用第一个构造函数，对 `b` 调用第二个构造函数。
4. 定义两个函数，一个叫做 `func`，没有参数，返回值为 `int`，另一个叫做 `func2`，没有参数，没有返回值。
5. 调用这个函数，返回值赋值到变量 `aaa` 中。
6. 进入主程序
7. 输出 `b.n,argc,argv[0],argv[1],argv[2]`
8. 定义并输入 `n`
9. 用 `atexit` 函数注册 `func2` 函数
10. 输出 `n` 和 `str+to_string(n)`

编译：

```
g++ -std=c++11 xxx.cpp
```

运行（看好！）：

```
a at 1
```

输入：

```
121
```

输出：
```
default ctor.
one arg:int n ctor
func() called.
start of main.
Before the main function is called,IO initialization was completed.
a and b is right. b.n = 1
Heap initialization was completed too.
argc and argv's value is right,too.
argc = 3,argv[0]=a,argv[1]=at,argv[2]=1
121
Input initialization was completed!
n=121!
str + to_string(n) = aa121
end of main.
func2() called.
dtor.
dtor.
```

你看，在 `start of main` 之前和 `end of main` 之后都有输出，而在 `start of main` 之前，其实 IO 初始化已经完成（可以用 `printf,scanf,cin,cout`），`a,b` 初始化完成（`b.n=1`），`argc` 和 `argv` 被正确传入，`str` 被正确构造。而在 `main` 之后，调用了 `str`，`a` 和 `b` 的析构函数，还调用了由 `atexit` 函数注册的 `func2` 函数。

所以，铁证如山，程序真的不是从 `main` 函数开始执行的！

> 如果你按 F11 无法跳到 `exe_common.inl`，而是程序直接停止了：
>
> 用这个：
> ```cpp
> int main()
> {
>   int* p = new int;
>   for (int* q = p - 1000; q <= p + 1000; q++)
>   {
>     *q = 123123123;
>   }
>   return 0;
> }
> ```
> 
> 原理大致是越界访问内存但又在程序自己的内存空间中，导致 CRT 的部分数据损坏。
> 
> 然后会这样：
> 
> [![pk7YuE6.png](pk7YuE6.png)](https://imgse.com/i/pk7YuE6)
> 
> 然后在第 $289$ 行设置断点，`main` 函数结束后断点就会被触发。

## 所以，CRT 在 `main` 函数调用前/结束后，做了什么？

我们注意到关键的函数是 `__scrt_common_main_seh`，所以我们仔细看看它。

```cpp
static __declspec(noinline) int __cdecl __scrt_common_main_seh()
{
  if (!__scrt_initialize_crt(__scrt_module_type::exe))
  __scrt_fastfail(FAST_FAIL_FATAL_APP_EXIT);
  
  bool has_cctor = false;
  __try
  {
    bool const is_nested = __scrt_acquire_startup_lock();
    
    if (__scrt_current_native_startup_state == __scrt_native_startup_state::initializing)
    {
      __scrt_fastfail(FAST_FAIL_FATAL_APP_EXIT);
    }
    else if (__scrt_current_native_startup_state == __scrt_native_startup_state::uninitialized)
    {
      __scrt_current_native_startup_state = __scrt_native_startup_state::initializing;
      
      if (_initterm_e(__xi_a, __xi_z) != 0)
        return 255;
        
      _initterm(__xc_a, __xc_z);
      
      __scrt_current_native_startup_state = __scrt_native_startup_state::initialized;
    }
    else
    {
      has_cctor = true;
    }
    
    __scrt_release_startup_lock(is_nested);
    
    // If this module has any dynamically initialized __declspec(thread)
    // variables, then we invoke their initialization for the primary thread
    // used to start the process:
    _tls_callback_type const* const tls_init_callback = __scrt_get_dyn_tls_init_callback();
    if (*tls_init_callback != nullptr &&  __scrt_is_nonwritable_in_current_image(tls_init_callback))
    {
      (*tls_init_callback)(nullptr, DLL_THREAD_ATTACH, nullptr);
    }
    
    // If this module has any thread-local destructors, register the
    // callback function with the Unified CRT to run on exit.
    _tls_callback_type const * const tls_dtor_callback = __scrt_get_dyn_tls_dtor_callback();
    if (*tls_dtor_callback != nullptr &amp;&amp; __scrt_is_nonwritable_in_current_image(tls_dtor_callback))
    {
      _register_thread_local_exe_atexit_callback(*tls_dtor_callback);
    }
    
    //
    // Initialization is complete; invoke main...
    //
    
    int const main_result = invoke_main();
    
    //
    // main has returned; exit somehow...
    //
    
    if (!__scrt_is_managed_app())
      exit(main_result);
    
    if (!has_cctor)
      _cexit();
    
    // Finally, we terminate the CRT:
    __scrt_uninitialize_crt(true, false);
    return main_result;
  }
  __except (_seh_filter_exe(GetExceptionCode(), GetExceptionInformation()))
  {
    // Note:  We should never reach this except clause.
    int const main_result = GetExceptionCode();
    
    if (!__scrt_is_managed_app())
    _exit(main_result);
    
    if (!has_cctor)
    _c_exit();
    
    return main_result;
  }
}
```

### 初始化 CRT

```cpp
    if (!__scrt_initialize_crt(__scrt_module_type::exe))
        __scrt_fastfail(FAST_FAIL_FATAL_APP_EXIT);
```

可以看出，这里如果初始化未成功，程序就会直接退出。

而 `__scrt_initialize_crt` 函数，源代码我就不放了，说一下主要执行流程：
1. 参数代表以什么方式初始化 CRT（这里是 exe，即可执行文件）
2. 调用 `__isa_available_init`，用途不明，但是可以猜出用于初始化。
3. 这里有个注释：`// Notify the CRT components of the process attach, bottom-to-top`，意思大概是以自下往上的方式继续初始化 CRT。
4. 先后调用 `__vcrt_initialize` 和 `__acrt_initialize` 两个函数，如果有任何一个返回 `false` 则直接返回 `false`，如果都返回 `true` 则直接返回 `true`。
5. 但是我们看到，调用 `__vcrt_initialize` 和 `__acrt_initialize` 后控制流都走到了一个直接返回 `true` 的函数，应该是因为条件编译（跳到的函数名称并不是原来两个函数的名称），所以真正进行初始化的应该是 `__isa_available_init` 函数。
而 `__scrt_fastfail` 函数呢，通过反汇编可知，`FAST_FAIL_FATAL_APP_EXIT = 7`，并且最终使用了汇编指令 `int 29h`（我对汇编不太了解）退出，在调试模式下 VS 显示：

![](pk7YmHx.md.png)

### `__try,__except`

之后是一段的 `__try` 和 `__except`。

#### 上锁，检查，解锁
```cpp
        bool const is_nested = __scrt_acquire_startup_lock();
 
        if (__scrt_current_native_startup_state == __scrt_native_startup_state::initializing)
        {
            __scrt_fastfail(FAST_FAIL_FATAL_APP_EXIT);
        }
        else if (__scrt_current_native_startup_state == __scrt_native_startup_state::uninitialized)
        {
            __scrt_current_native_startup_state = __scrt_native_startup_state::initializing;
 
            if (_initterm_e(__xi_a, __xi_z) != 0)
                return 255;
 
            _initterm(__xc_a, __xc_z);
 
            __scrt_current_native_startup_state = __scrt_native_startup_state::initialized;
        }
        else
        {
            has_cctor = true;
        }
 
        __scrt_release_startup_lock(is_nested);
```
首先第一句显然是上锁。

然后第一个 `if`，如果初始化状态是正在初始化（此时应该是还未开始初始化），也是直接退出。

第二个 `if`，如果状态是还未开始初始化（也就是正常情况）：

> 第一步将状态设置为正在初始化。\
第二步初始化终端（就是程序运行的黑框），如果初始化失败，返回一个异常值（$255$）。\
第三步将状态设置为初始化完成。


然后是 `else`，也就是状态并不在这两者之中，也就是 CRT 已经初始化完成了，那么设置 `has_cctor = true`，此时可能是用户自己以某种 方式初始化了 CRT。

然后最后一句，释放锁。

#### 处理全局构造函数，注册全局析构函数。

```cpp
// If this module has any dynamically initialized __declspec(thread)
// variables, then we invoke their initialization for the primary thread
// used to start the process:
_tls_callback_type const* const tls_init_callback = __scrt_get_dyn_tls_init_callback();
if (*tls_init_callback != nullptr && __scrt_is_nonwritable_in_current_image(tls_init_callback))
{
    (*tls_init_callback)(nullptr, DLL_THREAD_ATTACH, nullptr);
}
 
// If this module has any thread-local destructors, register the
// callback function with the Unified CRT to run on exit.
_tls_callback_type const * const tls_dtor_callback = __scrt_get_dyn_tls_dtor_callback();
if (*tls_dtor_callback != nullptr && __scrt_is_nonwritable_in_current_image(tls_dtor_callback))
{
    _register_thread_local_exe_atexit_callback(*tls_dtor_callback);
}
```

#### 调用 `main` 函数。

```cpp
        //
        // Initialization is complete; invoke main...
        //
 
        int const main_result = invoke_main();
```
这里有一个小细节：就是调用 `main` 函数使用的是 `invoke_main`，`invoke_main` 实际上是一个简单的不能再简单的函数：
```cpp
static int __cdecl invoke_main()
{
    return main(__argc, __argv, _get_initial_narrow_environment());
}
```
这里给 `main` 函数传了三个参数，分别是我们熟悉的命令行参数个数和参数列表，还有一个环境变量。

#### 收尾

```cpp
        //
        // main has returned; exit somehow...
        //
 
        if (!__scrt_is_managed_app())
            exit(main_result);
 
        if (!has_cctor)
            _cexit();
 
        // Finally, we terminate the CRT:
        __scrt_uninitialize_crt(true, false);
        return main_result;
```

首先，确认此时 CRT 的各个地方有没有被损坏，如果没有，直接调用 `exit`（可以猜到，`exit` 处理了 `atexit` 注册的函数，然后结束进程）。

然后，如果 `has_cctor` 为 `false`，使用 `_cexit` 退出进程。

最后，如果**上述条件都不满足**（目前还没有遇到过这种情况，我是拖动小箭头来到这里的），调用 `__scrt_uninitialize_crt` 然后直接返回 `main` 函数的返回值。

#### `__scrt_uninitialize_crt`

如果程序实际上是一个 DLL，且是由 `exit` 函数调用的，直接返回 `true`。

这样也可以猜到，`exit` 函数调用了这个函数。

然后就是对应初始化时调用 `__vcrt_initialize` 和 `__acrt_initialize`，调用了 `__acrt_uninitialize`  和 `__vcrt_uninitialize`，结果发现也都是直接返回 `true` 的空函数。

最后，返回 `true`。

#### `__except` 块

```cpp
        // Note:  We should never reach this except clause.
        int const main_result = GetExceptionCode();
 
        if (!__scrt_is_managed_app())
            _exit(main_result);
 
        if (!has_cctor)
            _c_exit();
 
        return main_result;
```
永远不会到达此处，所以不讲 :)

### 控制流返回到 `__scrt_common_main`

顺便说一句，我以前使用的 VS2015 是没有上面的 `__scrt_common_main_seh` 函数的，上面的一切实现都是在 `__scrt_common_main` 中，VS2022 似乎加了一个 `__security_init_cookie` 的调用，但是没关系，因为注释里说需要编译时启用 `/GS` 才有效。

### 控制流返回到 `mainCRTStartup`

前面说的，它直接返回了 `__scrt_common_main` 的返回值。

### 最后返回到了 kernel32.dll

去到了操作系统，没法查看源代码了，我们的探索之旅结束了。

## `exit` 源代码

显然 `exit` 是非常重要的。

首先是一段注释和一小段代码：

```cpp
    // First, check to see if we're loaded in a managed app.  If we are, try to
    // call CorExitProcess to let the CLR handle the process termination.  If
    // the call to CorExitProcess is successful, then it will call back through
    // this function with a return mode of _crt_exit_return_to_caller, at which
    // point we will run the C termination routines.  It will then terminate the
    // process itself and not return.
    if (return_mode == _crt_exit_terminate_process && is_managed_app())
    {
        try_cor_exit_process(return_code);
    }
```

但是 `is_managed_app()` 返回 `false`，因为 `is_managed_app()`：

```cpp
    if (pe_header->OptionalHeader.DataDirectory[IMAGE_DIRECTORY_ENTRY_COM_DESCRIPTOR].VirtualAddress == 0)
        return false;
```

然后是：

```cpp
    // Run the C termination:
    bool crt_uninitialization_required = false;
```

然后不知道为啥在模块间乱跳，明明只是定义了一个变量，然后提示需要 corecrt_internal_state_isolation.h。

然后调用了 `__crt_state_management::is_os_call`。

然后就这么水灵灵地调用了 `__crt_state_management::get_current_state_index`。

然后又这么**血淋淋**地调用了 `__crt_scoped_get_last_error_reset::__crt_scoped_get_last_error_reset`。

然后终于有源代码了！

```cpp
        __crt_scoped_get_last_error_reset() throw()
        {
            _old_last_error = GetLastError();
        }
```

此时没有任何错误，`GetLastError()` 应当是 `0`，实际上确实。

返回之后又调用了 `__acrt_FlsGetValue`，是一番让人惊叹“Who cares?”的操作，直接 F10 跳过，然我们意识到我们应当回到 `exit` 函数了。

# G++

以后会更新。（我又给自己挖坑了呜呜）