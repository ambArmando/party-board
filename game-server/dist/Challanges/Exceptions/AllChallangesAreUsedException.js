"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllChallangesAreUsedException = void 0;
const ServerException_1 = require("../../Shared/Exceptions/ServerException");
class AllChallangesAreUsedException extends ServerException_1.ServerException {
    constructor() {
        super('There are no more challanges avalaible!');
    }
}
exports.AllChallangesAreUsedException = AllChallangesAreUsedException;
