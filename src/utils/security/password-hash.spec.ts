import { Test, TestingModule } from '@nestjs/testing';
import { HashProvider } from './password-hash';

describe('HashProvider', () => {
  let service: HashProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashProvider],
    }).compile();

    service = module.get<HashProvider>(HashProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHash', () => {
    it('should return a hashed password', async () => {
      expect(HashProvider.getHash('test')).not.toEqual('test');
    });
  });
});
