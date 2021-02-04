export interface IMailService {
  sendMail(email: string, subject: string, content: string): Promise<boolean>;

  sendResetPasswordMail(email: string, token: string): Promise<boolean>;
}
