import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/createProductDto';
import { UpdateProductDto } from './dto/updateProductDto';
import { GetAllProductsParams } from './types/types';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Optional limit param',
    required: false,
  })
  @HttpCode(200)
  async getAllProducts(@Query() params: GetAllProductsParams) {
    const products = await this.productService.getAllProducts(params);

    return products;
  }

  @Get(':id')
  @HttpCode(200)
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.getProduct(id);

    return product;
  }

  @Post()
  @HttpCode(201)
  async createProduct(@Body() body: CreateProductDto) {
    return await this.productService.createProduct(body);
  }

  @Patch(':id')
  @HttpCode(200)
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.deleteProduct(id);
  }
}
