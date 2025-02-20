import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ClientAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientId = request.headers["x-client-id"];
    const clientSecret = request.headers["x-client-secret"];

    if (
      clientId === this.configService.get<string>("CLIENT_ID") &&
      clientSecret === this.configService.get<string>("CLIENT_SECRET")
    )
      return true;

    throw new UnauthorizedException("Invalid client credentials");
  }
}
