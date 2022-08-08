import { startTransition, useMemo, useState } from 'react';

import { Box, Button, Center, Flex, HStack, Stack, Text, useColorModeValue, VStack } from '@chakra-ui/react';

import { BiDevices } from 'react-icons/bi';

import { DEVICE_POWER_OFF, DEVICE_POWER_ON, MY_SWITC_BOT_TOKEN } from '@src/libs/constants';
import { getStorageData } from '@src/libs/storage';
import { Device, RemoteDevice } from '@src/pages/background/fetcher';

export const DeviceItem = ({
  device,
  setDeviceStatus,
}: {
  device: Device | RemoteDevice;
  setDeviceStatus: (deviceType: 'device' | 'remoteDevice', deviceId: string, status: number) => void;
}) => {
  const [status, setStatus] = useState('');
  const statusColor = useMemo(() => {
    return /success/.test(status) || status === '' ? 'green.400' : 'red.400';
  }, [status]);

  // TODO Hub Miniだとステータスがうまく取得できない(body無しでstatus:100が返却される)
  const iconStatusColor = useMemo(
    () =>
      'deviceType' in device && device.deviceType == 'Hub Mini' ? '#ababab' : device.online ? '#4ba01d' : '#c03a3a',
    [device.online]
  );

  const onPowerToggle = async (type: typeof DEVICE_POWER_ON | typeof DEVICE_POWER_OFF) => {
    const token = await getStorageData(MY_SWITC_BOT_TOKEN);

    const command = type === DEVICE_POWER_ON ? 'turnOn' : 'turnOff';

    chrome.runtime.sendMessage({ type, deviceId: device.deviceId, token, command }, (response) => {
      console.log({ response });
      if (response) {
        setStatus(response.message);
        startTransition(() => {
          setTimeout(() => setStatus(''), 1500);
          setDeviceStatus('deviceType' in device ? 'device' : 'remoteDevice', device.deviceId, response.statusCode);
        });
      }
    });
  };

  return (
    <Stack p={4} pt={2} m={1} mr={2} borderColor='gray.400' borderRadius='md' borderWidth={1} w='56' h='32'>
      <Text fontWeight={'bold'} whiteSpace='nowrap'>
        {device.deviceName}
      </Text>
      <HStack flex={1}>
        <Center
          position={'relative'}
          p={4}
          pt={1.5}
          flex={1}
          flexDirection={'column'}
          bgColor={useColorModeValue('gray.200', 'gray.700')}
          borderRadius={8}
        >
          <Box pb={'2'}>
            {/* TODO アイコンをTypeで変える */}
            <BiDevices size={32} color={iconStatusColor} />
          </Box>

          <Box position={'absolute'} bottom={1}>
            <Text color={iconStatusColor}>{device.online ? 'online' : 'offline'}</Text>
          </Box>
        </Center>

        <VStack flex={2}>
          <Text>{'deviceType' in device ? device.deviceType : device.remoteType}</Text>
          <HStack flex={1} justify='center' align='center'>
            <Button
              size='xs'
              bgColor='red.400'
              onClick={() => onPowerToggle(DEVICE_POWER_ON)}
              w='10'
              _hover={{ bgColor: 'red.300' }}
            >
              ON
            </Button>
            <Button
              size='xs'
              bgColor='blue.400'
              onClick={() => onPowerToggle(DEVICE_POWER_OFF)}
              w='10'
              _hover={{ bgColor: 'blue.300' }}
            >
              OFF
            </Button>
          </HStack>
        </VStack>
      </HStack>
      <Flex h={1} alignItems='center' justifyContent='center' py={1}>
        <Text fontWeight={'bold'} color={statusColor}>
          {status ?? ''}
        </Text>
      </Flex>
    </Stack>
  );
};
