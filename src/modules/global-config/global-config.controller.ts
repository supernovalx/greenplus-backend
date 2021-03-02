import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/enums/roles';
import { Auth } from '../auth/decorator/auth.decorator';
import { ClosureDatesDto } from '../faculty/dto/closure-dates.dto';
import { GlobalClosureDatesDto } from './dto/global-closure-dates.dto';
import { SetGlobalClosureDatesDto } from './dto/set-closure-dates.dto';
import { GlobalConfigService } from './global-config.service';

@Controller('global-config')
@ApiTags('Global configs')
export class GlobalConfigController {
  constructor(private readonly globalConfigService: GlobalConfigService) {}

  @Get('/closure-dates')
  @ApiOperation({ summary: 'Get global closure dates' })
  async getGlobalClosureDates(): Promise<ClosureDatesDto> {
    return await this.globalConfigService.getGlobalClosureDates();
  }

  @Post('/closure-dates')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Change global closure dates' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async changeGlobalClosureDates(
    @Body() setGlobalClosureDatesDto: SetGlobalClosureDatesDto,
  ): Promise<GlobalClosureDatesDto> {
    await this.globalConfigService.setGlobalClosureDates(
      setGlobalClosureDatesDto,
    );

    return await this.globalConfigService.getGlobalClosureDates();
  }
}
