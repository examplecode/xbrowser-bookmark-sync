#!/bin/bash

# Firefox 扩展构建脚本
# 使用方法: ./build-firefox.sh

echo "🦊 开始构建 Firefox 扩展..."

# 检查 manifest.firefox.json 是否存在
if [ ! -f "manifest.firefox.json" ]; then
  echo "❌ 错误: manifest.firefox.json 文件不存在"
  exit 1
fi

# 备份当前的 manifest.json (如果存在)
if [ -f "manifest.json" ]; then
  echo "📦 备份当前的 manifest.json..."
  cp manifest.json manifest.chrome.json.backup
fi

# 使用 Firefox 版本的 manifest
echo "🔄 使用 Firefox manifest..."
cp manifest.firefox.json manifest.json

echo "✅ Firefox 扩展构建完成！"
echo ""
echo "📝 下一步操作："
echo "1. 打开 Firefox 浏览器"
echo "2. 在地址栏输入: about:debugging#/runtime/this-firefox"
echo "3. 点击 '临时载入附加组件'"
echo "4. 选择本目录下的 manifest.json 文件"
echo ""
echo "💡 提示: 如需恢复 Chrome 版本，请运行: cp manifest.chrome.json.backup manifest.json"
