import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './typeorm/entities/user';
import { UsersModule } from './users/users.module';
import { Profile } from './typeorm/entities/profile';
import { CrudHistory } from './typeorm/entities/crudhistory';
import { Products } from './typeorm/entities/products';
import { ProductCategory } from './typeorm/entities/productcategory';
import { Role } from './typeorm/entities/roles';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'rootuser',
    database: 'inventory_management',
    entities: [User, Profile,CrudHistory, Products, ProductCategory, Role],
    synchronize: true,
  }), UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private constructor(dataSource : DataSource){}
}
