import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/auth-signup.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ){}

    @Post('signup')
     signUp(@Body(ValidationPipe) authSignUpDto: AuthSignUpDto){
        console.log(authSignUpDto)
        return this.authService.signUp(authSignUpDto);
    }

    @Post('signin')
    signIn(@Body(ValidationPipe) authSignUpDto: AuthSignUpDto) : Promise<{accessToken: string}>{
    return this.authService.signIn(authSignUpDto);
    }


}
