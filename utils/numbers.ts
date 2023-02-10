// Round to 2 dp
export const round = (num: number) => {
  return Math.round(num * 100) / 100;
};

export const roundToWhole = Math.round;
