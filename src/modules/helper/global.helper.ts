import { Injectable } from '@nestjs/common';
import { isArray, isEmpty, isObject } from 'lodash';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GlobalHelper {
  private bcryptRounds: number;
  constructor(private configService: ConfigService) {
    this.bcryptRounds =
      Number(configService.get<number>('BCRYPT_ROUNDS')) || 11;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.bcryptRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  checkObjectIsEmpty(object: any): boolean {
    let rs: boolean = false;
    if (isArray(object) || !isObject(object) || isEmpty(object)) {
      rs = true;
    }

    return rs;
  }

  checkArrayIsEmpty(object: any): boolean {
    let rs: boolean = false;
    if (!isArray(object) || !isObject(object) || isEmpty(object)) {
      rs = true;
    }

    return rs;
  }

  generateRandomString(
    len: number,
    charSet: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  ): string {
    let result = '';
    for (var i = 0; i < len; i++) {
      result += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    return result;
  }

  getRandomInt(n: number): number {
    return Math.floor(Math.random() * n);
  }

  shuffle(s: string): string {
    var arr = s.split('');
    var n = arr.length;

    for (var i = 0; i < n - 1; ++i) {
      var j = this.getRandomInt(n);

      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }

    s = arr.join('');

    return s;
  }

  generateRandomPassword(): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const capLetters = letters.toUpperCase();
    const numbers = '0123456789';

    let password = `${this.generateRandomString(
      5,
      letters,
    )}${this.generateRandomString(2, capLetters)}${this.generateRandomString(
      1,
      numbers,
    )}`;

    return this.shuffle(password);
  }
}
