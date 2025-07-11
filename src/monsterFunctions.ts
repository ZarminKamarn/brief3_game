import {
  correspondance,
  keys,
  monsterOrientation,
  sleepingMonsterOrientation,
  variables,
} from "./data.js";
import {
  canBlocMove,
  generateId,
  getCoordAfterMove,
  isOutOfBound,
  moveElement,
  sleep,
} from "./gameLogicFunctions.js";
import { generateGridImage } from "./gameScreenFunctions.js";

export async function initMonster(posX: number, posY: number) {
  while (variables.curLvl[posX][posY] === 9) {
    const nextMovement: number = Math.floor(Math.random() * 4);
    if (nextMovement !== variables.curMonsterMovement) {
      variables.curMonsterMovement = nextMovement;
      correspondance[9] = monsterOrientation[variables.curMonsterMovement];
      generateGridImage(posX, posY);
    }
    const nextCoord: Array<number> = getCoordAfterMove(
      posX,
      posY,
      keys[variables.curMonsterMovement]
    );
    if (
      canBlocMove(
        nextCoord[0],
        nextCoord[1],
        keys[variables.curMonsterMovement]
      )
    ) {
      moveElement(posX, posY, keys[variables.curMonsterMovement]);
      posX = nextCoord[0];
      posY = nextCoord[1];
    } else if (encounterPlayer(nextCoord[0], nextCoord[1])) {
      freezeMonster(posX, posY);
    } else {
      continue;
    }
    await sleep(200);
  }
  return;
}

export function encounterPlayer(posX: number, posY: number): boolean {
  if (!isOutOfBound(posX, posY)) {
    if (variables.curLvl[posX][posY] === 1) {
      return true;
    }
  }
  return false;
}

export function freezeMonster(posX: number, posY: number): void {
  correspondance[10] = sleepingMonsterOrientation[variables.curMonsterMovement];
  variables.curLvl[posX][posY] = 10;
  generateGridImage(posX, posY);
}
