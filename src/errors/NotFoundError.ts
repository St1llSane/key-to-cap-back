import { NotFoundException } from '@nestjs/common';

export class NotFoundError extends NotFoundException {
  constructor(message: string = 'Resource was not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}
