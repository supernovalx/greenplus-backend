import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { FacultyModule } from '../faculty/faculty.module';
import { GlobalConfigModule } from '../global-config/global-config.module';
import { GlobalHelper } from '../helper/global.helper';
import { HelperModule } from '../helper/helper.module';
import { ContributionCommentRepository } from './contribution-comment.repository';
import { ContributionCommentService } from './contribution-comment.service';
import { ContributionFileRepository } from './contribution-file.repository';
import { ContributionFileService } from './contribution-file.service';
import { ContributionController } from './contribution.controller';
import { ContributionRepository } from './contribution.repository';
import { ContributionService } from './contribution.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [HelperModule],
      useFactory: async (globalHelper: GlobalHelper) => ({
        storage: diskStorage({
          destination: function (req: any, file: any, cb: any) {
            cb(null, './upload');
          },
          filename: function (req: any, file: any, cb: any) {
            cb(
              null,
              `${globalHelper.generateRandomString(18)}${file.originalname}`,
            );
          },
        }),
      }),
      inject: [GlobalHelper],
    }),
    TypeOrmModule.forFeature([
      ContributionRepository,
      ContributionCommentRepository,
      ContributionFileRepository,
    ]),
    FacultyModule,
    GlobalConfigModule,
  ],
  controllers: [ContributionController],
  providers: [
    ContributionService,
    ContributionCommentService,
    ContributionFileService,
  ],
  exports: [TypeOrmModule],
})
export class ContributionModule {}
