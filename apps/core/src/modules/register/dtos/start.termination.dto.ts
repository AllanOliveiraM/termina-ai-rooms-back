import { IsNotEmpty, IsString } from 'class-validator'

export class StartTerminationDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  phone: string
}
