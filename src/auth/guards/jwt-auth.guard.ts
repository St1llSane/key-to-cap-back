import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = await context.switchToHttp().getRequest();
    const token = req.cookies.access_token;

    if (!token) throw new UnauthorizedException();

    try {
      const verifiedPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_JWT_SECRET,
      });
      // req['user'] = verifiedPayload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
