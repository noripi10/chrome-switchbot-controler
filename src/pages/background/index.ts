import { getDeviceList, postPowerToggle } from './fetcher';

const init = () => {
  chrome.runtime.onMessage.addListener((message, sender, callback) => {
    try {
      console.log({ message });
      if (message.type === 'GET_DEVICES') {
        getDeviceList(message).then(callback, callback);
        return true;
      }

      if (message.type === 'DEVICE_POWER_ON') {
        postPowerToggle(message).then(callback, callback);
        return true;
      }

      if (message.type === 'DEVICE_POWER_OFF') {
        postPowerToggle(message).then(callback, callback);
        return true;
      }
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        throw new Error(e.message);
      }

      throw new Error("Can't SwitchBot Deviece");
    }
  });
};

init();
