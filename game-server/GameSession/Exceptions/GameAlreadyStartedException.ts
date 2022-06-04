import { ServerException } from "../../Shared/Exceptions/ServerException";

export class GameAlreadyStartedException extends ServerException {
    constructor () {
        super('The game already started');
    }
}