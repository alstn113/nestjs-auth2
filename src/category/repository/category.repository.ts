import { EntityRepository, Repository } from "typeorm";
import { Category } from "@/category/entitiy/category.entity";
import { CategoryRequest } from "@/category/dto/category-request.dto";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  findCategories(): Promise<Category[]> {
    return this.find({ relations: ["review"] });
  }
  findCategoryById(categoryId: number): Promise<Category | undefined> {
    return this.findOne(categoryId, { relations: ["review"] });
  }
  createCategory(categpry: CategoryRequest): void {
    this.insert(categpry);
  }
  deleteCategoryById(categoryId: number): void {
    this.delete({ id: categoryId });
  }
}
