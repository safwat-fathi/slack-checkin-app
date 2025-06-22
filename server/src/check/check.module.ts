import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { CheckIn } from './entities/check.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackService } from 'src/slack/slack.service';

@Module({
  imports: [TypeOrmModule.forFeature([CheckIn])],
  controllers: [CheckController],
  providers: [CheckService, SlackService],
})
export class CheckModule {}
