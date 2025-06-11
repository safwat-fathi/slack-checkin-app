import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import dataSource from './config/orm.config';
import { CheckModule } from './check/check.module';
import { SlackModule } from './slack/slack.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: `.env.${ENV}` }),
    TypeOrmModule.forRoot({ ...dataSource.options, autoLoadEntities: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // The time-to-live (TTL) in milliseconds (1 minute)
          limit: 10, // The maximum number of allowed requests (10 requests)
        },
      ],
    }),
    // Modules
    CheckModule,
    SlackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
