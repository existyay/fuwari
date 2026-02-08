---

title: windows终端美化指北
published: 2026-02-08
description: 'Windows Terminals + Oh-my-posh + 右键reg'
image: ''
tags: [Technology]
category: '技术'
draft: false 
lang: 'zh-cn'
---

# 安装所需的软件

## Step1 Winget or chocolatey

**winget**(安装详情参考https://learn.microsoft.com/zh-cn/windows/package-manager/winget/)

注意你的windows版本

原版的windows没有关闭自动更新，没有精简，没有任何其他操作且是windows10 1809以上可以使用自带的**powershell5+** 管理员模式输入

~~~bash
Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe
~~~

来进行安装

一般特殊的版本例如预览版或者企业版可以使用https://aka.ms/getwingetpreview进行安装

如果winget死活装不上请修复windows store程序并使用修复脚本进行安装(针对ltsc和一些特殊版本)

> [!NOTE]
>
> https://github.com/IceLoveYer/LTSC-Add-MicrosoftStore
>
> 蓝奏云 https://wwbgw.lanzouv.com/iN1Zx3i0yp7i 密码:5wgn

并且打开cmd进行清理对应的windows缓存

~~~bash
wsreset.exe
~~~

安装之后可以在**powershell5+** or **cmd**中进行**powershell7**的安装

~~~bash
winget install --id Microsoft.PowerShell --source winget
~~~

> [!NOTE]
>
> 也可以使用msi包进行安装或者使用zip包中的appx**切记安装证书**
>
> https://github.com/PowerShell/PowerShell/releases/download/v7.5.4/PowerShell-7.5.4-win-x64.msi
>
> https://github.com/PowerShell/PowerShell/releases/download/v7.5.4/PowerShell-7.5.4-win-x64.zip

> [!IMPORTANT]
>
> **chocolatey使用node在安装过程中安装并勾选即可，最简单最快捷，并且附带python环境，自动设置对应的环境变量和目录**

## Step2 Window terminal

安装window terminal也是切记有证书先安装证书链接为

https://github.com/microsoft/terminal/releases/download/v1.23.20211.0/Microsoft.WindowsTerminal_1.23.20211.0_8wekyb3d8bbwe.msixbundle_Windows10_PreinstallKit.zip

或者使用**winget**进行安装

~~~bash
winget install --id Microsoft.WindowsTerminal -e
~~~

> [!Note] 
>
> (可选):对于自己的windows terminal进行**设置右键打开和图标注册表文件**
>
> ~~~reg
> Windows Registry Editor Version 5.00
> 
> [HKEY_CLASSES_ROOT\Directory\Background\shell\wt]
> @="Windows Terminal Here"
> "Icon"="%USERPROFILE%\\AppData\\Local\\Terminal\\terminal.ico"
> 
> [HKEY_CLASSES_ROOT\Directory\Background\shell\wt\command]
> @="C:\\Users\\your_username\\AppData\\Local\\Microsoft\\WindowsApps\\wt.exe"
> ~~~
> 对应目录的ico文件地址为https://github.com/microsoft/terminal/blob/main/res/terminal.ico

> [!IMPORTANT]
>
> 右键在此打开，打开的却不是该文件夹
>
> 两种处理办法，新版terminal已经提供了更为方便的方法，在terminal设置的对应命令行启动目录选项中直接勾选使用父进程目录即可
>
> 或者使用vscode打开对应的配置文件(点击小齿轮)将其中的
>
> ~~~json
> "startingDirectory": "%USERPROFILE%"
> ~~~
>
> 改为
>
> ~~~json
> "startingDirectory": null
> ~~~
>
> 注意null没有双引号

## Step3 Oh-my-posh安装

打开**WindowsTerminal**敲入以下命令安装**oh-my-posh**

~~~bash
winget install JanDeDobbeleer.OhMyPosh --source winget
~~~

或者

~~~bash
Set-ExecutionPolicy Bypass -Scope Process -Force; Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://ohmyposh.dev/install.ps1'))
~~~

对应的oh-my-posh字体安装 可以使用ctrl+c取消安装你会得到一行命令like:No need to install a new font? That's cool.

~~~bash
oh-my-posh font install
~~~

选择你喜欢的font进行安装对应的字体列表https://www.nerdfonts.com/font-downloads

然后在终端中的设置中将默认值中的外观使用成对应的字体 选择显示所有字体安装你刚刚install的字体 更改默认启动为powershell7

> [!NOTE]
>
> (可选):可以对于终端进行透明化并且自定义你的终端壁纸、取消标题栏设置和取消勾选隐藏标题栏你将得到一个干净的终端(但是你右键点击设置会发现一些难绷的微软特有的bug)

初始化oh-my-posh，在你的对应使用的终端中注册并初始化oh-my-posh

~~~bash
oh-my-posh get shell
~~~

新建PROFILE配置文件

~~~
New-Item -Path $PROFILE -Type File -Force
~~~

然后进行编辑

~~~
notepad $PROFILE
~~~

在打开的文件中输入

~~~
oh-my-posh init pwsh | Invoke-Expression
~~~

## Step4 Profile For Theme

Profile的配置方式有多种

- 本地的配置方法

  ```powershell
  --config 'C:/Users/Posh/myconfig.omp.json'
  ```

- 或者直接指向对应的主题名

  ```powershell
  --config 'jandedobbeleer'
  ```

- 或者使用远程的仓库

  ```powershell
  --config 'https://raw.githubusercontent.com/JanDeDobbeleer/oh-my-posh/main/themes/jandedobbeleer.omp.json'
  ```

> [!NOTE]
>
> 注意直接指向和远程仓库都需要获取远程的代码因此加载可能会有所缓慢

对于本地的地址因为使用winget，获取到的oh-my-push文件不是在大家所说对应的目录 可以使用geek查看对应的目录下json主题文件

> [!CAUTION]
>
> 对应的Get-PoshThemes已经弃用，可以使用https://ohmyposh.dev/docs/themes地址查看对应的主题预览

配置参考

~~~bash
oh-my-posh init pwsh --config 'C:\Program Files\WindowsApps\ohmyposh.cli_29.2.0.0_x64__xxxxxxxxxx\themes\peru.omp.json' | Invoke-Expression
~~~

## Step4 If update

~~~bash
winget upgrade JanDeDobbeleer.OhMyPosh --source winget
~~~

或者

~~~bash
Set-ExecutionPolicy Bypass -Scope Process -Force; Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://ohmyposh.dev/install.ps1'))
~~~

## Step5 Finish Enjoy :)