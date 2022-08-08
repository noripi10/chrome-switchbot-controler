import { ChangeEvent, memo, useEffect, useState } from 'react';

import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';

import { TokenInput } from './TokenInput';
import { MY_SWITC_BOT_TOKEN } from '@src/libs/constants';
import { getStorageData, setStorageData } from '@src/libs/storage';

export const EditModal = memo(
  ({ isOpen, closeModal, reload }: { isOpen: boolean; closeModal: () => void; reload: () => Promise<void> }) => {
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
  }
);
