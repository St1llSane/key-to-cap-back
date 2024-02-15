import { EntitySchema } from 'typeorm';
import { Product } from './product.entity';

export const ProductSchema = new EntitySchema<Product>({
  name: 'Product',
  target: Product,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    categoryId: {
      type: Number,
    },
  },
  // relations: {
  //   category: {
  //     type: 'many-to-one',
  //     target: 'Category',
  //   },
  // },
});
