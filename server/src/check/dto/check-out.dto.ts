import { IsString, IsOptional } from 'class-validator';

export class CheckOutDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
