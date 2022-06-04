import { ServerException } from "../../Shared/Exceptions/ServerException";

export class RoomDoesNotExistException extends ServerException {
    public roomName: string; 
    constructor (roomName: string) {
        super(`The room '${roomName}' does not exist`);
        this.roomName = roomName;
    }
}