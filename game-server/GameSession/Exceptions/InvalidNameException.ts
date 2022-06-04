import { ServerException } from "../../Shared/Exceptions/ServerException";

export class InvalidNameException extends ServerException {
    constructor () {
        super('Invalid name!');
    }
}