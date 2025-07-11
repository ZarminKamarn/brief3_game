import { variables } from "./data.js";
import { generateGridImage } from "./gameScreenFunctions.js";

export function shootSnake(posX: number, posY: number): void {
  variables.curLvl[posX][posY] = 7;
  generateGridImage(posX, posY);
}

export function shootBall(posX: number, posY: number): void {
  variables.curLvl[posX][posY] = 0;
  generateGridImage(posX, posY);
}
