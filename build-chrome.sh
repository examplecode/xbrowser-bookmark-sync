#!/bin/bash

# Chrome 扩展构建脚本
# 使用方法: ./build-chrome.sh

echo "🌐 开始构建 Chrome 扩展..."

# 检查 manifest.chrome.json 或 manifest.chrome.json.backup 是否存在
if [ -f "manifest.chrome.json.backup" ]; then
  echo "🔄 恢复 Chrome manifest..."
  cp manifest.chrome.json.backup manifest.json
  echo "✅ Chrome 扩展构建完成！"
elif [ -f "manifest.json" ]; then
  # 检查当前的 manifest 是否是 Chrome 版本 (Manifest V3)
  if grep -q '"manifest_version": 3' manifest.json; then
    echo "✅ 当前已是 Chrome 版本！"
  else
    echo "⚠️  当前 manifest.json 不是 Chrome 版本"
    echo "请确保你有正确的 Chrome manifest 文件"
    exit 1
  fi
else
  echo "❌ 错误: 找不到 Chrome manifest 文件"
  exit 1
fi

echo ""
echo "📝 下一步操作："
echo "1. 打开 Chrome 浏览器"
echo "2. 在地址栏输入: chrome://extensions/"
echo "3. 开启右上角的 '开发者模式'"
echo "4. 点击 '加载已解压的扩展程序'"
echo "5. 选择本目录"
