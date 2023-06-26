import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

import {
  CreateproductDTO,
  UpdateProductDTO,
} from 'src/products/dtos/products.dto';
import { ProductService } from 'src/products/services/product/product.service';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/roles';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get()
  getProducts() {
    return this.productService.getProducts();
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.staffMember, Role.superAdmin)
  createProducts(
    @Req() req: Request,
    @Body() createProductDto: CreateproductDTO,
  ) {
    return this.productService.createProducts(req, createProductDto);
  }

  @Put(':id')
  updateProducts(
    @Param() id: number,
    @Body() updateProductDto: UpdateProductDTO,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  deleteProduct(@Req() req: Request, @Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}
