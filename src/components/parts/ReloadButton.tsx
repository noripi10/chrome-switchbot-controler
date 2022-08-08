import { startTransition, useState } from 'react';

import { Box, IconButton, Tooltip, usePrefersReducedMotion } from '@chakra-ui/react';
import { AiOutlineReload } from 'react-icons/ai';
import { keyframes } from '@emotion/react';

const lotation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const ReloadButton = ({ reload }: { reload: () => Promise<void> }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [loading, setLoading] = useState(false);

  const animation = prefersReducedMotion ? undefined : `${lotation} 1s linear`;
  const click = () => {
    setLoading(true);

    startTransition(() => {
      reload().then(() =>
        setTimeout(() => {
          setLoading(false);
        }, 1000)
      );
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
          shadow={'4'}
          icon={<AiOutlineReload size={'24'} color='#fff' />}
          _hover={{ bgColor: 'red.300' }}
          onClick={click}
        />
      </Box>
    </Tooltip>
  );
};
