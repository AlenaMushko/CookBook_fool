import { LOCAL_STORAGE } from '@constants/localStorage'

export const getDeviceId = () => {
  let deviceId = localStorage.getItem(LOCAL_STORAGE.DEVICE_ID)
  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem(LOCAL_STORAGE.DEVICE_ID, deviceId)
  }
  return deviceId
}
