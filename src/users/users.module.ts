import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersController } from './controller/users/users.controller';
import { UsersService } from './services/users/users.service';
import { User } from 'src/typeorm/entities/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/typeorm/entities/profile';
import { UsersMiddleware } from './middleware/users/users.middleware';
import { CrudHistory } from 'src/typeorm/entities/crudhistory';
import { Products } from 'src/typeorm/entities/products';
import { ProductCategory } from 'src/typeorm/entities/productcategory';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Profile,
      CrudHistory,
      Products,
      ProductCategory,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(UsersMiddleware).forRoutes('user')// for all user routes
    consumer.apply(UsersMiddleware).forRoutes(
      {
        path: 'user',
        method: RequestMethod.GET,
      },
      {
        path: 'user/:id',
        method: RequestMethod.GET,
      },
    );
  }
}
