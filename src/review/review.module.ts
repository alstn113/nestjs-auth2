import { Module } from "@nestjs/common";
import { ReviewRepository } from "@/review/repository/review.repository";
import { ReviewService } from "@/review/service/review.service";
import { ReviewController } from "@/review/controller/review.controller";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ReviewRepository])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
