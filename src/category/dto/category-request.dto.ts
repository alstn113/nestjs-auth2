export class CategoryRequest {
  name: string;
  review: {
    id: number;
  };
}

export class CreateCategoryRequest {
  name: string;
  reviewId: number;
}
