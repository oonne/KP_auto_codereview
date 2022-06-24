/**
 *  延迟一定时间，单位毫秒。
 */
const wait = async (time: number): Promise<void> => new Promise((resolve) => {
  setTimeout(resolve, time);
});

export default {
  wait,
};
