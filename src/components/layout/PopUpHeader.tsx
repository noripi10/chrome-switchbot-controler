import { Heading, HStack, IconButton, Text, Tooltip, useColorMode } from '@chakra-ui/react';
import { GiConsoleController } from 'react-icons/gi';
import { TbMoonStars, TbSun } from 'react-icons/tb';

const PopUpHeader = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <HStack px='4' bgColor={'#E0393A'} align='center' minH={'60px'}>
      <HStack flexGrow={1}>
        <GiConsoleController size={24} color='white' />
        <Heading color='white' fontSize={'md'}>
          <Text>My SwitchBot Controller</Text>
        </Heading>
      </HStack>
      <Tooltip label='color mode change'>
        <IconButton
          borderRadius='full'
          variant={'ghost'}
          aria-label='color mode change'
          icon={colorMode === 'light' ? <TbMoonStars size={24} color='white' /> : <TbSun size={24} color='white' />}
          _hover={{ bgColor: 'red.400' }}
          onClick={toggleColorMode}
        />
      </Tooltip>
    </HStack>
  );
};

export default PopUpHeader;
