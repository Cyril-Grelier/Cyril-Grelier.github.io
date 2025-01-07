---
layout: post
title: "How to Use AMPL in VSCode"
categories: [ampl, vscode]
---

This post is a guide to help you set up Visual Studio Code (VSCode) to write and run AMPL code if you cannot use the AMPL IDE on your computer.

- [Install VSCode](#install-vscode)
- [Install AMPL](#install-ampl)
- [Install the AMPL Extensions for VSCode](#install-the-ampl-extensions-for-vscode)
- [Configure the AMPL Path](#configure-the-ampl-path)
- [Write and Run AMPL Code](#write-and-run-ampl-code)

## Install VSCode

<a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> is a free source code editor developed by Microsoft. You can download and install it from the official website.

## Install AMPL

<a href="https://ampl.com/" target="_blank">AMPL</a> (A Mathematical Programming Language) is a modeling language for mathematical programming.
Download and install it from the official website.
If you are a student from Les Mines Nancy, use the link available on arche to create an account with your university email (`@etud.univ-lorraine.fr`) for a free student license.

## Install the AMPL Extensions for VSCode

To install the AMPL extensions in VSCode, follow these steps (see the image below):

1. Click the Extensions icon on the left side of the VSCode window.
2. Search for "AMPL" in the search bar.
3. Install the following extensions by clicking `Install`:
   - <a href="https://marketplace.visualstudio.com/items?itemName=michael-sundvick.ampl" target="_blank">AMPL by Michael Sundvick</a> – Adds a button to run AMPL files.
   - <a href="https://marketplace.visualstudio.com/items?itemName=johan-cho.ampl-vscode" target="_blank">AMPL for VSCode by Johan Cho</a> – Provides syntax highlighting and definitions on hover.

![AMPL Extension Installation](/assets/images/ampl_vscode/install.png)

## Configure the AMPL Path

To use AMPL in VSCode, configure the path to the AMPL executable:

- Open the settings in VSCode using:
  - `Ctrl + ,` (keyboard shortcut), or
  - `File > Preferences > Settings`, or
  - Click the gear icon in the bottom-left corner and select `Settings`. (1 and 2 in the image below)
- Search for "AMPL" in the settings search bar. (3 in the image below)
- Set the path to the AMPL executable in the `Ampl: Executable Path` field.  
  Example paths:
  - `C:\ampl\ampl.exe` (Windows)
  - `/home/YOUR_PATH/amplide.linux64/ampl.linux-intel64/ampl` (Linux)
- Optionally, check the box `Ampl: Use Relative Path` to use a relative path.

![AMPL Path Configuration](/assets/images/ampl_vscode/setting.png)

## Write and Run AMPL Code

Follow these steps to write and run AMPL code (if you are a student from Les Mines Nancy):

1. Download the archive `ampl_exercices.zip` from arche and extract it.
2. Open the extracted folder in VSCode:
   - Use the menu: `File > Open Folder`.
   - Alternatively, in the terminal, navigate to the folder and type `code .`
3. View the folder contents in the Explorer panel on the left side of the VSCode window.
4. Open the files `e0_1_farmer.run` and `e0_1_farmer.mod`.
5. Arrange the tabs to view the code side by side if needed.
6. In the top-right corner of the `e0_1_farmer.run` file, click the button `AMPL: Include File` to run the file with AMPL.
7. A terminal will open, displaying the results of the execution.

![Running AMPL Exercises](/assets/images/ampl_vscode/exercices.png)

If you are not a student from Les Mines Nancy, you can follow this steps :

1. Create a folder and open it in VSCode.
2. Create a new file `prod0.mod` and write the following code (from the <a href="https://ampl.com/learn/ampl-book/" target="_blank">AMPL book</a>):

    ```ampl
   # Variables
   var XB;
   var XC;
   
   # Objective Function
   maximize Profit: 25 *XB + 30* XC;
   
   # Constraints
   subject to Time: (1/200) *XB + (1/140)* XC <= 40;
   subject to B_limit: 0 <= XB <= 6000;
   subject to C_limit: 0 <= XC <= 4000;
    ```

3. Create a new file `prod0.run` and write the following code:

    ```ampl
   reset;
   
   model prod0.mod;
   
   option solver gurobi;
   solve;
   
   display XB, XC;
    ```

4. Click the button `AMPL: Include File` in the top-right corner of the `prod0.run` file to run the file with AMPL.
5. A terminal will open, displaying the results of the execution :

    ```console
    Gurobi 12.0.0: optimal solution; objective 192000
    1 simplex iteration
    XB = 6000
    XC = 1400
    ```
