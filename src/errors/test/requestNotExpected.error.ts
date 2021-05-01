export default class RequestNotExpected extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TestError';
  }
}
