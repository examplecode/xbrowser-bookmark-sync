# 多语言API服务器配置

## 🎯 功能概述

支持根据用户浏览器语言自动选择对应的API服务器地址：
- **中文用户** → 连接中国服务器 (`https://api.xbrowser.cn`)
- **英文用户** → 连接国际服务器 (`https://api.xbrowser.com`)
- **开发模式** → 连接本地服务器 (`http://localhost:3000`)

## 📁 相关文件

| 文件 | 作用 |
|------|------|
| `config.js` | 环境配置文件（API地址、开发/生产切换）|
| `popup.js` | 使用 `getApiBaseUrl()` 获取API地址 |
| `popup.html` | 引入 `config.js` |
| `ENVIRONMENT_CONFIG.md` | 详细配置说明文档 |
| `switch-env.sh` | 快速切换环境脚本 |

## 🚀 快速开始

### 开发环境

1. 确保 `config.js` 中设置为开发模式：
   ```javascript
   isDevelopment: true
   ```

2. 启动本地API服务器：
   ```bash
   node api-server.js
   ```

3. 加载扩展到Chrome

### 生产环境

1. 修改 `config.js`：
   ```javascript
   isDevelopment: false
   ```

2. 重新加载扩展

3. 扩展会根据浏览器语言自动选择服务器

## 🔧 配置说明

### config.js 结构

```javascript
const ENV = {
  // 环境开关
  isDevelopment: true,  // true=开发, false=生产
  
  // 开发环境
  development: {
    apiUrl: 'http://localhost:3000'
  },
  
  // 生产环境（按语言）
  production: {
    zh: 'https://api.xbrowser.cn',   // 中文
    en: 'https://api.xbrowser.com',  // 英文
  }
};
```

### 语言映射规则

| 浏览器语言 | 主语言 | 使用的API服务器 |
|------------|--------|-----------------|
| zh-CN (简体中文) | zh | api.xbrowser.cn |
| zh-TW (繁体中文) | zh | api.xbrowser.cn |
| zh-HK (香港中文) | zh | api.xbrowser.cn |
| en-US (美式英语) | en | api.xbrowser.com |
| en-GB (英式英语) | en | api.xbrowser.com |
| ja (日语) | ja | api.xbrowser.com (默认) |
| 其他语言 | - | api.xbrowser.com (默认) |

## 🛠️ 使用脚本快速切换

### 查看当前环境

```bash
./switch-env.sh
```

输出：
```
📍 当前环境: 开发环境 (Development)
   API地址: http://localhost:3000
```

### 切换到开发环境

```bash
./switch-env.sh dev
```

### 切换到生产环境

```bash
./switch-env.sh prod
```

### 首次使用需要赋予执行权限

```bash
chmod +x switch-env.sh
```

## 📋 部署检查清单

### 发布生产版本前

- [ ] ✅ 运行 `./switch-env.sh prod` 切换到生产环境
- [ ] ✅ 检查 `config.js` 中 `isDevelopment: false`
- [ ] ✅ 验证中文环境连接到 `api.xbrowser.cn`
- [ ] ✅ 验证英文环境连接到 `api.xbrowser.com`
- [ ] ✅ 测试登录、上传、下载功能
- [ ] ✅ 打包扩展

### 恢复开发环境

- [ ] ✅ 运行 `./switch-env.sh dev`
- [ ] ✅ 确保本地API服务器运行
- [ ] ✅ 重新加载扩展

## 🧪 测试不同语言环境

### 测试中文环境

1. Chrome设置 → 语言 → 添加"中文（简体）"
2. 设为首选语言
3. 重启Chrome
4. 打开扩展
5. 检查控制台日志确认API地址

### 测试英文环境

1. Chrome设置 → 语言 → 添加"English"
2. 设为首选语言
3. 重启Chrome
4. 打开扩展
5. 检查控制台日志确认API地址

### 查看调试信息

打开扩展，按F12打开控制台，查看：

```
[环境] 生产模式 - 浏览器语言: zh-CN
[环境] API地址: https://api.xbrowser.cn
```

## 🌍 添加更多语言服务器

如果需要为日语、韩语等添加专属服务器：

### 1. 更新 config.js

```javascript
production: {
  zh: 'https://api.xbrowser.cn',   // 中文
  en: 'https://api.xbrowser.com',  // 英文
  ja: 'https://api.xbrowser.jp',   // 日语（新增）
  ko: 'https://api.xbrowser.kr',   // 韩语（新增）
}
```

### 2. 添加翻译文件

创建对应的语言目录：
```
_locales/
├── ja/
│   └── messages.json
└── ko/
    └── messages.json
```

### 3. 测试

1. 将浏览器语言改为日语/韩语
2. 重启浏览器
3. 验证连接到对应服务器

## 📊 架构图

```
用户打开扩展
    ↓
加载 config.js
    ↓
调用 getApiBaseUrl()
    ↓
├─ isDevelopment = true
│   → 返回 localhost:3000
│
└─ isDevelopment = false
    ↓
    获取浏览器语言 (chrome.i18n.getUILanguage())
    ↓
    ├─ zh-CN → api.xbrowser.cn
    ├─ en-US → api.xbrowser.com
    └─ 其他  → api.xbrowser.com (默认)
    ↓
所有API请求使用此地址
```

## ⚠️ 注意事项

1. **环境切换后必须重新加载扩展**
   - 在Chrome扩展管理页面点击刷新按钮

2. **测试语言切换必须重启Chrome**
   - 仅更改语言设置不够
   - 必须完全关闭并重新打开Chrome

3. **生产环境检查**
   - 发布前务必确认 `isDevelopment: false`
   - 可以使用 `getEnvironmentInfo()` 验证

4. **API地址必须使用HTTPS**
   - 生产环境不要使用HTTP
   - 本地开发可以使用HTTP

## 🔍 调试技巧

### 在控制台查看环境信息

```javascript
// 查看完整环境配置
getEnvironmentInfo()

// 输出示例
{
  isDevelopment: false,
  language: "zh-CN",
  apiUrl: "https://api.xbrowser.cn",
  version: "1.0.5"
}
```

### 查看API请求

在Network标签中过滤：
- 开发环境：`localhost:3000`
- 中文生产：`api.xbrowser.cn`
- 英文生产：`api.xbrowser.com`

## 📝 版本历史

- **v1.0.5** - 新增多语言API服务器配置功能
  - 支持开发/生产环境切换
  - 支持根据浏览器语言选择服务器
  - 添加环境切换脚本

## 🔗 相关文档

- [环境配置详细说明](ENVIRONMENT_CONFIG.md)
- [国际化指南](I18N_GUIDE.md)
- [国际化属性配置](I18N_ATTRIBUTES.md)

## ❓ 常见问题

**Q: 生产环境中API地址错误怎么办？**

A: 检查：
1. `config.js` 中 `isDevelopment` 是否为 `false`
2. 浏览器语言设置是否正确
3. 是否重启了Chrome
4. 是否重新加载了扩展

**Q: 如何强制使用特定API地址？**

A: 修改 `getApiBaseUrl()` 函数：
```javascript
function getApiBaseUrl() {
  return 'https://your-custom-api.com';
}
```

**Q: 支持动态切换API地址吗？**

A: 当前不支持。用户无法在扩展内切换服务器，服务器地址在扩展加载时确定。如需此功能，可以添加设置页面。
