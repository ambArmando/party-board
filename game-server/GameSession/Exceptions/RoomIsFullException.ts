import { ServerException } from "../../Shared/Exceptions/ServerException";

export class RoomIsFullException extends ServerException {
    constructor () {
        super('The room is full');
    }
}