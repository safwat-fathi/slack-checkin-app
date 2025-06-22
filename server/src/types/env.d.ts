declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'staging';
      HTTP_SERVER_PORT: number;
      DB_TYPE: string;
      DB_NAME: string;
      DB_USER: string;
      DB_PASS: string;
      DB_HOST: string;
      DB_PORT: number;
      APP_URL: string;
      JWT_SECRET: string;
      CSRF_SECRET: string;
      SMTP_HOST: string;
      SMTP_PORT: number;
      SMTP_SECURE: string;
      SMTP_USER: string;
      SMTP_PASS: string;
      NOREPLY_EMAIL: string;
      BOOKING_EMAIL: string;
    }
  }
}

export {};
