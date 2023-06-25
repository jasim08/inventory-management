import { Module } from '@nestjs/common';
import { ProductController } from './controller/product/product.controller';
import { ProductService } from './services/product/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/typeorm/entities/products';
import { ProductCategory } from 'src/typeorm/entities/productcategory';

@Module({
  imports: [TypeOrmModule.forFeature([Products, ProductCategory])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductsModule {}
