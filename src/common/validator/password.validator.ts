import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class ValidPassword implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return this.isValidPassword(text);
  }

  isValidPassword(password: string) {
    let rs = false;

    const uppercaseMatches = password.match(/[A-Z]/);
    if (!uppercaseMatches) {
      return rs;
    }
    const numberMatches = password.match(/[0-9]/);
    if (!numberMatches) {
      return rs;
    }
    rs =
      password.length >= 8 &&
      uppercaseMatches.length > 0 &&
      numberMatches.length > 0;

    return rs;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password must have at least 8 characters, 1 uppercase character, 1 number';
  }
}
