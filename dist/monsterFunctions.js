var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { correspondance, keys, monsterOrientation, sleepingMonsterOrientation, variables } from "./data.js";
import { canBlocMove, generateId, getCoordAfterMove, isOutOfBound, moveElement, sleep } from "./gameLogicFunctions.js";
import { generateGridImage } from "./gameScreenFunctions.js";
export function initMonster(posX, posY) {
    return __awaiter(this, void 0, void 0, function* () {
        while (variables.curLvl[posX][posY] === 9) {
            const nextMovement = Math.floor(Math.random() * 4);
            if (nextMovement !== variables.curMonsterMovement) {
                variables.curMonsterMovement = nextMovement;
                correspondance[9] = monsterOrientation[variables.curMonsterMovement];
                const curTile = document.getElementById(generateId(posX, posY));
                if (curTile) {
                    generateGridImage(curTile, posX, posY);
                }
            }
            const nextCoord = getCoordAfterMove(posX, posY, keys[variables.curMonsterMovement]);
            if (canBlocMove(nextCoord[0], nextCoord[1], keys[variables.curMonsterMovement])) {
                moveElement(posX, posY, keys[variables.curMonsterMovement]);
                posX = nextCoord[0];
                posY = nextCoord[1];
            }
            else if (encounterPlayer(nextCoord[0], nextCoord[1])) {
                freezeMonster(posX, posY);
            }
            else {
                continue;
            }
            yield sleep(200);
        }
        return;
    });
}
export function encounterPlayer(posX, posY) {
    if (!isOutOfBound(posX, posY)) {
        if (variables.curLvl[posX][posY] === 1) {
            return true;
        }
    }
    return false;
}
export function freezeMonster(posX, posY) {
    correspondance[10] = sleepingMonsterOrientation[variables.curMonsterMovement];
    variables.curLvl[posX][posY] = 10;
    const curTile = document.getElementById(generateId(posX, posY));
    if (curTile) {
        generateGridImage(curTile, posX, posY);
    }
}
