import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Sends an email.
   * @param to Recipient email address
   * @param subject Email subject
   * @param templateName Template name (if using templates)
   * @param context Context variables for the template
   */
  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    context: any,
    from?: string,
    attachments?: {
      filename: string;
      path: string;
      cid?: string;
    }[],
  ) {
    try {
      await this.mailerService.sendMail({
        from: from || process.env.NOREPLY_EMAIL,
        to,
        subject,
        template: templateName, // Name of the template file without extension
        context, // Data to be injected into the template
        attachments,
      });
    } catch (error) {
      this.logger.error('Caught cron job exception:', error);
    }
  }
}
