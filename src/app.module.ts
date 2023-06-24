import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './typeorm/entities/user';
import { UsersModule } from './users/users.module';
import { Profile } from './typeorm/entities/profile';
import { Posts } from './typeorm/entities/posts';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'rootuser',
    database: 'inventory_management',
    entities: [User, Profile, Posts],
    synchronize: true,
  }), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private constructor(dataSource : DataSource){}
}
