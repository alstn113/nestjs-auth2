import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthRepository } from "@/auth/auth.repository";
import { AuthDto, AuthResponse } from "@/auth/dto";
import * as bcrypt from "bcrypt";
import { Tokens } from "@/auth/types";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { IsNull, Not } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) throw new HttpException("없어요 없어 하하!", 404);
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new HttpException("없어요 없어 하하!", 404);

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signupLocal(dto: AuthDto): Promise<Tokens> {
    dto.password = await this.hashData(dto.password);
    const newUser = await this.authRepository.createUser(dto);

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    const user = await this.authRepository.findOne({
      where: {
        id: userId,
        hashedRt: Not(IsNull()),
      },
    });
    await this.authRepository.save({ ...user, hashedRt: null });
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.authRepository.findUserById(userId);
    if (!user || !user.hashedRt) throw new HttpException("접근 금지", 404);
    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new HttpException("접근 금지", 404);

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async findUsers(): Promise<AuthResponse[]> {
    return await this.authRepository.findUsers();
  }

  async findUserByEmail(email: string): Promise<AuthResponse> {
    return await this.authRepository.findUserByEmail(email);
  }

  async findUserById(userId: number): Promise<AuthResponse> {
    return await this.authRepository.findUserById(userId);
  }

  async deleteUserById(userId: number): Promise<string> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new HttpException("없어요 없어 하하", 404);
    }
    await this.authRepository.deleteUserById(userId);
    return "제거완료";
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>("auth.access_token_secret"),
          expiresIn: 60 * 15, //15m
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>("auth.refresh_token_secret"),
          expiresIn: 60 * 60 * 24 * 7, // 7d
        }
      ),
    ]);
    return { access_token: at, refresh_token: rt };
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    const user = await this.authRepository.findOne({
      where: { id: userId },
    });
    await this.authRepository.save({
      ...user,
      hashedRt: hash,
    });
  } // this.authRepository.update(id, { hashedRt: hash})도 가능한 듯
}
