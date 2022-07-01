import { Box, Button, Flex, HStack, Image, Input, Spacer, Text, VStack } from '@chakra-ui/react';
import { ChangeEvent, FC, useState } from 'react';

import Screen1 from '@assets/img/screen1.png';
import Screen2 from '@assets/img/screen2.png';
import { TokenInput } from './TokenInput';

type Props = {
  regsterToken: (token: string) => void;
};

export const TokenInputForm: FC<Props> = ({ regsterToken }) => {
  const [token, setToken] = useState('');

  const onChangeText = (e: ChangeEvent<HTMLInputElement>) => setToken(e.target.value);

  const onReg = () => {
    regsterToken(token);
  };

  return (
    <VStack flex={1} minW={'md'} align='flex-start' p={4} py={2}>
      <TokenInput onReg={onReg} onChangeText={onChangeText} token={token} />
      <VStack pt={2} w='full'>
        <Text>How to Get Token</Text>
        <HStack align={'center'}>
          <Image src={Screen1} w={140} h={280} _hover={{ transform: 'scale(2)' }} />
          <Spacer px={4} />
          <Image src={Screen2} w={140} h={280} _hover={{ transform: 'scale(2)' }} />
        </HStack>
      </VStack>
    </VStack>
  );
};

export default TokenInputForm;
