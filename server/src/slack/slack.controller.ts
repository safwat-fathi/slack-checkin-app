import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SlackService } from './slack.service';

@Controller('api/slack')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Get('user/:userId')
  async getUserInfo(@Param('userId') userId: string) {
    return this.slackService.getUserInfo(userId);
  }

  // Slack webhook endpoint for slash commands
  @Post('webhook')
  async handleSlackWebhook(@Body() body: any) {
    // Handle Slack slash commands here
    console.log('Slack webhook received:', body);
    return { response_type: 'ephemeral', text: 'Command received!' };
  }
}
