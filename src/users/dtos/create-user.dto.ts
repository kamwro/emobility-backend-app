import { IsString, IsBoolean, IsEmail, IsDate, IsNotEmpty, Matches, Length } from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty({ message: 'login is required' })
    @IsEmail()
    login: string;

    @IsNotEmpty({ message: 'first name is required' })
    @IsString()
    firstName: string;

    @IsNotEmpty({ message: 'last name is required' })
    @IsString()
    lastName: string;

    @IsNotEmpty({ message: 'address is required' })
    @IsString()
    address: string;

    @IsNotEmpty({ message: 'birthday is required' })
    @IsDate()
    birthday: Date;

    @IsBoolean()
    isActive: boolean = false;

    @IsNotEmpty({ message: 'password is required' })
    @Length(4, 20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password is too weak',
    })
    hashedPassword: string;
}