import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { ContributionCommentRepository } from './contribution-comment.repository';
import { ContributionRepository } from './contribution.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
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

  async updateComment(
    id: number,
    user: User,
    updateCommentDto: UpdateCommentDto,
  ): Promise<ContributionComment> {
    const comment: ContributionComment = await this.contributionCommentRepository.findOneByIdWithRelations(
      id,
    );
    if (comment.userId !== user.id || comment.isDeleted) {
      throw new BadRequestException();
    }
    // Update comment
    await this.contributionCommentRepository.updateOne(id, updateCommentDto);

    return await this.contributionCommentRepository.findOneByIdWithRelations(
      id,
    );
  }

  async deleteComment(id: number, user: User): Promise<void> {
    const comment: ContributionComment = await this.contributionCommentRepository.findOneByIdWithRelations(
      id,
    );
    if (comment.userId !== user.id) {
      throw new BadRequestException();
    }
    // Update comment
    await this.contributionCommentRepository.updateOne(id, {
      comment: 'This comment has been deleted',
      isDeleted: true,
    });
  }
}
