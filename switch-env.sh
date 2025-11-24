#!/bin/bash

# 环境切换脚本
# 用法: ./switch-env.sh [dev|prod]

CONFIG_FILE="config.js"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ 错误: 找不到 config.js 文件"
    exit 1
fi

if [ $# -eq 0 ]; then
    # 显示当前环境
    if grep -q "isDevelopment: true" "$CONFIG_FILE"; then
        echo "📍 当前环境: 开发环境 (Development)"
        echo "   API地址: http://localhost:3000"
    else
        echo "📍 当前环境: 生产环境 (Production)"
        echo "   中文API: https://api.xbrowser.cn"
        echo "   英文API: https://api.xbrowser.com"
    fi
    echo ""
    echo "用法: ./switch-env.sh [dev|prod]"
    echo "  dev  - 切换到开发环境"
    echo "  prod - 切换到生产环境"
    exit 0
fi

case $1 in
    dev|development)
        sed -i '' 's/isDevelopment: false/isDevelopment: true/' "$CONFIG_FILE"
        echo "✅ 已切换到开发环境"
        echo "   API地址: http://localhost:3000"
        echo ""
        echo "⚠️  请在Chrome扩展管理页面重新加载扩展"
        ;;
    prod|production)
        sed -i '' 's/isDevelopment: true/isDevelopment: false/' "$CONFIG_FILE"
        echo "✅ 已切换到生产环境"
        echo "   中文API: https://api.xbrowser.cn"
        echo "   英文API: https://api.xbrowser.com"
        echo ""
        echo "⚠️  请在Chrome扩展管理页面重新加载扩展"
        ;;
    *)
        echo "❌ 无效的参数: $1"
        echo "用法: ./switch-env.sh [dev|prod]"
        exit 1
        ;;
esac
