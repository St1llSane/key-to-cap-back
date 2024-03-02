import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { NotFoundError } from 'src/shared/errors/NotFoundError';
import { CreateProductDto } from './dto/createProductDto';
import { DefaultConflictError } from 'src/shared/errors/DefaultConflictError';
import { GetAllProductsParams, Products } from './types/types';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private readonly categories: { [k: number]: string } = {
    1: 'Keyboards',
    2: 'Mouses',
    3: 'Mouse pads',
    4: 'Keycaps',
  };

  async getAllProducts(params?: GetAllProductsParams) {
    const products = await this.productRepository.find({
      take: params.limit,
      order: { id: { direction: 'asc' } },
      select: ['id', 'name', 'description', 'price', 'quantity', 'categoryId'],
    });

    const filteredProducts = products.reduce((acc, product) => {
      if (!acc[product.categoryId]) {
        acc[product.categoryId] = [];
      }

      acc[product.categoryId].push(product);

      return acc;
    }, {});

    const filteredProductsWithCorrectCategoriesNames: Products = Object.keys(
      filteredProducts,
    ).reduce((acc, key) => {
      const newCategoryName = this.categories[key];
      acc[newCategoryName] = filteredProducts[key];

      return acc;
    }, {} as Products);

    return filteredProductsWithCorrectCategoriesNames;
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

    return await this.productRepository.update(
      { id },
      {
        name: body.name,
        description: body.description,
        price: body.price,
        quantity: body.quantity,
        categoryId: body.categoryId,
      },
    );
  }

  async deleteProduct(id: number) {
    return await this.productRepository.delete(id);
  }
}
