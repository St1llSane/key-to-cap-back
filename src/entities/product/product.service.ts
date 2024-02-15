import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { NotFoundError } from '@errors/NotFoundError';
import { CreateProductDto } from './dto/createProductDto';
import { DefaultConflictError } from '@errors/DefaultConflictError';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getAllProducts() {
    const products = await this.productRepository.find({
      select: ['id', 'name', 'description', 'price', 'quantity'],
    });

    return products;
  }

  async getProduct(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      select: ['id', 'name', 'description', 'price', 'quantity'],
    });

    if (!product) {
      throw new NotFoundError('Product with this id was not found');
    }

    return product;
  }

  async createProduct(body: CreateProductDto) {
    const isProductAlreadyExist = await this.productRepository.exist({
      where: { name: body.name },
    });

    if (isProductAlreadyExist) {
      throw new DefaultConflictError();
    }

    const newProduct = this.productRepository.create(body);
    await this.productRepository.save(newProduct);

    return newProduct;
  }

  async updateProduct(id: number, body: CreateProductDto) {
    const isProductExist = await this.productRepository.exist({
      where: { id },
    });

    if (!isProductExist) {
      throw new NotFoundError('Product with this id was not found');
    }

    await this.productRepository.update(
      { id },
      {
        name: body.name,
        description: body.description,
        price: body.price,
        quantity: body.quantity,
        categoryId: body.categoryId,
      },
    );

    return { status: 'UPDATED' };
  }

  async deleteProduct(id: number) {
    await this.productRepository.delete(id);

    return { status: 'DELETED' };
  }
}
