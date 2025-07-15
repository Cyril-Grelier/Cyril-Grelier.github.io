---
layout: post
title: "How I use VSCode for C projects"
categories: [vscode, c]
---

This post describes how I use [Visual Studio Code (VSCode)](https://code.visualstudio.com/) for small C projects, without external libs, to write, compile, debug, and organize C projects.

Most of this tutorial is oriented to use with VSCode but would work without installing any extension in [QtCreator](https://www.qt.io/product/development-tools) or [CLion](https://www.jetbrains.com/clion/) (I suppose, I haven't used them in a few years) or with [neovim](https://neovim.io/)/[vim](https://www.vim.org/)/[emacs](https://www.gnu.org/software/emacs/) with the right extensions. I don't know if all the extensions are available in [VSCodium](https://vscodium.com/).

If you have any suggestions, please let me know.

*[link to automated translation into French](https://cyril-grelier.github.io/vscode/c/2025/07/15/vscode_projet_c.html)*

## Summary

- [Summary](#summary)
- [Tools and Setup](#tools-and-setup)
- [Project Structure](#project-structure)
  - [Example Source Files (with bugs)](#example-source-files-with-bugs)
    - [`src/main.c`](#srcmainc)
    - [`src/utils.h`](#srcutilsh)
    - [`src/utils.c`](#srcutilsc)
- [Building and Running the Project](#building-and-running-the-project)
  - [`CMakeLists.txt`](#cmakeliststxt)
  - [Build and compile](#build-and-compile)
  - [Errors](#errors)
- [Makefile](#makefile)
- [Linter](#linter)
- [Formatting](#formatting)

## Tools and Setup

To work with C/C++ in VSCode, I use the following extensions :

- [C/C++ Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools-extension-pack)  
  > IntelliSense, debugging, build tasks, ...
- [Clang-Format](https://marketplace.visualstudio.com/items?itemName=xaver.clang-format)  
  > For automatic code formatting.

Other tools to install:

- [GCC](https://gcc.gnu.org/) for compilation (it also works with [Clang](https://clang.llvm.org/))
- [CMake](https://cmake.org/) to manage the project.
- [clang-format](https://clang.llvm.org/docs/ClangFormat.html) as formatter
- [clang-tidy](https://clang.llvm.org/extra/clang-tidy/) as linter
- [cppcheck](https://cppcheck.sourceforge.io/) as linter

On Linux and macOS, it should be easy to install.
On Windows, I recommend installing WSL (Windows Subsystem for Linux) to get a full Linux environment to [use in VSCode](https://code.visualstudio.com/docs/remote/wsl).

## Project Structure

The example project ([available here](/assets/data/my_c_project.zip)) is organized as follow:

```bash
my_c_project/
├── build/
├── .clang-format
├── .clang-tidy
├── CMakeLists.txt
├── Makefile
└── src/
    ├── main.c
    ├── utils.c
    └── utils.h
```

Yes, my .c files and .h files are in the same directory, .h files could also go in an `include` directory.

To open `my_c_project` in VSCode, you can use :

```bash
# unzip the archive
unzip my_c_project.zip
# go in the directory
cd my_c_project
# open with VSCode
code .
```

or right click on the folder `my_c_project` and "Open with code", if available, or "Open with another application" then "VSCode".

You must open the `my_c_project` in your code editor, not the `src` folder.

### Example Source Files (with bugs)

Here’s an example with bugs to show compile-time and runtime issues :

#### `src/main.c`

```c
#include <stdio.h>
#include <stdlib.h>

#include "utils.h"

int main(int argc, [[maybe_unused]] char *argv[argc + 1]) {

    printf("Hello!\n");

    int a = 5;
    int b = 6;

    int result = add(a, b);

    printf("%d + %d = %d\n", a, b, result);

    int *ptr = malloc(sizeof(int) * 10);

    // Buffer overflow: index 10 is out of bounds (0-9)
    // Sanitizer will detect it at runtime in debug mode
    ptr[10] = 42;

    // Memory leak: ptr is not freed
    return EXIT_SUCCESS;
}
```

#### `src/utils.h`

```c
#ifndef UTILS_H
#define UTILS_H

int add(int a, int b);

#endif // UTILS_H
```

#### `src/utils.c`

```c
#include "utils.h"

int add(int a, int b) {
    return a + b;
}
```

## Building and Running the Project

CMake will be in charge of building the project.

This is the `CMakeLists.txt` file that will build everything for us :

### `CMakeLists.txt`

```cmake
cmake_minimum_required(VERSION 3.22)
project(my_c_project LANGUAGES C)

# List all sources files
set(PROJECT_SOURCE_FILES
    ${CMAKE_SOURCE_DIR}/src/main.c
    ${CMAKE_SOURCE_DIR}/src/utils.c
)

# Use clang-tidy if available, you may need to edit this with the correct version of clang-tidy
find_program(CLANG_TIDY_EXE NAMES "clang-tidy-19" "clang-tidy")
if(CLANG_TIDY_EXE)
    message(STATUS "Found clang-tidy: ${CLANG_TIDY_EXE}")
    set(CMAKE_C_CLANG_TIDY "${CLANG_TIDY_EXE}")
endif()

# Use modern C
set(CMAKE_C_STANDARD 23)
set(CMAKE_C_STANDARD_REQUIRED ON)

# Default to Release if not specified
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE "Release")
endif()

# Detect compiler
if(CMAKE_C_COMPILER_ID MATCHES "Clang")
    set(COMPILER_IS_CLANG TRUE)
elseif(CMAKE_C_COMPILER_ID STREQUAL "GNU")
    set(COMPILER_IS_GCC TRUE)
endif()

# Enable LTO in Release mode
if(CMAKE_BUILD_TYPE MATCHES Release)
    set(CMAKE_INTERPROCEDURAL_OPTIMIZATION TRUE)

    if(COMPILER_IS_GCC)
        set(CMAKE_AR "gcc-ar")
        set(CMAKE_RANLIB "gcc-ranlib")
    endif()
endif()


# Base warning flags
set(WARN_FLAGS_COMMON
    -Wall
    -Wextra
    -Wshadow
    -Wcast-align
    -Wunused
    -Wpedantic
    -Wconversion
    -Wmisleading-indentation
    -Wnull-dereference
    -Wdouble-promotion
    -Wformat=2
    -Werror
)

add_executable(${PROJECT_NAME} ${PROJECT_SOURCE_FILES})

# Apply flags per configuration with conditional logic
target_compile_options(${PROJECT_NAME} PRIVATE
    # Common flags
    $<$<CONFIG:Debug>:${WARN_FLAGS_COMMON} -O0 -g -DDEBUG -fsanitize=address,undefined -fno-sanitize-recover=all>
    $<$<CONFIG:Release>:${WARN_FLAGS_COMMON} -O3 -DNDEBUG -flto=auto -s>
)

# Link sanitizers too for debug mode
target_link_options(${PROJECT_NAME} PRIVATE
    $<$<CONFIG:Debug>:-fsanitize=address,undefined -fno-sanitize-recover=all>
)
```

To summarize the content of the `CMakeLists.txt`:

- set the cmake version
- then we give a name to the project, here `my_c_project`, it will be the name of the executable in the `build` directory
- the following section should be updated as your project grows:

  ```cmake
    # List all sources files
    set(PROJECT_SOURCE_FILES
        ${CMAKE_SOURCE_DIR}/src/main.c
        ${CMAKE_SOURCE_DIR}/src/utils.c
    )
  ```

  add your future files here
- `find_program(CLANG_TIDY_EXE NAMES "clang-tidy-19" "clang-tidy")` will look for `clang-tidy` on your system, you may have to edit the line to use the right version (`clang-tidy-20` for example).
- then we specify the version of C to use, here C23
- if no build type is given, we default to Release. VSCode's CMake extension sets the build type explicitly, so this default only applies when running CMake manually (with `-DCMAKE_BUILD_TYPE=Debug` or `Release`).
- Then it select which compiler is in use (see `[Scan for kit]` in next section) or when running manually with `-DCMAKE_C_COMPILER=clang`/`gcc` or `CC=clang CFLAGS=... cmake -B build -DCMAKE_BUILD_TYPE=Debug`/`CC=gcc cmake -B build -DCMAKE_BUILD_TYPE=Debug`
- if the build is in release, enable LTO (Link Time Optimisation) to improve performance
- define warning flags
- add the compilation flags:
  - in debug: with sanitizers, debug symbols (`-g`) and without optimisations (`-O0`)
  - in release: with LTO and optimizations (`-O3`)

### Build and compile

To compile manually:

```bash
mkdir build
cd build || exit
cmake -DCMAKE_BUILD_TYPE=Release ..
make -j
```

To compile in VSCode (if you installed the [extensions](#tools-and-setup)), you should see this bar on the bottom of the screen :

![CMake Kits Build and Run](/assets/images/c_project_vscode/cmake_build_bar.png)

If it's not here while you have a `CMakeLists.txt` in the folder, click on `ctrl+shift+p` then write "reload window" then `enter`, or close and re-open VSCode in the folder, and it should show up.

On the screenshot, after the crossed tools you can see `[GCC 13.1.0x86_64-linux-gnu]` it could be possible that you have something like `[Scan for kits]`, you can click it to open a dropdown window at the top of VSCode :

![Scan for kits](/assets/images/c_project_vscode/scan_for_kits.png)

If there is nothing under `[Unspecified]`, click on `[Scan for kits]` and if you have `gcc` or `clang` installed on your system, they should be listed here, pick the most recent version of GCC, here `GCC 13...` or `Clang 19`.

Once one is selected, click on `build`, this will build the project and show warnings.

With the buggy code I gave you, if `clang-tidy` is found (have to be installed first, and if the package name is `clang-tidy` or `clang-tidy-VERSION`, edit the line ̀`find_program(CLANG_TIDY_EXE NAMES "clang-tidy-19")` with the right version), it should show the following warning, about `ptr` that is not freed :

```text
[build] /tmp/my_c_project/src/main.c:24:5: warning: Potential leak of memory pointed to by 'ptr' [clang-analyzer-unix.Malloc]
[build]    24 |     return EXIT_SUCCESS;
[build]       |     ^
[build] /tmp/my_c_project/src/main.c:17:16: note: Memory is allocated
[build]    17 |     int *ptr = malloc(sizeof(int) * 10);
[build]       |                ^~~~~~~~~~~~~~~~~~~~~~~~
[build] /tmp/my_c_project/src/main.c:24:5: note: Potential leak of memory pointed to by 'ptr'
[build]    24 |     return EXIT_SUCCESS;
[build]       |     ^
```

Even with this error, the code compiled anyway (in practice, correct the warnings, for the example, we leave them).

To run the code, you have 2 options on the right of the `build` button:

![CMake Kits Build and Run](/assets/images/c_project_vscode/cmake_build_bar.png)

- the bug icon : to launch with the debugger
- the "play" icon : to launch in the terminal

When you execute with the debugger, the execution will stop on the break points that you can set by clicking on the left of the line number, assertions error and some other errors.

When you run on the terminal, the effect will be the same as :

```bash
cd build
./my_c_project
```

### Errors

As you can see in the main file, on line 21, `ptr` is modified outside of its bounds, this will trigger the sanitizers and show an error :

```console
==140758==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x604000000038 at pc 0x59b9894da3a4 bp 0x7ffdd8ae5e20 sp 0x7ffdd8ae5e10
WRITE of size 4 at 0x604000000038 thread T0
    #0 0x59b9894da3a3 in main /tmp/my_c_project/src/main.c:21
    #1 0x7c4557e29d8f in __libc_start_call_main ../sysdeps/nptl/libc_start_call_main.h:58
    #2 0x7c4557e29e3f in __libc_start_main_impl ../csu/libc-start.c:392
    #3 0x59b9894da1c4 in _start (/tmp/my_c_project/build/my_c_project+0x11c4) (BuildId: b4c1263f080d2c962e39c92f6893508348192044)
...
...
...
```

On some run it may print on the console `AddressSanitizer:DEADLYSIGNAL` again and again, just stop it with `Ctrl+C` then run again, after few times it stop normally (a [fix](https://stackoverflow.com/questions/78136716/addresssanitizerdeadlysignal-from-fsanitize-address-flag) might be possible, haven't tried it)

## Makefile

I added a make file to simplify manual calls :

```console
> make help
Available targets:
  build          - Clean and build in Debug mode
  build-release  - Clean and build in Release mode
  clean          - Remove build directory
  lint           - Run clang-tidy and cppcheck
  format         - Format source code using clang-format
  run            - Run the compiled binary
  help           - Show this help message
```

- `make build`/`build-release` will remove the `build` folder and compile.
- `make clean` will remove the `build` folder.
- `make lint` will call `clang-tidy` and `cppcheck`
- `make format` will call `clang-format`
- `make run` will run the program

## Linter

Linters, like [`clang-tidy`](https://clang.llvm.org/extra/clang-tidy/) or [`cppcheck`](https://cppcheck.sourceforge.io/), are useful to detect bugs in the code statically that compiler errors can't find.

`clang-tidy` is automatically run during compilation (if executable is found), `cppcheck` can be call through the `make lint` command.

## Formatting

Clang-Format is used to auto-format code.
The `.clang-format` config file ensures a consistent style across all files and across different projects, its a LLVM style with the following edits :

- `AllowShortEnumsOnASingleLine: true` -> `false`
- `AllowShortFunctionsOnASingleLine: All` -> `None`
- `AllowShortLambdasOnASingleLine: All` -> `None`
- `BinPackArguments: true` -> `false`
- `BinPackParameters: true` -> `false`
- `ConstructorInitializerAllOnOneLineOrOnePerLine: false` -> `true`
- `IndentWidth: 2` -> `4`

You can format your code using:

```bash
clang-format -i src/*.c src/*.h
```

or with the `make format` command.

Or automatically on save using the VSCode extension for `clang-format`.
You might have to check the `format on save` parameter in the settings and choose `clang-format` as default formatter, hit `Ctrl+Shift+P` then type `format document with` then select `Configure Default Formatter` then `Clang-Format`.
