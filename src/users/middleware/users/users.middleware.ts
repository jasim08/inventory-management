import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class UsersMiddleware implements NestMiddleware {
  use(req: Response, res: Response, next: NextFunction) {
    req["MIDDLEWARE"] = true;
    next();
  }
}
