import { shuffleArray } from "../Shared/Helpers";
import { IChallangeManager } from "./Abstractions/IChallangeManager";
import { ChallangeDifficulty, Challange } from "../Entities/Challange";
import { AllChallangesAreUsedException } from "./Exceptions/AllChallangesAreUsedException";
import { ChallangeDto } from "./DTO/ChallangeDto";

interface IHash {
    [details: string]: boolean
}

export class ChallangeManager implements IChallangeManager {
    private challanges: Array<Challange> = [];
    //private usedChallanges: Record<number, boolean> = {};
    private usedChallanges: IHash = {};

    private id: number = 0;

    constructor () {

    }
    
    addChallange(data: ChallangeDto): void {
        this.challanges.push(new Challange(this.id++, data.text, data.difficulty));
    }

    addChallanges(challanges: ChallangeDto[]): void {
       for (const challage of challanges) {
           this.addChallange(challage);
       }
    }

    getUnusedChallange(difficulty: ChallangeDifficulty): Challange {
        shuffleArray(this.challanges);
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

    getAllChallanges(): Challange[] {
        return this.challanges;
    }
}