import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GlobalHelper } from './global.helper';

describe('GlobalHelper', () => {
  let globalHelper: GlobalHelper;
  let mockConfigService = {
    get(key: string) {
      return 10;
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        GlobalHelper,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    globalHelper = module.get<GlobalHelper>(GlobalHelper);
  });

  it('should be defined', () => {
    expect(globalHelper).toBeDefined();
  });

  describe('checkObjectIsEmpty', () => {
    it('should return true', () => {
      expect(globalHelper.checkObjectIsEmpty({})).toBe(true);
      expect(globalHelper.checkObjectIsEmpty([])).toBe(true);
      expect(globalHelper.checkObjectIsEmpty([{}])).toBe(true);
      expect(globalHelper.checkObjectIsEmpty([{ e: 'f' }])).toBe(true);
      expect(globalHelper.checkObjectIsEmpty([1, 2])).toBe(true);
      expect(globalHelper.checkObjectIsEmpty('1213')).toBe(true);
      expect(globalHelper.checkObjectIsEmpty('')).toBe(true);
      expect(globalHelper.checkObjectIsEmpty(0)).toBe(true);
    });

    it('should return false', () => {
      expect(globalHelper.checkObjectIsEmpty({ a: 1 })).toBe(false);
      expect(globalHelper.checkObjectIsEmpty({ a: 1, b: { foo: 'bar' } })).toBe(
        false,
      );
    });
  });

  describe('checkArrayIsEmpty', () => {
    it('should return true', () => {
      expect(globalHelper.checkArrayIsEmpty({})).toBe(true);
      expect(globalHelper.checkArrayIsEmpty({ a: 1 })).toBe(true);
      expect(globalHelper.checkArrayIsEmpty({ a: 1, b: { foo: 'bar' } })).toBe(
        true,
      );
      expect(globalHelper.checkArrayIsEmpty([])).toBe(true);
      expect(globalHelper.checkArrayIsEmpty('1213')).toBe(true);
      expect(globalHelper.checkArrayIsEmpty('')).toBe(true);
      expect(globalHelper.checkArrayIsEmpty(0)).toBe(true);
    });

    it('should return false', () => {
      expect(globalHelper.checkArrayIsEmpty([{}])).toBe(false);
      expect(globalHelper.checkArrayIsEmpty([{ e: 'f' }])).toBe(false);
      expect(globalHelper.checkArrayIsEmpty([1, 2])).toBe(false);
    });
  });

  describe('password helpers', () => {
    it('should matches', async () => {
      const password = 'padpwdpawd';
      const hashedPassword = await globalHelper.hashPassword(password);
      const matchesResult = await globalHelper.comparePassword(
        password,
        hashedPassword,
      );

      expect(matchesResult).toBe(true);
    });
  });
});
