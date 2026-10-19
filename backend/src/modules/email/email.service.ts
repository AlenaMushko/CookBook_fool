import {
  SendEmailCommand,
  type SendEmailCommandInput,
  SESv2Client,
} from '@aws-sdk/client-sesv2';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ErrorCode } from '../../common/constants/error-codes';
import { AppException } from '../../common/expections/app.exception';
import { AWSConfig, Config, SesConfig } from '../../config/config.type';
import logger from '../../logger';
import { EmailTemplate } from './constants/email-template.enum';
import {
  EmailTemplateContextMap,
  SendEmailOptions,
  SendTemplateOptions,
} from './email.types';
import { EMAIL_TEMPLATE_REGISTRY } from './templates/email-template.registry';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly aws: AWSConfig;
  private readonly ses: SesConfig;
  private readonly isProduction: boolean;
  private client: SESv2Client | null = null;
  private ready = false;

  constructor(private readonly configService: ConfigService<Config>) {
    this.aws = this.configService.getOrThrow<AWSConfig>('aws');
    this.ses = this.configService.getOrThrow<SesConfig>('ses');
    this.isProduction =
      this.configService.getOrThrow('app').nodeEnv === 'production';
  }

  onModuleInit(): void {
    if (
      !this.ses.fromEmail ||
      !this.aws.accessKeyId ||
      !this.aws.secretAccessKey ||
      !this.aws.region
    ) {
      logger.warn(
        'Amazon SES is not configured (SES_FROM_EMAIL / AWS credentials / region). Email sending is disabled.',
      );
      return;
    }

    this.client = new SESv2Client({
      region: this.aws.region,
      credentials: {
        accessKeyId: this.aws.accessKeyId,
        secretAccessKey: this.aws.secretAccessKey,
      },
    });
    this.ready = true;
    logger.info(
      {
        from: this.maskEmail(this.ses.fromEmail),
        region: this.aws.region,
      },
      'Amazon SES email client initialized',
    );
  }

  public isConfigured(): boolean {
    return this.ready;
  }

  public async send(options: SendEmailOptions): Promise<void> {
    this.assertReady();

    const from =
      this.ses.fromName.trim().length > 0
        ? `${this.ses.fromName} <${this.ses.fromEmail}>`
        : this.ses.fromEmail;

    const input: SendEmailCommandInput = {
      FromEmailAddress: from,
      Destination: {
        ToAddresses: [options.to],
      },
      Content: {
        Simple: {
          Subject: { Data: options.subject, Charset: 'UTF-8' },
          Body: {
            Html: { Data: options.html, Charset: 'UTF-8' },
            ...(options.text
              ? { Text: { Data: options.text, Charset: 'UTF-8' } }
              : {}),
          },
        },
      },
      ...(options.replyTo ? { ReplyToAddresses: [options.replyTo] } : {}),
    };

    try {
      await this.client!.send(new SendEmailCommand(input));
      logger.info(`Email sent to ${this.maskEmail(options.to)}`);
    } catch (error) {
      this.logSesError(error);
      throw new AppException(
        ErrorCode.EMAIL_SEND_FAILED,
        502,
        'Failed to send email',
      );
    }
  }

  public async sendTemplate<T extends EmailTemplate>(
    template: T,
    options: SendTemplateOptions<T>,
  ): Promise<void> {
    const builder = EMAIL_TEMPLATE_REGISTRY[template];
    const context = {
      appName: this.ses.fromName,
      ...options.context,
    } as EmailTemplateContextMap[T];

    const content = builder(context);

    await this.send({
      to: options.to,
      replyTo: options.replyTo,
      subject: content.subject,
      html: content.html,
      text: content.text,
    });
  }

  private assertReady(): void {
    if (this.ready && this.client) return;

    throw new AppException(
      ErrorCode.EMAIL_NOT_CONFIGURED,
      503,
      'Email service is not configured',
    );
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return '***';
    const visible = local.slice(0, 2);
    return `${visible}***@${domain}`;
  }

  private logSesError(error: unknown): void {
    const sesError = error as {
      name?: string;
      message?: string;
      $metadata?: { httpStatusCode?: number; requestId?: string };
    };

    if (sesError?.name || sesError?.$metadata) {
      logger.error(
        {
          name: sesError.name,
          message: sesError.message,
          statusCode: sesError.$metadata?.httpStatusCode,
          requestId: sesError.$metadata?.requestId,
        },
        'Amazon SES rejected the email request',
      );
      return;
    }

    logger.error(
      { err: error },
      'Unexpected error while sending email via Amazon SES',
    );

    if (!this.isProduction && error instanceof Error) {
      logger.debug(error.message);
    }
  }
}
