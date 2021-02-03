import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalHelper } from './modules/helper/global.helper';
import { HelperModule } from './modules/helper/helper.module';
import { ConfigModule } from '@nestjs/config';
import { FacultyModule } from './modules/faculty/faculty.module';
import { ContributionModule } from './modules/contribution/contribution.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
