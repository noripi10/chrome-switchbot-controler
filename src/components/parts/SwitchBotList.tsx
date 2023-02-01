import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Box, Center, Heading, Spacer, Spinner, useDisclosure, useToast } from '@chakra-ui/react';

import { getStorageData, setStorageData } from '@src/libs/storage';
import { AllDevices, GetDeviceResult } from '@src/pages/background/fetcher';
import { getDiffMinutesNow } from '@src/libs/day';

import { DeviceItem } from '@src/components/parts/SwitchBotItem';
import { EditModal } from '@src/components/parts/EditModal';
import { EditButton } from '@src/components/parts/EditBotton';
import { ReloadButton } from '@src/components/parts/ReloadButton';
import { DEVICE_INFO_LAST_GET_TIME, GET_DEVICES, MY_SWITC_BOT_DEVICES, MY_SWITC_BOT_TOKEN } from '@src/libs/constants';

let isFirst = true;

const SwithcBotList = () => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<AllDevices | undefined>();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const init = async () => {
    let lastUpdateTime = new Date().toISOString();
    try {
      lastUpdateTime = (await getStorageData<string>(DEVICE_INFO_LAST_GET_TIME)) ?? lastUpdateTime;
    } catch (error) {
      console.error(error);
    }
    const diff = getDiffMinutesNow(lastUpdateTime);

    // 1分経過後に再度POPUPを開いたら再取得
    if (diff >= -1) {
      const saveDevices = await getStorageData<AllDevices>(MY_SWITC_BOT_DEVICES);
      if (saveDevices) {
        setDevices(saveDevices);
        setLoading(false);
        return;
      }
    }

    await getCurrentDevices();
    return;
  };

  const getCurrentDevices = async () => {
    flushSync(() => {
      try {
        setLoading(true);
        getStorageData<string>(MY_SWITC_BOT_TOKEN).then((token) => {
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
        });
      } catch (e) {
        console.warn({ e });
      }
      setLoading(false);
    });
  };

  const setDeviceStatus = (deviceType: 'device' | 'remoteDevice', deviceId: string, status: number) => {
    // devicesが無い+online系Statusが無い場合、処理しない
    if (!devices) return;
    // 100: online, 161,171: offline
    if (![100, 161, 171].some((e) => e === status)) return;

    const result = devices;

    if (deviceType === 'device') {
      const newDeviceList = devices.deviceList?.map((device) => {
        if (device.deviceId === deviceId) {
          device.online = status === 100 ? true : 161 === status ? false : device.online;
          device.status = device.online ? 'online' : 'offline';
          device.statusColor = device.online ? '#4ba01d' : '#c03a3a';
        }
        return device;
      });

      result.deviceList = newDeviceList;
    }

    if (deviceType === 'remoteDevice') {
      const newInfraredRemoteList = devices.infraredRemoteList?.map((device) => {
        if (device.deviceId === deviceId) {
          device.online = status === 100 ? true : 171 === status ? false : device.online;
          device.status = device.online ? 'online' : 'offline';
          device.statusColor = device.online ? '#4ba01d' : '#c03a3a';
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

      {loading && (
        <Center position={'absolute'} top={0} left={0} right={0} bottom={0}>
          <Spinner size='lg' color='#E0393A' />
        </Center>
      )}
    </>
  );
};

export default SwithcBotList;
