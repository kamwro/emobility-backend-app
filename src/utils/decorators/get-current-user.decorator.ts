import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtRefreshPayload } from '../types/jwt-refresh-payload.type';

export const GetCurrentUser = createParamDecorator((data: keyof JwtRefreshPayload, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  if (!data) {
    return request.user;
  }
  return request.user[data];
});
