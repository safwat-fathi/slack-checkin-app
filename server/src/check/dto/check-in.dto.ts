import { IsString, IsOptional } from 'class-validator';

export class CheckInDto {
  @IsString()
  userId: string;

  @IsString()
  teamId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
