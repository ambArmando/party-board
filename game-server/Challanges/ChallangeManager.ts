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
        console.log("arrayu de challangeuri", this.challanges);
    }

    addChallanges(challanges: ChallangeDto[]): void {
       for (const challage of challanges) {
           this.addChallange(challage);
       }
    }

    getUnusedChallange(difficulty: ChallangeDifficulty): Challange {
        shuffleArray(this.challanges);
        console.log(this.challanges);
        for (const challange of this.challanges) {
            console.log(this.usedChallanges[challange.id], challange.text);
            console.log("asta este challangeu =>> ", challange);
            console.log("dificultatea provocarii =>> ", (<any>ChallangeDifficulty)[challange.difficulty] );
            console.log("dificultatea in enum =>> ", ChallangeDifficulty[difficulty]);
            console.log("dificultatea primita ca paramtetru =>> ", ChallangeDifficulty[difficulty]);
            
            console.log("e undefined? =>> ", this.usedChallanges[challange.id] == undefined);
            console.log("sunt egale dificultatile? ==>>", (<any>ChallangeDifficulty)[challange.difficulty] == ChallangeDifficulty[difficulty]);
            console.log("conditia din if =>> ", this.usedChallanges[challange.id] == undefined && ((<any>ChallangeDifficulty)[challange.difficulty].value == ChallangeDifficulty[difficulty]));
            if (this.usedChallanges[challange.id] == undefined && ((<any>ChallangeDifficulty)[challange.difficulty] == ChallangeDifficulty[difficulty])) {
                console.log("found dificulty: ", ChallangeDifficulty[difficulty]);
                this.usedChallanges[challange.id] = true;
                console.log("Found challange", challange.text);
                return challange;
            }
        }
        console.log("NU mai sunt provocari disponibile");
        return this.challanges[0];
       // throw new AllChallangesAreUsedException();
    }

    getAllChallanges(): Challange[] {
        return this.challanges;
    }
}