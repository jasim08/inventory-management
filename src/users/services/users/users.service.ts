import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Profile } from 'src/typeorm/entities/profile';
import { User } from 'src/typeorm/entities/user';
import { comparePasswords } from 'src/utils/helper';
import {
  CreateUserParams,
  LoginParams,
  UpdateProfileparams,
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

  findUser() {
    return this.userRepository.find({ relations: ['profile'] });
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
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
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

  async updateProfile(id: number, updateProfileData: UpdateProfileparams) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    if (updateProfileData && updateProfileData.role) {
      await this.userRepository.update(
        { id },
        { roleId: updateProfileData.role },
      );
    }
    return this.profileRepository.update(
      { id: user.profile.id },
      { ...updateProfileData },
    );
  }
}
