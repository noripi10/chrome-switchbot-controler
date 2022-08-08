import { differenceInMinutes } from 'date-fns';

export const getDiffMinutesNow = (from: string) => {
  const fromDate = new Date(from);
  const nowDate = new Date();

  const diff = differenceInMinutes(fromDate, nowDate);

  return diff;
};
