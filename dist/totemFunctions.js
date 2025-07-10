var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { correspondance, keys, levels, totemArrowOrientation, variables } from "./data.js";
import { generateId, getCoordAfterMove, moveElement, sleep } from "./gameLogicFunctions.js";
import { addGameListener, generateGridImage, removeGameListener, resetLvl } from "./gameScreenFunctions.js";
import { encounterPlayer } from "./monsterFunctions.js";
let totemShootDirection = -1;
export function isSeenByTotem(div, posX, posY) {
    deactivateAllTotems();
    for (let i = 0; i < variables.curLvl.length; i++) {
        if (variables.curLvl[posX][i] === 11) {
            activateTotem(posX, i);
            if (canTotemShoot(posX, i, posX, posY)) {
                getTotemDirection(posX, i, posX, posY);
                totemShoots(div, posX, i);
                return;
            }
        }
        if (variables.curLvl[i][posY] === 11) {
            activateTotem(i, posY);
            if (canTotemShoot(i, posY, posX, posY)) {
                getTotemDirection(i, posY, posX, posY);
                totemShoots(div, i, posY);
            }
        }
    }
}
export function activateTotem(posX, posY) {
    correspondance[11] = "./images/activeTotem.png";
    const curTile = document.getElementById(generateId(posX, posY));
    if (curTile) {
        generateGridImage(curTile, posX, posY);
    }
}
export function deactivateAllTotems() {
    for (let i = 0; i < variables.curLvl.length; i++) {
        for (let j = 0; j < variables.curLvl[i].length; j++) {
            if (variables.curLvl[i][j] === 11) {
                deactivateTotem(i, j);
            }
        }
    }
}
export function deactivateTotem(posX, posY) {
    correspondance[11] = "./images/totem.png";
    const curTile = document.getElementById(generateId(posX, posY));
    if (curTile) {
        generateGridImage(curTile, posX, posY);
    }
}
export function canTotemShoot(posX, posY, targetX, targetY) {
    if (posX === targetX) {
        const min = Math.min(posY, targetY);
        const max = Math.max(posY, targetY);
        for (let i = min + 1; i < max; i++) {
            if (variables.curLvl[posX][i] !== 0 && variables.curLvl[posX][i] !== 2) {
                return false;
            }
        }
    }
    else if (posY === targetY) {
        const min = Math.min(posX, targetX);
        const max = Math.max(posX, targetX);
        for (let i = min + 1; i < max; i++) {
            if (variables.curLvl[i][posY] !== 0 && variables.curLvl[i][posY] !== 2) {
                return false;
            }
        }
    }
    return true;
}
export function totemShoots(div, posX, posY) {
    return __awaiter(this, void 0, void 0, function* () {
        removeGameListener(div);
        const dir = keys[totemShootDirection];
        let nextCoord = getCoordAfterMove(posX, posY, dir);
        if (!encounterPlayer(nextCoord[0], nextCoord[1])) {
            correspondance[12] = totemArrowOrientation[totemShootDirection];
            posX = nextCoord[0];
            posY = nextCoord[1];
            const nextTile = document.getElementById(generateId(nextCoord[0], nextCoord[1]));
            if (nextTile) {
                variables.curLvl[nextCoord[0]][nextCoord[1]] = 12;
                generateGridImage(nextTile, nextCoord[0], nextCoord[1]);
            }
            nextCoord = getCoordAfterMove(posX, posY, dir);
            while (!encounterPlayer(nextCoord[0], nextCoord[1])) {
                yield sleep(60);
                moveElement(posX, posY, dir);
                if (levels[variables.lvlNumber][posX][posY]) {
                    const treeTile = document.getElementById(generateId(posX, posY));
                    if (treeTile) {
                        variables.curLvl[posX][posY] = 2;
                        generateGridImage(treeTile, posX, posY);
                    }
                }
                posX = nextCoord[0];
                posY = nextCoord[1];
                nextCoord = getCoordAfterMove(posX, posY, dir);
            }
            variables.curLvl[posX][posY] = 12;
            const shootTile = document.getElementById(generateId(posX, posY));
            if (shootTile) {
                generateGridImage(shootTile, posX, posY);
                yield sleep(60);
                if (levels[variables.lvlNumber][posX][posY]) {
                    variables.curLvl[posX][posY] = 2;
                }
                else {
                    variables.curLvl[posX][posY] = 0;
                }
                generateGridImage(shootTile, posX, posY);
            }
            yield sleep(60);
        }
        resetLvl(div);
        addGameListener(div);
    });
}
export function getTotemDirection(posX, posY, targetX, targetY) {
    if (posX === targetX) {
        if (posY < targetY) {
            totemShootDirection = 0;
        }
        else {
            totemShootDirection = 1;
        }
    }
    else {
        if (posX > targetX) {
            totemShootDirection = 2;
        }
        else {
            totemShootDirection = 3;
        }
    }
}
