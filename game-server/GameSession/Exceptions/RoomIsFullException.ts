import { ServerException } from "../../Shared/Exceptions/ServerException";

export class RoomIsFullException extends ServerException {
    constructor () {
        super('Camera pe care vrei să o accesezi este plină!');
    }
}