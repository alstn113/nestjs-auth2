import { Module } from "@nestjs/common";
import { AuthController } from "@/auth/auth.controller";
import { AuthService } from "@/auth/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthRepository } from "@/auth/auth.repository";
import { AtStrategy, RtStrategy } from "@/auth/strategies";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([AuthRepository]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
})
export class AuthModule {}
