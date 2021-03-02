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
    try {
      let rs: boolean = false;

      const uppercaseMatches: RegExpMatchArray | null = password.match(/[A-Z]/);
      if (uppercaseMatches === null) {
        return rs;
      }
      const numberMatches: RegExpMatchArray | null = password.match(/[0-9]/);
      if (numberMatches === null) {
        return rs;
      }
      rs =
        password.length >= 8 &&
        uppercaseMatches.length > 0 &&
        numberMatches.length > 0;

      return rs;
    } catch (err) {
      console.log(err);

      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password must have at least 8 characters, 1 uppercase character, 1 number';
  }
}
