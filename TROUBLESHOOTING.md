# 🔧 故障排查指南

## 常见问题及解决方案

---

## 1. API服务器问题

### ❓ 问题：访问 http://localhost:3000 显示错误

**症状**：
```json
{"success":false,"message":"接口不存在"}
```

**原因**：你访问的是API服务器的根路径，该路径在之前版本没有配置。

**✅ 解决方案**（已修复）：
现在访问 `http://localhost:3000` 会显示一个友好的欢迎页面，包含：
- 服务器运行状态
- 测试账号信息
- 可用API接口列表
- 使用说明

**如何验证**：
```bash
# 1. 启动服务器
node api-server.js

# 2. 在浏览器打开
http://localhost:3000

# 应该看到美观的欢迎页面，而不是JSON错误
```

---

### ❓ 问题：服务器启动失败

**症状**：
```
Error: listen EADDRINUSE: address already in use :::3000
```

**原因**：端口3000已被占用。

**解决方案**：

**方法1：关闭占用端口的进程**
```bash
# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <进程ID> /F
```

**方法2：修改端口**
编辑 `api-server.js`，将 `PORT = 3000` 改为其他端口：
```javascript
const PORT = 3001;  // 改为其他端口
```

然后在 `popup.js` 中同步修改API地址：
```javascript
const API_BASE_URL = 'http://localhost:3001';
```

---

### ❓ 问题：Node.js未安装

**症状**：
```
command not found: node
```

**解决方案**：

**Mac**:
```bash
# 使用Homebrew安装
brew install node

# 或下载安装包
# https://nodejs.org/
```

**Windows**:
```bash
# 下载安装包
https://nodejs.org/

# 或使用Chocolatey
choco install nodejs
```

**验证安装**:
```bash
node --version
# 应显示版本号，如 v18.0.0
```

---

## 2. Chrome扩展问题

### ❓ 问题：Service worker registration failed. Status code: 15

**症状**：
```
Service worker registration failed. Status code: 15
Uncaught TypeError: Cannot read properties of undefined (reading 'create')
```

**原因**：
1. `background.js` 使用了 `chrome.alarms` API
2. `manifest.json` 中缺少 `alarms` 权限

**✅ 解决方案**（已修复）：

已在 `manifest.json` 中添加 `alarms` 权限和 `http://*/*` 支持：
```json
{
  "permissions": [
    "bookmarks",
    "storage",
    "alarms"
  ],
  "host_permissions": [
    "https://*/*",
    "http://*/*"
  ]
}
```

**如何验证**：
```bash
# 1. 在扩展页面移除旧版本
chrome://extensions/ → 移除

# 2. 重新加载扩展
chrome://extensions/ → 加载已解压的扩展程序

# 3. 应该不再有错误提示
```

---

### ❓ 问题：扩展图标不显示

**原因**：图标文件未生成或路径错误。

**解决方案**：
```bash
# 1. 打开图标生成器
open create-icons.html

# 2. 点击所有按钮下载图标：
#    - icon16.png
#    - icon48.png
#    - icon128.png
#    - default-avatar.png

# 3. 确保文件在正确位置
ls icons/
# 应该看到4个图标文件

# 4. 重新加载扩展
# chrome://extensions/ → 点击刷新按钮
```

---

### ❓ 问题：无法加载扩展

**症状**：
```
Manifest file is missing or unreadable
```

**解决方案**：
```bash
# 1. 检查manifest.json是否存在
ls -la manifest.json

# 2. 验证JSON格式
cat manifest.json | python -m json.tool

# 3. 确保选择正确的文件夹
# 应该选择包含manifest.json的文件夹
```

---

### ❓ 问题：扩展加载后没有图标

**原因**：
1. 图标文件缺失
2. manifest.json路径配置错误
3. 浏览器缓存问题

**解决方案**：
```bash
# 1. 验证图标文件存在
ls -la icons/

# 2. 检查manifest.json配置
cat manifest.json | grep -A 5 "icons"

# 3. 清除浏览器缓存
# Chrome → 设置 → 隐私和安全 → 清除浏览数据

# 4. 重新加载扩展
# chrome://extensions/ → 移除扩展 → 重新加载
```

---

## 3. 登录问题

### ❓ 问题：登录失败，显示"用户名或密码错误"

**检查清单**：
```bash
# 1. 确认API服务器正在运行
# 终端应该显示：
# 服务器运行在: http://localhost:3000

# 2. 确认使用正确的测试账号
用户名: testuser
密码: password123

# 3. 检查API地址配置
# 编辑 popup.js，确认：
const API_BASE_URL = 'http://localhost:3000';
# 不是 https，是 http

# 4. 检查网络连接
curl http://localhost:3000
# 应该返回HTML页面
```

---

### ❓ 问题：登录时显示"网络错误"

**可能原因**：
1. API服务器未启动
2. API地址配置错误
3. CORS问题
4. 防火墙阻止

**解决方案**：

**步骤1：验证API服务器**
```bash
# 启动服务器
node api-server.js

# 新开终端，测试连接
curl http://localhost:3000
```

**步骤2：检查扩展配置**
```javascript
// popup.js 第8行
const API_BASE_URL = 'http://localhost:3000';
// 确保是 http 不是 https
// 确保端口号正确
```

**步骤3：查看浏览器Console**
```
1. 点击扩展图标
2. 右键 → 检查
3. 查看Console标签的错误信息
```

**步骤4：测试API**
```bash
# 使用curl测试登录接口
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# 应该返回token等信息
```

---

## 4. 书签同步问题

### ❓ 问题：从云端同步时创建空文件夹，书签不在正确位置 ⭐️ [已修复]

**症状**：
```
从云端同步后，书签结构变成：
├─ 书签栏
│  └─ (原有书签)
├─ 其他书签
└─ [无标题文件夹] ❌  ← 不应该有这个！
   ├─ 书签栏
   │  └─ (同步的书签都在这里)
   └─ 其他书签

再次同步会创建更多文件夹，结构越来越乱
```

**原因**：
- 旧版本(v1.0.2及以下)没有正确处理Chrome书签结构
- 上传时包含了根节点，导致数据结构错误
- 下载时没有识别书签栏(id='1')和其他书签(id='2')的区别

**✅ 解决方案**（已在v1.0.3修复）：

**方法1：升级到最新版本（必须）**
```bash
# 1. 确认版本
# chrome://extensions/ 查看扩展版本
# 必须是 v1.0.3 或更高

# 2. 重新加载扩展
# chrome://extensions/ → 点击刷新按钮
```

**方法2：清理错误的文件夹（如已产生）**
```bash
# 1. 打开书签管理器
chrome://bookmarks/

# 2. 找到并删除无标题或错误的文件夹
# 通常在书签栏或其他书签的同级

# 3. 重新从云端同步（现在会恢复到正确位置）
```

**验证修复**：
```bash
# 同步后检查Chrome书签管理器
chrome://bookmarks/

# 应该看到：
├─ 书签栏  ← 书签应该直接在这里
│  ├─ 书签1
│  └─ 文件夹A
└─ 其他书签  ← 书签应该直接在这里
   └─ 书签2

# ❌ 不应该有额外的文件夹
```

**新版本功能**：
- ✅ 智能识别Chrome书签结构
- ✅ 书签恢复到正确位置（书签栏、其他书签）
- ✅ 不创建额外的空文件夹
- ✅ 支持中英文标题识别

**详细说明**: 查看 `BOOKMARK_STRUCTURE_FIX.md` 了解完整技术细节

---

### ❓ 问题：每次从云端同步书签数量都会翻倍 ⭐️ [已修复]

**症状**：
```
第一次同步: 10个书签 → 20个书签
第二次同步: 20个书签 → 40个书签
第三次同步: 40个书签 → 80个书签
书签重复，出现大量相同的书签和文件夹
```

**原因**：
- 旧版本(v1.0.1)的同步逻辑没有检查书签是否已存在
- 每次同步都直接创建新书签，导致重复

**✅ 解决方案**（已在v1.0.2修复）：

**方法1：升级到最新版本（推荐）**
```bash
# 1. 确认版本
# chrome://extensions/ 查看扩展版本
# 应该是 1.0.2 或更高

# 2. 如果是旧版本，重新加载扩展
# chrome://extensions/ → 移除 → 重新加载
```

**方法2：清理重复书签（如已产生）**
```bash
# 手动删除重复的书签和文件夹
# 或使用Chrome书签管理器批量删除
chrome://bookmarks/
```

**验证修复**：
```bash
# 1. 记录当前书签数量（如：10个）
# 2. 点击 "从云端同步"
# 3. 检查书签数量（应该仍是10个）
# 4. 再次点击 "从云端同步"
# 5. 检查书签数量（应该还是10个）
# ✅ 数量不变表示修复成功
```

**新版本功能**：
- ✅ 智能去重：基于URL检查书签是否存在
- ✅ 智能合并：同名文件夹会合并内容
- ✅ 增量更新：只添加云端特有的书签
- ✅ 保留本地：不删除本地特有的书签

**详细说明**: 查看 `BOOKMARK_SYNC_FIX.md` 了解完整技术细节

---

### ❓ 问题：同步到云端失败

**检查清单**：
```bash
# 1. 确认已登录
# 应该看到用户头像和昵称

# 2. 确认有书签
# 书签数量应该 > 0

# 3. 检查token
# 打开开发者工具Console:
chrome.storage.local.get('apiToken', (result) => {
  console.log('Token:', result.apiToken);
});

# 4. 查看API服务器日志
# 服务器终端应该显示上传请求
```

---

### ❓ 问题：从云端同步失败

**原因**：云端可能没有数据。

**解决方案**：
```bash
# 1. 先上传一次
# 点击"同步到云端"按钮

# 2. 等待成功提示
# 应显示：同步成功！已上传 X 个书签

# 3. 再尝试下载
# 点击"从云端同步"按钮
```

---

## 5. 开发者工具调试

### 查看扩展日志

```bash
# 1. 打开扩展页面
chrome://extensions/

# 2. 找到"X浏览器书签同步助手"

# 3. 点击"检查视图"下的链接

# 4. 在Console中查看日志
```

### 查看存储数据

```javascript
// 在扩展的Console中运行

// 查看所有存储数据
chrome.storage.local.get(null, (result) => {
  console.log('所有数据:', result);
});

// 查看token
chrome.storage.local.get('apiToken', (result) => {
  console.log('Token:', result.apiToken);
});

// 查看用户信息
chrome.storage.local.get('userInfo', (result) => {
  console.log('用户信息:', result.userInfo);
});

// 清除所有数据
chrome.storage.local.clear(() => {
  console.log('已清除所有数据');
});
```

### 查看书签数据

```javascript
// 获取所有书签
chrome.bookmarks.getTree((bookmarks) => {
  console.log('书签树:', bookmarks);
});

// 计算书签数量
function countBookmarks(nodes) {
  let count = 0;
  for (const node of nodes) {
    if (node.url) count++;
    if (node.children) count += countBookmarks(node.children);
  }
  return count;
}

chrome.bookmarks.getTree((bookmarks) => {
  console.log('书签数量:', countBookmarks(bookmarks));
});
```

---

## 6. API服务器调试

### 查看请求日志

服务器会自动记录所有请求：
```
GET /
POST /api/auth
POST /api/bookmark_upload
GET /api/bookmark_download
```

### 测试各个接口

```bash
# 1. 测试登录
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# 2. 测试上传（需要先登录获取token）
curl -X POST http://localhost:3000/api/bookmark_upload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "bookmarks": [],
    "timestamp": 1234567890000
  }'

# 3. 测试下载
curl -X GET http://localhost:3000/api/bookmark_download \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. 测试用户信息
curl -X GET http://localhost:3000/user/info \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 7. 性能问题

### ❓ 问题：同步速度慢

**优化建议**：

1. **检查书签数量**
   ```javascript
   // 如果书签 > 5000，考虑分批同步
   ```

2. **检查网络延迟**
   ```bash
   # 测试API响应时间
   time curl http://localhost:3000
   ```

3. **优化书签结构**
   - 减少深层嵌套
   - 删除无用书签
   - 合并重复文件夹

---

## 8. 兼容性问题

### ❓ 问题：扩展在某些浏览器不工作

**支持的浏览器**：
- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Brave 1.20+
- ✅ Opera 74+
- ❌ Firefox（需要WebExtensions API）
- ❌ Safari（需要Safari Extensions）

**检查浏览器版本**：
```javascript
// 在Console中运行
navigator.userAgent
```

---

## 9. 重置扩展

如果遇到无法解决的问题，尝试完全重置：

```bash
# 1. 移除扩展
chrome://extensions/ → 移除

# 2. 清除存储数据
# 在Console中运行：
chrome.storage.local.clear()

# 3. 重启API服务器
# Ctrl+C 停止
node api-server.js

# 4. 重新加载扩展
chrome://extensions/ → 加载已解压的扩展程序

# 5. 重新登录
# 使用测试账号登录
```

---

## 10. 获取帮助

如果以上方法都无法解决问题：

1. **查看文档**
   - README.md - 项目说明
   - INSTALL.md - 安装指南
   - FEATURES.md - 功能说明
   - API_DOCUMENTATION.md - API文档

2. **查看日志**
   - Chrome开发者工具Console
   - API服务器终端输出

3. **检查更新**
   - 查看 UPDATE_LOG.md
   - 确认使用最新版本

4. **报告问题**
   - 提供详细的错误信息
   - 包含浏览器版本
   - 包含控制台日志

---

## 快速诊断清单

遇到问题时，按顺序检查：

- [ ] Node.js已安装（`node --version`）
- [ ] API服务器正在运行（`http://localhost:3000`可访问）
- [ ] 图标文件已生成（`ls icons/`）
- [ ] Chrome扩展已加载（`chrome://extensions/`）
- [ ] 扩展图标可见
- [ ] API地址配置正确（`popup.js`）
- [ ] 使用正确的测试账号
- [ ] 查看了浏览器Console日志
- [ ] 查看了API服务器日志

---

**提示**：大多数问题可以通过查看浏览器Console和API服务器日志来定位。

**最后更新**: 2024-01-01  
**维护团队**: X浏览器开发团队
