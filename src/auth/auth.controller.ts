import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { UserBody } from "./dto";
import { authSchema, AuthBody } from "./schemas";

import { ZodValidationPipe } from "@/common/pipes";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("signin")
  @UsePipes(new ZodValidationPipe(authSchema))
  signin(@Body() dto: AuthBody) {
    return this.authService.signin(dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("signup")
  signup(@Body() dto: UserBody) {
    return this.authService.signup(dto);
  }
}
