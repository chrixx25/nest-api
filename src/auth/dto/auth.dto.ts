import { OmitType } from "@nestjs/mapped-types";

import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserBody {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;
}

export class UpdateUserBody extends OmitType(UserBody, ["password"] as const) {}

export class AuthBody {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
