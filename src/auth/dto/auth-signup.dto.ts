import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthSignUpDto {
    @IsString()
    @MinLength(4)
    username: string;

    @IsString()
    @MinLength(8)
    password: string;
    
}