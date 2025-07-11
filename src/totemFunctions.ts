import {correspondance, keys, levels, totemArrowOrientation, variables} from "./data.js"
import { generateId, getCoordAfterMove, moveElement, sleep } from "./gameLogicFunctions.js";
import { addGameListener, generateGridImage, removeGameListener, resetLvl } from "./gameScreenFunctions.js";
import { encounterPlayer } from "./monsterFunctions.js";

let totemShootDirection: number = -1;

export function isSeenByTotem(div: HTMLElement, posX: number, posY: number): void{
    deactivateAllTotems();

    for(let i = 0; i < variables.curLvl.length; i++){        
        if (variables.curLvl[posX][i] === 11){
            activateTotem(posX, i);
            if(canTotemShoot(posX, i, posX, posY)){
                getTotemDirection(posX, i, posX, posY);
                totemShoots(div, posX, i);
                return;
            }
        }
        if (variables.curLvl[i][posY] === 11){
            activateTotem(i, posY);
            if(canTotemShoot(i, posY, posX, posY)){
                getTotemDirection(i, posY, posX, posY);
                totemShoots(div, i, posY);
            }
        }
    }
}

export function activateTotem(posX: number, posY: number): void{
    correspondance[11] = "./images/activeTotem.png";
    const curTile: HTMLElement | null =  document.getElementById(generateId(posX, posY));
    if(curTile){
        generateGridImage(curTile, posX, posY);
    }
}

export function deactivateAllTotems(): void{
    for(let i: number = 0; i < variables.curLvl.length; i++){
        for(let j: number = 0; j < variables.curLvl[i].length; j++){
            if(variables.curLvl[i][j] === 11){
                deactivateTotem(i, j);
            }
        }
    }
}

export function deactivateTotem(posX: number, posY: number): void{
    correspondance[11] = "./images/totem.png";
    const curTile: HTMLElement | null =  document.getElementById(generateId(posX, posY));
    if(curTile){
        generateGridImage(curTile, posX, posY);
    }
}

export function canTotemShoot(posX: number, posY: number, targetX: number, targetY: number): boolean{
    if(posX === targetX){
        const min: number = Math.min(posY, targetY);
        const max: number = Math.max(posY, targetY);

        for(let i = min+1; i < max; i++){
            if(variables.curLvl[posX][i] !== 0 && variables.curLvl[posX][i] !== 2){
                return false;
            }
        }
    }
    else if (posY === targetY){
        const min: number = Math.min(posX, targetX);
        const max: number = Math.max(posX, targetX);

        for(let i = min+1; i < max; i++){
            if(variables.curLvl[i][posY] !== 0 && variables.curLvl[i][posY] !== 2){
                return false;
            }
        }
    }
    return true;
}

export async function totemShoots(div: HTMLElement, posX: number, posY: number){
    removeGameListener();

    const dir: string = keys[totemShootDirection];
    let nextCoord: Array<number> = getCoordAfterMove(posX, posY, dir);
    if(!encounterPlayer(nextCoord[0], nextCoord[1])){
        correspondance[12] = totemArrowOrientation[totemShootDirection];
        posX = nextCoord[0];
        posY = nextCoord[1];

        const nextTile: HTMLElement | null =  document.getElementById(generateId(nextCoord[0], nextCoord[1]));
        if(nextTile){
            variables.curLvl[nextCoord[0]][nextCoord[1]] = 12;
            generateGridImage(nextTile, nextCoord[0], nextCoord[1]);
        }
        nextCoord = getCoordAfterMove(posX, posY, dir);

        while(!encounterPlayer(nextCoord[0], nextCoord[1])){
            await sleep(60);
            moveElement(posX, posY, dir);

            if(levels[variables.lvlNumber][posX][posY]){
                const treeTile: HTMLElement | null =  document.getElementById(generateId(posX, posY));
                if(treeTile){
                    variables.curLvl[posX][posY] = 2;
                    generateGridImage(treeTile, posX, posY);
                }
            }
            posX = nextCoord[0];
            posY = nextCoord[1];
            nextCoord = getCoordAfterMove(posX, posY, dir);
        }

        variables.curLvl[posX][posY] = 12;
        const shootTile: HTMLElement | null =  document.getElementById(generateId(posX, posY));
        if(shootTile){
            generateGridImage(shootTile, posX, posY);
            await sleep(60);
            if (levels[variables.lvlNumber][posX][posY]){
                variables.curLvl[posX][posY] = 2;
            }
            else{
                variables.curLvl[posX][posY] = 0;
            }
            generateGridImage(shootTile, posX, posY);
        }

        await sleep(60);
    }
    resetLvl();
    addGameListener();
}

export function getTotemDirection(posX: number, posY: number, targetX: number, targetY: number): void{
    if(posX === targetX){
        if(posY < targetY){
            totemShootDirection = 0;
        }
        else{
            totemShootDirection = 1;
        }
    }
    else{
        if(posX > targetX){
            totemShootDirection = 2;
        }
        else{
            totemShootDirection = 3;
        }
    }
}