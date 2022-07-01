import { startTransition, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  keyframes,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  usePrefersReducedMotion,
  VStack,
} from '@chakra-ui/react';
import { AiOutlineReload } from 'react-icons/ai';
import { BiDevices } from 'react-icons/bi';

import { getStorageData, setStorageData } from '@src/libs/storage';
import { AllDevices, Device, GetDeviceResult, RemoteDevice } from '@src/pages/background/fetcher';
import { DEVICE_POWER_ON, GET_DEVICES, MY_SWITC_BOT_DEVICES, MY_SWITC_BOT_TOKEN } from '../../libs/constants';

const SwithcBotList = () => {
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
          Device
        </Heading>
        <Box display={'flex'} flexWrap={'wrap'}>
          {devices?.deviceList?.map((device) => (
            <DeviceItem key={device.deviceId} device={device} />
          ))}
        </Box>
        <Spacer py={3} />
        <Heading as='h3' fontSize={'sm'}>
          Remote Device
        </Heading>
        <Box display={'flex'} flexWrap={'wrap'}>
          {devices?.infraredRemoteList?.map((device) => (
            <DeviceItem key={device.deviceId} device={device} />
          ))}
        </Box>
      </Box>
      <Center position={'absolute'} right={8} bottom={8}>
        <ReloadButton reload={getCurrentDevices} />
      </Center>
    </>
  );
};

const lotation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const ReloadButton = ({ reload }: { reload: () => Promise<void> }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [loading, setLoading] = useState(false);

  const animation = prefersReducedMotion ? undefined : `${lotation} 1s linear`;
  console.log({ animation });
  const click = () => {
    console.log('start');
    setLoading(true);

    startTransition(() => {
      reload().then(() =>
        setTimeout(() => {
          setLoading(false);
        }, 1000)
      );
      console.log('end');
    });
  };
  return (
    <Tooltip label='Reload Device'>
      <Box animation={loading ? animation : ''}>
        <IconButton
          aria-label='Reload Device'
          bgColor={'#E0393A'}
          width='12'
          height='12'
          borderRadius={'full'}
          icon={<AiOutlineReload size={'24'} color='#fff' />}
          _hover={{ bgColor: 'red.300' }}
          onClick={click}
        />
      </Box>
    </Tooltip>
  );
};

const DeviceItem = ({ device }: { device: Device | RemoteDevice }) => {
  const [status, setStatus] = useState('');
  const statusColor = useMemo(() => {
    return /success/.test(status) || status === '' ? 'blue.400' : 'red.400';
  }, [status]);

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
    <Stack p={4} m={1} mr={2} borderColor='gray.400' borderRadius='md' borderWidth={1} w='56' h='32'>
      <HStack flex={1}>
        <Center p={4} flex={1} bgColor={useColorModeValue('gray.200', 'gray.700')} borderRadius={8}>
          <BiDevices size={32} />
        </Center>

        <VStack flex={2}>
          <Text fontWeight={'bold'}>{device.deviceName}</Text>
          <Text>{'deviceType' in device ? device.deviceType : device.remoteType}</Text>
          <HStack flex={1} justify='center' align='center'>
            <Button size='xs' bgColor='red.400' onClick={onOn} w='10' _hover={{ bgColor: 'red.300' }}>
              ON
            </Button>
            <Button size='xs' bgColor='blue.400' onClick={onOff} w='10' _hover={{ bgColor: 'blue.300' }}>
              OFF
            </Button>
          </HStack>
        </VStack>
      </HStack>
      <Flex h={1} alignItems='center' justifyContent='center' py={1}>
        <Text color={statusColor}>{status ?? ''}</Text>
      </Flex>
    </Stack>
  );
};

export default SwithcBotList;
