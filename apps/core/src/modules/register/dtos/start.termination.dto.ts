import { IsNotEmpty, IsString } from 'class-validator'

export class StartTerminationDto {
  @IsString()
  @IsNotEmpty()
  nameTerminator: string

  @IsString()
  @IsNotEmpty()
  phoneTerminator: string

  @IsString()
  @IsNotEmpty()
  nameTerminated: string

  @IsString()
  @IsNotEmpty()
  phoneTerminated: string
}
