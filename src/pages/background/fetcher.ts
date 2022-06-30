export type GetDeviceResult = {
  statusCode: number;
  body: AllDevices;
  message: string;
};

export type Device = {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  hubDeviceId: string;
};

export type RemoteDevice = {
  deviceId: string;
  deviceName: string;
  remoteType: string;
  hubDeviceId: string;
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

export const getDeviceList = async (param: GetProps) => {
  console.log({ param });
  const result = await fetch('https://api.switch-bot.com/v1.0/devices', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: param.token,
    },
  });
  const data = (await result.json()) as GetDeviceResult;
  console.log({ data });
  return data;
};

export const postPowerToggle = async (param: PostProps) => {
  console.log({ param });
  const result = await fetch(`https://api.switch-bot.com/v1.0/devices/${param.deviceId}/commands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: param.token,
    },
    body: JSON.stringify({
      command: param.command,
      parameter: 'default',
      commandType: 'command',
    }),
  });

  const data = (await result.json()) as PostDeviceCommandResult;
  console.log({ data });
  return data;
};
