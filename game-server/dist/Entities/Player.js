"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(params) {
        this.id = params.id;
        this.name = params.name;
        this.color = params.color;
        this.points = params.points;
        this.position = params.position;
        this.lastPosition = params.lastPosition;
        this.socket = params.socket;
    }
    toJson() {
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
exports.Player = Player;
