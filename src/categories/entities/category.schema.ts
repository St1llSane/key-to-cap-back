import { EntitySchema } from 'typeorm';
import { CategoryEntity } from './category.entity';

export const CategorySchema = new EntitySchema<CategoryEntity>({
  name: 'Category',
  target: CategoryEntity,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    categoryName: {
      type: String,
    },
  },
  relations: {
    products: {
      type: 'one-to-many',
      target: 'Product',
    },
  },
});
