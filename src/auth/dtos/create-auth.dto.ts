import { IsString, IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateAuthDTO {
    @IsNotEmpty({ message: 'login is required' })
    @IsEmail()
    login: string;

    @IsNotEmpty({ message: 'password is required' })
    @IsString()
    @Length(4, 20)
    hashedPassword: string;
}