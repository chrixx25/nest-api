import { Injectable, NotFoundException } from "@nestjs/common";

import { Prisma } from "@prisma/client";

import { SearchQuery } from "../common/dto";

import { UpdateUserBody } from "@/auth/dto";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers({ page = 1, size = 10, search }: SearchQuery) {
    try {
      const skip = (page - 1) * size;
      const take = size;

      const where: Prisma.UserWhereInput = search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { firstname: { contains: search, mode: "insensitive" } },
              { lastname: { contains: search, mode: "insensitive" } },
            ],
          }
        : {};

      const users = await this.prisma.user.findMany({
        skip,
        take,
        where,
      });
      const totalUsers = await this.prisma.user.count({
        where,
      });

      return {
        page,
        size,
        pages: Math.ceil(totalUsers / size),
        data: users,
        total: totalUsers,
      };
    } catch (error) {
      return error;
    }
  }

  async getUser(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) throw new NotFoundException("Not found");

      return user;
    } catch (error) {
      return error;
    }
  }

  async updateUser(id: string, data: UpdateUserBody) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data,
      });

      return updatedUser;
    } catch (error) {
      return error;
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
      });

      return user;
    } catch (error) {
      return error;
    }
  }
}
