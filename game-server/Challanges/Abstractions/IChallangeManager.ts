import { Challange, ChallangeDifficulty } from "../../Entities/Challange";
import { ChallangeDto } from "../DTO/ChallangeDto";

export interface IChallangeManager {
    addChallange(challange: ChallangeDto): void;
    addChallanges(challanges: ChallangeDto[]): void;
    getUnusedChallange(difficulty: ChallangeDifficulty): Challange;
    getAllChallanges(): Array<Challange>;
    //removeChallange(): void;
}