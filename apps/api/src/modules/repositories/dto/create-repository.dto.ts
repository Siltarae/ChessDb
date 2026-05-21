import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateRepositorySchema = z.object({
  name: z.string(),
});

export class CreateRepositoryDto extends createZodDto(CreateRepositorySchema) {}
