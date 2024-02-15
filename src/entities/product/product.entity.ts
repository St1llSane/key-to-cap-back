import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'descriprion', type: 'varchar' })
  descriprion: string;

  @Column({ name: 'price', type: 'numeric' })
  price: number;

  @Column({ name: 'category_id', type: 'int' })
  categoryId: number;

  // @ManyToOne(() => CategoryEntity, (category) => category.id)
  // category: CategoryEntity;
}
