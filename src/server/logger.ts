import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: 'info',
  transports: [],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.prettyPrint({ colorize: true })
      ),
    })
  );
}
