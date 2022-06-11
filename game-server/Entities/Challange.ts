export enum ChallangeDifficulty {
    Easy,
    Medium,
    Hard,
}

export class Challange {
    public readonly id: number;
    public readonly text: string;
    public readonly difficulty: ChallangeDifficulty;

    constructor(id: number, text: string, difficulty: ChallangeDifficulty) {
        this.id = id;
        this.text = text;
        this.difficulty = difficulty;
    }

}