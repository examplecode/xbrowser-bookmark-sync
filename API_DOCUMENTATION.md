# API 接口文档

X浏览器书签同步助手 - 后端API接口规范

---

## 基础信息

- **协议**: HTTPS（生产环境）/ HTTP（开发环境）
- **数据格式**: JSON
- **字符编码**: UTF-8
- **认证方式**: Bearer Token

---

## 接口列表

### 1. 用户登录

获取访问令牌，用于后续所有API调用。

#### 请求

**接口地址**: `POST /auth/login`

**请求头**:
\`\`\`http
Content-Type: application/json
\`\`\`

**请求体**:
\`\`\`json
{
  "username": "string",   // 必填，用户名
  "password": "string"    // 必填，密码
}
\`\`\`

**请求示例**:
\`\`\`bash
curl -X POST https://api.xbrowser.example.com/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
\`\`\`

#### 响应

**成功响应** (200):
\`\`\`json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // 访问令牌
  "nickname": "测试用户",                              // 用户昵称
  "avatar": "https://example.com/avatar.jpg",        // 头像URL
  "userId": "user_001"                               // 用户ID
}
\`\`\`

**失败响应** (401):
\`\`\`json
{
  "success": false,
  "message": "用户名或密码错误"
}
\`\`\`

**参数说明**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| success | boolean | 是 | 是否成功 |
| token | string | 是 | JWT令牌，有效期24小时 |
| nickname | string | 是 | 用户昵称 |
| avatar | string | 否 | 头像URL，可为空 |
| userId | string | 是 | 用户唯一标识 |

---

### 2. 上传书签到云端

将本地书签数据上传到服务器保存。

#### 请求

**接口地址**: `POST /bookmarks/upload`

**请求头**:
\`\`\`http
Content-Type: application/json
Authorization: Bearer {token}
\`\`\`

**请求体**:
\`\`\`json
{
  "bookmarks": [
    {
      "id": "1",
      "title": "书签栏",
      "children": [
        {
          "id": "2",
          "title": "Google",
          "url": "https://www.google.com",
          "dateAdded": 1634567890000,
          "dateGroupModified": 1634567890000
        },
        {
          "id": "3",
          "title": "工作文件夹",
          "children": [
            {
              "id": "4",
              "title": "GitHub",
              "url": "https://github.com",
              "dateAdded": 1634567890000
            }
          ]
        }
      ]
    }
  ],
  "timestamp": 1634567890000  // 上传时间戳
}
\`\`\`

**请求示例**:
\`\`\`bash
curl -X POST https://api.xbrowser.example.com/bookmarks/upload \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -d '{
    "bookmarks": [...],
    "timestamp": 1634567890000
  }'
\`\`\`

#### 响应

**成功响应** (200):
\`\`\`json
{
  "success": true,
  "message": "书签上传成功",
  "count": 128  // 上传的书签数量
}
\`\`\`

**失败响应** (401):
\`\`\`json
{
  "success": false,
  "message": "未授权或token已过期"
}
\`\`\`

**参数说明**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| bookmarks | array | 是 | 书签数据数组 |
| timestamp | number | 是 | 上传时间戳（毫秒） |

**书签对象结构**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 书签ID |
| title | string | 是 | 书签标题 |
| url | string | 否 | 书签URL（文件夹无此字段） |
| dateAdded | number | 否 | 添加时间戳 |
| dateGroupModified | number | 否 | 修改时间戳 |
| children | array | 否 | 子书签数组（文件夹有此字段） |

---

### 3. 从云端下载书签

从服务器获取用户的云端书签数据。

#### 请求

**接口地址**: `GET /bookmarks/download`

**请求头**:
\`\`\`http
Authorization: Bearer {token}
\`\`\`

**请求示例**:
\`\`\`bash
curl -X GET https://api.xbrowser.example.com/bookmarks/download \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
\`\`\`

#### 响应

**成功响应** (200):
\`\`\`json
{
  "success": true,
  "bookmarks": [
    {
      "id": "1",
      "title": "书签栏",
      "children": [...]
    }
  ],
  "timestamp": 1634567890000  // 上传时间戳
}
\`\`\`

**无数据响应** (200):
\`\`\`json
{
  "success": true,
  "bookmarks": [],
  "message": "暂无云端书签"
}
\`\`\`

**失败响应** (401):
\`\`\`json
{
  "success": false,
  "message": "未授权或token已过期"
}
\`\`\`

---

### 4. 获取用户信息（可选）

获取当前登录用户的详细信息。

#### 请求

**接口地址**: `GET /user/info`

**请求头**:
\`\`\`http
Authorization: Bearer {token}
\`\`\`

**请求示例**:
\`\`\`bash
curl -X GET https://api.xbrowser.example.com/user/info \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
\`\`\`

#### 响应

**成功响应** (200):
\`\`\`json
{
  "success": true,
  "userInfo": {
    "username": "testuser",
    "nickname": "测试用户",
    "avatar": "https://example.com/avatar.jpg",
    "userId": "user_001"
  }
}
\`\`\`

---

## 通用错误码

| HTTP状态码 | 说明 | 处理建议 |
|-----------|------|---------|
| 200 | 请求成功 | - |
| 400 | 请求参数错误 | 检查请求体格式 |
| 401 | 未授权或token过期 | 重新登录 |
| 403 | 禁止访问 | 检查权限 |
| 404 | 接口不存在 | 检查API地址 |
| 500 | 服务器内部错误 | 联系技术支持 |
| 503 | 服务不可用 | 稍后重试 |

---

## CORS配置

服务器需要设置以下CORS响应头：

\`\`\`http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
\`\`\`

或者针对特定域名：

\`\`\`http
Access-Control-Allow-Origin: chrome-extension://{extension-id}
\`\`\`

---

## 安全建议

### 1. HTTPS通信
生产环境必须使用HTTPS加密通信，保护用户隐私和数据安全。

### 2. Token管理
- Token有效期建议24小时
- 使用JWT标准格式
- 包含用户ID和过期时间
- 服务端验证Token签名

### 3. 密码安全
- 传输前使用HTTPS加密
- 服务端存储使用bcrypt/argon2等加盐哈希
- 实施密码复杂度策略
- 考虑实现双因素认证

### 4. 速率限制
建议实施API速率限制：
- 登录接口：5次/分钟
- 上传接口：10次/分钟
- 下载接口：20次/分钟

### 5. 数据验证
- 验证所有输入参数
- 限制书签数据大小（建议< 5MB）
- 过滤恶意内容
- 防止SQL注入和XSS攻击

---

## 数据格式规范

### 时间戳格式
所有时间戳使用Unix毫秒时间戳（13位数字）。

**示例**:
\`\`\`javascript
const timestamp = Date.now();  // 1634567890000
\`\`\`

### URL格式
书签URL必须是完整的URL，包含协议。

**有效示例**:
- `https://www.google.com`
- `http://example.com/page`
- `chrome://bookmarks/`

**无效示例**:
- `www.google.com` (缺少协议)
- `google.com` (缺少协议)

### 字符串编码
所有字符串使用UTF-8编码，支持多语言。

---

## 实现示例

### JavaScript (Chrome扩展)

\`\`\`javascript
// 登录
async function login(username, password) {
  const response = await fetch('https://api.example.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  const data = await response.json();
  if (data.success) {
    // 保存token
    await chrome.storage.local.set({ apiToken: data.token });
    return data;
  }
  throw new Error(data.message);
}

// 上传书签
async function uploadBookmarks(token, bookmarks) {
  const response = await fetch('https://api.example.com/bookmarks/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      bookmarks,
      timestamp: Date.now(),
    }),
  });
  
  return await response.json();
}

// 下载书签
async function downloadBookmarks(token) {
  const response = await fetch('https://api.example.com/bookmarks/download', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return await response.json();
}
\`\`\`

### Node.js (服务端)

\`\`\`javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// CORS中间件
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Token验证中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: '未授权' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Token已过期' });
    }
    req.user = user;
    next();
  });
}

// 登录接口
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // 验证用户名密码（这里需要实际的数据库查询）
  // ...
  
  const token = jwt.sign(
    { userId: 'user_001' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({
    success: true,
    token,
    nickname: '用户昵称',
    avatar: 'https://example.com/avatar.jpg',
    userId: 'user_001',
  });
});

// 上传书签
app.post('/bookmarks/upload', authenticateToken, (req, res) => {
  const { bookmarks, timestamp } = req.body;
  const userId = req.user.userId;
  
  // 保存到数据库
  // ...
  
  res.json({
    success: true,
    message: '上传成功',
    count: countBookmarks(bookmarks),
  });
});

// 下载书签
app.get('/bookmarks/download', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  
  // 从数据库获取
  // const bookmarks = ...
  
  res.json({
    success: true,
    bookmarks: [],
    timestamp: Date.now(),
  });
});

app.listen(3000);
\`\`\`

---

## 测试工具

### Postman集合

可以使用以下Postman测试：

1. **登录**
   - Method: POST
   - URL: http://localhost:3000/auth/login
   - Body: `{"username":"testuser","password":"password123"}`

2. **上传书签**
   - Method: POST
   - URL: http://localhost:3000/bookmarks/upload
   - Headers: `Authorization: Bearer {token}`
   - Body: `{"bookmarks":[...],"timestamp":1634567890000}`

3. **下载书签**
   - Method: GET
   - URL: http://localhost:3000/bookmarks/download
   - Headers: `Authorization: Bearer {token}`

### cURL测试

\`\`\`bash
# 登录
curl -X POST http://localhost:3000/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"testuser","password":"password123"}'

# 上传（替换YOUR_TOKEN）
curl -X POST http://localhost:3000/bookmarks/upload \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{"bookmarks":[],"timestamp":1634567890000}'

# 下载（替换YOUR_TOKEN）
curl -X GET http://localhost:3000/bookmarks/download \\
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

---

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| 1.0.0 | 2024-01 | 初始版本，包含基础登录和同步功能 |

---

## 联系方式

- **技术支持**: support@xbrowser.com
- **API问题**: api@xbrowser.com
- **文档反馈**: docs@xbrowser.com

---

**最后更新**: 2024-01-01
**维护团队**: X浏览器开发团队
