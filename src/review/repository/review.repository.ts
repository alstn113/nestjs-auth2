import { EntityRepository, Repository } from "typeorm";
import { Review } from "@/review/entity/review.entity";
import { ReviewRequest } from "@/review/dto/review-request.dto";

@EntityRepository(Review)
export class ReviewRepository extends Repository<Review> {
  findReviews(): Promise<Review[]> {
    return this.find();
  }
  findReviewById(reviewId: number): Promise<Review | undefined> {
    return this.findOne(reviewId);
  }
  createReview(review: ReviewRequest): void {
    this.insert(review);
  }
  deleteReviewById(reviewId: number): void {
    this.delete({ id: reviewId });
  }
}
