import { FC, useEffect, useState } from 'react';
import { Box, Center, Heading, Spacer, useDisclosure, useToast } from '@chakra-ui/react';

import { getStorageData, setStorageData } from '@src/libs/storage';
import { AllDevices, GetDeviceResult } from '@src/pages/background/fetcher';
import { getDiffMinutesNow } from '@src/libs/day';

import { DeviceItem } from '@src/components/parts/SwitchBotItem';
import { EditModal } from '@src/components/parts/EditModal';
import { EditButton } from '@src/components/parts/EditBotton';
import { ReloadButton } from '@src/components/parts/ReloadButton';
import { DEVICE_INFO_LAST_GET_TIME, GET_DEVICES, MY_SWITC_BOT_DEVICES, MY_SWITC_BOT_TOKEN } from '@src/libs/constants';

let isFirst = true;

const SwithcBotList: FC = () => {
  const [devices, setDevices] = useState<AllDevices | undefined>();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const init = async () => {
    let lastUpdateTime = new Date().toISOString();
    try {
      lastUpdateTime = (await getStorageData<string>(DEVICE_INFO_LAST_GET_TIME)) ?? lastUpdateTime;
    } catch (error) {
      console.info('get fail lastUpdateTime');
    }
    const diff = getDiffMinutesNow(lastUpdateTime);

    if (diff >= -3) {
      const saveDevices = await getStorageData<AllDevices>(MY_SWITC_BOT_DEVICES);
      // console.log({ devices });
      if (saveDevices) {
        setDevices(saveDevices);
        return;
      }
    }

    await getCurrentDevices();
    return;
  };

  const getCurrentDevices = async () => {
    const token = await getStorageData<string>(MY_SWITC_BOT_TOKEN);
    chrome.runtime.sendMessage({ type: GET_DEVICES, token }, (response: GetDeviceResult | undefined) => {
      // console.log({ response });
      if (response?.message === 'success') {
        setStorageData(MY_SWITC_BOT_DEVICES, response.body);
        setDevices(response.body);
        // 前回取得時間をセット
        setStorageData(DEVICE_INFO_LAST_GET_TIME, new Date().toISOString());
      } else {
        setStorageData(MY_SWITC_BOT_DEVICES, []);
        setDevices(undefined);
        toast({
          title: 'Device Not Found',
          status: 'warning',
          position: 'bottom',
        });
      }
    });
  };

  const setDeviceStatus = (deviceType: 'device' | 'remoteDevice', deviceId: string, status: number) => {
    // devicesが無い+online系Statusが無い場合、処理しない
    if (!devices) return;
    if (![100, 161, 171].some((e) => e === status)) return;

    const result = devices;

    if (deviceType === 'device') {
      const newDeviceList = devices.deviceList?.map((device) => {
        if (device.deviceId === deviceId) {
          device.online = status === 100 ? true : 161 === status ? false : device.online;
        }
        return device;
      });

      result.deviceList = newDeviceList;
    }

    if (deviceType === 'remoteDevice') {
      const newInfraredRemoteList = devices.infraredRemoteList?.map((device) => {
        if (device.deviceId === deviceId) {
          device.online = status === 100 ? true : 171 === status ? false : device.online;
        }
        return device;
      });
      result.infraredRemoteList = newInfraredRemoteList;
    }

    setDevices(result);
    setStorageData(MY_SWITC_BOT_DEVICES, result);
  };

  useEffect(() => {
    if (isFirst) {
      isFirst = false;
      init();
    }

    return () => {
      isFirst = true;
    };
  }, []);

  return (
    <>
      <Box display={'flex'} flexDir='column' justifyContent={'flex-start'} pl='6' pr='8' py='4' overflowY={'auto'}>
        <Heading as='h3' fontSize={'sm'}>
          Device
        </Heading>
        <Box display={'flex'} flexWrap={'wrap'}>
          {devices?.deviceList?.map((device) => (
            <DeviceItem key={device.deviceId} device={device} setDeviceStatus={setDeviceStatus} />
          ))}
        </Box>
        <Spacer py={2} />
        <Heading as='h3' fontSize={'sm'}>
          Remote Device
        </Heading>
        <Box display={'flex'} flexWrap={'wrap'}>
          {devices?.infraredRemoteList?.map((device) => (
            <DeviceItem key={device.deviceId} device={device} setDeviceStatus={setDeviceStatus} />
          ))}
        </Box>
      </Box>
      <Center position={'absolute'} right={5} bottom={8} flexDir='column'>
        <EditButton modalOpen={onOpen} />
        <Spacer py={3} />
        <ReloadButton reload={getCurrentDevices} />
      </Center>
      <EditModal isOpen={isOpen} closeModal={onClose} reload={getCurrentDevices} />
    </>
  );
};

export default SwithcBotList;
