#!/bin/bash

echo "======================================"
echo "X浏览器书签同步助手 - 开发环境"
echo "======================================"
echo ""
echo "正在启动模拟API服务器..."
echo ""
echo "测试账号："
echo "  用户名: testuser  密码: password123"
echo "  用户名: admin     密码: admin123"
echo ""
echo "请按照以下步骤操作："
echo "1. 在浏览器中打开 create-icons.html 生成图标"
echo "2. 将图标文件放入 icons/ 文件夹"
echo "3. 在Chrome中加载扩展程序"
echo "4. 使用测试账号登录"
echo ""
echo "API服务器运行在: http://localhost:3000"
echo "======================================"
echo ""

# 启动API服务器
node api-server.js
