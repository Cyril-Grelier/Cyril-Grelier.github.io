---
layout: post
title: "Comment j'utilise VSCode pour les projets C"
categories: [vscode, c]
---

Cet article décrit comment j'utilise [Visual Studio Code (VSCode)](https://code.visualstudio.com/) pour de petits projets C, sans bibliothèques externes, pour écrire, compiler, déboguer et organiser des projets C.

Ce tutoriel est orienté pour une utilisation avec VSCode mais fonctionnerait sans installer d'extension dans [QtCreator](https://www.qt.io/product/development-tools) ou [CLion](https://www.jetbrains.com/clion/) (je suppose, je ne les ai pas utilisés depuis plusieurs années) ou avec [neovim](https://neovim.io/)/[vim](https://www.vim.org/)/[emacs](https://www.gnu.org/software/emacs/) avec les bonnes extensions. Je ne sais pas si toutes les extensions sont disponibles dans [VSCodium](https://vscodium.com/).

Si vous avez des suggestions, n'hésitez pas à me les faire savoir.

*traduit automatiquement de la [version anglaise](https://cyril-grelier.github.io/vscode/c/2025/07/15/vscode_c_project.html)*

## Sommaire

- [Sommaire](#sommaire)
- [Outils et Configuration](#outils-et-configuration)
- [Structure du Projet](#structure-du-projet)
  - [Exemple de Fichiers Source (avec bugs)](#exemple-de-fichiers-source-avec-bugs)
    - [`src/main.c`](#srcmainc)
    - [`src/utils.h`](#srcutilsh)
    - [`src/utils.c`](#srcutilsc)
- [Construction et Exécution du Projet](#construction-et-exécution-du-projet)
  - [`CMakeLists.txt`](#cmakeliststxt)
  - [Construire et Compiler](#construire-et-compiler)
  - [Erreurs](#erreurs)
- [Makefile](#makefile)
- [Linter](#linter)
- [Formattage](#formattage)


## Outils et Configuration

Pour travailler avec C/C++ dans VSCode, j'utilise les extensions suivantes :

- [C/C++ Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools-extension-pack)
  > IntelliSense, débogage, tâches de compilation, ...
- [Clang-Format](https://marketplace.visualstudio.com/items?itemName=xaver.clang-format)
  > Pour le formatage automatique du code.

Autres outils à installer :

- [GCC](https://gcc.gnu.org/) pour la compilation (cela fonctionne aussi avec [Clang](https://clang.llvm.org/))
- [CMake](https://cmake.org/) pour gérer le projet.
- [clang-format](https://clang.llvm.org/docs/ClangFormat.html) comme formateur
- [clang-tidy](https://clang.llvm.org/extra/clang-tidy/) comme linter
- [cppcheck](https://cppcheck.sourceforge.io/) comme linter

Sur Linux et macOS, cela devrait être facile à installer. Sur Windows, je recommande d'installer WSL (Windows Subsystem for Linux) pour obtenir un environnement Linux complet à [utiliser dans VSCode](https://code.visualstudio.com/docs/remote/wsl).

## Structure du Projet

Le projet exemple ([disponible ici](/assets/data/my_c_project.zip)) est organisé comme suit :

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

Oui, mes fichiers .c et .h sont dans le même répertoire, les fichiers .h pourraient également aller dans un répertoire `include`.

Pour ouvrir `my_c_project` dans VSCode, vous pouvez utiliser :

```bash
# décompresser l'archive
unzip my_c_project.zip
# aller dans le répertoire
cd my_c_project
# ouvrir avec VSCode
code .
```

ou faites un clic droit sur le dossier `my_c_project` et "Ouvrir avec code", si disponible, ou "Ouvrir avec une autre application" puis "VSCode".

Vous devez ouvrir `my_c_project` dans votre éditeur de code, pas le dossier `src`.

### Exemple de Fichiers Source (avec bugs)

Voici un exemple avec des bugs pour montrer les problèmes à la compilation et à l'exécution :

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

## Construction et Exécution du Projet

CMake sera responsable de la construction du projet.

Voici le fichier `CMakeLists.txt` qui construira tout pour nous :

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

Pour résumer le contenu du `CMakeLists.txt` :

- définir la version de cmake
- puis nous donnons un nom au projet, ici my_c_project, ce sera le nom de l'exécutable dans le répertoire build
- la section suivante doit être mise à jour à mesure que votre projet grandit :

  ```cmake
    # List all sources files
    set(PROJECT_SOURCE_FILES
        ${CMAKE_SOURCE_DIR}/src/main.c
        ${CMAKE_SOURCE_DIR}/src/utils.c
    )
  ```

   ajoutez vos futurs fichiers ici
- `find_program(CLANG_TIDY_EXE NAMES "clang-tidy-19" "clang-tidy")` recherchera clang-tidy sur votre système, vous devrez peut-être modifier la ligne pour utiliser la bonne version (`clang-tidy-20` par exemple).
- puis nous spécifions la version de C à utiliser, ici C23
- si aucun type de build n'est donné, nous utilisons Release par défaut. L'extension CMake de VSCode définit explicitement le type de build, donc ce défaut ne s'applique que lorsque CMake est exécuté manuellement (avec `-DCMAKE_BUILD_TYPE=Debug` ou `Release`).
- Ensuite, il sélectionne quel compilateur est utilisé (voir `[Scan for kit]` dans la section suivante) ou lors d'une exécution manuelle avec `-DCMAKE_C_COMPILER=clang`/`gcc` ou `CC=clang CFLAGS=... cmake -B build -DCMAKE_BUILD_TYPE=Debug`/`CC=gcc cmake -B build -DCMAKE_BUILD_TYPE=Debug`
- si la build est en release, active LTO (Link Time Optimisation) pour améliorer les performances
- définir les drapeaux d'avertissement
- ajouter les drapeaux de compilation :
  - en mode débogage : avec les sanitizers, les symboles de débogage (`-g`) et sans optimisations (`-O0`)
  - en mode release : avec LTO et optimisations (`-O3`)

### Construire et Compiler

Pour compiler manuellement :

```bash
mkdir build
cd build || exit
cmake -DCMAKE_BUILD_TYPE=Release ..
make -j
```

Pour compiler dans VSCode (si vous avez installé les [extensions](#outils-et-configuration)), vous devriez voir cette barre en bas de l'écran :

![CMake Kits Build and Run](/assets/images/c_project_vscode/cmake_build_bar.png)

Si elle n'est pas là alors que vous avez un `CMakeLists.txt` dans le dossier, cliquez sur `ctrl+shift+p` puis tapez `reload window` puis enter, ou fermez et rouvrez VSCode dans le dossier, et elle devrait apparaître.

Sur la capture d'écran, après les outils croisés, vous pouvez voir `[GCC 13.1.0x86_64-linux-gnu]`, il est possible que vous ayez quelque chose comme `[Scan for kits]`, vous pouvez cliquer dessus pour ouvrir une fenêtre déroulante en haut de VSCode :

Si rien n'apparaît sous `[Unspecified]`, cliquez sur `[Scan for kits]` et si vous avez `gcc` ou `clang` installé sur votre système, ils devraient être listés ici, choisissez la version la plus récente de GCC, ici `GCC 13...` ou `Clang 19`.

Une fois qu'une option est sélectionnée, cliquez sur le bouton `build`, cela construira le projet et affichera les avertissements.

Avec le code bogué que je vous ai donné, si `clang-tidy` est trouvé (il doit être installé, et si le nom du paquet est `clang-tidy` ou `clang-tidy-VERSION`), il devrait afficher l'avertissement suivant, concernant `ptr` qui n'est pas libéré :

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

Même avec cette erreur, le code est compilé quand même (en principe, corrigez les warning, pour l'exemple des bugs, nous les laissons).

Pour exécuter le code, vous avez 2 options à droite du bouton `build` :

![CMake Kits Build and Run](/assets/images/c_project_vscode/cmake_build_bar.png)

- l'icône d'insecte : pour lancer avec le débogueur
- l'icône "play" : pour lancer dans le terminal

Lorsque vous exécutez avec le débogueur, l'exécution s'arrêtera sur les points d'arrêt que vous pouvez définir en cliquant à gauche du numéro de ligne, les erreurs d'assertion et certaines autres erreurs.

Lorsque vous exécutez dans le terminal, l'effet sera le même que :

```bash
cd build
./my_c_project
```

### Erreurs

Comme vous pouvez le voir dans le fichier principal, à la ligne 21, `ptr` est modifié en dehors de ses limites, cela déclenchera les sanitizers et affichera une erreur :

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

Lors de certaines exécutions, il peut imprimer sur la console `AddressSanitizer:DEADLYSIGNAL` encore et encore, arrêtez-le simplement avec `Ctrl+C` puis exécutez à nouveau, après quelques fois, il s'arrête normalement (une [solution](https://stackoverflow.com/questions/78136716/addresssanitizerdeadlysignal-from-fsanitize-address-flag) pourrait être possible, je ne l'ai pas essayée).

## Makefile

J'ai ajouté un fichier makefile pour simplifier les appels à la main :

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

- `make build`/`build-release` supprimera le dossier `build` et compilera.
- `make clean` supprimera le dossier `build`.
- `make lint` appellera clang-tidy et cppcheck
- `make format` appellera clang-format
- `make run` exécutera le programme

## Linter


Les linters, comme [`clang-tidy`](https://clang.llvm.org/extra/clang-tidy/) ou [`cppcheck`](https://cppcheck.sourceforge.io/), sont utiles pour détecter des bugs dans le code de manière statique que les erreurs de compilation ne peuvent pas trouver.

`clang-tidy` est automatiquement exécuté pendant la compilation (si l'exécutable est trouvé), `cppcheck` peut être appelé via la commande `make lint`.

## Formattage

Clang-Format est utilisé pour auto-formater le code.

Le fichier de configuration `.clang-format` assure un style cohérent à travers tous les fichiers et à travers différents projets.

Dans ce projet, j'ai ajouté un fichier avec le style LLVM avec les modifications suivantes :

- `AllowShortEnumsOnASingleLine: true` -> `false`
- `AllowShortFunctionsOnASingleLine: All` -> `None`
- `AllowShortLambdasOnASingleLine: All` -> `None`
- `BinPackArguments: true` -> `false`
- `BinPackParameters: true` -> `false`
- `ConstructorInitializerAllOnOneLineOrOnePerLine: false` -> `true`
- `IndentWidth: 2` -> `4`

Vous pouvez formater votre code en utilisant :

```bash
clang-format -i src/*.c src/*.h
```

ou avec la commande `make format`.

Ou automatiquement à la sauvegarde en utilisant l'extension VSCode pour clang-format.

Vous devrez peut-être vérifier le paramètre `format on save` dans les paramètres et choisir `clang-format` comme formateur par défaut, appuyez sur `Ctrl+Shift+P` puis tapez `format document with` puis sélectionnez `Configure Default Formatter` puis `Clang-Format`.
