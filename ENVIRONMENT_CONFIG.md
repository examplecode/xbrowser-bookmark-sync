# 环境配置说明

## 多语言API服务器配置

扩展支持根据浏览器语言自动选择不同的API服务器地址。

## 配置文件

所有环境配置都在 `config.js` 文件中：

```javascript
const ENV = {
  // 开发/生产模式切换
  isDevelopment: true,  // true=开发模式, false=生产模式
  
  // 开发环境配置
  development: {
    apiUrl: 'http://localhost:3000'
  },
  
  // 生产环境配置（按语言）
  production: {
    zh: 'https://api.xbrowser.cn',   // 中文服务器
    en: 'https://api.xbrowser.com',  // 英文/国际服务器
  }
};
```

## 环境切换

### 开发环境

在 `config.js` 中设置：

```javascript
isDevelopment: true
```

**效果**：
- 所有请求发送到 `http://localhost:3000`
- 适用于本地开发和测试

### 生产环境

在 `config.js` 中设置：

```javascript
isDevelopment: false
```

**效果**：
- 根据浏览器语言自动选择API服务器
- 中文环境 → `https://api.xbrowser.cn`
- 英文环境 → `https://api.xbrowser.com`

## 语言检测逻辑

系统使用 `chrome.i18n.getUILanguage()` 获取浏览器语言：

```javascript
浏览器语言        主语言代码    使用的服务器
-------------------------------------------
zh-CN            zh          api.xbrowser.cn
zh-TW            zh          api.xbrowser.cn
zh-HK            zh          api.xbrowser.cn
en-US            en          api.xbrowser.com
en-GB            en          api.xbrowser.com
ja               ja          api.xbrowser.com (默认)
fr               fr          api.xbrowser.com (默认)
```

## 添加更多语言服务器

如果需要为特定语言配置专属服务器：

### 步骤1: 更新 config.js

```javascript
production: {
  zh: 'https://api.xbrowser.cn',   // 中文
  en: 'https://api.xbrowser.com',  // 英文
  ja: 'https://api.xbrowser.jp',   // 日语（新增）
  ko: 'https://api.xbrowser.kr',   // 韩语（新增）
}
```

### 步骤2: 无需其他修改

系统会自动识别并使用对应的服务器。

## 调试

### 查看当前环境信息

在浏览器控制台执行：

```javascript
getEnvironmentInfo()
```

返回示例：
```javascript
{
  isDevelopment: false,
  language: "zh-CN",
  apiUrl: "https://api.xbrowser.cn",
  version: "1.0.5"
}
```

### 控制台日志

系统会自动打印环境信息：

```
[环境] 生产模式 - 浏览器语言: zh-CN
[环境] API地址: https://api.xbrowser.cn
```

## 部署检查清单

在发布生产版本前，请检查：

### ✅ 开发环境 → 生产环境

- [ ] `config.js` 中 `isDevelopment` 设置为 `false`
- [ ] 检查 `production` 配置中的服务器地址是否正确
- [ ] 测试中文环境下的API连接
- [ ] 测试英文环境下的API连接
- [ ] 验证登录、上传、下载功能

### ✅ 生产环境 → 开发环境

- [ ] `config.js` 中 `isDevelopment` 设置为 `true`
- [ ] 确保本地API服务器运行在 `localhost:3000`
- [ ] 重新加载扩展

## 配置示例

### 场景1: 本地开发测试

```javascript
// config.js
const ENV = {
  isDevelopment: true,
  development: {
    apiUrl: 'http://localhost:3000'
  },
  // ...
};
```

### 场景2: 单一生产服务器

如果所有语言都使用同一个API服务器：

```javascript
// config.js
const ENV = {
  isDevelopment: false,
  production: {
    zh: 'https://api.xbrowser.com',
    en: 'https://api.xbrowser.com',
  }
};
```

### 场景3: 区域化服务器

```javascript
// config.js
const ENV = {
  isDevelopment: false,
  production: {
    zh: 'https://api-cn.xbrowser.com',  // 中国大陆
    en: 'https://api-us.xbrowser.com',  // 美国
    ja: 'https://api-jp.xbrowser.com',  // 日本
    ko: 'https://api-kr.xbrowser.com',  // 韩国
  }
};
```

### 场景4: 测试环境

```javascript
// config.js
const ENV = {
  isDevelopment: false,
  production: {
    zh: 'https://api-test.xbrowser.cn',
    en: 'https://api-test.xbrowser.com',
  }
};
```

## 文件结构

```
项目根目录/
├── config.js           # 环境配置文件 ⭐
├── popup.html          # 引入 config.js
├── popup.js            # 使用 getApiBaseUrl()
├── manifest.json
└── _locales/
    ├── zh_CN/
    └── en/
```

## API调用流程

```
1. 用户打开扩展
   ↓
2. popup.html 加载 config.js
   ↓
3. popup.js 调用 getApiBaseUrl()
   ↓
4. 检查 isDevelopment
   ├─ true → 返回 development.apiUrl
   └─ false → 检测浏览器语言 → 返回对应的 production 服务器
   ↓
5. 所有API请求使用选定的服务器地址
```

## 常见问题

### Q1: 如何快速切换开发/生产环境？

**A:** 只需修改 `config.js` 中的一行：
```javascript
isDevelopment: true  // 改为 false
```

### Q2: 测试英文环境时API还是连到中文服务器？

**A:** 确保：
1. 浏览器语言设置已改为英文
2. 重启了Chrome浏览器
3. 重新加载了扩展

### Q3: 能否手动指定API地址？

**A:** 可以。修改 `config.js`：
```javascript
function getApiBaseUrl() {
  // 强制使用指定地址（用于调试）
  return 'https://your-custom-api.com';
}
```

### Q4: 生产环境忘记改配置怎么办？

**A:** 扩展会继续使用 `localhost:3000`，无法连接服务器。
- 用户会看到"网络错误"提示
- 立即发布修复版本，将 `isDevelopment` 改为 `false`

## 安全建议

1. **不要在代码中硬编码敏感信息**
   - API密钥应通过服务器认证获取
   - 不要在扩展中存储密码

2. **使用HTTPS**
   - 生产环境必须使用 HTTPS
   - 保护用户数据传输安全

3. **版本控制**
   - 在 Git 中提交前检查 `isDevelopment` 的值
   - 可以添加 `.env.development` 和 `.env.production` 文件

## 监控建议

建议在生产环境中添加日志：

```javascript
// popup.js 中
console.log('[启动] 环境:', ENV.isDevelopment ? '开发' : '生产');
console.log('[启动] 语言:', chrome.i18n.getUILanguage());
console.log('[启动] API:', API_BASE_URL);
```

## 更新日志

- **v1.0.5** - 新增多语言API服务器配置功能
- 支持开发/生产环境切换
- 支持根据浏览器语言自动选择服务器
