"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Challange = exports.ChallangeDifficulty = void 0;
var ChallangeDifficulty;
(function (ChallangeDifficulty) {
    ChallangeDifficulty[ChallangeDifficulty["Easy"] = 0] = "Easy";
    ChallangeDifficulty[ChallangeDifficulty["Medium"] = 1] = "Medium";
    ChallangeDifficulty[ChallangeDifficulty["Hard"] = 2] = "Hard";
})(ChallangeDifficulty = exports.ChallangeDifficulty || (exports.ChallangeDifficulty = {}));
class Challange {
    constructor(id, text, difficulty) {
        this.id = id;
        this.text = text;
        this.difficulty = difficulty;
    }
}
exports.Challange = Challange;
