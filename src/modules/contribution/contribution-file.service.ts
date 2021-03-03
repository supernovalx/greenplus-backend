import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ExceptionMessage } from 'src/common/const/exception-message';
import { User } from '../user/entities/user.entity';
import { ContributionFileRepository } from './contribution-file.repository';
import { ContributionRepository } from './contribution.repository';
import { ContributionService } from './contribution.service';
import { ContributionFile } from './entities/contribution-file.entity';
import { Contribution } from './entities/contribution.entity';

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
    // Check if user can update contributions
    if (
      !(await this.contributionService.canUploadNewContributions(
        author.facultyId,
      ))
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
      !(await this.contributionService.canUploadNewContributions(
        author.facultyId,
      ))
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
}
