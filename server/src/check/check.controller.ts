import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';

@Controller('check')
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Post('in')
  checkIn(@Body() createCheckDto: CheckInDto) {
    return this.checkService.checkIn(createCheckDto);
  }

  @Post('out')
  checkOut(@Body() createCheckDto: CheckOutDto) {
    return this.checkService.checkOut(createCheckDto);
  }

  @Get('status/:userId')
  findAll(@Param('userId') userId: string) {
    return this.checkService.getUserStatus(userId);
  }

  @Get('today')
  findOne() {
    return this.checkService.getTodayEntries();
  }
}
