import { IsNotEmpty, IsString } from 'class-validator'

export class WithAuthEventDto {
  @IsString()
  @IsNotEmpty()
  token: string
}
