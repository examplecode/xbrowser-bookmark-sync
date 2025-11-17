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

// 定期检查token有效性（可选）
// 注意：需要在manifest.json中添加 "alarms" 权限
if (chrome.alarms) {
  chrome.alarms.create('checkTokenValidity', {
    periodInMinutes: 60, // 每小时检查一次
  }).catch(error => {
    console.error('创建定时器失败:', error);
  });

  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'checkTokenValidity') {
      try {
        const result = await chrome.storage.local.get(['apiToken']);
        if (result.apiToken) {
          // 这里可以添加验证token的逻辑
          console.log('检查token有效性');
        }
      } catch (error) {
        console.error('检查token失败:', error);
      }
    }
  });
}
