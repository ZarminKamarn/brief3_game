import { arrowDown, arrowLeft, arrowRight, arrowUp, btnShoot, characterOrientation, correspondance, gameArea, gameScreen, keys, keysByLvl, levels, maxAmmo, monsterOrientation, variables } from "./data.js";
import { drawAmmo, drawLives, generateId, generateImage, movementListener } from "./gameLogicFunctions.js";
import { initMonster } from "./monsterFunctions.js";
import { generateButton, initTitleScreen } from "./otherScreenFunctions.js";
import { shoot } from "./playerFunctions.js";

export function drawEndGameScreen(div: HTMLElement): void{
    removeGameListener();
    const divEndScreen: HTMLDivElement = document.createElement("div");
    divEndScreen.classList.add("end-lvl-area");

    const divText: HTMLDivElement = document.createElement("div");
    divText.classList.add("glass-element");
    divText.classList.add("end-lvl");

    const p: HTMLParagraphElement = document.createElement("p");
    p.innerHTML = "Félicitations, vous avez fini le jeu!";
    divText.appendChild(p);

    const btn: HTMLButtonElement = generateButton("Retour à l'accueil");
    btn.id = "returnBtn";

    divEndScreen.append(divText, btn);
    div.appendChild(divEndScreen);

    btn.addEventListener("click", function(){
        initTitleScreen(div);
    })
}

export function drawEndLvlScreen(div: HTMLElement): void{
    removeGameListener();
    const divEndScreen: HTMLDivElement = document.createElement("div");
    divEndScreen.classList.add("end-lvl-area");

    const divText: HTMLDivElement = document.createElement("div");
    divText.classList.add("glass-element");
    divText.classList.add("end-lvl");

    const p: HTMLParagraphElement = document.createElement("p");
    p.innerHTML = `Vous avez fini le niveau ${variables.lvlNumber}!`;
    divText.appendChild(p);

    const btn: HTMLButtonElement = generateButton("Niveau suivant");
    btn.id = "returnBtn";

    divEndScreen.append(divText, btn);
    div.appendChild(divEndScreen);

    btn.addEventListener("click", function(){
        initGame(div);
    })
}

export function drawGameOverScreen(div: HTMLElement): void{
    removeGameListener();
    const divEndScreen: HTMLDivElement = document.createElement("div");
    divEndScreen.classList.add("end-lvl-area");

    const divText: HTMLDivElement = document.createElement("div");
    divText.classList.add("glass-element");
    divText.classList.add("end-lvl");

    const p: HTMLParagraphElement = document.createElement("p");
    p.innerHTML = `Game Over! Vous n'avez plus de vie`;
    divText.appendChild(p);

    const btn: HTMLButtonElement = generateButton("Retour à l'accueil");
    btn.id = "returnBtn";

    divEndScreen.append(divText, btn);
    div.appendChild(divEndScreen);

    btn.addEventListener("click", function(){
        initTitleScreen(div);
    })
}

export function initLvl(lvl: number=0): void{
    variables.curLvl = [];
    let arr = [];
    for(let i = 0; i < levels[lvl].length; i++){
        arr = [];
        for(let j = 0; j < levels[lvl][i].length; j++){
            arr.push(levels[lvl][i][j]);
        }
        variables.curLvl.push(arr);
    }
}

export function resetLvl(): void{
    if(gameScreen){
        initGame(gameScreen);

        variables.lives--;
        drawLives();
        if(variables.lives === 0){
            drawGameOverScreen(gameScreen);
        }
    }
}

export function resetCharacter(): void{
    variables.curMovement = 3;
    correspondance[1] = characterOrientation[variables.curMovement];

    variables.curMonsterMovement = 3;
    correspondance[9] = monsterOrientation[variables.curMonsterMovement];

    correspondance[11] = "./images/totem.png";
}

export function generateGridImage(div: HTMLElement, i: number, j: number): void{
    resetDiv(div);
    const src: string = correspondance[variables.curLvl[i][j]];
    if (src !== ""){
        const img: HTMLImageElement = generateImage(src);
        img.classList.add("game-image");

        div.appendChild(img);
    }
}

export function resetGame(div: HTMLElement): void{
    resetDiv(div);
    initLvl();
    variables.curInstruction = 0;
    variables.lvlNumber = 0;
    variables.keyNumber = 0;
    variables.ammo = maxAmmo;

    removeGameListener();

    const sideDiv: HTMLElement | null = document.getElementById("sideDiv");
    const gameArea: HTMLElement | null = document.getElementById("gameArea");
    if(sideDiv && gameArea){
        gameArea.removeChild(sideDiv);
    }
}

export function resetDiv(div: HTMLElement): void{
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

export function initFirstGame(div: HTMLElement): void{
    variables.lives = 2;
    addSideInfos(div);

    initGame(div);
}

export function addSideInfos(div: HTMLElement): void{
    if(gameArea){
        const sideDiv: HTMLDivElement = document.createElement("div");
        sideDiv.id = "sideDiv";

        const divLives: HTMLDivElement = document.createElement("div");
        divLives.classList.add("side-div");
        const imgLives: HTMLImageElement = document.createElement("img");
        imgLives.src = "./images/characterDown.png";
        imgLives.classList.add("icon");
        const pLives: HTMLParagraphElement = document.createElement("p");
        pLives.innerText = variables.lives.toString();
        pLives.id = "lives";
        pLives.classList.add("side-text");

        divLives.append(imgLives, pLives);

        const divAmmo: HTMLDivElement = document.createElement("div");
        divAmmo.classList.add("side-div");
        const imgAmmo: HTMLImageElement = document.createElement("img");
        imgAmmo.src = "./images/ammos.png";
        imgAmmo.classList.add("icon");
        const pAmmo: HTMLParagraphElement = document.createElement("p");
        pAmmo.innerText = variables.ammo.toString();
        pAmmo.id = "ammo";
        pAmmo.classList.add("side-text");

        divAmmo.append(imgAmmo, pAmmo);

        const btn: HTMLButtonElement = document.createElement("button");
        btn.innerText = "RESET";
        btn.classList.add("reset-btn");
        btn.id = "reset";
    
        sideDiv.classList.add("aside");
        sideDiv.append(divLives, divAmmo , btn);

        gameArea.appendChild(sideDiv);

        btn.addEventListener("click", resetLvl);
    }
    
}

export function addGameListener(): void{
    if(arrowUp && arrowLeft && arrowDown && arrowRight){
        const arrArrows: Array<HTMLElement> = [arrowUp, arrowDown, arrowRight, arrowLeft];
        arrArrows.forEach(function(arrow){
            arrow.addEventListener("click", arrowPressedEvent);
        })
    }
    if(btnShoot){
        btnShoot.addEventListener("click", shoot);
    }

    document.addEventListener("keydown", keydownEvent);

    const btnReset: HTMLElement | null = document.getElementById("reset");
    if(btnReset){
        btnReset.addEventListener("click", resetLvl);
    }
}

export function removeGameListener(): void{
    if(arrowUp && arrowLeft && arrowDown && arrowRight){
        const arrArrows: Array<HTMLElement> = [arrowUp, arrowDown, arrowRight, arrowLeft];
        arrArrows.forEach(function(arrow){
            arrow.removeEventListener("click", arrowPressedEvent);
        })
    }
    if(btnShoot){
        btnShoot.removeEventListener("click", shoot);
    }

    document.removeEventListener("keydown", keydownEvent);

    const btnReset: HTMLElement | null = document.getElementById("reset");
    if(btnReset){
        btnReset.removeEventListener("click", resetLvl);
    }
}

export function arrowPressedEvent(event: MouseEvent): void{
    if(gameScreen){
        if(event.target instanceof HTMLElement && event.target.parentElement){
            const arrowPressed: string = event.target.parentElement.id;
            movementListener(gameScreen, arrowPressed);
        }
    }
}

export function keydownEvent(event: KeyboardEvent): void{
    if(gameScreen){
        if(event.key === " "){
            event.preventDefault();
            shoot();
        }
        if(keys.indexOf(event.key) !== -1){
            event.preventDefault();
            movementListener(gameScreen, event.key);
        };
    }
}

export function initGame(div: HTMLElement): void{
    variables.keyNumber = 0;
    div.classList.add("game-screen-game");
    div.classList.remove("game-screen-accueil");
    variables.ammo = maxAmmo;
    variables.maxKeys = keysByLvl[variables.lvlNumber];

    drawAmmo();
    drawLives();

    initLvl(variables.lvlNumber);
    resetDiv(div);
    resetCharacter();

    initGrid(div);

    for(let i: number = 0; i < variables.curLvl.length; i++){
        for(let j: number = 0; j < variables.curLvl[i].length; j++){
            if(variables.curLvl[i][j] === 9){
                initMonster(i, j);
            }
        }
    }
    addGameListener();
}

export function initGrid(div: HTMLElement): void{
    for(let i: number = 0; i < 11; i++){
        for(let j: number = 0; j < 11; j++){
            const divGrid: HTMLDivElement = document.createElement("div");
            divGrid.classList.add("fit-element");
            divGrid.id = generateId(i, j);
            generateGridImage(divGrid, i, j);
            div.append(divGrid);
        }
    }
}