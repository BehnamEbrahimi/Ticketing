export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    // The inherited fields should not have any access modifiers, because they belong to parent and inherits the behavior from the parent class.
    super(message);

    //Only because we are extending a built-in class:
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
