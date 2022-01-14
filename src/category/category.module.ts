import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryService } from "@/category/service/category.service";
import { CategoryController } from "@/category/controller/category.controller";
import { CategoryRepository } from "@/category/repository/category.repository";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryRepository])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
