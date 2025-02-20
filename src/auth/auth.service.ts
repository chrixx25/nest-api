import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon2 from "argon2";

import { AuthBody, UserBody } from "./dto";

import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: UserBody) {
    // generate the password hash
    const hash = await argon2.hash(dto.password);
    // save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: hash,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("Email already exists");
        }
      }
      return error;
    }
  }

  async signin(dto: AuthBody) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException("Invalid credentials");

    const isValid = await argon2.verify(user.password, dto.password);

    if (!isValid) throw new ForbiddenException("Invalid credentials");

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get<string>("JWT_SECRET");
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: "1d",
      secret,
    });

    return {
      accessToken,
    };
  }
}
