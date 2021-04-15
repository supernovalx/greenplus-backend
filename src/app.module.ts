import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ContributionModule } from './modules/contribution/contribution.module';
import { FacultyModule } from './modules/faculty/faculty.module';
import { GlobalConfigModule } from './modules/global-config/global-config.module';
import { HelperModule } from './modules/helper/helper.module';
import { MailModule } from './modules/mail/mail.module';
import { UserModule } from './modules/user/user.module';
import { ChatModule } from './modules/chat/chat.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot(),
    HelperModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FacultyModule,
    ContributionModule,
    MailModule,
    GlobalConfigModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ChatModule,
    ReportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
