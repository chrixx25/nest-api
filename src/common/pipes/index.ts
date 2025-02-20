import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";

import { ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    // try {
    //   const parseValue = this.schema.parse(value);

    //   return parseValue;
    // } catch (error) {
    //   throw new BadRequestException(error.errors);
    // }
    const parseValue = this.schema.safeParse(value);

    if (parseValue.success) return parseValue.data;

    throw new BadRequestException(parseValue.error.flatten().fieldErrors);
  }
}
