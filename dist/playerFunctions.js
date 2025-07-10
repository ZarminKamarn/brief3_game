var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { characterOrientation, correspondance, keys, maxLvl, shootOrientation, variables } from "./data.js";
import { canBlocMove, generateId, getCoordAfterMove, getCurrentCoord, isLevelOver, isOutOfBound, moveElement, drawAmmo, sleep } from "./gameLogicFunctions.js";
import { drawEndGameScreen, drawEndLvlScreen, generateGridImage } from "./gameScreenFunctions.js";
import { freezeMonster } from "./monsterFunctions.js";
import { shootBall, shootSnake } from "./snakeFunctions.js";
import { isSeenByTotem } from "./totemFunctions.js";
let shotAmmo = false;
export function turnCharacter(dir) {
    const curCoord = getCurrentCoord();
    const curTile = document.getElementById(generateId(curCoord[0], curCoord[1]));
    if (curTile) {
        switch (dir) {
            case "ArrowRight":
                variables.curMovement = 0;
                break;
            case "ArrowLeft":
                variables.curMovement = 1;
                break;
            case "ArrowUp":
                variables.curMovement = 2;
                break;
            case "ArrowDown":
                variables.curMovement = 3;
                break;
        }
        correspondance[1] = characterOrientation[variables.curMovement];
        generateGridImage(curTile, curCoord[0], curCoord[1]);
    }
}
export function moveCharacter(div, dir) {
    const curCoord = getCurrentCoord();
    const nextCoord = getCoordAfterMove(curCoord[0], curCoord[1], dir);
    if (canCharacterMove(nextCoord[0], nextCoord[1], dir)) {
        const moveToCase = variables.curLvl[nextCoord[0]][nextCoord[1]];
        if (moveToCase === 4 || moveToCase === 7) {
            moveElement(nextCoord[0], nextCoord[1], dir);
        }
        moveElement(curCoord[0], curCoord[1], dir);
        isSeenByTotem(div, nextCoord[0], nextCoord[1]);
        if (moveToCase === 5) {
            variables.keyNumber++;
        }
        if (isLevelOver(nextCoord[0], nextCoord[1])) {
            if (variables.lvlNumber === maxLvl) {
                drawEndGameScreen(div);
            }
            else {
                variables.lvlNumber++;
                drawEndLvlScreen(div);
            }
        }
    }
    else if (!isOutOfBound(nextCoord[0], nextCoord[1])) {
        if (variables.curLvl[nextCoord[0]][nextCoord[1]] === 9) {
            freezeMonster(nextCoord[0], nextCoord[1]);
        }
    }
}
export function canCharacterMove(posX, posY, dir) {
    if (!isOutOfBound(posX, posY)) {
        if (variables.curLvl[posX][posY] === 4 || variables.curLvl[posX][posY] === 7) {
            const newCoord = getCoordAfterMove(posX, posY, dir);
            if (!canBlocMove(newCoord[0], newCoord[1], dir)) {
                return false;
            }
            else {
                return true;
            }
        }
        if (variables.curLvl[posX][posY] === 0 || variables.curLvl[posX][posY] === 13 || variables.curLvl[posX][posY] === 5) {
            return true;
        }
    }
    return false;
}
export function shoot() {
    if (!shotAmmo && variables.ammo > 0) {
        shotAmmo = true;
        variables.ammo--;
        drawAmmo();
        const dir = keys[variables.curMovement];
        const curCoord = getCurrentCoord();
        const coordShoot = getCoordAfterMove(curCoord[0], curCoord[1], dir);
        if (canBlocMove(coordShoot[0], coordShoot[1], dir)) {
            const shootTile = document.getElementById(generateId(coordShoot[0], coordShoot[1]));
            if (shootTile) {
                correspondance[8] = shootOrientation[variables.curMovement];
                variables.curLvl[coordShoot[0]][coordShoot[1]] = 8;
                generateGridImage(shootTile, coordShoot[0], coordShoot[1]);
                drawShootMovement(coordShoot[0], coordShoot[1], dir);
            }
        }
        else {
            killEnemyIfPossible(coordShoot[0], coordShoot[1]);
            shotAmmo = false;
        }
    }
    return;
}
export function drawShootMovement(posX, posY, dir) {
    return __awaiter(this, void 0, void 0, function* () {
        yield sleep(50);
        let nextCoord = getCoordAfterMove(posX, posY, dir);
        while (canBlocMove(nextCoord[0], nextCoord[1], dir)) {
            moveElement(posX, posY, dir);
            posX = nextCoord[0];
            posY = nextCoord[1];
            nextCoord = getCoordAfterMove(posX, posY, dir);
            yield sleep(50);
        }
        killEnemyIfPossible(nextCoord[0], nextCoord[1]);
        variables.curLvl[posX][posY] = 0;
        const shootTile = document.getElementById(generateId(posX, posY));
        if (shootTile) {
            generateGridImage(shootTile, posX, posY);
        }
        shotAmmo = false;
    });
}
export function killEnemyIfPossible(posX, posY) {
    if (!isOutOfBound(posX, posY)) {
        if (variables.curLvl[posX][posY] === 7) {
            shootBall(posX, posY);
        }
        else if (variables.curLvl[posX][posY] === 6) {
            shootSnake(posX, posY);
        }
    }
}
