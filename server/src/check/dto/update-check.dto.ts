import { PartialType } from '@nestjs/swagger';
import { CreateCheckDto } from './check-in.dto';

export class UpdateCheckDto extends PartialType(CreateCheckDto) {}
