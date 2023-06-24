import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services/users/users.service';
import { comparePasswords, encryptPassword } from 'src/utils/helper';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/utils/roles';

@Injectable()
export class AuthService {
constructor( private userService: UsersService,  private jwtService: JwtService){}
  
async signIn(username: string, pass: string): Promise<any> {
    console.log(username, pass)
    const user = await this.userService.getUserByUsername(username);
    
    if (!user) {
        throw new UnauthorizedException();
      }
      const plainPassword = pass;
  
      const isMatch = await comparePasswords(plainPassword, user.password);
      if (isMatch) {
        let userRole = Role.NormalUser;
        if(user && user.profile && user.profile.role){
            userRole = user.profile.role
        }
        const payload = { sub: user.id, username: user.username, role: userRole };
    return {
        message: 'Login successfull!.',
        access_token: await this.jwtService.signAsync(payload),
    };
      } else {
        throw new HttpException('Invalid password.', HttpStatus.UNAUTHORIZED);
      }
   
    
  }
}


