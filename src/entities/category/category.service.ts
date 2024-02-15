import { Injectable } from '@nestjs/common';
// import { CreateCategoryDto } from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoriesRepository: Repository<CategoryEntity>,
  ) {}

  public async getAllCategories() {
    const categories = await this.categoriesRepository.find({
      select: ['id', 'name'],
    });

    return categories;
  }

  public async getCategory(id: number) {
    const category = await this.categoriesRepository.find({
      where: { id },
      select: ['id', 'name'],
    });

    return category;
  }

  public async deleteCategory(id: number) {
    return await this.categoriesRepository.delete(id);
  }
}
