import { EntitySchema } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';

export const CategorySchema = new EntitySchema<CategoryEntity>({
  name: 'Category',
  target: CategoryEntity,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
  },
});
