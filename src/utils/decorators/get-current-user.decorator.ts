import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtRefreshPayload } from '../types/jwt-refresh-payload.type';

export const GET_CURRENT_USER = createParamDecorator((data: keyof JwtRefreshPayload, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  if (!data) {
    return request.user;
  }

  switch (data) {
    case 'sub':
      return request.user.sub;
    case 'login':
      return request.user.login;
    case 'refreshToken':
      return request.user.refreshToken;
    default:
      return request.user;
  }
});
