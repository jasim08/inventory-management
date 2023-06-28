import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/user';
import { UsersModule } from './users/users.module';
import { Profile } from './typeorm/entities/profile';
import { CrudHistory } from './typeorm/entities/crudhistory';
import { Products } from './typeorm/entities/products';
import { ProductCategory } from './typeorm/entities/productcategory';
import { Role } from './typeorm/entities/roles';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DBHOST,
      port: Number(process.env.DBPORT),
      username: process.env.DBUNAME,
      password: process.env.DBPASS,
      database: process.env.DBNAME,
      entities: [User, Profile, CrudHistory, Products, ProductCategory, Role],
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
  exports: [ConfigService],
})
export class AppModule {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
}

function getEnvFilePath(): string {
  // Determine the environment based on the NODE_ENV environment variable
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Return the appropriate dotenv file path
  if (nodeEnv === 'production') {
    return '.env.prod';
  } else if (nodeEnv === 'test') {
    return '.env.test';
  } else {
    return '.env.dev';
  }
}
