import { EmailTemplate } from '../constants/email-template.enum';
import { EmailContent, EmailTemplateContextMap } from '../email.types';
import { buildPasswordResetEmail } from './password-reset.template';

export const EMAIL_TEMPLATE_REGISTRY: {
  [K in EmailTemplate]: (context: EmailTemplateContextMap[K]) => EmailContent;
} = {
  [EmailTemplate.FORGOT_PASSWORD]: buildPasswordResetEmail,
  [EmailTemplate.SET_PASSWORD]: buildPasswordResetEmail,
};
