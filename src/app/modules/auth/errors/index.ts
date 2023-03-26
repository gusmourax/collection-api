import { HttpException, HttpStatus } from '@nestjs/common';

export class PasswordConfirmationInvalid extends HttpException {
  constructor() {
    super('Password confirmation is invalid', HttpStatus.BAD_REQUEST);
  }
}
