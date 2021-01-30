import { Global, Module } from '@nestjs/common';
import { GlobalHelper } from './global.helper';

@Global()
@Module({
  providers: [GlobalHelper],
  exports: [GlobalHelper],
})
export class HelperModule {}
