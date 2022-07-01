import { FC, useEffect, useState } from 'react';
import { Stack } from '@chakra-ui/react';

import { MY_SWITC_BOT_TOKEN } from '@libs/constants';
import { getStorageData, setStorageData } from '@libs/storage';

import { SwitchBotList, TokenInputForm } from '@components/parts';

const PopUpMain: FC = () => {
  const [hasToken, setHasToken] = useState<boolean | undefined>();

  const regsterToken = (token: string) => {
    try {
      setStorageData(MY_SWITC_BOT_TOKEN, token).then((res) => {
        setHasToken(res);
      });
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    getStorageData(MY_SWITC_BOT_TOKEN).then((res) => {
      setHasToken(!!res);
    });
  }, []);

  if (hasToken) {
    return <SwitchBotList />;
  }

  return (
    <>
      <Stack flex={1} p={8}>
        <TokenInputForm regsterToken={regsterToken} />
      </Stack>
    </>
  );
};

export default PopUpMain;
