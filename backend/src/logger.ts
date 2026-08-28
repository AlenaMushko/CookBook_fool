import pino from 'pino';

const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV !== 'production';

const logger = pino({
  level:
    process.env.LOG_LEVEL ?? (isTest ? 'silent' : isDev ? 'debug' : 'info'),
  ...(!isTest &&
    isDev && {
      transport: {
        target: 'pino-pretty',
      },
    }),
});

export default logger;
