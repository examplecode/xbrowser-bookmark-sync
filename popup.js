// 全局状态
let currentUser = null;
let apiToken = null;

// API配置 - 从 config.js 获取
const API_BASE_URL = getApiBaseUrl();

// DOM元素
const loginView = document.getElementById('loginView');
const mainView = document.getElementById('mainView');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const loginStatus = document.getElementById('loginStatus');
const userAvatar = document.getElementById('userAvatar');
const userNickname = document.getElementById('userNickname');
const bookmarkCount = document.getElementById('bookmarkCount');
const uploadBtn = document.getElementById('uploadBtn');
const downloadBtn = document.getElementById('downloadBtn');
const syncStatus = document.getElementById('syncStatus');
const logoutBtn = document.getElementById('logoutBtn');

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
  initI18n();
  await checkLoginStatus();
  updateBookmarkCount();
});

// 初始化国际化
function initI18n() {
  // 处理带 data-i18n 属性的元素
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const i18nValue = element.getAttribute('data-i18n');
    
    // 处理复合属性格式: [attr1]key1;[attr2]key2;textKey
    // 例如: [href]registerLinkUrl;registerLink
    if (i18nValue.includes('[') || i18nValue.includes(';')) {
      const parts = i18nValue.split(';');
      
      parts.forEach(part => {
        part = part.trim();
        
        // 匹配 [attribute]key 格式
        const attrMatch = part.match(/^\[(\w+)\](.+)$/);
        if (attrMatch) {
          const [, attr, key] = attrMatch;
          const message = chrome.i18n.getMessage(key);
          if (message) {
            element.setAttribute(attr, message);
          }
        } else {
          // 普通文本键
          const message = chrome.i18n.getMessage(part);
          if (message) {
            element.textContent = message;
          }
        }
      });
    } else {
      // 简单的文本替换
      const message = chrome.i18n.getMessage(i18nValue);
      if (message) {
        element.textContent = message;
      }
    }
  });
  
  // 处理 placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const message = chrome.i18n.getMessage(key);
    if (message) {
      element.placeholder = message;
    }
  });
}

// 检查登录状态
async function checkLoginStatus() {
  try {
    const result = await chrome.storage.local.get(['apiToken', 'userInfo']);
    
    if (result.apiToken && result.userInfo) {
      apiToken = result.apiToken;
      currentUser = result.userInfo;
      showMainView();
    } else {
      showLoginView();
    }
  } catch (error) {
    console.error('检查登录状态失败:', error);
    showLoginView();
  }
}

// 显示登录界面
function showLoginView() {
  loginView.classList.remove('hidden');
  mainView.classList.add('hidden');
}

// 显示主界面
function showMainView() {
  loginView.classList.add('hidden');
  mainView.classList.remove('hidden');
  
  if (currentUser) {
    userNickname.textContent = currentUser.nickname || currentUser.username;
    if (currentUser.avatar) {
      userAvatar.src = currentUser.avatar;
    }
  }
  
  updateBookmarkCount();
}

// 登录按钮事件
loginBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!username || !password) {
    showStatus(loginStatus, chrome.i18n.getMessage('inputRequired'), 'error');
    return;
  }
  
  await handleLogin(username, password);
});

// 回车登录
passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    loginBtn.click();
  }
});

// 处理登录
async function handleLogin(username, password) {
  try {
    loginBtn.disabled = true;
    showStatus(loginStatus, chrome.i18n.getMessage('loggingIn'), 'loading');
    
    // 调用登录API
    const response = await fetch(`${API_BASE_URL}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error(chrome.i18n.getMessage('loginFailed'));
    }
    
    const data = await response.json();
    
    if (data.success && data.token) {
      apiToken = data.token;
      currentUser = {
        username: username,
        nickname: data.nickname || username,
        avatar: data.avatar || '',
        userId: data.userId,
      };
      
      // 保存登录信息
      await chrome.storage.local.set({
        apiToken: apiToken,
        userInfo: currentUser,
      });
      
      showStatus(loginStatus, chrome.i18n.getMessage('loginSuccess'), 'success');
      
      // 延迟显示主界面
      setTimeout(() => {
        showMainView();
        usernameInput.value = '';
        passwordInput.value = '';
        loginStatus.textContent = '';
        loginStatus.className = 'status-message';
      }, 1000);
    } else {
      throw new Error(data.message || chrome.i18n.getMessage('loginFailed'));
    }
  } catch (error) {
    console.error('登录错误:', error);
    showStatus(loginStatus, error.message || chrome.i18n.getMessage('loginFailed'), 'error');
  } finally {
    loginBtn.disabled = false;
  }
}

// 更新书签数量
async function updateBookmarkCount() {
  try {
    const bookmarks = await chrome.bookmarks.getTree();
    const count = countBookmarks(bookmarks);
    bookmarkCount.textContent = count;
  } catch (error) {
    console.error('获取书签数量失败:', error);
    bookmarkCount.textContent = '0';
  }
}

// 递归计算书签数量
function countBookmarks(nodes) {
  let count = 0;
  for (const node of nodes) {
    if (node.url) {
      count++;
    }
    if (node.children) {
      count += countBookmarks(node.children);
    }
  }
  return count;
}

// 同步到云端
uploadBtn.addEventListener('click', async () => {
  try {
    uploadBtn.disabled = true;
    downloadBtn.disabled = true;
    showStatus(syncStatus, chrome.i18n.getMessage('syncingToCloud'), 'loading');
    
    // 获取所有书签
    const bookmarks = await chrome.bookmarks.getTree();
    // 只上传实际的书签内容，跳过根节点（id='0'）
    const bookmarkData = bookmarks[0] && bookmarks[0].children 
      ? serializeBookmarks(bookmarks[0].children)
      : [];
    
    // 上传到服务器
    const response = await fetch(`${API_BASE_URL}/api/bookmark_upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        bookmarks: bookmarkData,
        timestamp: Date.now(),
      }),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(chrome.i18n.getMessage('tokenExpired'));
      }
      throw new Error(chrome.i18n.getMessage('syncFailed'));
    }
    
    const data = await response.json();
    
    if (data.success) {
      const count = countBookmarks(bookmarks);
      showStatus(syncStatus, chrome.i18n.getMessage('syncSuccessWithCount', [count.toString()]), 'success');
      setTimeout(() => {
        syncStatus.textContent = '';
        syncStatus.className = 'status-message';
      }, 3000);
    } else {
      throw new Error(data.message || chrome.i18n.getMessage('syncFailed'));
    }
  } catch (error) {
    console.error('上传书签失败:', error);
    showStatus(syncStatus, error.message || chrome.i18n.getMessage('syncFailed'), 'error');
    
    if (error.message.includes(chrome.i18n.getMessage('tokenExpired'))) {
      setTimeout(() => {
        handleLogout();
      }, 2000);
    }
  } finally {
    uploadBtn.disabled = false;
    downloadBtn.disabled = false;
  }
});

// 从云端同步
downloadBtn.addEventListener('click', async () => {
  try {
    downloadBtn.disabled = true;
    uploadBtn.disabled = true;
    showStatus(syncStatus, chrome.i18n.getMessage('syncingFromCloud'), 'loading');
    
    // 从服务器获取书签
    const response = await fetch(`${API_BASE_URL}/api/bookmark_download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(chrome.i18n.getMessage('tokenExpired'));
      }
      throw new Error(chrome.i18n.getMessage('syncFailed'));
    }
    
    const data = await response.json();
    
    if (data.success && data.bookmarks) {
      // 恢复书签到正确的位置
      // Chrome书签结构：
      // '0' - 根节点
      // '1' - 书签栏 (Bookmarks Bar)
      // '2' - 其他书签 (Other Bookmarks)
      // data.bookmarks 应该是一个数组，包含这些主要文件夹
      await restoreBookmarksToRoot(data.bookmarks);
      
      showStatus(syncStatus, chrome.i18n.getMessage('syncSuccess') + '！' + chrome.i18n.getMessage('bookmarksUpdated'), 'success');
      await updateBookmarkCount();
      
      setTimeout(() => {
        syncStatus.textContent = '';
        syncStatus.className = 'status-message';
      }, 3000);
    } else {
      throw new Error(data.message || chrome.i18n.getMessage('syncFailed'));
    }
  } catch (error) {
    console.error('下载书签失败:', error);
    showStatus(syncStatus, error.message || chrome.i18n.getMessage('syncFailed'), 'error');
    
    if (error.message.includes(chrome.i18n.getMessage('tokenExpired'))) {
      setTimeout(() => {
        handleLogout();
      }, 2000);
    }
  } finally {
    downloadBtn.disabled = false;
    uploadBtn.disabled = false;
  }
});

// 序列化书签
function serializeBookmarks(nodes) {
  const result = [];
  
  for (const node of nodes) {
    const item = {
      id: node.id,
      title: node.title,
      url: node.url,
      dateAdded: node.dateAdded,
      dateGroupModified: node.dateGroupModified,
    };
    
    if (node.children) {
      item.children = serializeBookmarks(node.children);
    }
    
    result.push(item);
  }
  
  return result;
}

// 恢复书签到根目录（处理Chrome书签结构）
async function restoreBookmarksToRoot(bookmarkData) {
  // Chrome书签结构：
  // bookmarkData 是一个数组，可能包含：
  // - { id: '1', title: '书签栏', children: [...] }
  // - { id: '2', title: '其他书签', children: [...] }
  // - 或者直接是书签/文件夹的数组
  
  // 获取Chrome书签的主要容器
  const bookmarkBar = '1';      // 书签栏
  const otherBookmarks = '2';   // 其他书签
  
  for (const item of bookmarkData) {
    try {
      // 判断这是否是Chrome的主文件夹（书签栏、其他书签等）
      if (item.id === '1' || item.title === '书签栏' || item.title === 'Bookmarks Bar') {
        // 这是书签栏的数据，恢复到书签栏
        if (item.children && item.children.length > 0) {
          await restoreBookmarks(item.children, bookmarkBar);
        }
      } else if (item.id === '2' || item.title === '其他书签' || item.title === 'Other Bookmarks') {
        // 这是其他书签的数据，恢复到其他书签
        if (item.children && item.children.length > 0) {
          await restoreBookmarks(item.children, otherBookmarks);
        }
      } else {
        // 这是普通的书签或文件夹，默认恢复到书签栏
        // 注意：这里不应该创建新的根文件夹
        if (item.url) {
          // 这是一个书签，检查书签栏中是否已存在
          const existingChildren = await chrome.bookmarks.getChildren(bookmarkBar);
          const exists = existingChildren.find(
            child => child.url && normalizeUrl(child.url) === normalizeUrl(item.url)
          );
          
          if (!exists) {
            await chrome.bookmarks.create({
              parentId: bookmarkBar,
              title: item.title,
              url: item.url,
            });
          }
        } else if (item.children) {
          // 这是一个文件夹
          const existingChildren = await chrome.bookmarks.getChildren(bookmarkBar);
          let folder = existingChildren.find(child => !child.url && child.title === item.title);
          
          if (!folder) {
            folder = await chrome.bookmarks.create({
              parentId: bookmarkBar,
              title: item.title,
            });
          }
          
          // 递归恢复子项
          await restoreBookmarks(item.children, folder.id);
        }
      }
    } catch (error) {
      console.error('恢复书签项失败:', item, error);
    }
  }
}

// URL标准化函数：使用URL API进行严格规范化
function normalizeUrl(url) {
  if (!url) return '';
  
  try {
    // 1. 首先尝试多次解码，直到无法再解码
    let decodedUrl = url;
    let previousUrl = '';
    let maxIterations = 5; // 防止无限循环
    let iterations = 0;
    
    while (decodedUrl !== previousUrl && iterations < maxIterations) {
      previousUrl = decodedUrl;
      try {
        const newUrl = decodeURIComponent(decodedUrl);
        // 只有当解码后确实有变化时才继续
        if (newUrl !== decodedUrl) {
          decodedUrl = newUrl;
        } else {
          break;
        }
      } catch (e) {
        // 无法继续解码，使用当前结果
        break;
      }
      iterations++;
    }
    
    // 2. 尝试使用URL API规范化
    try {
      const urlObj = new URL(decodedUrl);
      
      // 3. 规范化处理
      // - 移除尾部斜杠（除非是根路径）
      let pathname = urlObj.pathname;
      if (pathname.length > 1 && pathname.endsWith('/')) {
        pathname = pathname.slice(0, -1);
      }
      
      // - 移除默认端口
      let port = urlObj.port;
      if ((urlObj.protocol === 'http:' && port === '80') ||
          (urlObj.protocol === 'https:' && port === '443')) {
        port = '';
      }
      
      // - 构建规范化URL（保留hash，因为单页应用可能需要）
      const normalizedUrl = 
        urlObj.protocol + '//' + 
        urlObj.hostname.toLowerCase() + 
        (port ? ':' + port : '') +
        pathname +
        urlObj.search +
        urlObj.hash;
      
      return normalizedUrl.toLowerCase().trim();
    } catch (urlError) {
      // URL API解析失败，说明URL格式无效
      // 回退到字符串比较（完全解码后的URL）
      return decodedUrl.toLowerCase().trim();
    }
  } catch (error) {
    // 如果所有处理都失败，返回原始URL的小写形式
    console.warn('URL规范化失败:', url, error);
    return url.toLowerCase().trim();
  }
}

// 恢复书签（智能合并模式）
async function restoreBookmarks(bookmarkData, parentId = '1') {
  // 获取当前父节点下的所有子节点
  const existingChildren = await chrome.bookmarks.getChildren(parentId);
  
  for (const item of bookmarkData) {
    try {
      if (item.url) {
        // 检查书签是否已存在（基于URL规范化比较）
        const exists = existingChildren.find(
          child => child.url && normalizeUrl(child.url) === normalizeUrl(item.url)
        );
        
        if (!exists) {
          // 书签不存在，创建新书签
          await chrome.bookmarks.create({
            parentId: parentId,
            title: item.title,
            url: item.url,
          });
        } else {
          // 书签已存在，更新标题（如果不同）
          if (exists.title !== item.title) {
            await chrome.bookmarks.update(exists.id, {
              title: item.title,
            });
          }
        }
      } else if (item.children && item.children.length > 0) {
        // 检查文件夹是否已存在（基于标题）
        let folder = existingChildren.find(child => !child.url && child.title === item.title);
        
        if (!folder) {
          // 文件夹不存在，创建新文件夹
          folder = await chrome.bookmarks.create({
            parentId: parentId,
            title: item.title,
          });
        }
        
        // 递归恢复子书签（合并到已存在的文件夹）
        await restoreBookmarks(item.children, folder.id);
      }
    } catch (error) {
      console.error('恢复书签项失败:', item, error);
    }
  }
}

// 退出登录
logoutBtn.addEventListener('click', () => {
  if (confirm(chrome.i18n.getMessage('logoutConfirm'))) {
    handleLogout();
  }
});

async function handleLogout() {
  try {
    await chrome.storage.local.remove(['apiToken', 'userInfo']);
    apiToken = null;
    currentUser = null;
    showLoginView();
  } catch (error) {
    console.error('退出登录失败:', error);
  }
}

// 显示状态消息
function showStatus(element, message, type) {
  element.textContent = message;
  element.className = `status-message ${type}`;
}
