import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Profile } from 'src/typeorm/entities/profile';
import { User } from 'src/typeorm/entities/user';
import { comparePasswords } from 'src/utils/helper';
import { Role } from 'src/utils/roles';
import {
  CreateUserParams,
  LoginParams,
  UpdateProfileparams,
  UpdatePwdParams,
  UpdateUserParams,
  createProfileParams,
} from 'src/utils/type';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async findUser() {
    const getalluser = await this.userRepository.find({
      relations: ['profile'],
    });
    return getalluser.map((x) => {
      delete x.password;
      return x;
    });
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['profile'],
    });
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async createUser(userDetails: CreateUserParams) {
    const user = await this.userRepository.findOneBy({
      username: userDetails.username,
    });
    if (user) {
      throw new HttpException('User already Exists', HttpStatus.CONFLICT);
    }
    const newUser = this.userRepository.create({
      ...userDetails,
      roleId: Role.NormalUser,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  updateUserPwd(id: number, updatePwdDetails: UpdatePwdParams) {
    return this.userRepository.update({ id }, { ...updatePwdDetails });
  }

  updateUser(id: number, updateUserDetails: UpdateUserParams) {
    return this.userRepository.update({ id }, { ...updateUserDetails });
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  async createProfile(id: number, profiledata: createProfileParams) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(
        'User not found, Cannot create Profile.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newprofile = this.profileRepository.create(profiledata);
    await this.profileRepository.save(newprofile);
    user.profile = newprofile;
    return this.userRepository.save(user);
  }

  async login(res: Response, loginParams: LoginParams) {
    const user = await this.userRepository.findOneBy({
      username: loginParams.username,
    });
    if (!user) {
      throw new HttpException(
        'User not registered. Please register.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const plainPassword = loginParams.password;

    const isMatch = await comparePasswords(plainPassword, user.password);
    if (isMatch) {
      res.status(200).send({ message: 'Login Successfull!.' });
    } else {
      throw new HttpException('Invalid password.', HttpStatus.UNAUTHORIZED);
    }
  }

  async updateRole(req: Express.Request, id: number, updateRole: Role) {
    if (id == Role.superAdmin) {
      throw new HttpException(
        'You can not update this role to staff members.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const result = await this.userRepository.update(
      { id },
      { roleId: updateRole },
    );

    if (result) {
      return { message: 'Role update successfully.' };
    } else {
      throw new HttpException(
        'Something went wrong. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfile(id: number, profiledata: UpdateProfileparams) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) {
      throw new HttpException(
        'User not found, Cannot update your Profile.',
        HttpStatus.BAD_REQUEST,
      );
    }
    let profile: Profile;
    let result: any;
    if (!user.profile) {
      const newprofile = this.profileRepository.create({ ...profiledata });
      profile = await this.profileRepository.save(newprofile);
      user.profile = profile;
      result = await this.userRepository.save(user);
    } else {
      result = await this.profileRepository.update(
        { id: user.profile.id },
        { ...profiledata },
      );
    }

    if (result) {
      return { message: 'User profile update successfully.' };
    } else {
      throw new HttpException(
        'Something went wrong. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
