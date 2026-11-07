import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ErrorCode } from '../../common/constants/error-codes';
import { AppException } from '../../common/expections/app.exception';
import { Config, SesConfig } from '../../config/config.type';
import { EmailService } from '../email/email.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService<Config>,
  ) {}

  public async send(dto: CreateFeedbackDto): Promise<void> {
    const ses = this.configService.getOrThrow<SesConfig>('ses');
    const to = ses.fromEmail.trim();
    if (!to) {
      throw new AppException(ErrorCode.EMAIL_NOT_CONFIGURED, 503);
    }

    await this.emailService.send({
      to,
      subject: 'Cookbook feedback',
      text: dto.message,
      html: this.toHtml(dto.message),
    });
  }

  private toHtml(message: string): string {
    const safeMessage = this.escapeHtml(message).replaceAll('\n', '<br />');

    return `<!DOCTYPE html>
<html lang="en">
  <body style="font-family: sans-serif; color: #2b2620; line-height: 1.5;">
    <p>${safeMessage}</p>
  </body>
</html>`;
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
}
