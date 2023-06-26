import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from 'src/typeorm/entities/productcategory';
import { Products } from 'src/typeorm/entities/products';
import { UpdateProductParams, createProductParams } from 'src/utils/type';
import { Repository } from 'typeorm';
import { Role } from 'src/utils/roles';
import { Request } from 'express';
import { MailerService } from 'src/mail-service/mail-service.service';
import { User } from 'src/typeorm/entities/user';
import { CrudHistory } from 'src/typeorm/entities/crudhistory';
import { createReadStream } from 'fs';
import { CsvParser } from 'nest-csv-parser';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Products) private productRepository: Repository<Products>,
    @InjectRepository(ProductCategory)
    private categoryRepository: Repository<ProductCategory>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(CrudHistory)
    private crudRepository: Repository<CrudHistory>,
    private sendMailService: MailerService,
    private readonly csvParser: CsvParser,
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
    } else {
      const newRequest = this.crudRepository.create({
        crudtype: 'CREATE',
        status: false,
        raisedBy: req['user']['sub'],
        action: JSON.stringify(createProductParams),
      });

      const crud = await this.crudRepository.save(newRequest);
      if (!crud) {
        throw new HttpException(
          'Some thing went wrong. Please try again Later',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const superadmin = await this.userRepository.findOneBy({ roleId: 1 });
      const data = {
        sender_name: req['user']['username'],
        receiver_name: superadmin.username,
        buttonLink: 'http://localhost.com/request/' + crud.id,
      };

      this.sendMailService.sendMail(
        'jasjasim08@gmail.com',
        'Request for creating the Product.',
        data,
      );
    }

    return { message: 'Request created successfull.' };
  }

  async updateProduct(id: number, updateProductParams: UpdateProductParams) {
    return this.productRepository.update({ id }, { ...updateProductParams });
  }

  deleteProduct(id: number) {
    return this.productRepository.delete({ id });
  }

  async bulkUpload(
    req: Request,
    file: Express.Multer.File,
  ): Promise<Products[]> {
    console.log('file');
    console.log(file);
    const csvRows = await this.csvParser.parse(
      createReadStream(file.path),
      Products,
    );

    const products: Products[] = [];
    // const rowsArray = csvRows.data;
    console.log(csvRows.list.length);
    for (const row of csvRows.list) {
      const [productname, productdescription, category] =
        row['productname,productdescritption,category'].split(',');
      console.log(productname, productdescription, category);
      const existingProduct = await this.productRepository
        .createQueryBuilder('products')
        .leftJoinAndSelect('products.category', 'product_category')
        .where('products.productname = :productname', { productname })
        .andWhere('product_category.category = :category', { category })
        .getOne();

      console.log('EXISTING');
      console.log(existingProduct);
      if (existingProduct) {
        existingProduct.productdescription = productdescription;
        products.push(existingProduct);
      } else {
        // Create a new product entity from the CSV row data
        const newProduct = {
          productdescription: productdescription,
          productname: productname,
        } as Products;

        products.push(newProduct);
      }
    }

    // Save all products (new and updated) in bulk
    await this.productRepository.save(products);

    return products;
  }
}
