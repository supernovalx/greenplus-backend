import { Injectable } from '@nestjs/common';
import { GlobalConfigKey } from './config-keys';
import { GlobalClosureDatesDto } from './dto/global-closure-dates.dto';
import { SetGlobalClosureDatesDto } from './dto/set-closure-dates.dto';
import { GlobalConfigRepository } from './global-config.repository';

@Injectable()
export class GlobalConfigService {
  constructor(private globalConfigRepository: GlobalConfigRepository) {}
  async setGlobalClosureDates(dto: SetGlobalClosureDatesDto): Promise<void> {
    if (dto.firstClosureDate) {
      await this.globalConfigRepository.set(
        GlobalConfigKey.FIRST_CLOSURE_DATE,
        dto.firstClosureDate,
      );
    }

    if (dto.secondClosureDate) {
      await this.globalConfigRepository.set(
        GlobalConfigKey.SECOND_CLOSURE_DATE,
        dto.secondClosureDate,
      );
    }
  }

  async getGlobalClosureDates(): Promise<GlobalClosureDatesDto> {
    return {
      firstClosureDate: new Date(
        await this.globalConfigRepository.get(
          GlobalConfigKey.FIRST_CLOSURE_DATE,
        ),
      ),
      secondClosureDate: new Date(
        await this.globalConfigRepository.get(
          GlobalConfigKey.SECOND_CLOSURE_DATE,
        ),
      ),
    };
  }
}
