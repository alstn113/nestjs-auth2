import { AuthService } from "@/auth/auth.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthDto, AuthResponse } from "@/auth/dto";
import { Tokens } from "@/auth/types";
import { RtGuard } from "@/common/guards";
import { GetCurrentUser, GetCurrentUserId, Public } from "@/common/decorators";

@Controller("/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  async findUsers(): Promise<AuthResponse[]> {
    return this.authService.findUsers();
  }

  @Get("/:userId")
  async findUserById(@Param("userId") userId: number): Promise<AuthResponse> {
    const user = await this.authService.findUserById(userId);
    if (!user) {
      throw new HttpException("없어요 없어 하하!", 404);
    }
    return user;
  }

  @Delete("/:userId")
  async deleteUserById(@Param("userId") userId: number): Promise<string> {
    const user = await this.authService.findUserById(userId);
    if (!user) {
      throw new HttpException("없어요 없어 하하!", 404);
    }
    return await this.authService.deleteUserById(userId);
  }

  @Public()
  @Post("/signin/local")
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }

  @Public()
  @Post("/signup/local")
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Post("/logout")
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    console.log(userId);
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post("/refresh")
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser("refreshToken") refreshToken: string
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
