import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  descriprion: string;

  @Column()
  price: number;

  @Column()
  categoryId: number;

  // @ManyToOne(() => CategoryEntity, (category) => category.id)
  // category: CategoryEntity;
}
