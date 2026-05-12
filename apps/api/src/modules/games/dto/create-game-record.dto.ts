import { CreateGameRecordRequestSchema } from '@chess-db/shared';
import { createZodDto } from 'nestjs-zod';

export class CreateGameRecordDto extends createZodDto(
  CreateGameRecordRequestSchema,
) {}
