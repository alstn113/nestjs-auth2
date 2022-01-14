import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CategoryResponse } from "@/category/dto/category-response.dto";
import { CategoryService } from "@/category/service/category.service";
import { CreateCategoryRequest } from "@/category/dto/category-request.dto";

@Controller("/categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findCategorys(): Promise<CategoryResponse[]> {
    return this.categoryService.findCategories();
  }

  @Get("/:categoryId")
  findCategoryById(
    @Param("categoryId") categoryId: number
  ): Promise<CategoryResponse> {
    return this.categoryService.findCategoryById(categoryId);
  }

  @Post()
  async createCategory(@Body() body: CreateCategoryRequest): Promise<string> {
    return await this.categoryService.createCategory(body);
  }

  @Delete("/:categoryId")
  async deleteCategoryById(
    @Param("categoryId") categoryId: number
  ): Promise<string> {
    return await this.categoryService.deleteCategoryById(categoryId);
  }
}
