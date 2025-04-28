class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message} ${args.length ? JSON.stringify(args) : ''}`;
  }

  public info(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.info(this.formatMessage('INFO', message, ...args));
    }
  }

  public error(message: string, ...args: any[]): void {
    console.error(this.formatMessage('ERROR', message, ...args));
  }

  public warn(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.warn(this.formatMessage('WARN', message, ...args));
    }
  }

  public debug(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('DEBUG', message, ...args));
    }
  }
}

export const logger = Logger.getInstance(); 