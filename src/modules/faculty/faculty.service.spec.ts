import { Test, TestingModule } from '@nestjs/testing';
import { FacultyService } from './faculty.service';
import { HelperModule } from '../helper/helper.module';
import { FacultyRepository } from './faculty.repository';

describe('FacultyService', () => {
  let service: FacultyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HelperModule],
      providers: [FacultyService, FacultyRepository],
    }).compile();

    service = module.get<FacultyService>(FacultyService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
