// 后台服务脚本

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('X浏览器书签同步助手已安装');
    
    // 初始化存储
    chrome.storage.local.set({
      installedAt: Date.now(),
    }).catch(error => {
      console.error('初始化存储失败:', error);
    });
  } else if (details.reason === 'update') {
    console.log('X浏览器书签同步助手已更新至 v1.0.1');
  }
});

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ping') {
    sendResponse({ status: 'ok' });
  }
  return true;
});

