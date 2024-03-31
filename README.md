
![](https://s2.loli.net/2023/03/08/Mp6stlRvqrm2WSO.png)

![微信公众号.png](https://s2.loli.net/2024/03/31/MHE1CD3WtP2nUOQ.jpg)

## 此仓库说明

此仓库代码为基于YeIM-Uni-SDK的Electron桌面端案例，实现了基本的聊天功能

YeIM-Uni-SDK是一款基于UniAPP的开源聊天SDK，可为项目快速接入聊天功能，想了解YeIM-Uni-SDK可查看：https://github.com/wzJun1/YeIM-Uni-SDK

## 注意

`此为社区开源项目，用于学习YeIM-Uni-SDK、技术交流使用，禁止用于非法途径，禁止商用。如作他用所造成的一切法律责任均不由作者承担。` 

 

## 下载演示版本

Windows或MacOS可下载发行版测试：

[https://github.com/wzJun1/YeIM-Uni-SDK-Electron-Demo/releases](https://github.com/wzJun1/YeIM-Uni-SDK-Electron-Demo/releases)


## 编译运行

### 下载源代码

```shell
git clone https://github.com/wzJun1/YeIM-Uni-SDK-Electron-Demo
```

### 安装依赖

```shell
npm run install
```

或者

```shell
npm i
```

### 编译H5

需要配合[YeIM-Uni-SDK](https://github.com/wzJun1/YeIM-Uni-SDK "YeIM-Uni-SDK")，请先搭建。

随后在src/main.ts中修改baseURL和socketURL

```shell
npm run build:h5
```

或者开启调试模式，调试H5需要在electron/main.js中修改加载的url

```shell
npm run dev:h5
```

### 运行Electron

```shell
npm run dev:electron
```

### 打包Electron发行版

```shell
npm run make
```
 

## 反馈与共建

- 普通交流QQ群：[391276294](https://qm.qq.com/cgi-bin/qm/qr?k=hEQnVRj3c1B0gDpD2QJrD7UIfWMzCUuM&jump_from=webapi&authKey=kbrD7NHXGIPaiVb2puw+vJeRCIQSXVhIci7eFvFLBH/UjGt+hrdOk4upK731S+1+)
