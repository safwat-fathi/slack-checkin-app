import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SlackService } from 'src/slack/slack.service';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { CheckIn, CheckInStatus } from './entities/check.entity';

@Injectable()
export class CheckService {
  constructor(
    @InjectRepository(CheckIn)
    private checkInRepository: Repository<CheckIn>,
    private slackService: SlackService,
  ) {}

  async checkIn(checkInDto: CheckInDto) {
    // Check if user is already checked in
    const existingEntry = await this.getActiveCheckIn(checkInDto.userId);
    if (existingEntry) {
      throw new BadRequestException('User is already checked in');
    }

    // Get user info from Slack
    const userInfo = await this.slackService.getUserInfo(checkInDto.userId);

    const checkInEntry = this.checkInRepository.create({
      userId: checkInDto.userId,
      userName: userInfo?.real_name || 'Unknown User',
      teamId: checkInDto.teamId,
      checkInTime: new Date(),
      status: CheckInStatus.CHECKED_IN,
      notes: checkInDto.notes,
    });

    const savedEntry = await this.checkInRepository.save(checkInEntry);

    // Send Slack notification
    await this.slackService.sendCheckInNotification(savedEntry);

    return savedEntry;
  }

  async checkOut(checkOutDto: CheckOutDto) {
    const activeEntry = await this.getActiveCheckIn(checkOutDto.userId);
    if (!activeEntry) {
      throw new BadRequestException('No active check-in found');
    }

    activeEntry.checkOutTime = new Date();
    activeEntry.status = 'checked-out';
    if (checkOutDto.notes) {
      activeEntry.notes = activeEntry.notes
        ? `${activeEntry.notes}\n\nCheck-out notes: ${checkOutDto.notes}`
        : checkOutDto.notes;
    }

    const savedEntry = await this.checkInRepository.save(activeEntry);

    // Send Slack notification
    await this.slackService.sendCheckOutNotification(savedEntry);

    return savedEntry;
  }

  async getActiveCheckIn(userId: string) {
    return this.checkInRepository.findOne({
      where: { userId, status: CheckInStatus.CHECKED_IN },
      order: { checkInTime: 'DESC' },
    });
  }

  async getTodayEntries(teamId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const queryBuilder = this.checkInRepository
      .createQueryBuilder('entry')
      .where('entry.checkInTime >= :today', { today })
      .andWhere('entry.checkInTime < :tomorrow', { tomorrow })
      .orderBy('entry.checkInTime', 'DESC');

    if (teamId) {
      queryBuilder.andWhere('entry.teamId = :teamId', { teamId });
    }

    return queryBuilder.getMany();
  }

  async getUserStatus(userId: string) {
    return this.getActiveCheckIn(userId);
  }
}
