import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCategoryRequest } from "@/category/dto/category-request.dto";
import { CategoryResponse } from "@/category/dto/category-response.dto";
import { CategoryRepository } from "@/category/repository/category.repository";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository
  ) {}

  async findCategories(): Promise<CategoryResponse[]> {
    return await this.categoryRepository.findCategories();
  }

  async findCategoryById(categoryId: number): Promise<CategoryResponse> {
    const category = await this.categoryRepository.findCategoryById(categoryId);
    if (!category) {
      throw new HttpException("없어요 없어 하하!", 404);
    }
    return category;
  }

  async createCategory(categoryBody: CreateCategoryRequest): Promise<string> {
    await this.categoryRepository.createCategory({
      ...categoryBody,
      review: { id: categoryBody.reviewId },
    });
    return "생성완료";
  }

  async deleteCategoryById(categoryId: number): Promise<string> {
    const category = await this.findCategoryById(categoryId);
    if (!category) {
      throw new HttpException("없어요 없어 하하!", 404);
    }
    await this.categoryRepository.deleteCategoryById(categoryId);
    return "제거완료";
  }
}
