import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { ContributionModule } from './modules/contribution/contribution.module';
import { FacultyModule } from './modules/faculty/faculty.module';
import { GlobalConfigModule } from './modules/global-config/global-config.module';
import { HelperModule } from './modules/helper/helper.module';
import { MailModule } from './modules/mail/mail.module';
import { UserModule } from './modules/user/user.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
