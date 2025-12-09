/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  @MinLength(1)
  readonly name: string;
  @IsNumber()
  @Min(1)
  readonly no: number;
}
