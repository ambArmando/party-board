import { ChallangeDto } from "../../Challanges/DTO/ChallangeDto";
import { ChallangeDifficulty } from "../../Entities/Challange";
import { IChallangeRepository } from "./Abstractions/IChallangeRepository";

export enum ChallangeCollection {
    standard = "standard"
}


export class ChallangeRepository implements IChallangeRepository {

    private challangeCollections: Record<string, ChallangeDto[]> = {
        "standard": [{
            text: "Ține trei cuburi de gheață în gură până se topesc.",
            difficulty: ChallangeDifficulty.Medium,
        }, {
            text: "Mănâncă o lingură de muștar.",
            difficulty: ChallangeDifficulty.Easy
        }, {
            text: "Oferă un masaj la picioare persoanei din dreapta ta.",
            difficulty: ChallangeDifficulty.Hard
        }, {
            text: "Ține trei cuburi de gheață în gură până se topesc.",
            difficulty: ChallangeDifficulty.Medium,
        }, {
            text: "Mănâncă o lingură de muștar.",
            difficulty: ChallangeDifficulty.Easy
        }, {
            text: "Oferă un masaj la picioare persoanei din dreapta ta.",
            difficulty: ChallangeDifficulty.Hard
        }, {
            text: "Ține trei cuburi de gheață în gură până se topesc.",
            difficulty: ChallangeDifficulty.Medium,
        }, {
            text: "Mănâncă o lingură de muștar.",
            difficulty: ChallangeDifficulty.Easy
        }, {
            text: "Oferă un masaj la picioare persoanei din dreapta ta.",
            difficulty: ChallangeDifficulty.Hard
        }, {
            text: "Ține trei cuburi de gheață în gură până se topesc.",
            difficulty: ChallangeDifficulty.Medium,
        }, {
            text: "Mănâncă o lingură de muștar.",
            difficulty: ChallangeDifficulty.Easy
        }, {
            text: "Oferă un masaj la picioare persoanei din dreapta ta.",
            difficulty: ChallangeDifficulty.Hard
        }, {
            text: "Ține trei cuburi de gheață în gură până se topesc.",
            difficulty: ChallangeDifficulty.Medium,
        }, {
            text: "Mănâncă o lingură de muștar.",
            difficulty: ChallangeDifficulty.Easy
        }, {
            text: "Oferă un masaj la picioare persoanei din dreapta ta.",
            difficulty: ChallangeDifficulty.Hard
        }, {
            text: "Ține trei cuburi de gheață în gură până se topesc.",
            difficulty: ChallangeDifficulty.Medium,
        }, {
            text: "Mănâncă o lingură de muștar.",
            difficulty: ChallangeDifficulty.Easy
        }, {
            text: "Oferă un masaj la picioare persoanei din dreapta ta.",
            difficulty: ChallangeDifficulty.Hard
        }],
    };

    getChallangeCollection(collectionName: string): ChallangeDto[] {
       return this.challangeCollections[collectionName];
    }
}