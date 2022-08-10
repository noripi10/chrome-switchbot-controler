export type GetDeviceResult = {
  statusCode: number;
  body: AllDevices;
  message: string;
};

export type GetDeviceStatusResult = {
  statusCode: number;
  body: any;
  message: string;
};

export type Device = {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  hubDeviceId: string;
  deviceMark: string;
  online?: boolean;
  status?: string;
  statusColor?: string;
};

export type RemoteDevice = {
  deviceId: string;
  deviceName: string;
  remoteType: string;
  hubDeviceId: string;
  hubDeviceMark?: string;
  online?: boolean;
  status?: string;
  statusColor?: string;
};

export type AllDevices = {
  deviceList: Device[] | undefined;
  infraredRemoteList: RemoteDevice[] | undefined;
};

export type PostDeviceCommandResult = {
  statusCode: number;
  body: any;
  message: string;
};

export type GetProps = {
  type: 'GET_DEVICES';
  token: string;
};

export type PostProps = {
  type: 'DEVICE_POWER_ON' | 'DEVICE_POWER_OFF';
  token: string;
  deviceId: string;
  command: string;
};

const DEVICE_MARKS = ['★', '●', '▲', '■', '◆', '◎', '⌘', '♪', '∮', '☆'];

export const getDeviceOnlineStatus = async (deviceId: string, token: string) => {
  const result = await fetch(`https://api.switch-bot.com/v1.0/devices/${deviceId}/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });

  const { statusCode, message } = (await result.json()) as GetDeviceStatusResult;
  console.info('status result', statusCode, message);

  return statusCode === 100 && !!message.match(/success/);
};

export const getDeviceList = async (param: GetProps) => {
  // console.log({ param });
  const result = await fetch('https://api.switch-bot.com/v1.0/devices', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: param.token,
    },
  });
  const data = (await result.json()) as GetDeviceResult;

  // Hub MiniのデバイスステータスはAPIで取得できない
  // https://github.com/OpenWonderLabs/SwitchBotAPI#description
  if (data.body.deviceList) {
    const deviceList = await Promise.all(
      data.body.deviceList.map(
        async (device, index) =>
          await getDeviceOnlineStatus(device.deviceId, param.token).then((res) => {
            const online = res;
            const status = device.deviceType === 'Hub Mini' ? '---' : res ? 'online' : 'offline';
            const statusColor = device.deviceType === 'Hub Mini' ? '#ababab' : res ? '#4ba01d' : '#c03a3a';
            return { ...device, deviceMark: DEVICE_MARKS[index], online, status, statusColor };
          })
      )
    );

    let infraredRemoteList = data.body.infraredRemoteList;
    if (deviceList && data.body.infraredRemoteList) {
      infraredRemoteList = infraredRemoteList?.map((remoteDevice) => {
        const res = deviceList.find((e) => e.deviceId === remoteDevice.hubDeviceId);
        const online = res?.deviceType === 'Hub Mini' ? false : res?.online;
        const status = '---';
        const statusColor = '#ababab';
        return { ...remoteDevice, hubDeviceMark: res?.deviceMark, online, status, statusColor };
      });
    }

    return { ...data, body: { deviceList, infraredRemoteList } } as GetDeviceResult;
  }
  return data;
};

export const postPowerToggle = async (param: PostProps) => {
  // console.log({ param });
  const result = await fetch(`https://api.switch-bot.com/v1.0/devices/${param.deviceId}/commands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf8',
      Authorization: param.token,
    },
    body: JSON.stringify({
      command: param.command,
      parameter: 'default',
      commandType: 'command',
    }),
  });

  const data = (await result.json()) as PostDeviceCommandResult;
  return data;
};
