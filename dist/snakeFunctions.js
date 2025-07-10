import { variables } from "./data.js";
import { generateId } from "./gameLogicFunctions.js";
import { generateGridImage } from "./gameScreenFunctions.js";
export function shootSnake(posX, posY) {
    variables.curLvl[posX][posY] = 7;
    const snakeTile = document.getElementById(generateId(posX, posY));
    if (snakeTile) {
        generateGridImage(snakeTile, posX, posY);
    }
}
export function shootBall(posX, posY) {
    variables.curLvl[posX][posY] = 0;
    const ballTile = document.getElementById(generateId(posX, posY));
    if (ballTile) {
        generateGridImage(ballTile, posX, posY);
    }
}
