import {
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { ChangeEvent, FC, useState } from 'react';
import { BiShow, BiHide } from 'react-icons/bi';

type Props = {
  onReg: () => void;
  onChangeText: (e: ChangeEvent<HTMLInputElement>) => void;
  token: string | undefined;
};

export const TokenInput: FC<Props> = ({ onReg, onChangeText, token }) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <VStack px={2} w='full' align={'flex-start'}>
      <Text fontSize={'md'}>🌟Enter your SwitchBot token</Text>

      <InputGroup size='md'>
        <Input
          color='#000'
          background='white'
          pr='4.5rem'
          type={show ? 'text' : 'password'}
          placeholder='Enter password'
          onChange={onChangeText}
          value={token}
        />
        <InputRightElement width='4.5rem'>
          <IconButton
            h='1.75rem'
            size='sm'
            onClick={handleClick}
            bgColor={useColorModeValue('gray.100', 'gray.400')}
            color='#000'
            borderRadius={'full'}
            icon={show ? <BiHide /> : <BiShow />}
            aria-label={'show token'}
          />
        </InputRightElement>
      </InputGroup>

      <Flex alignItems={'flex-end'} justifyContent='flex-end' w='100%'>
        <Button
          disabled={!token}
          onClick={onReg}
          size='md'
          color={'white'}
          bgColor='#E0393A'
          borderRadius={10}
          w='24'
          _hover={{ bgColor: 'red.300' }}
        >
          Register
        </Button>
      </Flex>
    </VStack>
  );
};
