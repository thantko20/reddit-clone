import { array, number } from 'yup';

export const checkFileSize = (files?: [File]): boolean => {
  let isValid = true;

  if (files) {
    files.map((file) => {
      if (file.size > 1048576) {
        isValid = false;
      }
      return null;
    });
  }

  return isValid;
};

export const chunksArray = <T>(array: T[], size: number): Array<T[]> => {
  const finalArray: any = [];

  for (let i = 0; i < size; i += size) {
    const chunk = array.slice(i, i + size);
    finalArray.push(chunk);
  }

  return finalArray;
};

export const calcTimePast = (unixTime: number): string => {
  const currentTimeInUnix = Date.now();

  const timeDiff = currentTimeInUnix - unixTime;

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 28;
  const year = month * 12;

  if (timeDiff <= minute) {
    return 'a minute ago';
  } else if (timeDiff < hour) {
    return `${Math.floor(timeDiff / minute)}min. ago`;
  } else if (timeDiff < day) {
    return `${Math.floor(timeDiff / hour)}hr. ago`;
  } else if (timeDiff < month) {
    return `${Math.floor(timeDiff / day)}d. ago`;
  } else if (timeDiff < year) {
    return `${Math.floor(timeDiff / month)}m. ago`;
  } else {
    return `${Math.floor(timeDiff / year)}y. ago`;
  }
};

export const randomItemsFromArray = <T>(array: T[], size: number): T[] => {
  const output = array.sort(() => 0.5 - Math.random());

  return output.slice(0, size);
};
