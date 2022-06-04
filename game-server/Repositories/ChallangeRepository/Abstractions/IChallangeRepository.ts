import { ChallangeDto } from "../../../Challanges/DTO/ChallangeDto";

export interface IChallangeRepository {
    getChallangeCollection(collectionName: string): ChallangeDto[];
}