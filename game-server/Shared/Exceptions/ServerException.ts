export abstract class ServerException extends Error {
    constructor(message: string) {
        super(message);
    }
}