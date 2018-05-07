export class WrongPathError extends Error {
  
  constructor(message, extraData) {
    super(message);
    this.name = this.constructor.name;
    this.extraData = extraData;
  
    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);
  }
}
