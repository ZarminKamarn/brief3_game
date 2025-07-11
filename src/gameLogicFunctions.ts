import { keys, letters, variables } from "./data.js";
import { generateGridImage } from "./gameScreenFunctions.js";
import { moveCharacter, turnCharacter } from "./playerFunctions.js";

let lastMoveTime: number = 0;

export function movementListener(div: HTMLElement, key: string): void {
  const now: number = Date.now();
  if (now - lastMoveTime < 100) {
    return;
  }

  if (variables.curMovement === keys.indexOf(key)) {
    moveCharacter(div, key);
  } else {
    turnCharacter(key);
    return;
  }

  lastMoveTime = now;
}

export function generateId(x: number, y: number): string {
  let id: string;
  if (y < 10) {
    id = `${letters[x]}0${y}`;
  } else {
    id = `${letters[x]}${y}`;
  }

  return id;
}

export function getCurrentCoord(): Array<number> {
  let curX: number = -1,
    curY: number = -1;
  for (let i = 0; i < variables.curLvl.length; i++) {
    if (variables.curLvl[i].indexOf(1) !== -1) {
      curX = i;
      curY = variables.curLvl[i].indexOf(1);
      break;
    }
  }

  return [curX, curY];
}

export function getCoordAfterMove(
  posX: number,
  posY: number,
  dir: string
): Array<number> {
  let nextX: number = posX;
  let nextY: number = posY;
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

export function moveElement(coordX: number, coordY: number, dir: string): void {
  const nextCoord: Array<number> = getCoordAfterMove(coordX, coordY, dir);
  variables.curLvl[nextCoord[0]][nextCoord[1]] =
    variables.curLvl[coordX][coordY];
  variables.curLvl[coordX][coordY] = 0;

  generateGridImage(coordX, coordY);
  generateGridImage(nextCoord[0], nextCoord[1]);
}

export function canBlocMove(posX: number, posY: number, dir: string): boolean {
  if (!isOutOfBound(posX, posY)) {
    if (
      variables.curLvl[posX][posY] === 0 ||
      variables.curLvl[posX][posY] === 13
    ) {
      return true;
    }
  }
  return false;
}

export function isLevelOver(posX: number, posY: number): boolean {
  if (posX === 0 && posY === 4 && variables.keyNumber === variables.maxKeys) {
    return true;
  }
  return false;
}

export function generateImage(src: string): HTMLImageElement {
  const img: HTMLImageElement = document.createElement("img");
  img.src = src;
  return img;
}

export function drawAmmo(): void {
  const pAmmo: HTMLElement | null = document.getElementById("ammo");
  if (pAmmo) {
    pAmmo.innerText = variables.ammo.toString();
  }
}

export function drawLives() {
  const pLives: HTMLElement | null = document.getElementById("lives");
  if (pLives) {
    pLives.innerText = variables.lives.toString();
  }
}

export function isOutOfBound(posX: number, posY: number): boolean {
  if (posX < 0 || posY < 0) {
    return true;
  }
  if (
    posX >= variables.curLvl.length ||
    posY >= variables.curLvl[posX].length
  ) {
    return true;
  }
  return false;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
