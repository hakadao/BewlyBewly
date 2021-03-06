import { setupAuthAPIs } from './auth'
import { setupVideosAPIs } from './videos'
import { setupUserAPIs } from './user'
import { setupSearchAPIs } from './search'
import { setupNotificationsAPIs } from './notifications'
import { setupMomentsAPIs } from './moments'

export const APP_URL = 'https://app.bilibili.com'
export const API_URL = 'https://api.bilibili.com'

export const setupAllAPIs = () => {
  setupAuthAPIs()
  setupVideosAPIs()
  setupUserAPIs()
  setupSearchAPIs()
  setupNotificationsAPIs()
  setupMomentsAPIs()
}
