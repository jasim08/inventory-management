import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Req,
  Res,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreatUserDto } from 'src/users/dtos/CreateUser.dto';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfile.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UpdateUserProfileDto } from 'src/users/dtos/UpdateUserProfile.dto';
import { UpdateRoleDTO } from 'src/users/dtos/updateRole.dto';
import { updateUserPwdDTO } from 'src/users/dtos/updateUserPwd.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { encryptPassword } from 'src/utils/helper';
import { Role } from 'src/utils/roles';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get()
  @UseGuards(AuthGuard)
  @Roles(Role.superAdmin)
  async getUser(@Req() request: Request) {
    console.log(request['MIDDLEWARE']);
    return this.userService.findUser();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.superAdmin, Role.staffMember, Role.NormalUser)
  async getUserById(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.getUserById(id);
  }

  // create user
  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreatUserDto) {
    const encryptedPassword = createUserDto.password;
    const hashedPassword = await encryptPassword(encryptedPassword);
    const userDetailsTosave = {
      ...createUserDto,
      authType: 'NORMAL',
      authValue: 'NA',
      password: hashedPassword,
    };
    return this.userService.createUser(userDetailsTosave);
  }

  //udpate user
  @Put('password')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @Roles(Role.superAdmin, Role.NormalUser, Role.staffMember)
  async updateUserPWD(
    @Req() req: Request,
    @Body() udpateUserPwdDTO: updateUserPwdDTO,
  ) {
    if (udpateUserPwdDTO && udpateUserPwdDTO['username']) {
      delete udpateUserPwdDTO['username'];
    }
    console.log(udpateUserPwdDTO);
    if (udpateUserPwdDTO && udpateUserPwdDTO.password) {
      const encryptedPassword = udpateUserPwdDTO.password;
      const hashedPassword = await encryptPassword(encryptedPassword);
      return this.userService.updateUserPwd(req['user']['sub'], {
        password: hashedPassword,
      });
    } else {
      throw new HttpException(
        'Some thing went wrong. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Roles(Role.superAdmin)
  @Delete(':id')
  async DeleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @Post('profile')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @Roles(Role.NormalUser, Role.staffMember, Role.superAdmin)
  createProfile(
    @Req() req: Request,
    @Body() createProfileDto: CreateUserProfileDto,
  ) {
    if (req && req['user'] && req['user']['sub']) {
      return this.userService.createProfile(req['user']['sub'], {
        ...createProfileDto,
        role: Role.NormalUser,
      });
    } else {
      throw new HttpException(
        'Some thing went wrong. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('profile')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Roles(Role.superAdmin, Role.staffMember, Role.NormalUser)
  updateProfile(
    @Req() req: Request,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    if (updateUserProfileDto && updateUserProfileDto['role']) {
      delete updateUserProfileDto['role'];
    }

    if (
      updateUserProfileDto.firstname ||
      updateUserProfileDto.lastname ||
      updateUserProfileDto.age ||
      updateUserProfileDto.dob ||
      updateUserProfileDto.additionalInfo
    ) {
      if (req && req['user'] && req['user']['sub']) {
        return this.userService.updateProfile(req['user']['sub'], {
          ...updateUserProfileDto,
        });
      } else {
        throw new HttpException(
          'Some thing went wrong. Please try again later.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      throw new HttpException(
        'Update fields are missing.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('/:id/updaterole')
  @UseGuards(AuthGuard)
  @Roles(Role.superAdmin)
  @UsePipes(new ValidationPipe())
  updateRole(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDTO,
  ) {
    return this.userService.updateRole(req, id, updateRoleDto['role']);
  }
}
