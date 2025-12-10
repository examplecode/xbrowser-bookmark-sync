/**
 * 浏览器兼容性适配层
 * 统一 Chrome 和 Firefox 的 API 差异
 */

// 检测浏览器类型
const isFirefox = typeof browser !== 'undefined' && browser.runtime;
const isChrome = typeof chrome !== 'undefined' && chrome.runtime;

// 创建统一的浏览器API对象
const browserAPI = (() => {
  if (isFirefox) {
    // Firefox 使用 browser.* 命名空间，原生支持 Promise
    return browser;
  } else if (isChrome) {
    // Chrome 使用 chrome.* 命名空间
    // 检查是否已经有 Promise 支持（Chrome 新版本）
    if (chrome.bookmarks && chrome.bookmarks.getTree && 
        chrome.bookmarks.getTree.constructor.name === 'AsyncFunction') {
      return chrome;
    }
    
    // 为旧版 Chrome 创建 Promise 包装器
    const wrappedChrome = {};
    
    // 包装需要的 API
    const apisToWrap = ['bookmarks', 'storage', 'runtime', 'i18n'];
    
    apisToWrap.forEach(apiName => {
      if (!chrome[apiName]) return;
      
      wrappedChrome[apiName] = {};
      
      for (const methodName in chrome[apiName]) {
        const method = chrome[apiName][methodName];
        
        if (typeof method === 'function') {
          // 对于回调式的方法，包装成 Promise
          wrappedChrome[apiName][methodName] = function(...args) {
            return new Promise((resolve, reject) => {
              chrome[apiName][methodName](...args, (result) => {
                if (chrome.runtime.lastError) {
                  reject(new Error(chrome.runtime.lastError.message));
                } else {
                  resolve(result);
                }
              });
            });
          };
        } else {
          // 非函数属性直接复制
          wrappedChrome[apiName][methodName] = method;
        }
      }
    });
    
    // i18n 的特殊处理（同步方法不需要包装）
    wrappedChrome.i18n = {
      getMessage: chrome.i18n.getMessage.bind(chrome.i18n),
      getUILanguage: chrome.i18n.getUILanguage.bind(chrome.i18n),
    };
    
    return wrappedChrome;
  }
  
  throw new Error('不支持的浏览器');
})();

// 导出浏览器信息
const browserInfo = {
  isFirefox,
  isChrome,
  name: isFirefox ? 'Firefox' : 'Chrome',
};

// 将 browserAPI 挂载到全局
if (typeof window !== 'undefined') {
  window.browserAPI = browserAPI;
  window.browserInfo = browserInfo;
}
