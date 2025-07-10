import { keys, letters, variables } from "./data.js";
import { generateGridImage } from "./gameScreenFunctions.js";
import { moveCharacter, turnCharacter } from "./playerFunctions.js";
let lastMoveTime = 0;
export function movementListener(div, key) {
    const now = Date.now();
    if (now - lastMoveTime < 100) {
        return; // trop tôt, on ignore cette pression
    }
    if (variables.curMovement === keys.indexOf(key)) {
        moveCharacter(div, key);
    }
    else {
        turnCharacter(key);
        return;
    }
    lastMoveTime = now;
}
export function generateId(x, y) {
    let id;
    if (y < 10) {
        id = `${letters[x]}0${y}`;
    }
    else {
        id = `${letters[x]}${y}`;
    }
    return id;
}
export function getCurrentCoord() {
    let curX = -1, curY = -1;
    for (let i = 0; i < variables.curLvl.length; i++) {
        if (variables.curLvl[i].indexOf(1) !== -1) {
            curX = i;
            curY = variables.curLvl[i].indexOf(1);
            break;
        }
    }
    return [curX, curY];
}
export function getCoordAfterMove(posX, posY, dir) {
    let nextX = posX;
    let nextY = posY;
    switch (dir) {
        case "ArrowRight":
            nextY = posY + 1;
            break;
        case "ArrowLeft":
            nextY = posY - 1;
            break;
        case "ArrowUp":
            nextX = posX - 1;
            break;
        case "ArrowDown":
            nextX = posX + 1;
            break;
    }
    return [nextX, nextY];
}
export function moveElement(coordX, coordY, dir) {
    const nextCoord = getCoordAfterMove(coordX, coordY, dir);
    variables.curLvl[nextCoord[0]][nextCoord[1]] = variables.curLvl[coordX][coordY];
    variables.curLvl[coordX][coordY] = 0;
    const curTile = document.getElementById(generateId(coordX, coordY));
    const nextTile = document.getElementById(generateId(nextCoord[0], nextCoord[1]));
    if (curTile && nextTile) {
        generateGridImage(curTile, coordX, coordY);
        generateGridImage(nextTile, nextCoord[0], nextCoord[1]);
    }
}
export function canBlocMove(posX, posY, dir) {
    if (!isOutOfBound(posX, posY)) {
        if (variables.curLvl[posX][posY] === 0 || variables.curLvl[posX][posY] === 13) {
            return true;
        }
    }
    return false;
}
export function isLevelOver(posX, posY) {
    if (posX === 0 && posY === 4 && variables.keyNumber === variables.maxKeys) {
        return true;
    }
    return false;
}
export function generateImage(src) {
    const img = document.createElement("img");
    img.src = src;
    return img;
}
export function drawAmmo() {
    const pAmmo = document.getElementById("ammo");
    if (pAmmo) {
        pAmmo.innerText = variables.ammo.toString();
    }
}
export function drawLives() {
    const pLives = document.getElementById("lives");
    if (pLives) {
        pLives.innerText = variables.lives.toString();
    }
}
export function isOutOfBound(posX, posY) {
    if (posX < 0 || posY < 0) {
        return true;
    }
    if (posX >= variables.curLvl.length || posY >= variables.curLvl[posX].length) {
        return true;
    }
    return false;
}
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
