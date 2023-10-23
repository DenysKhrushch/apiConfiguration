export default class UnauthorizedError extends Error {
  code: number;

  constructor(message: string) {
    super(message);
    this.code = 401;
  }
}
