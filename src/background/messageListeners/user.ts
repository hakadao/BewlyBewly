import browser from 'webextension-polyfill'

function handleMessage(message: any) {
  // https://github.com/SocialSisterYi/bilibili-API-collect/blob/e379d904c2753fa30e9083f59016f07e89d19467/docs/login/login_info.md#%E5%AF%BC%E8%88%AA%E6%A0%8F%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF
  if (message.contentScriptQuery === 'getUserInfo') {
    const url = 'https://api.bilibili.com/x/web-interface/nav'
    return fetch(url)
      .then(response => response.json())
      .then(data => (data))
      .catch(error => console.error(error))
  }

  else if (message.contentScriptQuery === 'getUserStat') {
    const url = 'https://api.bilibili.com/x/web-interface/nav/stat'
    return fetch(url)
      .then(response => response.json())
      .then(data => (data))
      .catch(error => console.error(error))
  }
}

function handleConnect() {
  browser.runtime.onMessage.removeListener(handleMessage)
  browser.runtime.onMessage.addListener(handleMessage)
}

export function setupUserMsgLstnr() {
  browser.runtime.onConnect.removeListener(handleConnect)
  browser.runtime.onConnect.addListener(handleConnect)
}
