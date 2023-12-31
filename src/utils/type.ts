import { Role } from './roles';

export type CreateUserParams = {
  username: string;
  password: string;
  authType: string;
  authValue: string;
};

export type UpdateUserParams = {
  password: string;
  authType: string;
  authValue: string;
};

export type UpdatePwdParams = {
  password: string;
};
export type createProfileParams = {
  firstname: string;
  lastname: string;
  age: number;
  dob: string;
  additionalInfo: JSON;
  role: Role;
};

export type CreatePostParams = {
  title: string;
  description: string;
};

export type LoginParams = {
  username: string;
  password: string;
};

export type UpdateProfileparams = {
  firstname: string;
  lastname: string;
  age: number;
  dob: string;
  additionalInfo: Record<string, any> | null;
};

export type UpdateRole = {
  firstname: string;
  lastname: string;
  age: number;
  dob: string;
  additionalInfo: Record<string, any> | null;
  role: Role;
};

export type createProductParams = {
  productname: string;
  productdescription: string;
  categoryname: string;
};

export type UpdateProductParams = {
  productname: string;
  productdescription: string;
};
