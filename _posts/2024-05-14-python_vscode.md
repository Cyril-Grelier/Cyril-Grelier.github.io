---
layout: post
title: "How to create a Python project with VSCode and GitHub"
categories: [python, vscode, github]
---

This post is a guide to help you create a new Python project with its own virtual environment using VSCode/VSCodium and GitHub.

- [Introduction](#introduction)
- [Installing VSCode Python extensions](#installing-vscode-python-extensions)
- [Creating a new repository on github](#creating-a-new-repository-on-github)
- [Cloning the repository on your computer through VSCode](#cloning-the-repository-on-your-computer-through-vscode)
- [Creating a Python environment](#creating-a-python-environment)
- [Coding!](#coding)

# Introduction


This guide aims to assist you in setting up a Python project with its own virtual environment using VSCode/VSCodium and GitHub.
The goal is not to go into exhaustive details of the tools, but to provide a quick start to create a new Python project and manage it with Git.
I strongly recommend to use Git even when working alone, as it helps in tracking changes and provides a backup of your code.
You wouldn't want to lose weeks of work due to a computer crash!

First, ensure you have the following installed:
- [Git](https://git-scm.com/)
- [Python](https://www.python.org/)
- [VSCode](https://code.visualstudio.com/) or [VSCodium](https://vscodium.com/)

Alternatives exist for each of these tools.

For the code editor, [PyCharm](https://www.jetbrains.com/pycharm/), [Vim](https://www.vim.org/),  [Neovim](https://neovim.io/), [Emacs](https://www.gnu.org/software/emacs/), or many others can be used.
However, tools with features like syntax highlighting, code completion, linting, git integration, and debugging capabilities are preferred.
PyCharm comes with a lot of features out of the box, VSCode/VSCodium will require some extensions, Vim/NeoVim and Emacs will require a lot of configuration and time to learn the basics and to obtain the same features as the other tools.
Personally, I use VSCode because I can easily switch between Python, C++, and other languages without having to spend a lot of time configuring it.

For version control, GitLab, Bitbucket, or other alternatives can also be used.

For managing Python environments, this guide utilizes the [built-in `venv` module](https://docs.python.org/3/library/venv.html). Alternatives like [virtualenv](https://virtualenv.pypa.io/en/latest/), [conda](https://docs.conda.io/en/latest/), or [poetry](https://python-poetry.org/) exist.
Personally, I use `venv` because it is built-in and easy to use.


Other resources such as [The Hitchhiker’s Guide to Python](https://docs.python-guide.org/), [Real Python](https://realpython.com/), or [Python.org](https://docs.python.org/3/) to learn more about Python, its ecosystem, and best practices (how to structure your project, how to write tests, how to document your code, etc.).
There are also a lot of tools to help you organize your project and write better and cleaner code :
- [Black](https://black.readthedocs.io/en/stable/) for code formatting.
- [Mypy](https://mypy.readthedocs.io/en/stable/) for static type checking.
- [Pylint](https://pylint.pycqa.org/en/latest/) for linting.
- [Isort](https://pycqa.github.io/isort/) for import sorting.
- [Ruff](https://github.com/astral-sh/ruff) for linting and code formatting.
- [CookieCutter](https://github.com/cookiecutter/cookiecutter) for project templating.
- and many others...

# Installing VSCode Python extensions

- Open VSCode.
- On the left, click on the Extensions icon (four squares icon).
- Search for "Python" and install the "Python Extension Pack".
- You can also install other extensions like "Black Formatter", "Python Type Hint", or "Pylint".

You can search for other extensions that you might find useful.


# Creating a new repository on github

- Log in to [GitHub](https://github.com/).
- Click on the "New" button (green on the top left).
- Choose a name for your repository (e.g. `my_project`), add a description, and configure privacy settings (public or private, you can change it later).
- Check "Add a README file" and add a gitignore file for Python.
- Select the license you want to use (e.g. MIT).
- Click on "Create repository".

Your new repository is now set up on GitHub.

# Cloning the repository on your computer through VSCode

- In VSCode, open the [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) (Ctrl+Shift+P on Linux), type `git clone`, and select `Git: Clone`.
- Choose "Clone from github".
- Enter your github credentials.
- Select the repository you want to clone (e.g. `your_github_name/my_project`, it should be the first one in the list).
- Choose a local folder for cloning (this will create a new folder with the name of your repository inside the selected folder).
- You have now cloned the repository on your computer.
- VSCode will ask you if you want to open the repository, click on "Open".

You have now opened the repository in VSCode.
You can see the README.md, .gitignore, and LICENSE files in the Explorer on the left.

You can then create files and add send them to the repository with git.
Look at [this video tutorial](https://code.visualstudio.com/docs/sourcecontrol/overview) to learn how to use git in VSCode (staging, committing, pushing, pulling, etc.).
It is also possible to create the repository locally then publish it on github.
I proposed to do it from github because it comes directly with a README.md, a gitignore file, and a license file.

# Creating a Python environment

- Open the terminal in VSCode (On the top menu, click on "Terminal" -> "New Terminal", the shortcut should be indicated here).
- Check the path to the python interpreter path you are currently using with `which python3`, probably `/usr/bin/python3.xx`.
- Create a virtual environment in a `venv` folder with `python3 -m venv venv`, you can specify the exact python version by using `python3.11` or `python3.12` depending on the version installed on your computer.
- Activate the virtual environment with the command : `source venv/bin/activate` (on Windows, the command should be `venv\Scripts\activate`).
- You should see `(venv)` at the beginning of the command line, this means you are now using the python interpreter from the virtual environment.
- Check the path to the python interpreter path you are currently using with `which python3`, the result should be `/path_to_current_directory/venv/bin/python3`. This means you are using the python interpreter from the virtual environment, installing packages with `pip` will install them in this virtual environment and not in the system python.
- You can upgrade `pip` with the command : `pip install --upgrade pip`.

You can now install the dependencies of your project with `pip`.
If you want to install a package, for example [black](https://black.readthedocs.io/en/stable/), you can do it with the command `pip install black`. The package will be installed in the virtual environment.
But if you only use `pip install package` and someone else clones your repository, they will not have the package installed as the virtual environment is not committed to the repository (it is in the `.gitignore` file, see [this stackoverflow question](https://stackoverflow.com/questions/6590688/is-it-bad-to-have-my-virtualenv-directory-inside-my-git-repository) for more information on this topic).
To avoid this, you can create a `requirements.txt` file with the command `pip freeze > requirements.txt` and commit it to your repository.
This file will list all the dependencies of your project and their versions, for tools like black or mypy that you normally don't directly use in your code, you can remove the version number to install the latest version, but for libraries that you use in your code, it is better to specify the version number.
You can then install the dependencies with the command `pip install -r requirements.txt`.

In the README.md file, you can add a section "Install dependencies" with the commands to create the virtual environment and install the dependencies.


# Coding!

You can now start coding your project.
You can take a look at the [section on the structure of a project on the hitchhiker's guide to python](https://docs.python-guide.org/writing/structure/) to have an idea on how to organize your project.

After few minutes of coding (or seconds if you are very efficient!), you will probably have some bugs in your code.
You can use the debugger of VSCode to help you find and fix them.
The [docs on debugging python in VSCode](https://code.visualstudio.com/docs/python/debugging) should help you to get started with the debugger.
