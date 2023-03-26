import { HttpException, HttpStatus } from '@nestjs/common';

export class CategoryDoesNotExists extends HttpException {
  constructor() {
    super('Category does not exists', HttpStatus.NOT_FOUND);
  }
}

export class CategoryAlreadyExists extends HttpException {
  constructor() {
    super('Category already exists', HttpStatus.BAD_REQUEST);
  }
}
