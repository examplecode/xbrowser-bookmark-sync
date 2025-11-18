# 安装与使用指南

## 快速开始

### 第一步：生成图标文件

1. 在浏览器中打开 `create-icons.html` 文件
2. 点击所有按钮下载图标文件：
   - icon16.png
   - icon48.png
   - icon128.png
   - default-avatar.png
3. 将下载的所有图标文件放入 `icons/` 文件夹

### 第二步：启动测试API服务器（可选）

如果你还没有真实的API服务器，可以使用模拟服务器进行测试：

\`\`\`bash
# 启动模拟API服务器
node api-server.js
\`\`\`

服务器将在 `http://localhost:3000` 运行。

**查看服务器状态**：在浏览器访问 `http://localhost:3000`，你将看到：
- 服务器运行状态
- 测试账号信息
- 可用API接口列表
- 使用说明和测试命令

**测试账号**：
- 用户名: `testuser` 密码: `password123`
- 用户名: `admin` 密码: `admin123`

**重要：** 如果使用本地API服务器，需要修改 `popup.js` 中的API地址：

\`\`\`javascript
const API_BASE_URL = 'http://localhost:3000';
\`\`\`

### 第三步：安装Chrome扩展

1. 打开Chrome浏览器
2. 在地址栏输入 `chrome://extensions/` 并回车
3. 开启右上角的"开发者模式"开关
4. 点击"加载已解压的扩展程序"
5. 选择本项目所在文件夹
6. 扩展程序安装完成！

### 第四步：使用扩展

1. 点击Chrome工具栏上的扩展图标（如果没有显示，点击拼图图标固定扩展）
2. 输入测试账号登录
3. 登录成功后可以：
   - 查看本地书签数量
   - 点击"同步到云端"上传书签
   - 点击"从云端同步"下载书签

## 配置真实API

如果要连接真实的X浏览器API服务器：

### 1. 修改API地址

编辑 `popup.js` 文件，将API地址改为真实地址：

\`\`\`javascript
// 修改这一行
const API_BASE_URL = 'https://api.xbrowser.example.com';
\`\`\`

### 2. 确保API接口符合规范

API服务器需要提供以下接口：

#### 登录接口
\`\`\`
POST /api/auth
Content-Type: application/json

请求体:
{
  "username": "用户名",
  "password": "密码"
}

响应:
{
  "success": true,
  "token": "访问令牌",
  "nickname": "用户昵称",
  "avatar": "头像URL",
  "userId": "用户ID"
}
\`\`\`

#### 上传书签
\`\`\`
POST /api/bookmark_upload
Authorization: Bearer {token}
Content-Type: application/json

请求体:
{
  "bookmarks": [...],
  "timestamp": 1234567890
}

响应:
{
  "success": true,
  "message": "上传成功",
  "count": 书签数量
}
\`\`\`

#### 下载书签
\`\`\`
GET /api/bookmark_download
Authorization: Bearer {token}

响应:
{
  "success": true,
  "bookmarks": [...],
  "timestamp": 1234567890
}
\`\`\`

### 3. 处理CORS

确保API服务器设置了正确的CORS头：

\`\`\`
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
\`\`\`

## 调试技巧

### 查看控制台日志

1. 在扩展程序页面找到"X浏览器书签同步助手"
2. 点击"检查视图"下的链接
3. 在开发者工具的Console标签查看日志

### 查看存储数据

在Console中运行：

\`\`\`javascript
// 查看所有存储的数据
chrome.storage.local.get(null, (result) => {
  console.log('存储数据:', result);
});

// 清除所有数据
chrome.storage.local.clear(() => {
  console.log('已清除所有数据');
});
\`\`\`

### 重新加载扩展

每次修改代码后，在扩展程序页面点击刷新按钮重新加载扩展。

## 常见问题

### Q: 图标不显示？
A: 确保已生成并放置所有图标文件到 `icons/` 文件夹，然后重新加载扩展。

### Q: 登录失败？
A: 
- 检查API服务器是否运行
- 检查API地址是否正确
- 查看控制台错误信息
- 确认用户名密码正确

### Q: 同步失败？
A:
- 检查网络连接
- 确认token是否有效（可能已过期）
- 查看API服务器日志
- 尝试重新登录

### Q: 书签没有同步？
A:
- 检查是否有书签权限
- 确认书签数据格式正确
- 查看控制台是否有错误

### Q: 如何备份书签？
A: 在Chrome中进入 `chrome://bookmarks/`，点击右上角菜单 → 导出书签。

## 打包发布

准备发布扩展时：

1. 确保所有图标文件齐全
2. 测试所有功能正常
3. 删除开发文件（api-server.js, create-icons.html, INSTALL.md等）
4. 在扩展程序页面点击"打包扩展程序"
5. 选择项目文件夹生成.crx文件

## 目录结构

\`\`\`
X-Browser-Bookmark-Sync/
├── manifest.json           # 扩展配置
├── popup.html              # 弹窗页面
├── popup.js                # 主逻辑
├── background.js           # 后台服务
├── styles.css              # 样式
├── icons/                  # 图标文件夹
│   ├── icon16.png         # 16x16 图标
│   ├── icon48.png         # 48x48 图标
│   ├── icon128.png        # 128x128 图标
│   └── default-avatar.png # 默认头像
├── README.md              # 项目说明
├── INSTALL.md             # 安装指南（本文件）
├── api-server.js          # 模拟API服务器（开发用）
└── create-icons.html      # 图标生成工具
\`\`\`

## 技术支持

如有问题，请查看：
- README.md 了解功能说明
- 控制台日志获取详细错误信息
- API服务器日志查看后端问题

## 许可证

MIT License
