export class AccessDeniedError extends Error {
  constructor() {
    super('Access dinied');
    this.name = 'AccessDeniedError';
  }
}