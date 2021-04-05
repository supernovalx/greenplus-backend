import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Archiver } from 'archiver';
import { Job } from 'bull';
import { QueueConst } from 'src/common/const/queue';
import { GlobalHelper } from '../helper/global.helper';
import { MailService } from '../mail/mail.service';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { ContributionRepository } from './contribution.repository';
import { Contribution } from './entities/contribution.entity';
const fs = require('fs');
const archiver = require('archiver');

@Processor(QueueConst.QUEUE.CONTRIBUTION)
export class ContributionProcessor {
  constructor(
    private contributionRepository: ContributionRepository,
    private userRepository: UserRepository,
    private mailService: MailService,
    private configService: ConfigService,
    private globalHelper: GlobalHelper,
  ) {}
  private readonly logger = new Logger(ContributionProcessor.name);

  @Process(QueueConst.JOB.ZIP)
  async handleZip(job: Job): Promise<void> {
    try {
      const fileName = this.globalHelper.generateRandomString(10, '0123456789');
      const output = fs.createWriteStream(`./upload/${fileName}.zip`);
      const archive: Archiver = archiver('zip', {
        zlib: { level: 1 },
      });

      // Send email when compression completed
      output.on('close', () => {
        this.mailService.sendContributionDownloadMail(
          job.data.email,
          `${this.configService.get('SERVER_ADDRESS')}/${fileName}.zip`,
        );
      });
      // Pipe archive data to the file
      archive.pipe(output);
      // Get published contributions
      const pulishedContributions: Contribution[] = await this.contributionRepository.findPublishedWithRelations();
      let fileCount = 0;
      // Add contribution files
      for (const contribution of pulishedContributions) {
        if (job.data.contributionIds.includes(contribution.id)) {
          for (const file of contribution.files) {
            archive.append(fs.createReadStream(`./upload/${file.file}`), {
              name: `[${contribution.name}] ${file.file}`,
            });
            fileCount++;
          }
        }
      }
      // Compress
      if (fileCount > 0) {
        archive.finalize();
      } else {
        archive.destroy();
      }
    } catch (err) {
      console.error(err);
    }
  }

  @Process(QueueConst.JOB.NEW_CONTRIBUTION)
  async handleNewContribution(job: Job): Promise<void> {
    // Get contribution from job data
    const contribution: Contribution = job.data.contribution;
    // Find all cordinators from the same faculty
    const cordinators: User[] = await this.userRepository.findMarketingCordinatorByFacultyId(
      contribution.facultyId,
    );
    // Send request for comment email
    for (const cordinator of cordinators) {
      try {
        await this.mailService.sendRequestForCommentMail(
          contribution,
          cordinator.email,
        );
      } catch (err) {
        console.log(err);
      }
    }
  }
}
