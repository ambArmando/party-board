"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallangeManager = void 0;
const Helpers_1 = require("../Shared/Helpers");
const Challange_1 = require("../Entities/Challange");
class ChallangeManager {
    constructor() {
        this.challanges = [];
        //private usedChallanges: Record<number, boolean> = {};
        this.usedChallanges = {};
        this.id = 0;
    }
    addChallange(data) {
        this.challanges.push(new Challange_1.Challange(this.id++, data.text, data.difficulty));
    }
    addChallanges(challanges) {
        for (const challage of challanges) {
            this.addChallange(challage);
        }
    }
    getUnusedChallange(difficulty) {
        (0, Helpers_1.shuffleArray)(this.challanges);
        for (const challange of this.challanges) {
            console.log(this.usedChallanges[challange.id], challange.text);
            if (this.usedChallanges[challange.id] == undefined) {
                this.usedChallanges[challange.id] = true;
                console.log("Found challange", challange.text);
                return challange;
            }
        }
        console.log("Oh no");
        return this.challanges[0];
        //throw new AllChallangesAreUsedException();
    }
    getAllChallanges() {
        return this.challanges;
    }
}
exports.ChallangeManager = ChallangeManager;
