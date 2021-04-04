import { applyDecorators } from '@nestjs/common';
import { Matches } from 'class-validator';
import { Constrains } from '../const/constraint';

export const IsAlphaSpace = () => {
  return applyDecorators(
    Matches(Constrains.ALPHA_SPACE_REGEX, {
      message: 'String must contains only alphabetic characters and spaces',
    }),
  );
};
