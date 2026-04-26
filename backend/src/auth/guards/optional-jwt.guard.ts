import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Accepts both authenticated (JWT) and anonymous requests.
 * Populates `req.user` when a valid JWT is supplied; otherwise
 * leaves it undefined so controllers can treat the caller as a guest.
 */
@Injectable()
export class OptionalJwtGuard extends AuthGuard(['jwt', 'anonymous']) {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(err: unknown, user: TUser) {
    return user as TUser;
  }
}
