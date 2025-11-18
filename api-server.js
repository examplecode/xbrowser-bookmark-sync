/**
 * X浏览器书签同步API模拟服务器
 * 用于开发测试，实际部署时需要替换为真实的后端服务
 */

const http = require('http');
const url = require('url');

// 模拟用户数据库
const users = new Map([
  ['testuser', {
    username: 'testuser',
    password: 'password123',
    nickname: '测试用户',
    avatar: 'https://ui-avatars.com/api/?name=Test+User&background=667eea&color=fff',
    userId: 'user_001',
  }],
  ['admin', {
    username: 'admin',
    password: 'admin123',
    nickname: '管理员',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=764ba2&color=fff',
    userId: 'user_002',
  }],
]);

// 模拟书签存储
const bookmarkStorage = new Map();

// 模拟token存储
const tokens = new Map();

// 生成token
function generateToken(userId) {
  const token = `token_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  tokens.set(token, { userId, createdAt: Date.now() });
  return token;
}

// 验证token
function validateToken(token) {
  const tokenData = tokens.get(token);
  if (!tokenData) return null;
  
  // token 24小时过期
  if (Date.now() - tokenData.createdAt > 24 * 60 * 60 * 1000) {
    tokens.delete(token);
    return null;
  }
  
  return tokenData.userId;
}

// 处理CORS
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// 发送JSON响应
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

// 创建服务器
const server = http.createServer((req, res) => {
  setCorsHeaders(res);
  
  // 处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  console.log(`${req.method} ${pathname}`);
  
  // 根路径 - 显示欢迎页面
  if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>X浏览器书签同步API服务器</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 16px;
      padding: 40px;
      max-width: 800px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 {
      color: #667eea;
      margin-bottom: 10px;
      font-size: 28px;
    }
    .status {
      display: inline-block;
      background: #4caf50;
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      margin-bottom: 30px;
    }
    .section {
      margin: 30px 0;
    }
    .section h2 {
      color: #333;
      font-size: 20px;
      margin-bottom: 15px;
      border-left: 4px solid #667eea;
      padding-left: 12px;
    }
    .accounts {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin: 15px 0;
    }
    .account {
      display: flex;
      gap: 20px;
      margin: 10px 0;
      font-family: 'Courier New', monospace;
    }
    .label {
      color: #666;
      font-weight: 600;
    }
    .value {
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    th {
      background: #f8f8f8;
      color: #667eea;
      font-weight: 600;
    }
    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #999;
      font-size: 14px;
    }
    .emoji {
      font-size: 24px;
      margin-right: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1><span class="emoji">🚀</span>X浏览器书签同步API服务器</h1>
    <span class="status">✓ 运行中</span>
    
    <div class="section">
      <h2>📋 测试账号</h2>
      <div class="accounts">
        <div class="account">
          <span class="label">用户名:</span>
          <span class="value">testuser</span>
          <span class="label">密码:</span>
          <span class="value">password123</span>
        </div>
        <div class="account">
          <span class="label">用户名:</span>
          <span class="value">admin</span>
          <span class="label">密码:</span>
          <span class="value">admin123</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>🔌 可用接口</h2>
      <table>
        <thead>
          <tr>
            <th>方法</th>
            <th>路径</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>POST</code></td>
            <td><code>/api/auth</code></td>
            <td>用户登录</td>
          </tr>
          <tr>
            <td><code>POST</code></td>
            <td><code>/api/bookmark_upload</code></td>
            <td>上传书签到云端</td>
          </tr>
          <tr>
            <td><code>GET</code></td>
            <td><code>/api/bookmark_download</code></td>
            <td>从云端下载书签</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>💡 使用说明</h2>
      <p style="line-height: 1.8; color: #666;">
        1. 确保Chrome扩展已安装并配置了正确的API地址<br>
        2. 点击扩展图标打开弹窗<br>
        3. 使用上述测试账号登录<br>
        4. 开始使用书签同步功能
      </p>
    </div>

    <div class="section">
      <h2>🔧 测试接口</h2>
      <p style="color: #666; margin-bottom: 10px;">使用 curl 测试登录接口：</p>
      <code style="display: block; padding: 15px; background: #2d2d2d; color: #f8f8f2; border-radius: 8px; overflow-x: auto;">
curl -X POST http://localhost:3000/auth/login \\<br>
&nbsp;&nbsp;-H "Content-Type: application/json" \\<br>
&nbsp;&nbsp;-d '{"username":"testuser","password":"password123"}'
      </code>
    </div>

    <div class="footer">
      版本 1.0.0 | X浏览器开发团队
    </div>
  </div>
</body>
</html>
    `);
    return;
  }
  
  // 登录接口
  if (pathname === '/api/auth' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body);
        const user = users.get(username);
        
        if (!user || user.password !== password) {
          sendJson(res, 401, {
            success: false,
            message: '用户名或密码错误',
          });
          return;
        }
        
        const token = generateToken(user.userId);
        
        sendJson(res, 200, {
          success: true,
          token,
          nickname: user.nickname,
          avatar: user.avatar,
          userId: user.userId,
        });
      } catch (error) {
        sendJson(res, 400, {
          success: false,
          message: '请求格式错误',
        });
      }
    });
    return;
  }
  
  // 上传书签
  if (pathname === '/api/bookmark_upload' && req.method === 'POST') {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    const userId = validateToken(token);
    
    if (!userId) {
      sendJson(res, 401, {
        success: false,
        message: '未授权或token已过期',
      });
      return;
    }
    
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { bookmarks, timestamp } = JSON.parse(body);
        
        // 保存书签
        bookmarkStorage.set(userId, {
          bookmarks,
          timestamp,
          updatedAt: Date.now(),
        });
        
        console.log(`用户 ${userId} 上传了书签，时间戳: ${timestamp}`);
        
        sendJson(res, 200, {
          success: true,
          message: '书签上传成功',
          count: countBookmarks(bookmarks),
        });
      } catch (error) {
        sendJson(res, 400, {
          success: false,
          message: '请求格式错误',
        });
      }
    });
    return;
  }
  
  // 下载书签
  if (pathname === '/api/bookmark_download' && req.method === 'GET') {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    const userId = validateToken(token);
    
    if (!userId) {
      sendJson(res, 401, {
        success: false,
        message: '未授权或token已过期',
      });
      return;
    }
    
    const bookmarkData = bookmarkStorage.get(userId);
    
    if (!bookmarkData) {
      sendJson(res, 200, {
        success: true,
        bookmarks: [],
        message: '暂无云端书签',
      });
      return;
    }
    
    sendJson(res, 200, {
      success: true,
      bookmarks: bookmarkData.bookmarks,
      timestamp: bookmarkData.timestamp,
    });
    return;
  }
  
  // 404
  sendJson(res, 404, {
    success: false,
    message: '接口不存在',
  });
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

const PORT = 3000;
server.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('X浏览器书签同步API模拟服务器');
  console.log('='.repeat(60));
  console.log(`服务器运行在: http://localhost:${PORT}`);
  console.log('');
  console.log('测试账号：');
  console.log('  用户名: testuser  密码: password123');
  console.log('  用户名: admin     密码: admin123');
  console.log('');
  console.log('可用接口：');
  console.log('  POST   /api/auth              - 用户登录');
  console.log('  POST   /api/bookmark_upload   - 上传书签');
  console.log('  GET    /api/bookmark_download - 下载书签');
  console.log('='.repeat(60));
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});
