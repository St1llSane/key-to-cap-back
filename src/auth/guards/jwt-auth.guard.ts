import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  private extractTokenFromHeaders = (req: Request) => {
    const [type, token] = req.headers.authorization
      ? req.headers.authorization.split(' ')
      : [];

    return type === 'Bearer' ? token : null;
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeaders(req);

    if (!token) throw new UnauthorizedException();

    try {
      const verifiedPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_JWT_SECRET,
      });
      req['user'] = verifiedPayload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
