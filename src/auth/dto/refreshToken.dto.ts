import { IsString } from 'class-validator'

export class RefreshTokenDto {
  @IsString({
    message: 'Вы не передали refresh token or или он не является строкой',
  })
  refreshToken: string
}
