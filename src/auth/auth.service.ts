import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService : JwtService,
    ){}

        async signUp(authSignUpDto: AuthSignUpDto) : Promise<void>{
            const salt = await bcrypt.genSalt();
            const {username, password} = authSignUpDto;
            // const exists = this.userRepository.findOne({where: {username: authSignUpDto.username}})
            // if (exists){
            // }
            const user = new User();
            user.username = username;
            user.salt= salt;
            user.password = await this.hashPassword(password,salt);
            try{
            await this.userRepository.save(user);
            } catch (error){
                if(error.code == 23505){ //duplicate username
                    throw new ConflictException('Username already exists')
                    }
                throw new InternalServerErrorException;
                }

  
    }
        async signIn(authSignUpDto: AuthSignUpDto): Promise<{accessToken : string}>{
            const username = await this.validatePassword(authSignUpDto);
            if (!username)
            throw new NotFoundException('Credentials does not match sorry bro');

            const payload : JwtPayload= {username};
            const accessToken = await this.jwtService.sign(payload)
            return {accessToken};
        }
        
    async validatePassword(authSignUpDto: AuthSignUpDto) :Promise<string>{
        const {username, password} = authSignUpDto;
        const user = await this.userRepository.findOne({where: {username}});
        if(user && await user.validateUserPassword(password))
        return user.username

        return null;

    }

    private async hashPassword(password: string, salt: string) : Promise<string>{
        return bcrypt.hash(password,salt)
    }
    
    
}
