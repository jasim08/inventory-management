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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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

  @Post('/bulkUpload')
  @UseGuards(AuthGuard)
  @Roles(Role.staffMember, Role.superAdmin)
  @UseInterceptors(
    FileInterceptor('fileName', {
      storage: diskStorage({
        destination: '../uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            file.fieldname +
              '-' +
              uniqueSuffix +
              '.' +
              file.originalname.split('.').pop(),
          );
        },
      }),
    }),
  )
  createProductsviafile(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    return this.productService.bulkUpload(req, file);
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
