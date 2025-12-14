# X浏览器书签同步助手

[English](README-en.md) | [中文](README.md)

一个专为X浏览器设计的 Chrome/Firefox 扩展程序，可以运行在任何支持 Chrome/Firefox 扩展的浏览器上，支持本地书签与云端的双向同步。

## 功能特性

极简设计，只提供最基本的书签同步功能，登录X浏览器账户后即可使用。如果你有多个PC浏览器也可以使用X浏览器的账户在多个PC浏览器设备上同步书签。

![alt text](assets/images/chrome-with-xbrowser-bookmark-sync.png)

## 浏览器兼容性

✅ **Chrome** 88+  
✅ **Firefox** 109+  
✅ **Microsoft Edge** 88+  
✅ **其他基于 Chromium 的浏览器**

> 🦊 **Firefox 用户**: 请查看 [Firefox 构建指南](FIREFOX_BUILD.md) 了解安装说明。

## 安装说明


### 扩展商店安装

- Chrome浏览器扩展商店安装地址：https://chrome.google.com/webstore/detail/dbccejmmnkoaaffbliocemfkhabmemhe

- Edge浏览器扩展商店安装地址：https://microsoftedge.microsoft.com/addons/detail/xbrowser-bookmark-sync/gdbkdcohpokcfaheiojfamnmfoniaeca

- FireFox扩展商店安装地址： https://addons.mozilla.org/en-US/firefox/addon/xbrowser-bookmark-sync/
   


### 从crx文件安装

1. 直接下载[xbrowser-bookmark-sync.crx](https://www.xbext.com/download/xbrowser-bookmark-sync.crx)文件到你本地目录。


2. 打开Chrome浏览器，进入扩展程序管理页面
   - 方法1：在地址栏输入 `chrome://extensions/`
   - 方法2：菜单 → 更多工具 → 扩展程序

3. 开启右上角的"开发者模式"

4. 从文件管理器拖拽crx文件到扩展程序页面即可完成安装

### 开发模式安装

#### Chrome/Edge 浏览器：

1. 下载本项目项目到本地

```bash
  git clone https://github.com/examplecode/xbrowser-bookmark-sync.git
```
或者直接下载压缩包 [xbrowser-bookmark-sync.zip](https://www.xbext.com/download/xbrowser-bookmark-sync.zip) 释放到本地目录。

2. 打开Chrome浏览器，进入扩展程序管理页面
   - 方法1：在地址栏输入 `chrome://extensions/`
   - 方法2：菜单 → 更多工具 → 扩展程序

3. 开启右上角的"开发者模式"

4. 点击"加载已解压的扩展程序"

5. 选择本项目所在文件夹

6. 扩展程序安装完成，点击工具栏图标即可使用

#### Firefox 浏览器：

##### 从zip包安装

下载压缩包 [xbrowser-bookmark-sync-firefox.zip](https://www.xbext.com/download/xbrowser-bookmark-sync-firefox.zip) 


然后在 Firefox 中：
1. 在地址栏输入 `about:debugging#/runtime/this-firefox`
2. 点击"临时载入附加组件"
3. 选择刚刚下载的 `xbrowser-bookmark-sync-firefox.zip` 文件

#####  从源码安装
```bash

  git clone https://github.com/examplecode/xbrowser-bookmark-sync.git
  cd /path/of/xbrowser-bookmark-sync
  # 构建 Firefox 版本
   ./build-firefox.sh
```

然后在 Firefox 中：
1. 在地址栏输入 `about:debugging#/runtime/this-firefox`
2. 点击"临时载入附加组件"
3. 选择项目目录下的 `manifest.json` 文件

📖 详细的 Firefox 安装说明请查看 [Firefox 构建指南](FIREFOX_BUILD.md)


## 技术栈

- Manifest V3 (Chrome) / V2 (Firefox)
- Chrome/Firefox Extension APIs
- Cross-browser Compatibility Layer
- Chrome Bookmarks API
- Chrome Storage API
- Vanilla JavaScript
- CSS3 渐变与动画

## 文件结构
```
├── manifest.json              # Chrome 扩展配置文件 (Manifest V3)
├── manifest.firefox.json      # Firefox 扩展配置文件 (Manifest V2)
├── browser-polyfill.js        # 浏览器兼容性适配层
├── config.js                  # 环境配置
├── popup.html                 # 弹窗页面
├── popup.js                   # 主要逻辑
├── background.js              # 后台服务
├── styles.css                 # 样式文件
├── build-firefox.sh           # Firefox 构建脚本
├── build-chrome.sh            # Chrome 构建脚本
├── icons/                     # 图标文件夹
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── default-avatar.png
├── _locales/                  # 多语言支持
│   ├── zh_CN/
│   ├── en/
│   └── en_US/
└── README.md                  # 说明文档
```

## 权限说明

- `bookmarks`: 读取和修改浏览器书签
- `storage`: 存储用户登录信息
- `host_permissions`: 访问云端API


## 开发说明

### 调试

1. 在扩展程序页面点击"检查视图"打开开发者工具
2. 查看Console中的日志信息
3. 修改代码后点击刷新按钮重新加载扩展



## 许可证

MIT License

## 联系方式

如有问题或建议，请联系X浏览器技术支持。
