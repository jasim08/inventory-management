import { Body, Controller ,Get , Post, Put, Delete, Param, ParseIntPipe, UsePipes, ValidationPipe, Req, Res, UseGuards} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreatUserDto } from 'src/users/dtos/CreateUser.dto';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfile.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { updateUserProfileDto } from 'src/users/dtos/UpdateUserProfile.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { encryptPassword } from 'src/utils/helper';
import { Role } from 'src/utils/roles';



@Controller('user')
export class UsersController {
    constructor(private userService: UsersService){}
    @Get()
    @UseGuards(AuthGuard)
    @Roles(Role.staffMember)
    async getUser(@Req() request: Request){
        console.log(request["MIDDLEWARE"])
        return this.userService.findUser();
    }

    @Get(":id")
    async getUserById(@Req() request: Request, @Param('id', ParseIntPipe) id: number){
        
        return this.userService.getUserById(id);
    }

    @Post()
    @UsePipes(new ValidationPipe())
     async createUser(@Body() createUserDto: CreatUserDto)  {
        const  encryptedPassword = createUserDto.password;
        const hashedPassword = await encryptPassword(encryptedPassword);
        let userDetailsTosave = {...createUserDto, authType: "NORMAL", authValue: "NA", password: hashedPassword}
        return this.userService.createUser(userDetailsTosave);
    }

    @Put(':id')
    async updateUser(@Param("id", ParseIntPipe) id:number, @Body() udpateUserDto: UpdateUserDto){
           if(udpateUserDto && udpateUserDto.password){
            const  encryptedPassword = udpateUserDto.password;
            const hashedPassword = await encryptPassword(encryptedPassword);
            return this.userService.updateUser(id , {...udpateUserDto, password: hashedPassword});
           }else{
            return this.userService.updateUser(id , {...udpateUserDto});
           }
          
           

    }

    @Delete(':id')
    async DeleteUser(@Param("id", ParseIntPipe) id: number){
        return this.userService.deleteUser(id)
    }


    @Post('/login')
    @UsePipes(new ValidationPipe())
    login(@Res() res: Response, @Body() loginDto: CreatUserDto){
        return this.userService.login(res, loginDto);
    }


    @Post(':id/profile')
    createProfile(@Param("id", ParseIntPipe) id: number, @Body()createProfileDto: CreateUserProfileDto){
        return this.userService.createProfile(id, {...createProfileDto, role: Role.NormalUser});
    }

    @Put(':id/profile')
    updateRole(@Param("id", ParseIntPipe) id: number, @Body()updateUserProfileDto: updateUserProfileDto){
        return this.userService.updateProfile(id, {...updateUserProfileDto});
    }

    


   

}
