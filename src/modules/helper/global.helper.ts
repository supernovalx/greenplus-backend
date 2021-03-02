import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { isArray, isEmpty, isObject } from 'lodash';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ExceptionMessage } from 'src/common/const/exception-message';

@Injectable()
export class GlobalHelper {
  private bcryptRounds: number;
  constructor(private readonly configService: ConfigService) {
    this.bcryptRounds =
      Number(configService.get<number>('BCRYPT_ROUNDS')) || 11;
  }

  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.bcryptRounds);
    } catch (error) {
      throw new InternalServerErrorException(
        ExceptionMessage.FAILED.HASH_PASSWORD,
      );
    }
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new InternalServerErrorException(
        ExceptionMessage.FAILED.HASH_PASSWORD,
      );
    }
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
    let result: string = '';
    for (let i: number = 0; i < len; i++) {
      result += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    return result;
  }

  getRandomInt(n: number): number {
    return Math.floor(Math.random() * n);
  }

  shuffle(s: string): string {
    let arr: string[] = s.split('');
    const n = arr.length;

    for (let i: number = 0; i < n - 1; i++) {
      const j = this.getRandomInt(n);

      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }

    return arr.join('');
  }

  generateRandomPassword(): string {
    const letters: string = 'abcdefghijklmnopqrstuvwxyz';
    const capLetters: string = letters.toUpperCase();
    const numbers: string = '0123456789';

    const password: string = `${this.generateRandomString(
      5,
      letters,
    )}${this.generateRandomString(2, capLetters)}${this.generateRandomString(
      1,
      numbers,
    )}`;

    return this.shuffle(password);
  }

  truthyOrFail(condition: boolean): void {
    if (!condition) {
      throw new Error();
    }
  }
}
