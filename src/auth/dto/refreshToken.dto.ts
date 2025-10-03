import { IsString } from 'class-validator'

export class RefreshTokenDto {
  @IsString({
    message: 'Вы не передали refresh token или он не является строкой',
  })
  refreshToken: string
}
