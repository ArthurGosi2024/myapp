import {IsNotEmpty, IsEmail, Length, IsDate, Min, Max, IsOptional, IsString, Matches} from 'class-validator';

export class UserDto {

    @IsNotEmpty({message: "Name is required"})
    @IsString({message: "Name must be a string"})
    @Length(3, 50, {message: "Name must be between 3 and 50 characters"})
    name: string | undefined;

    @IsNotEmpty({message: "Email is required"})
    @IsEmail({}, {message: "Invalid email format"})
    email: string | undefined;

    @IsNotEmpty({message: "Password is required"})
    @Length(8, 20, {message: "Password must be between 8 and 20 characters"})
    @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    })
    password: string | undefined;

    @IsNotEmpty({message: "Date of birth is required"})
    dateOfBirth: string;

    @IsOptional() // Assuming age is optional and derived from dateOfBirth
    @Min(0, {message: "Age cannot be negative"})
    @Max(100, {message: "Age cannot be greater than 150"})
    age?: number;
}


export class RecoverDTO {
    @IsNotEmpty({message: "Email is required"})
    @IsEmail({}, {message: "Invalid email format"})
    email: string | undefined;
    @IsNotEmpty({message: "Password is required"})
    @Length(8, 20, {message: "Password must be between 8 and 20 characters"})
    @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    })
    password: string | undefined;


    @IsString({message: "Token must be a string"})
    token: string
}