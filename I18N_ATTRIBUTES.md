# 国际化属性配置指南

## 为不同语言环境配置不同的属性值

### 使用场景

需要根据不同语言环境配置不同的属性值，例如：
- 不同语言的链接地址（中文官网 vs 英文官网）
- 不同的图片源
- 不同的下载链接

### 语法格式

```html
<element data-i18n="[attribute]messageKey;textKey">默认文本</element>
```

#### 格式说明：
- `[attribute]` - 要设置的HTML属性名（如 href, src, title等）
- `messageKey` - 对应的翻译键名
- `textKey` - 元素文本内容的翻译键名
- 用分号 `;` 分隔多个部分

### 实际示例

#### 示例1: 配置不同语言的下载链接

**HTML:**
```html
<a href="https://www.xbext.com" 
   target="_blank" 
   data-i18n="[href]registerLinkUrl;registerLink">
  下载X浏览器注册
</a>
```

**中文翻译 (_locales/zh_CN/messages.json):**
```json
{
  "registerLink": {
    "message": "下载X浏览器注册"
  },
  "registerLinkUrl": {
    "message": "https://www.xbext.com"
  }
}
```

**英文翻译 (_locales/en/messages.json):**
```json
{
  "registerLink": {
    "message": "download X Browser to register"
  },
  "registerLinkUrl": {
    "message": "https://www.xbext.com/en"
  }
}
```

**渲染结果:**

中文环境：
```html
<a href="https://www.xbext.com" target="_blank">
  下载X浏览器注册
</a>
```

英文环境：
```html
<a href="https://www.xbext.com/en" target="_blank">
  download X Browser to register
</a>
```

#### 示例2: 配置不同语言的图片

**HTML:**
```html
<img data-i18n="[src]helpImageUrl;[alt]helpImageAlt" 
     src="default.png" 
     alt="Help">
```

**翻译文件:**
```json
{
  "helpImageUrl": {
    "message": "images/help-zh.png"
  },
  "helpImageAlt": {
    "message": "帮助图片"
  }
}
```

#### 示例3: 配置工具提示

**HTML:**
```html
<button data-i18n="[title]saveTooltip;saveButton">保存</button>
```

**翻译文件:**
```json
{
  "saveButton": {
    "message": "保存"
  },
  "saveTooltip": {
    "message": "点击保存您的更改"
  }
}
```

### 支持的属性

理论上可以配置任何HTML属性，常用的包括：

- `href` - 链接地址
- `src` - 图片/脚本源
- `alt` - 替代文本
- `title` - 工具提示
- `placeholder` - 输入框提示（也可用 data-i18n-placeholder）
- `aria-label` - 无障碍标签
- `data-*` - 自定义数据属性

### 多属性配置

可以同时配置多个属性：

```html
<a data-i18n="[href]docsUrl;[title]docsTooltip;docsLink">
  文档
</a>
```

对应翻译：
```json
{
  "docsUrl": {
    "message": "https://docs.example.com/zh"
  },
  "docsTooltip": {
    "message": "查看完整文档"
  },
  "docsLink": {
    "message": "文档"
  }
}
```

### 工作原理

`initI18n()` 函数会：

1. 查找所有带 `data-i18n` 属性的元素
2. 解析属性值，识别 `[attribute]key` 格式
3. 从语言文件中获取对应的翻译
4. 设置元素的属性和文本内容

```javascript
function initI18n() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const i18nValue = element.getAttribute('data-i18n');
    
    // 处理复合格式: [attr1]key1;[attr2]key2;textKey
    if (i18nValue.includes('[') || i18nValue.includes(';')) {
      const parts = i18nValue.split(';');
      
      parts.forEach(part => {
        part = part.trim();
        
        // 匹配 [attribute]key 格式
        const attrMatch = part.match(/^\[(\w+)\](.+)$/);
        if (attrMatch) {
          const [, attr, key] = attrMatch;
          const message = chrome.i18n.getMessage(key);
          if (message) {
            element.setAttribute(attr, message);
          }
        } else {
          // 普通文本键
          const message = chrome.i18n.getMessage(part);
          if (message) {
            element.textContent = message;
          }
        }
      });
    } else {
      // 简单的文本替换
      const message = chrome.i18n.getMessage(i18nValue);
      if (message) {
        element.textContent = message;
      }
    }
  });
}
```

### 注意事项

1. **顺序**: 先处理属性，最后处理文本内容
2. **空格**: 分号前后的空格会被自动去除
3. **默认值**: HTML中的默认值会被翻译覆盖
4. **调试**: 如果翻译未生效，检查：
   - 键名是否正确
   - messages.json 格式是否正确
   - 是否重新加载了扩展

### 最佳实践

1. **语义化键名**: 使用描述性的键名
   ```json
   "downloadLinkUrl": {...}     // ✅ 好
   "url1": {...}                 // ❌ 不好
   ```

2. **统一命名**: 相关的键使用一致的前缀
   ```json
   "registerLink": {...}
   "registerLinkUrl": {...}
   "registerLinkTooltip": {...}
   ```

3. **文档注释**: 在复杂配置旁添加注释
   ```html
   <!-- 中文链接到 .com，英文链接到 .com/en -->
   <a data-i18n="[href]registerLinkUrl;registerLink">注册</a>
   ```

### 完整示例

当前项目中的使用：

```html
<span data-i18n="loginSubtitle">
  本工具为X浏览器专用书签同步助手，如没有账户请
</span>
<a href="https://www.xbext.com" 
   target="_blank" 
   data-i18n="[href]registerLinkUrl;registerLink">
  下载X浏览器注册
</a>
```

语言文件配置：

**zh_CN/messages.json:**
```json
{
  "loginSubtitle": {
    "message": "本工具为X浏览器专用书签同步助手，如没有账户请"
  },
  "registerLink": {
    "message": "下载X浏览器注册"
  },
  "registerLinkUrl": {
    "message": "https://www.xbext.com"
  }
}
```

**en/messages.json:**
```json
{
  "loginSubtitle": {
    "message": "This tool is designed for X Browser bookmark synchronization. If you don't have an account, please "
  },
  "registerLink": {
    "message": "download X Browser to register"
  },
  "registerLinkUrl": {
    "message": "https://www.xbext.com/en"
  }
}
```

### 测试

1. 重新加载扩展
2. 切换浏览器语言
3. 检查链接地址和文本是否正确切换
4. 使用浏览器开发工具检查实际的 href 属性值

---

**参考资料:**
- [Chrome Extension i18n](https://developer.chrome.com/docs/extensions/reference/i18n/)
- [Internationalization (i18n)](https://developer.chrome.com/docs/extensions/mv3/i18n/)
