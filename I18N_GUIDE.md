# 国际化 (i18n) 实现说明

## 版本更新

**v1.0.5** - 新增国际化支持（中文/英文）

## 功能特性

✅ 支持中文（简体）  
✅ 支持英文  
✅ 自动根据浏览器语言切换  
✅ 所有UI文本已国际化

## 目录结构

```
_locales/
├── zh_CN/           # 简体中文
│   └── messages.json
└── en/              # 英文
    └── messages.json
```

## 支持的语言

| 语言 | 代码 | 状态 |
|------|------|------|
| 简体中文 | zh_CN | ✅ 完整支持 |
| 英文 | en | ✅ 完整支持 |

## 如何工作

### 1. Manifest配置

```json
{
  "name": "__MSG_extName__",
  "description": "__MSG_extDescription__",
  "default_locale": "zh_CN"
}
```

- 使用 `__MSG_key__` 格式引用翻译
- `default_locale` 设置默认语言为中文

### 2. HTML国际化

使用 `data-i18n` 属性标记需要翻译的元素：

```html
<!-- 文本内容 -->
<h1 data-i18n="appTitle">X浏览器书签同步</h1>

<!-- 按钮 -->
<button data-i18n="loginButton">登录</button>

<!-- Placeholder -->
<input data-i18n-placeholder="usernamePlaceholder">
```

### 3. JavaScript国际化

使用 Chrome i18n API：

```javascript
// 简单文本
chrome.i18n.getMessage('loginSuccess')

// 带占位符的文本
chrome.i18n.getMessage('syncSuccessWithCount', ['10'])
```

### 4. 初始化

在 `popup.js` 中自动初始化：

```javascript
function initI18n() {
  // 处理 data-i18n 属性
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const message = chrome.i18n.getMessage(key);
    if (message) {
      element.textContent = message;
    }
  });
  
  // 处理 placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const message = chrome.i18n.getMessage(key);
    if (message) {
      element.placeholder = message;
    }
  });
}
```

## 翻译键列表

### 基础信息
- `extName` - 扩展名称
- `extDescription` - 扩展描述
- `appTitle` - 应用标题

### 登录界面
- `loginSubtitle` - 登录说明文字
- `registerLink` - 注册链接文字
- `username` - 用户名标签
- `usernamePlaceholder` - 用户名输入框提示
- `password` - 密码标签
- `passwordPlaceholder` - 密码输入框提示
- `loginButton` - 登录按钮

### 主界面
- `bookmarkCount` - 书签数量单位
- `syncToCloud` - 同步到云端按钮
- `syncFromCloud` - 从云端同步按钮
- `logout` - 退出登录按钮

### 状态消息
- `loggingIn` - 正在登录
- `loginSuccess` - 登录成功
- `loginFailed` - 登录失败
- `inputRequired` - 需要输入用户名密码
- `syncingToCloud` - 正在同步到云端
- `syncingFromCloud` - 正在从云端同步
- `syncSuccess` - 同步成功
- `syncSuccessWithCount` - 同步成功（带数量）
- `bookmarksUpdated` - 书签已更新
- `syncFailed` - 同步失败
- `tokenExpired` - 登录过期
- `logoutConfirm` - 退出确认
- `networkError` - 网络错误

## 如何添加新语言

### 步骤1: 创建语言目录

在 `_locales/` 下创建新的语言文件夹，例如日语：

```bash
mkdir -p _locales/ja
```

### 步骤2: 复制并翻译

复制 `en/messages.json` 到新文件夹并翻译：

```bash
cp _locales/en/messages.json _locales/ja/messages.json
```

### 步骤3: 翻译内容

编辑 `_locales/ja/messages.json`，将所有 `message` 字段翻译为日语。

### 步骤4: 测试

重新加载扩展，Chrome会自动根据浏览器语言选择对应的翻译。

## 语言选择逻辑

Chrome扩展的语言选择优先级：

1. 浏览器当前语言设置
2. 最接近的可用语言
3. `default_locale` 指定的默认语言（zh_CN）

例如：
- 浏览器设置为 `zh-CN` → 使用 `zh_CN`
- 浏览器设置为 `en-US` → 使用 `en`
- 浏览器设置为 `ja` → 使用 `zh_CN`（默认）

## 测试方法

### 测试英文界面

1. 打开Chrome设置
2. 搜索"语言"（Language）
3. 添加English并设为首选语言
4. 重启Chrome
5. 打开扩展查看效果

### 测试中文界面

1. 在语言设置中将中文设为首选语言
2. 重启Chrome
3. 打开扩展查看效果

## 占位符使用示例

在 `messages.json` 中定义带占位符的消息：

```json
{
  "syncSuccessWithCount": {
    "message": "同步成功！已上传 $COUNT$ 个书签",
    "placeholders": {
      "count": {
        "content": "$1"
      }
    }
  }
}
```

在代码中使用：

```javascript
const count = 10;
const message = chrome.i18n.getMessage('syncSuccessWithCount', [count.toString()]);
// 结果: "同步成功！已上传 10 个书签"
```

## 注意事项

1. **键名一致性**: 所有语言的 `messages.json` 必须包含相同的键
2. **占位符**: 如果使用占位符，所有语言版本都要定义
3. **重新加载**: 修改翻译文件后需要重新加载扩展
4. **编码**: 所有 JSON 文件使用 UTF-8 编码
5. **default_locale**: 必须在 manifest.json 中设置

## 浏览器兼容性

- ✅ Chrome/Chromium
- ✅ Edge (Chromium)
- ✅ Brave
- ✅ Opera
- ❌ Firefox (需要调整，语言代码格式不同)

## 参考资料

- [Chrome Extension i18n API](https://developer.chrome.com/docs/extensions/reference/i18n/)
- [Locale Codes](https://developer.chrome.com/docs/webstore/i18n/#choosing-locales-to-support)
