import { ChallangeDifficulty } from "../../Entities/Challange";

interface ChallangeDtoParams {
    text: string,
    difficulty: ChallangeDifficulty,
}

export class ChallangeDto {
    public text: string;
    public difficulty: ChallangeDifficulty;

    constructor(params: ChallangeDtoParams) {
        this.text = params.text;
        this.difficulty = params.difficulty;
    }
}