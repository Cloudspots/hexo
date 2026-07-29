---
title: 如何读写进程内存空间
date: 2024-12-23 13:40:06
categories:
  - Technology & Engineering
tags: []
---
前置知识：一个小 trick，如果代码里只有一行 `#include "con"`，那么使用 G++ 编译时输入代码然后按 Ctrl+Z 相当于源文件里有你输入的代码。

# 打开进程[^1]
[^1]: 参考资料：[MSDN](https://learn.microsoft.com/zh-cn/windows/win32/procthread/process-security-and-access-rights)

如其名，使用 `OpenProcess` 打开。如果需要效率更高（存疑，判断依据是 `OpenProcess` 使用了 `NtOpenProcess`），可以使用 `NtOpenProcess`。

`OpenProcess` 声明于 processthreadsapi.h，被 Windows.h 包含，可以直接使用 Windows.h。

函数原型：

```cpp
WINBASEAPI HANDLE WINAPI
OpenProcess(
    _In_ DWORD dwDesiredAccess,
    _In_ BOOL bInheritHandle,
    _In_ DWORD dwProcessId
    );
```

把部分宏/`typedef` 展开：

```cpp
__declspec(dllimport) HANDLE __stdcall OpenProcess(
    unsigned long dwDesiredAccess,
    int bInheritHandle,
    unsigned long dwProcessId
    );
```

（其实 `HANDLE` 是 `void *`，但是这里不展开。）

`dwDesiredAccess`：标识打开权限，权限具体有什么参见后文。

`bInheritHandle`：是否继承句柄。

`dwProcessId`：进程 PID。

返回值：打开的进程 ID。如果失败，调用 `SetLastError` 设置对应错误码。

第一个参数中的权限有：

```cpp
#define PROCESS_TERMINATE                  (0x0001)  // 结束进程
#define PROCESS_CREATE_THREAD              (0x0002)  // 给对应进程创建线程
#define PROCESS_SET_SESSIONID              (0x0004)  // 设置会话 ID
#define PROCESS_VM_OPERATION               (0x0008)  // 可以使用 VirtualProtectEx 函数（具体参见 MSDN）
#define PROCESS_VM_READ                    (0x0010)  // 获取进程内存读取权限
#define PROCESS_VM_WRITE                   (0x0020)  // 获取进程内存写入权限
#define PROCESS_DUP_HANDLE                 (0x0040)  // 获取复制进程句柄权限
#define PROCESS_CREATE_PROCESS             (0x0080)  // 使用该进程的名义创建进程
#define PROCESS_SET_QUOTA                  (0x0100)  // 可以使用 SetProcessWorkingSetSize 设置内存限制
#define PROCESS_SET_INFORMATION            (0x0200)  // 设置进程相关信息，具体参见 MSDN
#define PROCESS_QUERY_INFORMATION          (0x0400)  // 询问进程相关信息，具体参见 MSDN
#define PROCESS_SUSPEND_RESUME             (0x0800)  // 挂起或恢复进程
#define PROCESS_QUERY_LIMITED_INFORMATION  (0x1000)  // 检索有关进程的某些信息，具体参见 MSDN
#define PROCESS_SET_LIMITED_INFORMATION    (0x2000)  // 设置有关进程的某些信息，具体参见 MSDN

#define STANDARD_RIGHTS_REQUIRED         (0x000F0000L) // 获取标准访问权限（参见 https://learn.microsoft.com/zh-cn/windows/win32/secauthz/standard-access-rights）

#define SYNCHRONIZE                      (0x00100000L) // 没看懂，MSDN 说的是：The right to use the object for synchronization. This enables a thread to wait until the object is in the signaled state.
```

什么？这些太多了？没事，贴心的 `winnt.h` 都帮你准备好了：

```cpp
#define PROCESS_ALL_ACCESS        (STANDARD_RIGHTS_REQUIRED | SYNCHRONIZE | \
                                   0xFFFF) // 所有访问权限，完全控制
```

比如，打开 $\mathrm{PID} = 30872$ 的进程并取得完全访问权限，但是不继承句柄：

```cpp
HANDLE hand = OpenProcess(PROCESS_ALL_ACCESS, FALSE, 30872);
```

# 读取进程内存空间

使用高贵的（bushi）`ReadProcessMemory` 函数，原型为：

```cpp
WINBASEAPI
_Success_(return != FALSE)
BOOL
WINAPI
ReadProcessMemory(
    _In_ HANDLE hProcess,
    _In_ LPCVOID lpBaseAddress,
    _Out_writes_bytes_to_(nSize,*lpNumberOfBytesRead) LPVOID lpBuffer,
    _In_ SIZE_T nSize,
    _Out_opt_ SIZE_T* lpNumberOfBytesRead
    );
```

一样的，展开部分宏/`typedef`：

```cpp
__declspec(dllimport) int __stdcall
ReadProcessMemory(
    HANDLE hProcess,
    const void *lpBaseAddress,
    void *lpBuffer,
    size_t nSize,
    size_t* lpNumberOfBytesRead
    );
```

`hProcess`：进程句柄。需要有 `PROCESS_VM_READ` 权限。

`lpBaseAddress`：读取的内存开始地址。

`lpBuffer`：要把读取到的内存存储到的缓冲区（我语文不好，勿喷）。

`nSize`：要读取的字节数。

`lpNumberOfBytesRead`：读取了多少个字节，存到这个指针指向的变量中。

返回值：调用是否成功。返回 $0$ 表示成功，非 $0$ 表示失败。如果失败会调用 `SetLastError` 设置对应错误码。

比如，读取 `hand` 句柄中的 `0x0061FF1C` 处的内存，读取 $1024$ 字节，读取到 `buffer` 中，读取字节数存入 `bytesread`，就是这样的：

```cpp
ReadProcessMemory(hand, (void*)0x0061FF1C, buffer, 1024, &bytesread);
```

当然，良好的习惯是判断返回值：

```cpp
if (!ReadProcessMemory(hand, (void*)0x0061FF1C, buffer, 1024, &bytesread)) // 失败
{
	// 错误处理
}
else // 正常
{
  // ...
}
```

# 注解