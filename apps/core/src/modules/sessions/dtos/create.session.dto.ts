import { IsNotEmpty, IsString } from 'class-validator'

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  token: string

  @IsString()
  @IsNotEmpty()
  nickname: string
}
