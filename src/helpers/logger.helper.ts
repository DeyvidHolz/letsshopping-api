import fs from 'fs';
import moment from 'moment';

enum logTypes {
  info = 'INFO',
  debug = 'DEBUG',
  warn = 'WARNING',
  error = 'ERROR',
  critical = 'CRITICAL',
}

export class Logger {
  public static readonly path: string = './logs';
  public static readonly fileName: string = 'YYYY-MM-DD';
  public static readonly types = logTypes;

  private static getFile() {
    const fileName = moment().format(Logger.fileName);
    return `${Logger.path}/${fileName}.log`;
  }

  private static write(data: any, type: string = Logger.types.info): void {
    if (data === undefined)
      throw new Error('Tried to log undefined with Logger.');

    const file = Logger.getFile();
    if (typeof data === 'object') data = JSON.stringify(data);

    data = `[${moment().format('YYYY-MM-DD h:m:s')}] [${type}] ${data}\r\n`;
    fs.appendFileSync(file, data);
  }

  public static log(data: any, type: logTypes = logTypes.info) {
    Logger.write(data, type);
  }

  public static info(data: any) {
    Logger.write(data, Logger.types.info);
  }

  public static debug(data: any) {
    Logger.write(data, Logger.types.debug);
  }

  public static warn(data: any) {
    Logger.write(data, Logger.types.warn);
  }

  public static error(data: any) {
    Logger.write(data, Logger.types.error);
  }

  public static critical(data: any) {
    Logger.write(data, Logger.types.critical);
  }
}
