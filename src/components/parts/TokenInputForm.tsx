import { Box, Button, Flex, Input, Text, VStack } from '@chakra-ui/react';
import { ChangeEvent, FC, useState } from 'react';

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
    <VStack flex={1} minW={'md'} align='flex-start'>
      <Text fontSize={'md'}>SwitchBotトークンを入力してください</Text>
      <Input type='password' onChange={onChangeText} value={token} background='white' />
      <Flex alignItems={'flex-end'} justifyContent='flex-end' w='100%'>
        <Button
          onClick={onReg}
          size='md'
          bgColor='#E0393A'
          _hover={{ bgColor: 'red.300' }}
          color={'white'}
          w='24'
          disabled={!token}
        >
          登 録
        </Button>
      </Flex>
    </VStack>
  );
};

export default TokenInputForm;
