import { addHours, setMinutes } from 'date-fns';

export const getNextHalfHour = (date: Date = new Date()): Date => {
  const currentMinutes = date.getMinutes();
  let next: Date;

  if (currentMinutes <= 30) {
    next = setMinutes(date, 30);
  } else {
    next = setMinutes(addHours(date, 1), 0);
  }

  return next;
};
