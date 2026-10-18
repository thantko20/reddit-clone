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

export const chunksArray = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];

  if (size <= 0) return chunks;

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
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
    return 'Just now';
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
