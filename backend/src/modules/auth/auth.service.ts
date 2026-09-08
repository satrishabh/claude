import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../../common/AppError';
import { AuthRepository } from './auth.repository';
import { AuthResponse, LoginRequest, RefreshTokenRequest, RegisterRequest } from './auth.dto';

const ACCESS_TOKEN_EXPIRY = 900; // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

export class AuthService {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async register(dto: RegisterRequest): Promise<AuthResponse> {
    const existing = this.repository.findCustomerByUsername(dto.username);
    if (existing) {
      throw new AppError(409, 'CONFLICT', 'Username already taken');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    this.repository.createCustomer({
      id,
      username: dto.username,
      password_hash: passwordHash,
      created_at: now,
      updated_at: now,
    });

    return this.generateAuthResponse(id, dto.username);
  }

  async login(dto: LoginRequest): Promise<AuthResponse> {
    const customer = this.repository.findCustomerByUsername(dto.username);
    if (!customer) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid username or password');
    }

    const valid = await bcrypt.compare(dto.password, customer.password_hash);
    if (!valid) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid username or password');
    }

    return this.generateAuthResponse(customer.id, customer.username);
  }

  async refresh(dto: RefreshTokenRequest): Promise<AuthResponse> {
    const refreshSecret = process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret';

    let payload: { customerId: string; type: string };
    try {
      payload = jwt.verify(dto.refreshToken, refreshSecret) as {
        customerId: string;
        type: string;
      };
    } catch {
      throw new AppError(401, 'INVALID_TOKEN', 'Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new AppError(401, 'INVALID_TOKEN', 'Invalid token type');
    }

    const storedToken = this.repository.findRefreshToken(dto.refreshToken);
    if (!storedToken) {
      throw new AppError(401, 'INVALID_TOKEN', 'Refresh token not found or already used');
    }

    if (new Date(storedToken.expires_at) < new Date()) {
      this.repository.deleteRefreshToken(dto.refreshToken);
      throw new AppError(401, 'TOKEN_EXPIRED', 'Refresh token has expired');
    }

    const customer = this.repository.findCustomerById(payload.customerId);
    if (!customer) {
      throw new AppError(401, 'INVALID_TOKEN', 'Customer not found');
    }

    this.repository.deleteRefreshToken(dto.refreshToken);
    return this.generateAuthResponse(customer.id, customer.username);
  }

  logout(customerId: string): void {
    this.repository.deleteRefreshTokensByCustomerId(customerId);
  }

  private generateAuthResponse(customerId: string, username: string): AuthResponse {
    const accessSecret = process.env.JWT_SECRET ?? 'dev-secret';
    const refreshSecret = process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret';

    const accessToken = jwt.sign({ customerId, type: 'access' }, accessSecret, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign({ customerId, type: 'refresh' }, refreshSecret, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY * 1000).toISOString();

    this.repository.saveRefreshToken({
      id: crypto.randomUUID(),
      customer_id: customerId,
      token: refreshToken,
      expires_at: expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRY,
      customer: { id: customerId, username },
    };
  }
}
