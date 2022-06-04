import { ServerException } from "../../Shared/Exceptions/ServerException";

export class RoomExistsException extends ServerException {
    public roomName: string; 
    constructor (roomName: string) {
        super(`The room '${roomName}' already exists`);
        this.roomName = roomName;
    }
}