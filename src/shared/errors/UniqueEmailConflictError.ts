import { ConflictException } from '@nestjs/common';

export class UniqueEmailConflictError extends ConflictException {
  constructor(message: string = 'User with this email already exists') {
    super(message);
    this.name = 'UniqueEmailConflictError';
  }
}
