import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebClient } from '@slack/web-api';
import { CheckIn } from 'src/check/entities/check.entity';

@Injectable()
export class SlackService {
  private slackClient: WebClient;

  constructor(private configService: ConfigService) {
    this.slackClient = new WebClient(
      this.configService.get<string>('SLACK_BOT_TOKEN'),
    );
  }

  async getUserInfo(userId: string) {
    try {
      const result = await this.slackClient.users.info({
        user: userId,
      });
      return result.user;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }

  async sendCheckInNotification(entry: CheckIn) {
    try {
      const message = {
        channel: entry.userId,
        text: `✅ You've successfully checked in at ${entry.checkInTime.toLocaleTimeString()}`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `✅ *Check-in Confirmed*\n\n*Time:* ${entry.checkInTime.toLocaleTimeString()}\n*Date:* ${entry.checkInTime.toLocaleDateString()}${entry.notes ? `\n*Notes:* ${entry.notes}` : ''}`,
            },
          },
        ],
      };

      await this.slackClient.chat.postMessage(message);
    } catch (error) {
      console.error('Error sending check-in notification:', error);
    }
  }

  async sendCheckOutNotification(entry: CheckIn) {
    if (!entry.checkOutTime) return;

    try {
      const workDuration = this.calculateWorkDuration(
        entry.checkInTime,
        entry.checkOutTime,
      );

      const message = {
        channel: entry.userId,
        text: `🏁 You've checked out at ${entry.checkOutTime.toLocaleTimeString()}`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `🏁 *Check-out Confirmed*\n\n*Check-in:* ${entry.checkInTime.toLocaleTimeString()}\n*Check-out:* ${entry.checkOutTime.toLocaleTimeString()}\n*Work Duration:* ${workDuration}\n*Date:* ${entry.checkInTime.toLocaleDateString()}`,
            },
          },
        ],
      };

      await this.slackClient.chat.postMessage(message);
    } catch (error) {
      console.error('Error sending check-out notification:', error);
    }
  }

  private calculateWorkDuration(checkIn: Date, checkOut: Date): string {
    const diff = checkOut.getTime() - checkIn.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }
}
