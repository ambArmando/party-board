"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallangeRepository = exports.ChallangeCollection = void 0;
const Challange_1 = require("../../Entities/Challange");
var ChallangeCollection;
(function (ChallangeCollection) {
    ChallangeCollection["standard"] = "standard";
})(ChallangeCollection = exports.ChallangeCollection || (exports.ChallangeCollection = {}));
class ChallangeRepository {
    constructor() {
        this.challangeCollections = {
            "standard": [{
                    text: "Ține trei cuburi de gheață în gură până se topesc.",
                    difficulty: Challange_1.ChallangeDifficulty.Medium,
                }, {
                    text: "Mănâncă o lingură de muștar.",
                    difficulty: Challange_1.ChallangeDifficulty.Easy
                }, {
                    text: "Oferă un masaj la picioare persoanei din dreapta ta.",
                    difficulty: Challange_1.ChallangeDifficulty.Hard
                }],
        };
    }
    getChallangeCollection(collectionName) {
        return this.challangeCollections[collectionName];
    }
}
exports.ChallangeRepository = ChallangeRepository;
