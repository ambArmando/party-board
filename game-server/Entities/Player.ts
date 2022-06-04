import { Socket } from "socket.io";
import { ISerializable } from "./Abstractions/ISerializable";

export type Position = {
    i: number,
    j: number,
}

export type LastPosition = {
    lastI: number,
    lastJ: number,
}

interface PlayerParameters {
    id: number,
    name: string,
    color: string,
    points: number,
    position: Position,
    lastPosition: LastPosition,
    socket: Socket,
}

export class Player implements ISerializable {
    public id: number;
    public name: string;
    public color?: string;
    public points: number;

    public position: Position;
    public lastPosition: LastPosition;
    public socket: Socket;

    constructor(params: PlayerParameters) {
        this.id = params.id;
        this.name = params.name;
        this.color = params.color;
        this.points = params.points;
        this.position = params.position;
        this.lastPosition = params.lastPosition;
        this.socket = params.socket;
    }

    toJson(): Object {
       return {
            id: this.id,
            name: this.name,
            color: this.color,
            points: this.points,
            position: this.position,
            lastPosition: this.lastPosition
       };
    }
}