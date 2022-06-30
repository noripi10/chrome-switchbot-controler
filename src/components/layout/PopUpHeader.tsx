import { Heading, HStack, IconButton, useColorMode } from '@chakra-ui/react';
import { TbMoonStars, TbSun } from 'react-icons/tb';

export const PopUpHeader = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <HStack px='4' bgColor={'#E0393A'} align='center' minH={'60px'}>
      <Heading color='white' fontSize={'md'} flexGrow={1}>
        My SwitchBot Controller
      </Heading>
      <IconButton
        variant={'ghost'}
        aria-label='color mode change'
        icon={colorMode === 'light' ? <TbMoonStars size={24} color='white' /> : <TbSun size={24} color='white' />}
        _hover={{ bgColor: 'red.400' }}
        onClick={toggleColorMode}
      />
    </HStack>
  );
};
