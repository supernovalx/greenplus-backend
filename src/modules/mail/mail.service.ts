import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { User } from '../user/entities/user.entity';
import { IMailService } from './imail.service';

@Injectable()
export class MailService implements IMailService {
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
  ): Promise<boolean> {
    let rs = false;

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
      return rs;
    }
    rs = true;

    return rs;
  }

  async sendResetPasswordMail(email: string, token: string): Promise<boolean> {
    const content = `Reset token: <br><b>${token}</b>`;

    return await this.sendMail(email, 'Reset password', content);
  }

  async sendAccountInfoMail(
    user: User,
    plainPassword: string,
  ): Promise<boolean> {
    const content = `A Greenplus account has been created for you!<b>Here is your log in information:<br>Email: ${user.email}<br>Password: ${plainPassword}<br>`;

    return await this.sendMail(
      user.email,
      'Greenplus account information',
      content,
    );
  }
}
