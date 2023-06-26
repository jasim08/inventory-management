import { Module } from '@nestjs/common';
import { ProductController } from './controller/product/product.controller';
import { ProductService } from './services/product/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/typeorm/entities/products';
import { ProductCategory } from 'src/typeorm/entities/productcategory';
import { MailerService } from 'src/mail-service/mail-service.service';
import { User } from 'src/typeorm/entities/user';
import { CrudHistory } from 'src/typeorm/entities/crudhistory';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products, ProductCategory, User, CrudHistory]),
  ],
  controllers: [ProductController],
  providers: [ProductService, MailerService],
})
export class ProductsModule {}
