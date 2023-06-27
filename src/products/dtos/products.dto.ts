import { IsNotEmpty } from 'class-validator';

export class CreateproductDTO {
  @IsNotEmpty()
  productname: string;
  @IsNotEmpty()
  productdescription: string;
  @IsNotEmpty()
  categoryname: string;
}

export class UpdateProductDTO {
  @IsNotEmpty()
  productname: string;
  @IsNotEmpty()
  productdescription: string;
}
