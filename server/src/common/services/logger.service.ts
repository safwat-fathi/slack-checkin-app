import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import LokiTransport from 'winston-loki';

@Injectable()
export class LokiLogger implements LoggerService {
  private logger: winston.Logger;
  private userId: string | null = null;

  constructor() {
    const environment = process.env.NODE_ENV;
    const service = 'api';
    const appName = 'booklnk';

    const labels = {
      app: `${appName}-${environment}-${service}`,
      env: environment,
      service,
    };

    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.colorize(),
          winston.format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level}: ${message}`;
          }),
        ),
      }),
    ];

    try {
      if (process.env.LOKI_URL) {
        const lokiTransport = new LokiTransport({
          host: process.env.LOKI_URL,
          json: true,
          labels,
          timeout: 10000,
          batching: true,
          interval: 5000,
          onConnectionError: (err) =>
            console.error('Loki connection error:', err),
        });

        transports.push(lokiTransport);
      } else {
        console.warn('LOKI_URL is not defined. Skipping Loki transport.');
      }
    } catch (error) {
      console.error('Failed to initialize Loki transport:', error.message);
    }

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level}: ${message}`;
        }),
      ),
      transports,
    });

    console.log('Loki logger initialized with labels:', labels);
  }

  private formatMessage(message: string) {
    return this.userId ? `[User Id: ${this.userId}] ${message}` : message;
  }

  log(message: string) {
    this.logger.info(this.formatMessage(message));
  }

  error(message: string, trace?: string) {
    this.logger.error(
      this.formatMessage(`${message}${trace ? `\nStack: ${trace}` : ''}`),
    );
  }

  warn(message: string) {
    this.logger.warn(this.formatMessage(message));
  }

  debug?(message: string) {
    this.logger.debug(this.formatMessage(message));
  }

  verbose?(message: string) {
    this.logger.verbose(this.formatMessage(message));
  }
}
