import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Stack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { AiOutlineReload } from 'react-icons/ai';
import { BiDevices } from 'react-icons/bi';

import { getStorageData, setStorageData } from '@src/libs/storage';
import { AllDevices, Device, GetDeviceResult, RemoteDevice } from '@src/pages/background/fetcher';
import { startTransition, useEffect, useState } from 'react';
import { DEVICE_POWER_ON, GET_DEVICES, MY_SWITC_BOT_DEVICES, MY_SWITC_BOT_TOKEN } from '../constants';

export const SwithcBotList = () => {
  const [devices, setDevices] = useState<AllDevices | undefined>();

  const init = async () => {
    const devices = await getStorageData<AllDevices>(MY_SWITC_BOT_DEVICES);
    console.log({ devices });
    if (devices) {
      setDevices(devices);
      return;
    }

    await getCurrentDevices();
  };

  const getCurrentDevices = async () => {
    const token = await getStorageData<string>(MY_SWITC_BOT_TOKEN);
    chrome.runtime.sendMessage({ type: GET_DEVICES, token }, (response: GetDeviceResult | undefined) => {
      console.log({ response });
      if (response) {
        setStorageData(MY_SWITC_BOT_DEVICES, response.body);
        setDevices(response.body);
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Box display={'flex'} flexDir='column' justifyContent={'flex-start'} px='8' py='4' overflowY={'scroll'}>
        <Heading as='h3' fontSize={'sm'}>
          デバイス
        </Heading>
        <Box display={'flex'} flexWrap={'wrap'}>
          {devices?.deviceList?.map((device) => (
            <DeviceItem key={device.deviceId} device={device} />
          ))}
        </Box>
        <Spacer py={4} />
        <Heading as='h3' fontSize={'sm'}>
          リモートデバイス
        </Heading>
        <Box display={'flex'} flexWrap={'wrap'}>
          {devices?.infraredRemoteList?.map((device) => (
            <RemoteDeviceItem key={device.deviceId} device={device} />
          ))}
        </Box>
      </Box>
      <Center position={'absolute'} right={8} bottom={8}>
        <Tooltip label='再取得'>
          <IconButton
            aria-label='再取得'
            bgColor={'#E0393A'}
            width='12'
            height='12'
            borderRadius={'full'}
            icon={<AiOutlineReload size={'24'} color='#fff' />}
            _hover={{ bgColor: 'red.300' }}
            onClick={getCurrentDevices}
          />
        </Tooltip>
      </Center>
    </>
  );
};

const DeviceItem = ({ device }: { device: Device }) => {
  const [status, setStatus] = useState('');

  const onOn = async () => {
    const token = await getStorageData(MY_SWITC_BOT_TOKEN);
    chrome.runtime.sendMessage(
      { type: DEVICE_POWER_ON, deviceId: device.deviceId, token, command: 'turnOn' },
      (response) => {
        console.log({ response });
        if (response) {
          setStatus(response.message);
          startTransition(() => {
            setTimeout(() => setStatus(''), 1500);
          });
        }
      }
    );
  };

  const onOff = async () => {
    const token = await getStorageData(MY_SWITC_BOT_TOKEN);
    chrome.runtime.sendMessage(
      { type: DEVICE_POWER_ON, deviceId: device.deviceId, token, command: 'turnOff' },
      (response) => {
        console.log({ response });
        if (response) {
          setStatus(response.message);
          startTransition(() => {
            setTimeout(() => setStatus(''), 1500);
          });
        }
      }
    );
  };

  return (
    <Stack p={4} borderColor='gray.400' borderRadius='md' borderWidth={1} w='56' h='32' m={1}>
      <HStack flex={1}>
        <Center p={4} flex={1} bgColor='gray.200' borderRadius={8}>
          <BiDevices size={32} />
        </Center>

        <VStack flex={2}>
          <Text fontWeight={'bold'}>{device.deviceName}</Text>
          <Text>{device.deviceType}</Text>
          <HStack flex={1} justify='center' align='center'>
            <Button size='xs' bgColor='gray.400' onClick={onOn}>
              ON
            </Button>
            <Button size='xs' bgColor='gray.400' onClick={onOff}>
              OFF
            </Button>
          </HStack>
          <Box h={4}>
            <Text>{status ?? ''}</Text>
          </Box>
        </VStack>
      </HStack>
    </Stack>
  );
};

const RemoteDeviceItem = ({ device }: { device: RemoteDevice }) => {
  const [status, setStatus] = useState('');

  const onOn = async () => {
    const token = await getStorageData(MY_SWITC_BOT_TOKEN);
    chrome.runtime.sendMessage(
      { type: DEVICE_POWER_ON, deviceId: device.deviceId, token, command: 'turnOn' },
      (response) => {
        console.log({ response });
        if (response) {
          setStatus(response.message);
          startTransition(() => {
            setTimeout(() => setStatus(''), 1500);
          });
        }
      }
    );
  };

  const onOff = async () => {
    const token = await getStorageData(MY_SWITC_BOT_TOKEN);
    chrome.runtime.sendMessage(
      { type: DEVICE_POWER_ON, deviceId: device.deviceId, token, command: 'turnOff' },
      (response) => {
        console.log({ response });
        if (response) {
          setStatus(response.message);
          startTransition(() => {
            setTimeout(() => setStatus(''), 1500);
          });
        }
      }
    );
  };

  return (
    <Stack p={4} borderColor='gray.400' borderRadius='md' borderWidth={1} w='56' h='32' m={1}>
      <HStack flex={1}>
        <Center p={4} flex={1} bgColor='gray.200' borderRadius={8}>
          <BiDevices size={32} />
        </Center>

        <VStack flex={2}>
          <Text fontWeight={'bold'}>{device.deviceName}</Text>
          <Text>{device.remoteType}</Text>
          <HStack flex={1} justify='center' align='center'>
            <Button size='xs' bgColor='gray.400' onClick={onOn}>
              ON
            </Button>
            <Button size='xs' bgColor='gray.400' onClick={onOff}>
              OFF
            </Button>
          </HStack>
          <Box h={4}>
            <Text>{status ?? ''}</Text>
          </Box>
        </VStack>
      </HStack>
    </Stack>
  );
};
