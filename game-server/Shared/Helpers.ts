export function generateRandomHexColor(): string {
    let c = '';
    while (c.length < 7) {
      c += (Math.random()).toString(16).substr(-6).substr(-1)
    }
    return '#' + c;
}

export function shuffleArray(array: Array<any>): Array<any> {
  for (let i = array.length - 1; i > 0; i--) {
    const newIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[newIndex]] = [array[newIndex], array[i]];
  }
  return array;
}