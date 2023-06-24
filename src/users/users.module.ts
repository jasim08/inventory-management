import { MiddlewareConsumer, Module , NestModule, RequestMethod} from '@nestjs/common';
import { UsersController } from './controller/users/users.controller';
import { UsersService } from './services/users/users.service';
import { User } from 'src/typeorm/entities/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/typeorm/entities/profile';
import { Posts } from 'src/typeorm/entities/posts';
import { UsersMiddleware } from './middleware/users/users.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Posts])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule implements NestModule{
  configure(consumer: MiddlewareConsumer){
    // consumer.apply(UsersMiddleware).forRoutes('user')// for all user routes
    consumer.apply(UsersMiddleware).forRoutes({
      path: 'user',
      method: RequestMethod.GET
    },
    {
      path: 'user/:id',
      method: RequestMethod.GET
    }
    );
  }
}
