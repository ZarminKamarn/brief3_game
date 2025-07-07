import { levels, correspondance, instructions, arrows, instructionsImg, keys, keysByLvl, letters, maxLvl, gameArea, gameScreen, characterOrientation, shootOrientation } from "./data.js";

let curLvl: Array<Array<number>> = [];
let lvlNumber: number = 0;
let lastMoveTime = 0;

let keyNumber: number = 0;
let maxKeys: number = keysByLvl[lvlNumber];
let curInstruction = 0;
let curMovement = 3;

let ammo = 2;
let shotAmmo = false;

const arrowUp: HTMLElement | null = document.getElementById("ArrowUp");
const arrowLeft: HTMLElement | null = document.getElementById("ArrowLeft");
const arrowDown: HTMLElement | null = document.getElementById("ArrowDown");
const arrowRight: HTMLElement | null = document.getElementById("ArrowRight");

const btnShoot: HTMLElement | null = document.getElementById("shoot");

if(gameScreen){
    initTitleScreen(gameScreen);
}

function howToPlay(div: HTMLElement){
    resetDiv(div);
    generateTitleHowToPlay(div);
    generateInstructionCard(div, curInstruction);

    const btnBack: HTMLElement | null = document.getElementById("previous");
    if(btnBack){
        btnBack.addEventListener("click", function(){
            curInstruction--;
            howToPlay(div);
        })
    }

    const btnNext: HTMLElement | null = document.getElementById("next");
    if(btnNext){
        btnNext.addEventListener("click", function(){
            curInstruction++;
            howToPlay(div);
        })
    }

    const btnReturn = document.getElementById("returnBtn");
    if(btnReturn){
        btnReturn.addEventListener("click", function(){
            initTitleScreen(div);
        });
    }
}

function initTitleScreen(div: HTMLElement){
    div.classList.add("game-screen-accueil");
    div.classList.remove("game-screen-game");

    resetCharacter();
    resetGame(div);

    const btnPlay: HTMLButtonElement = generateButton("Jouer");
    btnPlay.id = "playGame";
    const btnHow: HTMLButtonElement = generateButton("Comment jouer ?");
    btnHow.id = "howToPlay";
    
    const img: HTMLImageElement = generateImage(correspondance[1]);
    img.classList.add("icon");

    div.append(btnPlay, img, btnHow);

    btnPlay.addEventListener("click", function(){
        initFirstGame(div);
    });

    btnHow.addEventListener("click", function(){
        howToPlay(div);
    });
}

function resetGame(div: HTMLElement){
    resetDiv(div);
    initLvl();
    curInstruction = 0;
    lvlNumber = 0;
    keyNumber = 0;
    ammo = 2;

    document.removeEventListener("keydown", function(event){
        movementListener(div, event.key);
    })

    if(arrowUp && arrowLeft && arrowDown && arrowRight){
        const arrArrows: Array<HTMLElement> = [arrowUp, arrowDown, arrowRight, arrowLeft];
        arrArrows.forEach(function(arrow){
            arrow.removeEventListener("click", function(){
                movementListener(div, arrow.id);
            });
        })
    }

    const resetBtn: HTMLElement | null = document.getElementById("reset");
    const gameArea: HTMLElement | null = document.getElementById("gameArea");
    if(resetBtn && gameArea){
        gameArea.removeChild(resetBtn);
    }
}

function resetDiv(div: HTMLElement){
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

function initFirstGame(div: HTMLElement){
    if(gameArea){
        const btn: HTMLButtonElement = document.createElement("button");
        btn.innerText = "RESET";
        btn.classList.add("reset-btn");
        btn.id = "reset";
        gameArea.appendChild(btn);

        btn.addEventListener("click", function(){
            resetLvl(div, lvlNumber);
        })
    }

    initGame(div);

    if(arrowUp && arrowLeft && arrowDown && arrowRight){
        const arrArrows: Array<HTMLElement> = [arrowUp, arrowDown, arrowRight, arrowLeft];
        arrArrows.forEach(function(arrow){
            arrow.addEventListener("click", function(){
                movementListener(div, arrow.id);
            });
        })
    }
    if(btnShoot){
        btnShoot.addEventListener("click", function(){
            shoot();
        })
    }

    document.addEventListener("keydown", function(event){
        if(event.key === " "){
            shoot();
        }
        if(keys.indexOf(event.key) !== -1){
            event.preventDefault();
            movementListener(div, event.key);
        };
    });
}

function initGame(div: HTMLElement){
    keyNumber = 0
    div.classList.add("game-screen-game");
    div.classList.remove("game-screen-accueil");
    ammo = 2;

    resetDiv(div);
    resetCharacter();

    initGrid(div);
}

function initGrid(div: HTMLElement){
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

function generateId(x: number, y: number): string{
    let id;
    if (y < 10){
        id = `${letters[x]}0${y}`;
    }
    else{
        id =`${letters[x]}${y}`;
    }

    return id;
}

function generateGridImage(div: HTMLElement, i: number, j: number): void{
    resetDiv(div);
    const src: string = correspondance[curLvl[i][j]];
    if (src !== ""){
        const img: HTMLImageElement = generateImage(src);
        img.classList.add("game-image");

        div.appendChild(img);
    }
}

function generateInstructionCard(div: HTMLElement, num: number): void{
    const card: HTMLParagraphElement = document.createElement("div");
    card.classList.add("glass-element", "card");
    
    generateCardImages(card, num);
    generateReturnButton(card);

    const p: HTMLParagraphElement = document.createElement("p");
    p.innerText = instructions[num];
    p.style.textAlign = "center";
    card.appendChild(p);

    generateCardButtons(card, num);
    div.appendChild(card);
}

function generateReturnButton(div: HTMLElement){
    const btn: HTMLButtonElement = document.createElement("button");
    btn.classList.add("return-btn");
    btn.id = "returnBtn";

    const p: HTMLParagraphElement = document.createElement("p");
    p.innerText = "X";

    btn.appendChild(p);
    div.appendChild(btn);
}

function generateCardImages(div: HTMLElement, num: number){
    if(instructionsImg[num].length !== 0){
        const divImg: HTMLDivElement = document.createElement("div");
        divImg.classList.add("card-images");

        instructionsImg[num].forEach(function(imgId){
            const img: HTMLImageElement = generateImage(correspondance[imgId]);
            img.classList.add("icon");
            divImg.appendChild(img);
        });
        div.appendChild(divImg);
    }
}

function generateCardButtons(div: HTMLElement, num: number){
    const divBtn: HTMLDivElement = document.createElement("div");
    divBtn.classList.add("card-btns");

    if (num > 0){
        const btnBack: HTMLButtonElement = generateButtonArrow(0);
        btnBack.id = "previous";
        divBtn.appendChild(btnBack);
    }
    else{
        divBtn.style.justifyContent = "flex-end";
    }
    if (num < instructions.length - 1){
        const btnForward: HTMLButtonElement = generateButtonArrow(1);
        btnForward.id = "next";   
        
        divBtn.appendChild(btnForward);
    }
    div.appendChild(divBtn);
}

function generateButtonArrow(num: number): HTMLButtonElement{
    const btn: HTMLButtonElement = document.createElement("button");
    const img: HTMLImageElement = generateImage(arrows[num]);

    btn.classList.add("card-btn");
    img.classList.add("fit-element");
    btn.appendChild(img);

    return btn;
}

function generateButton(text: string): HTMLButtonElement{
    const btn: HTMLButtonElement = document.createElement("button");
    btn.innerText = text;
    btn.classList.add("glass-element", "btn");
    return btn;
}

function generateTitleHowToPlay(div: HTMLElement){
    const title: HTMLParagraphElement = document.createElement("p");
    title.innerText = "Comment jouer ?";
    title.classList.add("glass-element", "instruction-title");

    div.appendChild(title);
}

function movementListener(div: HTMLElement, key: string){
    const now = Date.now();
    if (now - lastMoveTime < 100) {
        return; // trop tôt, on ignore cette pression
    }

    if(curMovement === keys.indexOf(key)){
        moveCharacter(div, key);
    }
    else{
        turnCharacter(div, key);
        return;
    }

    lastMoveTime = now;
}

function turnCharacter(div: HTMLElement, dir: string){
    const curCoord: Array<number> = getCurrentCoord();
    const curTile: HTMLElement | null =  document.getElementById(generateId(curCoord[0], curCoord[1]));

    if(curTile){
        switch(dir){
        case "ArrowRight":
            curMovement = 0;
            break;
        case "ArrowLeft":
            curMovement = 1;
            break;
        case "ArrowUp":
            curMovement = 2;
            break;
        case "ArrowDown":
            curMovement = 3;
            break;
        }
        correspondance[1] = characterOrientation[curMovement];
        generateGridImage(curTile, curCoord[0], curCoord[1]);
    }
}

function moveCharacter(div: HTMLElement, dir: string){
    const curCoord: Array<number> = getCurrentCoord();

    const nextCoord: Array<number> = getCoordAfterMove(curCoord[0], curCoord[1], dir);

    if(canCharacterMove(nextCoord[0], nextCoord[1], dir)){
        const moveToCase = curLvl[nextCoord[0]][nextCoord[1]];

        if(moveToCase === 4 || moveToCase === 7){
            moveElement(nextCoord[0], nextCoord[1], dir);
        }

        moveElement(curCoord[0], curCoord[1], dir);

        if(moveToCase === 5){
            keyNumber++;
            if(keyNumber === maxKeys){
                generateExit();
            }
        }

        if(isLevelOver(moveToCase)){
            if(lvlNumber === maxLvl){
                drawEndGameScreen(div);
            }
            else{
                lvlNumber++;
                maxKeys = keysByLvl[lvlNumber];
                drawEndLvlScreen(div);
            }
        }
    }
}

function getCurrentCoord(){
    let curX: number = -1, curY: number = -1;
    for(let i = 0; i < curLvl.length; i++){
        if(curLvl[i].indexOf(1) !== -1){
            curX = i;
            curY = curLvl[i].indexOf(1);
            break;
        }
    }

    return [curX, curY];
}

function getCoordAfterMove(posX: number, posY: number, dir: string): Array<number>{
    let nextX: number = posX, nextY: number = posY;
    switch(dir){
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

function moveElement(coordX: number,coordY: number, dir: string){
    const nextCoord: Array<number> = getCoordAfterMove(coordX, coordY, dir);
    curLvl[nextCoord[0]][nextCoord[1]] = curLvl[coordX][coordY];
    curLvl[coordX][coordY] = 0;

    const curTile: HTMLElement | null =  document.getElementById(generateId(coordX, coordY));
    const nextTile: HTMLElement | null =  document.getElementById(generateId(nextCoord[0], nextCoord[1]));

    if(curTile && nextTile){
        generateGridImage(curTile, coordX, coordY);
        generateGridImage(nextTile, nextCoord[0], nextCoord[1]);
    }
}

function canCharacterMove(posX: number, posY: number, dir: string): boolean{
    if(posX >= 0 && posY >= 0 && posX < curLvl.length && posY < curLvl[posX].length){
        if(curLvl[posX][posY] === 4 || curLvl[posX][posY] === 7){
            const newCoord: Array<number> = getCoordAfterMove(posX, posY, dir);
            if(!canBlocMove(newCoord[0], newCoord[1], dir)){
                return false;
            }
            else{
                return true;
            }
        }
        if (curLvl[posX][posY] === 0 || curLvl[posX][posY] === 9 || curLvl[posX][posY] === 5){
            return true;
        }
    }
    return false;
}

function canBlocMove(posX: number, posY: number, dir: string): boolean{
    if(posX >= 0 && posY >= 0 && posX < curLvl.length && posY < curLvl[posX].length){
        if (curLvl[posX][posY] === 0 || curLvl[posX][posY] === 9){
            return true;
        }
    }
    return false;
}

function isLevelOver(caseValue: number): boolean{
    if(caseValue === 9 && keyNumber === maxKeys){
        return true;
    }
    return false;
}

function drawEndGameScreen(div: HTMLElement){
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

function drawEndLvlScreen(div: HTMLElement){
    const divEndScreen: HTMLDivElement = document.createElement("div");
    divEndScreen.classList.add("end-lvl-area");

    div.style.position = "relative";

    const divText: HTMLDivElement = document.createElement("div");
    divText.classList.add("glass-element");
    divText.classList.add("end-lvl");

    const p: HTMLParagraphElement = document.createElement("p");
    p.innerHTML = `Vous avez fini le niveau ${lvlNumber}!`;
    divText.appendChild(p);

    const btn: HTMLButtonElement = generateButton("Niveau suivant");
    btn.id = "returnBtn";

    divEndScreen.append(divText, btn);
    div.appendChild(divEndScreen);

    btn.addEventListener("click", function(){
        initLvl(lvlNumber);
        initGame(div);
    })
}

function initLvl(lvl: number=0){
    curLvl = [];
    let arr = [];
    for(let i = 0; i < levels[lvl].length; i++){
        arr = [];
        for(let j = 0; j < levels[lvl][i].length; j++){
            arr.push(levels[lvl][i][j]);
        }
        curLvl.push(arr);
    }
}

function generateExit(){
    if(curLvl[0][4] === 0){
        curLvl[0][4] = 9;
    }
    else{
        alert("Exit blocked. Impossible to leave");
    }
}

function resetLvl(div: HTMLElement, lvl: number=0){
    resetDiv(div);
    initLvl(lvl);
    initGrid(div);
    ammo = 2;
    keyNumber = 0;
    resetCharacter();
}

function resetCharacter(){
    const curCoord: Array<number> = getCurrentCoord();
    const curTile: HTMLElement | null =  document.getElementById(generateId(curCoord[0], curCoord[1]));

    correspondance[1] = "../images/characterDown.png";
    curMovement = 3;
    if(curTile){
        generateGridImage(curTile, curCoord[0], curCoord[1]);
    }
}

function generateImage(src: string): HTMLImageElement{
    const img: HTMLImageElement = document.createElement("img");
    img.src = src;
    return img;
}

function shoot(){
    if(!shotAmmo && ammo > 0){
        shotAmmo = true;
        ammo--;
        console.log(ammo);
        
        const dir: string = keys[curMovement];
        const curCoord: Array<number> = getCurrentCoord();
        const coordShoot: Array<number> = getCoordAfterMove(curCoord[0], curCoord[1], dir);

        if(canBlocMove(coordShoot[0], coordShoot[1], dir)){            
            const shootTile: HTMLElement | null =  document.getElementById(generateId(coordShoot[0], coordShoot[1]));

            if(shootTile){
                correspondance[8] = shootOrientation[curMovement];
                curLvl[coordShoot[0]][coordShoot[1]] = 8;
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

async function drawShootMovement(posX: number, posY: number, dir: string){
    await sleep(50);
    let nextCoord: Array<number> = getCoordAfterMove(posX, posY, dir);
    while(canBlocMove(nextCoord[0], nextCoord[1], dir)){
        moveElement(posX, posY, dir);
        posX = nextCoord[0];
        posY = nextCoord[1];
        nextCoord = getCoordAfterMove(posX, posY, dir);
        await sleep(50);
    }

    killEnemyIfPossible(nextCoord[0], nextCoord[1]);

    curLvl[posX][posY] = 0;
    const shootTile: HTMLElement | null =  document.getElementById(generateId(posX, posY));
    if(shootTile){
        generateGridImage(shootTile, posX, posY);
    }
    shotAmmo = false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shootSnake(posX: number, posY: number){
    curLvl[posX][posY] = 7;
    const snakeTile: HTMLElement | null =  document.getElementById(generateId(posX, posY));
    if(snakeTile){
        generateGridImage(snakeTile, posX, posY);
    }
}

function shootBall(posX: number, posY: number){
    curLvl[posX][posY] = 0;
    const ballTile: HTMLElement | null =  document.getElementById(generateId(posX, posY));
    if(ballTile){
        generateGridImage(ballTile, posX, posY);
    }
}

function killEnemyIfPossible(posX: number, posY: number){
    if(posX >= 0 && posY >= 0 && posX < curLvl.length-1 && posY < curLvl[posX].length-1){
        if(curLvl[posX][posY] === 7){
            shootBall(posX, posY);
        }
        else if(curLvl[posX][posY] === 6){
            shootSnake(posX, posY);
        }
    }
}