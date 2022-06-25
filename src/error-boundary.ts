import errorNotice from './webhook/error';

/* 监听导致程序崩溃的未知错误 */
const errorBoundary = () => {
  // 未捕获的错误信息
  process.on('uncaughtException', (err) => {
    console.error(err);
    errorNotice(err.message);

    // 3秒后终止进程
    setTimeout(() => {
      process.exit(2);
    }, 3000);
  });

  // 未捕获的 Promise 错误信息
  process.on('unhandledRejection', (err) => {
    console.error(err);
    errorNotice('未知异步错误，程序崩溃');
  });
};

export default errorBoundary;
