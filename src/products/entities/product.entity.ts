import { CategoryEntity } from 'src/categories/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => CategoryEntity, (category) => category.id)
  category: CategoryEntity;
}
