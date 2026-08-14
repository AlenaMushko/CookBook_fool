export const getDeviceId = () => {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = Math.random().toString(36).substring(2);
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
};
