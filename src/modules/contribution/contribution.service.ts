import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Queue } from 'bull';
import { ExceptionMessage } from 'src/common/const/exception-message';
import { QueueConst } from 'src/common/const/queue';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { Role } from 'src/common/enums/roles';
import { DeepPartial } from 'typeorm';
import { Faculty } from '../faculty/entities/faculty.entity';
import { FacultyRepository } from '../faculty/faculty.repository';
import { GlobalConfigKey } from '../global-config/config-keys';
import { GlobalConfigRepository } from '../global-config/global-config.repository';
import { User } from '../user/entities/user.entity';
import { ContributionCommentRepository } from './contribution-comment.repository';
import { ContributionRepository } from './contribution.repository';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { FindAllContributionQueryDto } from './dto/find-all-contribution-query.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { ContributionFile } from './entities/contribution-file.entity';
import { Contribution } from './entities/contribution.entity';

@Injectable()
export class ContributionService {
  constructor(
    private contributionRepository: ContributionRepository,
    private contributionCommentRepository: ContributionCommentRepository,
    private facultyRepository: FacultyRepository,
    private globalConfigRepository: GlobalConfigRepository,
    @InjectQueue(QueueConst.QUEUE.CONTRIBUTION)
    private readonly contributionQueue: Queue,
  ) {}
  async createNewContribution(
    author: User,
    createContributionDto: CreateContributionDto,
    files: Express.Multer.File[],
    thumbnail: Express.Multer.File,
  ): Promise<Contribution> {
    if (!author.facultyId) {
      throw new InternalServerErrorException();
    }
    // Check file types
    await this.fitlerContributionFileTypes(files);
    await this.fitlerContributionThumbnailFileTypes(thumbnail);
    // Check if user can submit new contributions
    if (!(await this.canUploadNewContributions(author.facultyId))) {
      throw new BadRequestException(
        ExceptionMessage.INVALID.NEW_SUBMISSION_DEADLINE_DUE,
      );
    }
    // Generate contribution files
    let contributionFiles: DeepPartial<ContributionFile>[] = [];
    for (let file of files) {
      contributionFiles.push({
        file: file.filename,
      });
    }
    // Generate contribution
    const newContribution: Contribution = await this.contributionRepository.create(
      {
        name: createContributionDto.name,
        description: createContributionDto.description,
        user: author,
        faculty: author.faculty,
        files: contributionFiles,
        thumbnail: thumbnail.filename,
      },
    );
    // Add job
    await this.contributionQueue.add(
      QueueConst.JOB.NEW_CONTRIBUTION,
      {
        contribution: newContribution,
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    return newContribution;
  }

  async fitlerContributionFileTypes(
    files: Express.Multer.File[],
  ): Promise<void> {
    const allowedTypes: string[] = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/png',
      'image/jpeg',
    ];
    for (const file of files) {
      if (!allowedTypes.some((type) => file.mimetype === type)) {
        throw new BadRequestException(
          ExceptionMessage.INVALID.CONTRIBUTION_CONTENT_FILE_TYPE_NOT_ALLOWED,
        );
      }
    }
  }

  async fitlerContributionThumbnailFileTypes(
    thumbnail: Express.Multer.File,
  ): Promise<void> {
    const allowedTypes: string[] = ['image/png', 'image/jpeg'];
    if (!allowedTypes.some((type) => thumbnail.mimetype === type)) {
      throw new BadRequestException(
        ExceptionMessage.INVALID.CONTRIBUTION_THUMBNAIL_FILE_TYPE_NOT_ALLOWED,
      );
    }
  }

  async findAll(
    paginatedQueryDto: PaginatedQueryDto,
    query: FindAllContributionQueryDto,
  ): Promise<[Contribution[], number]> {
    return await this.contributionRepository.findAll(paginatedQueryDto, query);
  }

  async findOne(id: number): Promise<Contribution> {
    return await this.contributionRepository.findOneByIdWithRelations(id);
  }

  async update(
    id: number,
    updateContributionDto: UpdateContributionDto,
    user: User,
  ): Promise<Contribution> {
    const contribution: Contribution = await this.contributionRepository.findOneByIdWithRelations(
      id,
    );
    // STUDENT cannot update other student's contributions
    if (user.role === Role.STUDENT && user.id !== contribution.userId) {
      throw new BadRequestException();
    }
    // Updater must be same faculty as the contribution
    if (user.faculty.id !== contribution.facultyId) {
      throw new BadRequestException();
    }
    // Check if user can update contributions
    if (!(await this.canUpdateContributions(user.faculty.id))) {
      throw new BadRequestException(
        ExceptionMessage.INVALID.UPDATE_SUBMISSION_DEADLINE_DUE,
      );
    }

    await this.contributionRepository.updateOne(id, updateContributionDto);

    return await this.contributionRepository.findOneByIdWithRelations(id);
  }

  async publish(id: number, user: User): Promise<void> {
    const contribution: Contribution = await this.contributionRepository.findOneByIdWithRelations(
      id,
    );
    if (user.faculty.id !== contribution.facultyId) {
      throw new BadRequestException();
    }

    await this.contributionRepository.updateOne(id, {
      isPublished: true,
    });
  }

  async increaseView(id: number, amount: number = 1): Promise<void> {
    // Get contribution
    const contribution: Contribution = await this.contributionRepository.findOneById(
      id,
    );
    // Increase views
    await this.contributionRepository.updateOne(id, {
      views: contribution.views + amount,
    });
  }

  async remove(id: number, user: User): Promise<void> {
    const contribution: Contribution = await this.contributionRepository.findOneByIdWithRelations(
      id,
    );
    if (user.role === Role.STUDENT && user.id !== contribution.userId) {
      throw new BadRequestException();
    }
    if (
      user.role === Role.MARKETING_CORDINATOR &&
      user.faculty.id !== contribution.facultyId
    ) {
      throw new BadRequestException();
    }

    await this.contributionRepository.deleteOne(id);
  }

  async download(contributionIds: number[], requester: User): Promise<void> {
    const pulishedContributions: Contribution[] = await this.contributionRepository.findPublishedWithRelations();
    if (pulishedContributions.length === 0) {
      throw new BadRequestException(
        ExceptionMessage.INVALID.NO_PUBLISHED_CONTRIBUTION,
      );
    }
    // Add job
    await this.contributionQueue.add(
      QueueConst.JOB.ZIP,
      {
        email: requester.email,
        contributionIds: contributionIds,
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }

  async canUploadNewContributions(facultyId: number): Promise<boolean> {
    // Current time
    const now: Date = new Date();
    // Get faculty
    const faculty: Faculty = await this.facultyRepository.findOneById(
      facultyId,
    );
    let deadLine: Date = new Date();
    if (faculty.firstClosureDate) {
      deadLine = faculty.firstClosureDate;
    } else {
      deadLine = new Date(
        await this.globalConfigRepository.get(
          GlobalConfigKey.FIRST_CLOSURE_DATE,
        ),
      );
    }

    return now < deadLine;
  }

  async canUpdateContributions(facultyId: number): Promise<boolean> {
    // Current time
    const now: Date = new Date();
    // Get faculty
    const faculty: Faculty = await this.facultyRepository.findOneById(
      facultyId,
    );
    let deadLine: Date = new Date();
    if (faculty.secondClosureDate) {
      deadLine = faculty.secondClosureDate;
    } else {
      deadLine = new Date(
        await this.globalConfigRepository.get(
          GlobalConfigKey.SECOND_CLOSURE_DATE,
        ),
      );
    }

    return now < deadLine;
  }
}
