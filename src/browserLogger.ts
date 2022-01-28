export const log = (msg: string) => {
  const isBrowser = typeof window !== 'undefined';
  isBrowser && console.log(msg);
};
