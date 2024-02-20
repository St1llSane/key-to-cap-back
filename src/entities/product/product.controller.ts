import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/createProductDto';
import { UpdateProductDto } from './dto/updateProductDto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  async getAllProducts(@Query('limit') limit?: number) {
    const products = await this.productService.getAllProducts(limit);

    return products;
  }

  @Get(':id')
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.getProduct(id);

    return product;
  }

  @Post()
  async createProduct(@Body() body: CreateProductDto) {
    return await this.productService.createProduct(body);
  }

  @Put(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(id, body);
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.deleteProduct(id);
  }
}
