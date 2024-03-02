import { ConflictException } from '@nestjs/common';

export class DefaultConflictError extends ConflictException {
  constructor(message: string = 'Entity already exists') {
    super(message);
    this.name = 'DefaultConflictError';
  }
}
