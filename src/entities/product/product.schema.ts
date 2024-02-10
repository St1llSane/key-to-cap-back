import { EntitySchema } from 'typeorm';
import { ProductEntity } from './product.entity';

export const ProductSchema = new EntitySchema<ProductEntity>({
  name: 'Product',
  target: ProductEntity,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    descriprion: {
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
