import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
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
