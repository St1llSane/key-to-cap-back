import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  // private extractTokenFromHeaders = (req: Request) => {
  //   const [type, token] = req.headers.authorization
  //     ? req.headers.authorization.split(' ')
  //     : [];

  //   return type === 'Refresh' ? token : null;
  // };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.cookies.refresh_token;

    if (!token) throw new UnauthorizedException();

    try {
      const verifiedPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.REFRESH_JWT_SECRET,
      });
      req['user'] = verifiedPayload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
