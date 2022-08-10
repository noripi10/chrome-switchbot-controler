import { startTransition, useMemo, useState } from 'react';

import { Box, Button, Center, Flex, HStack, Stack, Text, useColorModeValue, VStack } from '@chakra-ui/react';

import { BiDevices } from 'react-icons/bi';

import { DEVICE_POWER_OFF, DEVICE_POWER_ON, DEVICE_TYPE_HUB_MINI, MY_SWITC_BOT_TOKEN } from '@src/libs/constants';
import { getStorageData } from '@src/libs/storage';
import { Device, RemoteDevice } from '@src/pages/background/fetcher';

export const DeviceItem = ({
  device,
  setDeviceStatus,
}: {
  device: Device | RemoteDevice;
  setDeviceStatus: (deviceType: 'device' | 'remoteDevice', deviceId: string, status: number) => void;
}) => {
  const isDevice = 'deviceType' in device;
  const isRemoteDevice = !('deviceType' in device);
  const mark = isDevice ? device.deviceMark : device.hubDeviceMark;

  const [commandStatus, setCommandStatus] = useState('');
  const commandStatusColor = useMemo(() => {
    return /success/.test(commandStatus) || commandStatus === '' ? 'green.400' : 'red.400';
  }, [commandStatus]);

  const onPowerToggle = async (type: typeof DEVICE_POWER_ON | typeof DEVICE_POWER_OFF) => {
    const token = await getStorageData(MY_SWITC_BOT_TOKEN);

    const command = type === DEVICE_POWER_ON ? 'turnOn' : 'turnOff';

    chrome.runtime.sendMessage({ type, deviceId: device.deviceId, token, command }, (response) => {
      // console.log({ response });
      if (response) {
        setCommandStatus(response.message);
        startTransition(() => {
          setTimeout(() => setCommandStatus(''), 1500);
          setDeviceStatus(isDevice ? 'device' : 'remoteDevice', device.deviceId, response.statusCode);
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
          borderRadius={6}
        >
          <Box pb={'2'}>
            <BiDevices size={32} color={device.statusColor} />
          </Box>

          <Box position={'absolute'} bottom={1}>
            <Text color={device.statusColor}>{device.status}</Text>
          </Box>

          <Box position={'absolute'} top={1} left={1}>
            <Text color={useColorModeValue('rgba(0,0,0,0.4)', 'rgba(255,255,255, 0.6)')}>{mark}</Text>
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
        <Text fontWeight={'bold'} color={commandStatusColor}>
          {commandStatus ?? ''}
        </Text>
      </Flex>
    </Stack>
  );
};
