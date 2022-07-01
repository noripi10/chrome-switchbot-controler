import { ChangeEvent, startTransition, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  keyframes,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  usePrefersReducedMotion,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { AiOutlineEdit, AiOutlineReload } from 'react-icons/ai';
import { BiDevices } from 'react-icons/bi';

import { getStorageData, setStorageData } from '@src/libs/storage';
import { AllDevices, Device, GetDeviceResult, RemoteDevice } from '@src/pages/background/fetcher';
import { DEVICE_POWER_ON, GET_DEVICES, MY_SWITC_BOT_DEVICES, MY_SWITC_BOT_TOKEN } from '../../libs/constants';
import { TokenInput } from './TokenInput';

let isFirst: boolean = true;

const SwithcBotList = () => {
  const [devices, setDevices] = useState<AllDevices | undefined>();

  const { isOpen, onOpen, onClose } = useDisclosure();

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
      if (response?.message === 'success') {
        setStorageData(MY_SWITC_BOT_DEVICES, response.body);
        setDevices(response.body);
      } else {
        setStorageData(MY_SWITC_BOT_DEVICES, []);
        setDevices(undefined);
      }
    });
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
      <Box display={'flex'} flexDir='column' justifyContent={'flex-start'} px='8' py='4' overflowY={'auto'}>
        <Heading as='h3' fontSize={'sm'}>
          Device
        </Heading>
        <Box display={'flex'} flexWrap={'wrap'}>
          {devices?.deviceList?.map((device) => (
            <DeviceItem key={device.deviceId} device={device} />
          ))}
        </Box>
        <Spacer py={2} />
        <Heading as='h3' fontSize={'sm'}>
          Remote Device
        </Heading>
        <Box display={'flex'} flexWrap={'wrap'}>
          {devices?.infraredRemoteList?.map((device) => (
            <DeviceItem key={device.deviceId} device={device} />
          ))}
        </Box>
      </Box>
      <Center position={'absolute'} right={8} bottom={8} flexDir='column'>
        <EditButton modalOpen={onOpen} />
        <Spacer py={2} />
        <ReloadButton reload={getCurrentDevices} />
      </Center>
      <EditModal isOpen={isOpen} closeModal={onClose} reload={getCurrentDevices} />
    </>
  );
};

const lotation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const EditButton = ({ modalOpen }: { modalOpen: () => void }) => {
  return (
    <Tooltip label='Edit Token'>
      <Box>
        <IconButton
          aria-label='Edit Token'
          bgColor={'#E0393A'}
          width='12'
          height='12'
          borderRadius={'full'}
          icon={<AiOutlineEdit size={'24'} color='#fff' />}
          _hover={{ bgColor: 'red.300' }}
          onClick={modalOpen}
        />
      </Box>
    </Tooltip>
  );
};

const ReloadButton = ({ reload }: { reload: () => Promise<void> }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [loading, setLoading] = useState(false);

  const animation = prefersReducedMotion ? undefined : `${lotation} 1s linear`;
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
    return /success/.test(status) || status === '' ? 'green.400' : 'red.400';
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
        <Text fontWeight={'bold'} color={statusColor}>
          {status ?? ''}
        </Text>
      </Flex>
    </Stack>
  );
};

const EditModal = ({
  isOpen,
  closeModal,
  reload,
}: {
  isOpen: boolean;
  closeModal: () => void;
  reload: () => Promise<void>;
}) => {
  const [token, setToken] = useState('');
  const toast = useToast();

  const onChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  const onReg = () => {
    setStorageData(MY_SWITC_BOT_TOKEN, token).then((res) => {
      if (!res) {
        toast({
          description: 'Token setting error',
          status: 'error',
        });
        return;
      }
      reload().then(closeModal);
    });
  };

  useEffect(() => {
    getStorageData<string>(MY_SWITC_BOT_TOKEN).then((value) => {
      if (value) {
        setToken(value);
      }
    });
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>SwitchBot ApiKey Edit</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={2}>
            <TokenInput onReg={onReg} onChangeText={onChangeText} token={token} />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SwithcBotList;
