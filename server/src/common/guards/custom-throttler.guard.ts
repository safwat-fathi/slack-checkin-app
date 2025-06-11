import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const isTest = req?.headers?.['istest']; // Check if the 'istest' header is present

    if (isTest === 'true') {
      return true; // Skip throttling if the 'istest' header is set to true
    }

    return super.canActivate(context); // Otherwise, proceed with the default throttling behavior
  }
}
