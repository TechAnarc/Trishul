import { authService } from '../auth.service';
import { authRepository } from '../auth.repository';
import { Role, MfaMethod } from '@prisma/client';
import { AuthError, ConflictError } from '../../../middleware/errorHandler';
import bcrypt from 'bcryptjs';
import { redis } from '../../../config/redis';

jest.mock('../auth.repository');
jest.mock('../../../config/redis');

describe('AuthService Logic Verification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      phone: '1234567890',
    };

    test('should successfully register a new user', async () => {
      (authRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (authRepository.createUser as jest.Mock).mockResolvedValue({
        id: 'user-123',
        email: registerDto.email,
        role: Role.DRIVER,
      });

      const result = await authService.register(registerDto);

      expect(result.email).toBe(registerDto.email);
      expect(authRepository.createUser).toHaveBeenCalled();
    });

    test('should throw ConflictError if email already exists', async () => {
      (authRepository.findByEmail as jest.Mock).mockResolvedValue({ id: '1' });

      await expect(authService.register(registerDto)).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    test('should return tokens on successful login without MFA', async () => {
      const hashedPassword = await bcrypt.hash(loginDto.password, 12);
      (authRepository.findByEmail as jest.Mock).mockResolvedValue({
        id: 'u1',
        email: loginDto.email,
        password: hashedPassword,
        isActive: true,
        isMfaEnabled: false,
        name: 'Test',
        role: Role.DRIVER,
      });

      const result = await authService.login(loginDto);

      expect(result.requiresMfa).toBe(false);
      expect(result.tokens).toBeDefined();
      expect(result.user?.email).toBe(loginDto.email);
    });

    test('should return MFA challenge if MFA is enabled', async () => {
      const hashedPassword = await bcrypt.hash(loginDto.password, 12);
      (authRepository.findByEmail as jest.Mock).mockResolvedValue({
        id: 'u1',
        email: loginDto.email,
        password: hashedPassword,
        isActive: true,
        isMfaEnabled: true,
        mfaMethod: MfaMethod.TOTP,
        name: 'Test',
        role: Role.DRIVER,
      });

      const result = await authService.login(loginDto);

      expect(result.requiresMfa).toBe(true);
      expect(result.mfaMethod).toBe(MfaMethod.TOTP);
      expect(redis.set).toHaveBeenCalled();
    });

    test('should throw AuthError on invalid password', async () => {
      const hashedPassword = await bcrypt.hash('wrong-password', 12);
      (authRepository.findByEmail as jest.Mock).mockResolvedValue({
        id: 'u1',
        email: loginDto.email,
        password: hashedPassword,
        isActive: true,
      });

      await expect(authService.login(loginDto)).rejects.toThrow(AuthError);
    });
  });
});
