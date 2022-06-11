"use strict";
// export function generateRandomHexColor(): string {
//     let c = '';
//     while (c.length < 7) {
//       c += (Math.random()).toString(16).substr(-6).substr(-1)
//     }
//     return '#' + c;
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleArray = void 0;
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const newIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[newIndex]] = [array[newIndex], array[i]];
    }
    return array;
}
exports.shuffleArray = shuffleArray;
