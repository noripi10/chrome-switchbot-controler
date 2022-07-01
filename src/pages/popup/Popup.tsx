import '@pages/popup/Popup.css';
import { Box, useColorModeValue } from '@chakra-ui/react';

import { PopUpMain, PopUpHeader } from '@src/components/layout';

const Popup = () => {
  return (
    <Box
      display={'flex'}
      flex={1}
      flexDir='column'
      bgColor={useColorModeValue('gray.100', 'gray.600')}
      w='560px'
      h='480px'
      borderRadius='2'
    >
      <PopUpHeader />
      <PopUpMain />
    </Box>
  );
};

export default Popup;
