import { EmailTemplate } from './constants/email-template.enum';

export type EmailContent = {
  subject: string;
  html: string;
  text?: string;
};

export type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export type PasswordResetTemplateContext = {
  resetLink: string;
  expiresIn: string;
  firstName?: string;
  appName?: string;
};

export type EmailTemplateContextMap = {
  [EmailTemplate.FORGOT_PASSWORD]: PasswordResetTemplateContext;
  [EmailTemplate.SET_PASSWORD]: PasswordResetTemplateContext;
};

export type SendTemplateOptions<T extends EmailTemplate> = {
  to: string;
  replyTo?: string;
  context: EmailTemplateContextMap[T];
};
