import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from 'src/typeorm/entities/productcategory';
import { Products } from 'src/typeorm/entities/products';
import { UpdateProductParams, createProductParams } from 'src/utils/type';
import { Repository } from 'typeorm';
import { Role } from 'src/utils/roles';
import { Request, Response } from 'express';
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
    return this.productRepository.save(products);
  }

  async upadeProductWithRequestId(req: Request, res: Response, id: number) {
    const actionrequest = await this.crudRepository.findOneBy({ id });
    if (!actionrequest) {
      throw new HttpException('Request not found.', HttpStatus.NOT_FOUND);
    }

    const productDetails = JSON.parse(actionrequest.action);
    console.log(productDetails);

    let product = await this.productRepository.findOne({
      where: { productname: productDetails.productname },
      relations: ['category'],
    });

    console.log(product);
    let result: any;
    if (product) {
      if (productDetails.categoryname == product.category.category) {
        result = await this.productRepository.update(
          { id: product.id },
          { productdescription: productDetails.productdescription },
        );
      } else {
        let category = await this.categoryRepository.findOneBy({
          category: productDetails.categoryname,
        });
        if (!category) {
          const newCategory = this.categoryRepository.create({
            category: productDetails.categoryname,
          });
          category = await this.categoryRepository.save(newCategory);
        }
        const updateFiled = {
          productdescription: productDetails.productdescription,
          category: category,
        };
        result = this.productRepository.update({ id: product.id }, updateFiled);
        console.log(result);
      }
    } else {
      let category = await this.categoryRepository.findOneBy({
        category: productDetails.categoryname,
      });
      if (!category) {
        const newCategory = this.categoryRepository.create({
          category: productDetails.categoryname,
        });
        category = await this.categoryRepository.save(newCategory);
      }
      const createField = {
        productname: productDetails.productname,
        productdescription: productDetails.productdescription,
        category: category,
      };
      const newproduct = this.productRepository.create(createField);
      product = await this.productRepository.save(newproduct);
      if (product) {
        result = product;
      }
      console.log(result);
    }

    if (result) {
      const update = await this.crudRepository.update(
        { id },
        {
          status: true,
          actionBy: req['user']['sub'],
          productId: product.id,
        },
      );
      if (update) {
        console.log('UPDATEW', update);
        res.send({
          message: `Product created with this request Id ${id} was successfull.`,
        });
      } else {
        throw new HttpException(
          'Something went wrong. Please try again later',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      throw new HttpException(
        'Something went wrong. Please try again later',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
