import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { glob } from 'glob';
import { ExceptionMessage } from 'src/common/const/exception-message';
import { User } from '../user/entities/user.entity';
import { ContributionFileRepository } from './contribution-file.repository';
import { ContributionRepository } from './contribution.repository';
import { ContributionService } from './contribution.service';
import { ContributionFile } from './entities/contribution-file.entity';
import { Contribution } from './entities/contribution.entity';
const fs = require('fs');

@Injectable()
export class ContributionFileService {
  constructor(
    private readonly contributionRepository: ContributionRepository,
    private readonly contributionFileRepository: ContributionFileRepository,
    private readonly contributionService: ContributionService,
  ) {}

  async addContributionFiles(
    contributionId: number,
    author: User,
    files: Express.Multer.File[],
  ): Promise<void> {
    if (!author.facultyId) {
      throw new InternalServerErrorException();
    }
    // Check file types
    await this.contributionService.fitlerContributionFileTypes(files);
    // Check if user can update contributions
    if (
      !(await this.contributionService.canUpdateContributions(author.facultyId))
    ) {
      throw new BadRequestException(
        ExceptionMessage.INVALID.UPDATE_SUBMISSION_DEADLINE_DUE,
      );
    }
    // Check is author
    const contribution: Contribution = await this.contributionRepository.findOneByIdWithRelations(
      contributionId,
    );
    if (author.id !== contribution.userId) {
      throw new BadRequestException();
    }
    // Add contribution files
    for (const file of files) {
      await this.contributionFileRepository.create({
        contributionId: contributionId,
        file: file.filename,
      });
    }
  }

  async deleteContributionFile(
    contributionId: number,
    author: User,
    fileId: number,
  ): Promise<void> {
    if (!author.facultyId) {
      throw new InternalServerErrorException();
    }
    // Check if user can update contributions
    if (
      !(await this.contributionService.canUpdateContributions(author.facultyId))
    ) {
      throw new BadRequestException(
        ExceptionMessage.INVALID.UPDATE_SUBMISSION_DEADLINE_DUE,
      );
    }
    // Check is author
    const contribution: Contribution = await this.contributionRepository.findOneByIdWithRelations(
      contributionId,
    );
    if (author.id !== contribution.userId) {
      throw new BadRequestException();
    }
    // Check is file of contribution
    const file: ContributionFile = await this.contributionFileRepository.findOneByIdWithRelations(
      fileId,
    );
    if (file.contributionId !== contribution.id) {
      throw new BadRequestException();
    }
    // Delete contribution file
    await this.contributionFileRepository.deleteOne(fileId);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async fileCleanupCron() {
    console.log('Running upload file cleanup...');
    glob('upload/*', {}, async (err: Error | null, matches: string[]) => {
      if (!err) {
        const contributionFiles: ContributionFile[] = await this.contributionFileRepository.findAll();
        const contributions: Contribution[] = await this.contributionRepository.findAll();
        for (const match of matches) {
          // Get file name
          const fileName = match.split('/')[1];

          // Check is zip file
          const isZip = fileName.endsWith('.zip');

          // Check if file is in database
          const stillContributionThumbnail = contributions.some(
            (contribution) => contribution.thumbnail === fileName,
          );
          const stillContributionFile = contributionFiles.some(
            (file) => file.file === fileName,
          );

          if (isZip) {
            // Get created time of file
            const { birthtime } = fs.statSync(match);
            // Calculate file age
            const zipAge =
              (new Date().getTime() - new Date(birthtime).getTime()) /
              1000 /
              60 /
              60; // days
            // Delete old zip files
            if (zipAge > 5) {
              this.deleteFile(match);
            }
            console.log(`${fileName} Zip age`, zipAge);
          }
          // Delete contributions file not in database, excludes zips
          else if (!stillContributionFile && !stillContributionThumbnail) {
            console.log(`Delete ${fileName}`);
            this.deleteFile(match);
          } else {
            console.log(fileName);
          }
        }
      }
    });
  }

  deleteFile(fileName: string) {
    fs.unlink(fileName, (err: Error | null) => {
      if (err) {
        console.error(err);
      }
    });
  }
}
