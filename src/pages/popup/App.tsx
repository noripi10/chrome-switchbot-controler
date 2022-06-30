import { FC } from 'react';
import Popup from '@pages/popup/Popup';

import { ChakraProvider } from '@chakra-ui/react';

export const App: FC = () => {
  return (
    <ChakraProvider>
      <Popup />
    </ChakraProvider>
  );
};
