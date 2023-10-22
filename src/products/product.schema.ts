import { EntitySchema } from 'typeorm';
import { ProductEntity } from './entities/product.entity';

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
    category: {
      type: String,
    },
    descriprion: {
      type: String,
    },
    price: {
      type: Number,
    },
  },
  relations: {
    category: {
      type: 'many-to-one',
      target: 'Category',
    },
  },
});
