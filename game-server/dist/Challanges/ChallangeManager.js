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
        console.log("arrayu de challangeuri", this.challanges);
    }
    addChallanges(challanges) {
        for (const challage of challanges) {
            this.addChallange(challage);
        }
    }
    getUnusedChallange(difficulty) {
        (0, Helpers_1.shuffleArray)(this.challanges);
        console.log(this.challanges);
        for (const challange of this.challanges) {
            console.log(this.usedChallanges[challange.id], challange.text);
            console.log("asta este challangeu =>> ", challange);
            console.log("dificultatea provocarii =>> ", Challange_1.ChallangeDifficulty[challange.difficulty]);
            console.log("dificultatea in enum =>> ", Challange_1.ChallangeDifficulty[difficulty]);
            console.log("dificultatea primita ca paramtetru =>> ", Challange_1.ChallangeDifficulty[difficulty]);
            console.log("e undefined? =>> ", this.usedChallanges[challange.id] == undefined);
            console.log("sunt egale dificultatile? ==>>", Challange_1.ChallangeDifficulty[challange.difficulty] == Challange_1.ChallangeDifficulty[difficulty]);
            console.log("conditia din if =>> ", this.usedChallanges[challange.id] == undefined && (Challange_1.ChallangeDifficulty[challange.difficulty].value == Challange_1.ChallangeDifficulty[difficulty]));
            if (this.usedChallanges[challange.id] == undefined && (Challange_1.ChallangeDifficulty[challange.difficulty] == Challange_1.ChallangeDifficulty[difficulty])) {
                console.log("found dificulty: ", Challange_1.ChallangeDifficulty[difficulty]);
                this.usedChallanges[challange.id] = true;
                console.log("Found challange", challange.text);
                return challange;
            }
        }
        console.log("NU mai sunt provocari disponibile");
        return this.challanges[0];
        // throw new AllChallangesAreUsedException();
    }
    getAllChallanges() {
        return this.challanges;
    }
}
exports.ChallangeManager = ChallangeManager;
