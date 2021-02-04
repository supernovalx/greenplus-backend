import { ValidPassword } from './password.validator';

describe('PasswordValidator', () => {
  let validator: ValidPassword;

  beforeEach(async () => {
    validator = new ValidPassword();
  });

  it('should be invalid', () => {
    expect(validator.isValidPassword('12')).toBe(false);
    expect(validator.isValidPassword('')).toBe(false);
    expect(validator.isValidPassword('awdhawdhawkkawhd12321')).toBe(false);
    expect(validator.isValidPassword('ADWDAWDAWDAWD')).toBe(false);
    expect(validator.isValidPassword('@!!F@G!@G!GFccwc')).toBe(false);
    expect(validator.isValidPassword('             ')).toBe(false);
  });

  it('should be valid', () => {
    expect(validator.isValidPassword('paswworD12')).toBe(true);
    expect(validator.isValidPassword('ADAWDAWDAWDAWDAW1')).toBe(true);
    expect(validator.isValidPassword('1234567U')).toBe(true);
    expect(validator.isValidPassword('aadwpyR7')).toBe(true);
    expect(validator.isValidPassword('sTronKPassworD264   2')).toBe(true);
  });
});
