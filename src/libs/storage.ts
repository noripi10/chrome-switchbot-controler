export const getStorageData = async <T>(key: string) => {
  if (typeof chrome.storage === 'undefined') return;
  const item = await chrome.storage.local.get(key);
  if (!Object.keys(item)) return;
  return item[key] as T;
};

export const setStorageData = async (key: string, value: unknown) => {
  await chrome.storage.local.set({ [key]: value });
  return true;
};
