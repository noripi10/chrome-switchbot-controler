import { memo } from 'react';

import { Box, IconButton, Tooltip } from '@chakra-ui/react';
import { AiOutlineEdit } from 'react-icons/ai';

export const EditButton = memo(({ modalOpen }: { modalOpen: () => void }) => {
  return (
    <Tooltip label='Edit Token'>
      <Box>
        <IconButton
          aria-label='Edit Token'
          bgColor={'#E0393A'}
          width='12'
          height='12'
          borderRadius={'full'}
          shadow={'4'}
          icon={<AiOutlineEdit size={'24'} color='#fff' />}
          _hover={{ bgColor: 'red.300' }}
          onClick={modalOpen}
        />
      </Box>
    </Tooltip>
  );
});
