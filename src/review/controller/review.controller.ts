import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ReviewResponse } from "@/review/dto/review-response.dto";
import { ReviewService } from "@/review/service/review.service";
import { ReviewRequest } from "@/review/dto/review-request.dto";
import { Public } from "@/common/decorators";

@Public()
@Controller("/reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  findReviews(): Promise<ReviewResponse[]> {
    return this.reviewService.findReviews();
  }

  @Get("/:reviewId")
  findReviewById(@Param("reviewId") reviewId: number): Promise<ReviewResponse> {
    return this.reviewService.findReviewById(reviewId);
  }

  @Post()
  async createReview(@Body() body: ReviewRequest): Promise<string> {
    return await this.reviewService.createReview(body);
  }

  @Delete("/:reviewId")
  async deleteReviewById(@Param("reviewId") reviewId: number): Promise<string> {
    return await this.reviewService.deleteReviewById(reviewId);
  }
}
