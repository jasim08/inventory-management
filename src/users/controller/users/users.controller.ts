import { Body, Controller ,Get , Post, Put, Delete, Param, ParseIntPipe, UsePipes, ValidationPipe, Req} from '@nestjs/common';
import { Request } from 'express';
import { CreatePostDto } from 'src/users/dtos/CreatePost.dto';
import { CreatUserDto } from 'src/users/dtos/CreateUser.dto';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfile.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { Role } from 'src/utils/roles';

@Controller('user')
export class UsersController {
    constructor(private userService: UsersService){}
    @Get()
    async getUser(@Req() request: Request){
        console.log(request["MIDDLEWARE"])
        return this.userService.findUser();
    }

    @Get(":id")
    async getUserById(@Req() request: Request, @Param('id', ParseIntPipe) id: number){
        console.log(request["MIDDLEWARE"])
        return this.userService.getUserById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
     async createUser(@Body() createUserDto: CreatUserDto)  {
        let userDetailsTosave = {...createUserDto, authType: "NORMAL", authValue: "NA"}
        return this.userService.createUser(userDetailsTosave);
    }

    @Put(':id')
    async updateUser(@Param("id", ParseIntPipe) id:number, @Body() udpateUserDto: UpdateUserDto){
           return this.userService.updateUser(id , udpateUserDto);

    }

    @Delete(':id')
    async DeleteUser(@Param("id", ParseIntPipe) id: number){
        return this.userService.deleteUser(id)
    }


    @Post(':id/profile')
    createProfile(@Param("id", ParseIntPipe) id: number, @Body()createProfileDto: CreateUserProfileDto){
        return this.userService.createProfile(id, createProfileDto);
    }


    @Post(':id/post')
    createPost(@Param("id", ParseIntPipe) id: number, @Body() createPostDto: CreatePostDto){
        return this.userService.createPost(id, createPostDto);
    }

}
