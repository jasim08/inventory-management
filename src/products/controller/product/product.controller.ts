import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import {
  CreateproductDTO,
  UpdateProductDTO,
} from 'src/products/dtos/products.dto';
import { ProductService } from 'src/products/services/product/product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get()
  getProducts() {
    return this.productService.getProducts();
  }

  @Post()
  createProducts(@Body() createProductDto: CreateproductDTO) {
    return this.productService.createProducts(createProductDto);
  }

  @Put(':id')
  updateProducts(
    @Param() id: number,
    @Body() updateProductDto: UpdateProductDTO,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}
