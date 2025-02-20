import {
  Controller,
  Get,
  UseGuards,
  Query,
  Param,
  Patch,
  Body,
  Delete,
} from "@nestjs/common";

import { User } from "prisma/prisma-client";

import { SearchQuery } from "../common/dto";

import { UserExistsGuard } from "./guards";
import { UsersService } from "./users.service";

import { GetUser } from "@/auth/decorators";
import { UpdateUserBody } from "@/auth/dto";
import { JwtAuthGuard } from "@/auth/guards";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("me")
  getMe(@GetUser() user: Omit<User, "password">) {
    return user;
  }

  @Get()
  getUsers(@Query() params: SearchQuery) {
    return this.usersService.getUsers(params);
  }

  @Get(":id")
  getUser(@Param("id") userId: string) {
    return this.usersService.getUser(userId);
  }

  @Patch(":id")
  @UseGuards(UserExistsGuard)
  updateUser(@Param("id") userId: string, @Body() body: UpdateUserBody) {
    return this.usersService.updateUser(userId, body);
  }

  @Delete(":id")
  @UseGuards(UserExistsGuard)
  deleteUser(@Param("id") userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
