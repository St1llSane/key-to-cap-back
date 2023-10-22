import { EntitySchema } from 'typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';

export const CategorySchema = new EntitySchema<CategoryEntity>({});
