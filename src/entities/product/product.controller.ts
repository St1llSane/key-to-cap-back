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
  Req,
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
  async getAllProducts(@Req() req: Request, @Query('limit') limit?: number) {
    console.log('🚀 ~ ProductController ~ getAllProducts ~ req:', req.headers);
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
    const newProduct = await this.productService.createProduct(body);

    return newProduct;
  }

  @Put(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    const updatedProduct = await this.productService.updateProduct(id, body);

    return updatedProduct;
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    const deletedProduct = await this.productService.deleteProduct(id);

    return deletedProduct;
  }
}
