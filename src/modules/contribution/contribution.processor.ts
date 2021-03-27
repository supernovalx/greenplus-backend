import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Archiver } from 'archiver';
import { Job } from 'bull';
import { QueueConst } from 'src/common/const/queue';
import { MailService } from '../mail/mail.service';
import { ContributionRepository } from './contribution.repository';
import { Contribution } from './entities/contribution.entity';
const fs = require('fs');
const archiver = require('archiver');

@Processor(QueueConst.QUEUE.CONTRIBUTION)
export class ContributionProcessor {
  constructor(
    private contributionRepository: ContributionRepository,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(ContributionProcessor.name);

  @Process(QueueConst.JOB.ZIP)
  async handleZip(job: Job): Promise<void> {
    const output = fs.createWriteStream('./upload/published_contributions.zip');
    const archive: Archiver = archiver('zip', {
      zlib: { level: 1 },
    });

    // Send email when compression completed
    output.on('close', () => {
      this.mailService.sendContributionDownloadMail(
        job.data.email,
        `${this.configService.get(
          'SERVER_ADDRESS',
        )}/published_contributions.zip`,
      );
    });
    // Pipe archive data to the file
    archive.pipe(output);
    // Get published contributions
    const pulishedContributions: Contribution[] = await this.contributionRepository.findPublishedWithRelations();
    // Add contribution files
    for (const contribution of pulishedContributions) {
      for (const file of contribution.files) {
        archive.append(fs.createReadStream(`./upload/${file.file}`), {
          name: `[${contribution.name}] ${file.file}`,
        });
      }
    }
    // Compress
    archive.finalize();
  }
}
