import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/typeorm/entities/posts';
import { Profile } from 'src/typeorm/entities/profile';
import { User } from 'src/typeorm/entities/user';
import { CreatePostParams, CreateUserParams, UpdateUserParams, createProfileParams } from 'src/utils/type';
import { Repository, FindOptionsWhere } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Posts) private postRepository: Repository<Posts>
  ) {}

  findUser() {
    return this.userRepository.find({relations:['profile']});
  }

  async getUserById(id:number){
    return await this.userRepository.findOne({where: { id},
      relations: ['profile', 'posts']})
  }

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({
      ...userDetails,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  updateUser(id: number, updateUserDetails: UpdateUserParams) {
    return this.userRepository.update({ id }, { ...updateUserDetails });
  }

  deleteUser(id:number){
    return this.userRepository.delete({id});
  }

  async createProfile(id:number, profiledata: createProfileParams){
    const user = await this.userRepository.findOneBy({id})
    if(!user){
       throw new HttpException('User not found, Cannot create Profile.', HttpStatus.BAD_REQUEST)
    }
    const newprofile = this.profileRepository.create(profiledata)
      await  this.profileRepository.save(newprofile);
      user.profile = newprofile;
     return this.userRepository.save(user)
  }

  async createPost(id: number, postData: CreatePostParams){
    const user = await this.userRepository.findOneBy({id})
    if(!user){
       throw new HttpException('User not found, Cannot create Post.', HttpStatus.BAD_REQUEST)
    }

    const newPost = this.postRepository.create({...postData, user});
    return this.postRepository.save(newPost);
    

  }

}
