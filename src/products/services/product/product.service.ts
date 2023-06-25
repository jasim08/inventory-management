import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from 'src/typeorm/entities/productcategory';
import { Products } from 'src/typeorm/entities/products';
import { UpdateProductParams, createProductParams } from 'src/utils/type';
import { Repository } from 'typeorm';
import { Role } from 'src/utils/roles';
import { Request } from 'express';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Products) private productRepository: Repository<Products>,
    @InjectRepository(ProductCategory)
    private categoryRepository: Repository<ProductCategory>,
  ) {}
  getProducts() {
    return this.productRepository.find({ relations: ['category'] });
  }

  async createProducts(req: Request, createProductParams: createProductParams) {
    const userRole = req['user']['role'];

    if (userRole == Role.superAdmin) {
      let productcateogory = await this.categoryRepository.findOneBy({
        category: createProductParams.categoryname,
      });
      console.log(productcateogory);
      if (!productcateogory) {
        const newCategory = this.categoryRepository.create({
          category: createProductParams.categoryname,
        });

        productcateogory = await this.categoryRepository.save(newCategory);
      }

      const product = await this.productRepository.findOneBy({
        productname: createProductParams.productname,
      });
      if (!product) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { categoryname, ...productdetails } = createProductParams;
        const productDetails = {
          ...productdetails,
          category: productcateogory,
        };
        const newProduct = this.productRepository.create(productDetails);
        return this.productRepository.save(newProduct);
      }
    }
  }

  async updateProduct(id: number, updateProductParams: UpdateProductParams) {
    return this.productRepository.update({ id }, { ...updateProductParams });
  }

  deleteProduct(id: number) {
    return this.productRepository.delete({ id });
  }
}
