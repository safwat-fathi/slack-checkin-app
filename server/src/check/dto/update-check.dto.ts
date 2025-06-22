import { PartialType } from '@nestjs/swagger';
import { CheckInDto } from './check-in.dto';

export class UpdateCheckDto extends PartialType(CheckInDto) {}
