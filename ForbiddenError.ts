enum ForbiddenErrorType {
  STRICTLY_CONFIDENTIAL = 'strictly-confidential',
  ACCESS_DENIED = 'access-denied',
}

export default class ForbiddenError extends Error {
  code: number;
  type: ForbiddenErrorType;

  constructor(type: ForbiddenErrorType, message: string) {
    super(message);
    this.code = 403;
    this.type = type;
  }

  static strictlyConfidential(message: string): ForbiddenError {
    return new ForbiddenError(
        ForbiddenErrorType.STRICTLY_CONFIDENTIAL,
        message
    );
  }

  static accessDenied(message: string): ForbiddenError {
    return new ForbiddenError(ForbiddenErrorType.ACCESS_DENIED, message);
  }
}
