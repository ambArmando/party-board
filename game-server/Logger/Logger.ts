export class Logger {
    private static _instance: Logger;
    private constructor() {}

    public static instance(): Logger {
        if (!Logger._instance) {
            Logger._instance = new Logger();
        }
        return Logger._instance;
    }

    log(message: string) {
        console.log(message);
    }
}