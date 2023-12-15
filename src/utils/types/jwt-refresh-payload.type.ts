export type JwtRefreshPayload = {
  sub: number; // id
  login: string;
  refreshToken: string;
};
