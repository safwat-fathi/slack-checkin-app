import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KashierPaymentService {
  private readonly baseUrl: string;
  private readonly secretKey: string;
  private readonly apiKey: string;
  private readonly merchentId: string;
  private readonly webhook_app_url: string;
  private readonly front_end_redirect: string;
  private readonly logger = new Logger(KashierPaymentService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('KASHIER_BASE_URL');
    this.secretKey = this.configService.get<string>('KASHIER_SECRET_KEY');
    this.apiKey = this.configService.get<string>('KASHIER_API_KEY');
    this.merchentId = this.configService.get<string>('KASHIER_MERCHENT_ID');
    this.webhook_app_url = this.configService.get<string>(
      'KASHIER_WEBHOOK_URL',
    );
    this.front_end_redirect =
      this.configService.get<string>('KASHIER_REDIRECT');
  }

  async createPaymentSession(
    amount: number,
    orderId: string,
    customerEmail: string,
    customerReference: string,
    merchantId: string,
  ): Promise<any> {
    const payload = {
      expireAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // Expires in 10 minutes
      maxFailureAttempts: 3,
      paymentType: 'credit',
      amount: amount.toString(),
      currency: 'EGP',
      order: orderId,
      merchantRedirect: this.front_end_redirect,
      display: 'en',
      type: 'one-time',
      connectedAccount: merchantId,
      allowedMethods: 'card,wallet',
      merchantId: this.merchentId,
      failureRedirect: false,
      brandColor: '#FF5733',
      defaultMethod: 'card',
      description: `Payment for order ${orderId}`,
      manualCapture: false,
      customer: {
        email: customerEmail,
        reference: customerReference,
      },
      interactionSource: 'ECOMMERCE',
      enable3DS: true,
      serverWebhook: this.webhook_app_url,
    };

    const response = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/payment/sessions`, payload, {
        headers: {
          Authorization: this.secretKey,
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      }),
    ).catch((error) => {
      this.logger.log(JSON.stringify(error));
      this.logger.log(JSON.stringify(error.response.data));
      throw new Error(
        error.response.data.message || 'Error creating payment session',
      );
    });

    return response.data.sessionUrl;
  }
}
