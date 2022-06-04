import { ServerException } from "../../Shared/Exceptions/ServerException";

export class AllChallangesAreUsedException extends ServerException {
    constructor () {
        super('There are no more challanges avalaible!');
    }
}