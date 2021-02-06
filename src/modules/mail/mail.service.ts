import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { ExceptionMessage } from 'src/common/const/exception-message';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MailService {
  private transporter: Transporter;
  private from: string;
  constructor(private readonly configService: ConfigService) {
    const transportConfig = {
      host: configService.get('MAIL_HOST'),
      port: Number(configService.get('MAIL_PORT')),
      auth: {
        user: configService.get('MAIL_USER'),
        pass: configService.get('MAIL_PASS'),
      },
    };
    console.log(transportConfig);
    this.transporter = nodemailer.createTransport(transportConfig);
    this.from = transportConfig.auth.user;
  }

  async sendMail(
    email: string,
    subject: string,
    content: string,
  ): Promise<void> {
    try {
      console.log(
        await this.transporter.sendMail({
          from: this.from,
          to: email,
          subject: subject,
          html: content,
        }),
      );
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(ExceptionMessage.FAILED.SEND_MAIL);
    }
  }

  async sendResetPasswordMail(email: string, token: string): Promise<void> {
    const content = `Reset token: <br><b>${token}</b>`;

    await this.sendMail(email, 'Reset password', content);
  }

  async sendAccountInfoMail(user: User, plainPassword: string): Promise<void> {
    const content = `A Greenplus account has been created for you!<br>Here is your log in information:<br>Email: ${user.email}<br>Password: ${plainPassword}<br>`;

    await this.sendMail(user.email, 'Greenplus account information', content);
  }
}
