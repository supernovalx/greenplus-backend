import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { ContributionCommentRepository } from './contribution-comment.repository';
import { ContributionRepository } from './contribution.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ContributionComment } from './entities/contribution-comment.entity';
import { Contribution } from './entities/contribution.entity';

@Injectable()
export class ContributionCommentService {
  constructor(
    private contributionRepository: ContributionRepository,
    private contributionCommentRepository: ContributionCommentRepository,
  ) {}

  async comment(
    createCommentDto: CreateCommentDto,
    contributionId: number,
    author: User,
  ): Promise<ContributionComment> {
    const contribution: Contribution = await this.contributionRepository.findOneById(
      contributionId,
    );
    if (contribution.facultyId !== author.facultyId) {
      throw new BadRequestException();
    }

    return await this.contributionCommentRepository.create({
      ...createCommentDto,
      contributionId: contributionId,
      userId: author.id,
    });
  }
}
