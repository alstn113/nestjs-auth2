import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReviewResponse } from "@/review/dto/review-response.dto";
import { ReviewRepository } from "@/review/repository/review.repository";
import { ReviewRequest } from "@/review/dto/review-request.dto";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewRepository)
    private readonly reviewRepository: ReviewRepository
  ) {}

  async findReviews(): Promise<ReviewResponse[]> {
    return await this.reviewRepository.findReviews();
  }

  async findReviewById(reviewId: number): Promise<ReviewResponse> {
    const review = await this.reviewRepository.findReviewById(reviewId);
    if (!review) {
      throw new HttpException("없어요 없어 하하!", 404);
    }
    return review;
  }

  async createReview(reviewBody: ReviewRequest): Promise<string> {
    await this.reviewRepository.createReview(reviewBody);
    return "생성완료";
  }

  async deleteReviewById(reviewId: number): Promise<string> {
    const review = await this.findReviewById(reviewId);
    if (!review) {
      throw new HttpException("없어요 없어 하하!", 404);
    }
    await this.reviewRepository.deleteReviewById(reviewId);
    return "제거완료";
  }
}
