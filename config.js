/**
 * X浏览器书签同步 - 配置文件
 * 
 * 使用说明：
 * 1. 开发环境：设置 ENV.isDevelopment = true
 * 2. 生产环境：设置 ENV.isDevelopment = false
 * 3. API地址会根据浏览器语言自动选择
 */

// 环境配置
const ENV = {
  // 开发模式开关：true=开发环境，false=生产环境
  isDevelopment: false,
  
  // 开发环境API地址
  development: {
    apiUrl: 'http://localhost:3000'
  },
  
  // 生产环境API地址（根据语言）
  production: {
    // 中文环境（zh-CN, zh-TW, zh-HK等）
    zh: 'https://www.xbext.com',
    
    // 英文及其他语言环境
    en: 'https://en.xbext.com',
    
    // 可以添加更多语言的专属服务器
    // ja: 'https://api.xbrowser.jp',  // 日语
    // ko: 'https://api.xbrowser.kr',  // 韩语
  }
};

/**
 * 获取API基础URL
 * @returns {string} API服务器地址
 */
function getApiBaseUrl() {
  // 使用兼容性 API
  const chromeAPI = typeof browserAPI !== 'undefined' ? browserAPI : (typeof browser !== 'undefined' ? browser : chrome);
  
  // 开发环境：使用本地测试服务器
  if (ENV.isDevelopment) {
    console.log('[环境] 开发模式 - API地址:', ENV.development.apiUrl);
    return ENV.development.apiUrl;
  }
  
  // 生产环境：根据浏览器语言选择API服务器
  const browserLanguage = chromeAPI.i18n.getUILanguage(); // 例如: "zh-CN", "en-US", "ja"
  console.log('[环境] 生产模式 - 浏览器语言:', browserLanguage);
  
  // 提取主语言代码（zh-CN -> zh）
  const primaryLanguage = browserLanguage.split('-')[0].toLowerCase();
  
  // 根据语言选择服务器
  let apiUrl;
  if (primaryLanguage === 'zh') {
    // 中文环境使用中国服务器
    apiUrl = ENV.production.zh;
  } else if (primaryLanguage === 'en') {
    // 英文环境使用国际服务器
    apiUrl = ENV.production.en;
  } else if (ENV.production[primaryLanguage]) {
    // 其他已配置的语言使用专属服务器
    apiUrl = ENV.production[primaryLanguage];
  } else {
    // 未配置的语言默认使用英文服务器
    apiUrl = ENV.production.en;
  }
  
  console.log('[环境] API地址:', apiUrl);
  return apiUrl;
}

/**
 * 获取当前环境信息（用于调试）
 * @returns {object} 环境信息
 */
function getEnvironmentInfo() {
  const chromeAPI = typeof browserAPI !== 'undefined' ? browserAPI : (typeof browser !== 'undefined' ? browser : chrome);
  
  return {
    isDevelopment: ENV.isDevelopment,
    language: chromeAPI.i18n.getUILanguage(),
    apiUrl: getApiBaseUrl(),
    version: chromeAPI.runtime.getManifest().version
  };
}
