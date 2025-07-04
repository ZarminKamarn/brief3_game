import { levels, correspondance, instructions, arrows, instructionsImg, keys, keysByLvl } from "./data.js";

const gameArea: HTMLElement | null = document.getElementById("gameArea");
const gameScreen: HTMLElement | null = document.getElementById("gameScreen");
const letters: Array<string> = ["a","b","c","d","e","f","g","h","i","j","k"];

let curLvl: Array<Array<number>> = [];
let lvlNumber: number = 0;
const maxLvl: number = levels.length-1;
let lastMoveTime = 0;
const moveDelay = 100;

let keyNumber: number = 0;
let maxKeys: number = keysByLvl[lvlNumber];
let curInstruction = 0;

if(gameScreen){
    initTitleScreen(gameScreen as HTMLDivElement);
}

function howToPlay(div: HTMLDivElement){
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

function initTitleScreen(div: HTMLDivElement){
    div.classList.add("game-screen-accueil");
    div.classList.remove("game-screen-game");

    resetGame(div);

    const btnPlay: HTMLButtonElement = generateButton("Jouer");
    btnPlay.id = "playGame";
    const btnHow: HTMLButtonElement = generateButton("Comment jouer ?");
    btnHow.id = "howToPlay";
    const img: HTMLImageElement = document.createElement("img");

    img.src = "../images/character.png";
    img.classList.add("icon");

    div.append(btnPlay, img, btnHow);

    btnPlay.addEventListener("click", function(){
        initFirstGame(div);
    });

    btnHow.addEventListener("click", function(){
        howToPlay(div);
    });
}

function resetGame(div: HTMLDivElement){
    resetDiv(div);
    initLvl();
    curInstruction = 0;
    lvlNumber = 0;
    keyNumber = 0;

    document.removeEventListener("keydown", function(event){
        movementListener(div, event);
    })

    const resetBtn: HTMLElement | null = document.getElementById("reset");
    const gameArea: HTMLElement | null = document.getElementById("gameArea");
    if(resetBtn && gameArea){
        gameArea.removeChild(resetBtn);
    }
}

function resetDiv(div: HTMLDivElement){
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

function initFirstGame(div: HTMLDivElement){
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

    document.addEventListener("keydown", function(event){
        movementListener(div, event);
    })
}

function initGame(div: HTMLDivElement){
    keyNumber = 0
    div.classList.add("game-screen-game");
    div.classList.remove("game-screen-accueil");

    resetDiv(div);

    initGrid(div);
}

function initGrid(div: HTMLDivElement){
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

function generateGridImage(div: HTMLDivElement, i: number, j: number): void{
    resetDiv(div);
    const src: string = correspondance[curLvl[i][j]];
    if (src !== ""){
        const img: HTMLImageElement = document.createElement("img");
        img.src = src;
        img.classList.add("game-image");

        div.appendChild(img);
    }
}

function generateInstructionCard(div: HTMLDivElement, num: number): void{
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

function generateReturnButton(div: HTMLDivElement){
    const btn: HTMLButtonElement = document.createElement("button");
    btn.classList.add("return-btn");
    btn.id = "returnBtn";

    const p: HTMLParagraphElement = document.createElement("p");
    p.innerText = "X";

    btn.appendChild(p);
    div.appendChild(btn);
}

function generateCardImages(div: HTMLDivElement, num: number){
    if(instructionsImg[num].length !== 0){
        const divImg: HTMLDivElement = document.createElement("div");
        divImg.classList.add("card-images");

        instructionsImg[num].forEach(function(imgId){
            const img: HTMLImageElement = document.createElement("img");
            img.src = correspondance[imgId];
            img.classList.add("icon");
            divImg.appendChild(img);
        });
        div.appendChild(divImg);
    }
}

function generateCardButtons(div: HTMLDivElement, num: number){
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
    const img: HTMLImageElement = document.createElement("img");

    btn.classList.add("card-btn");
    img.src = arrows[num];
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

function generateTitleHowToPlay(div: HTMLDivElement){
    const title: HTMLParagraphElement = document.createElement("p");
    title.innerText = "Comment jouer ?";
    title.classList.add("glass-element", "instruction-title");

    div.appendChild(title);
}

function styleGlassElement(element: HTMLElement){
    element.classList.add("glass-element");
}

function movementListener(div: HTMLDivElement, event: KeyboardEvent){
    const now = Date.now();
    if (now - lastMoveTime < moveDelay) {
        return; // trop tôt, on ignore cette pression
    }

    if(keys.indexOf(event.key) !== -1){
        event.preventDefault();
        moveCharacter(div, event.key);
    };

    lastMoveTime = now;
}

function moveCharacter(div: HTMLDivElement, dir: string){
    let curX: number = -1, curY: number = -1;
    for(let i = 0; i < curLvl.length; i++){
        if(curLvl[i].indexOf(1) !== -1){
            curX = i;
            curY = curLvl[i].indexOf(1);
            break;
        }
    }

    const nextCoord: Array<number> = getCoordAfterMove(curX, curY, dir);

    if(canCharacterMove(nextCoord[0], nextCoord[1], dir)){
        const moveToCase = curLvl[nextCoord[0]][nextCoord[1]];

        if(moveToCase === 4){
            moveElement(nextCoord[0], nextCoord[1], dir);
        }

        moveElement(curX, curY, dir);

        if(moveToCase === 5){
            keyNumber++;
            generateExit();
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

    generateGridImage(<HTMLDivElement>document.getElementById(generateId(coordX, coordY)), coordX, coordY);
    generateGridImage(<HTMLDivElement>document.getElementById(generateId(nextCoord[0], nextCoord[1])), nextCoord[0], nextCoord[1]);
}

function canCharacterMove(posX: number, posY: number, dir: string): boolean{
    if(posX >= 0 && posY >= 0 && posX < curLvl.length && posY < curLvl[posX].length){
        if(curLvl[posX][posY] === 4){
            const newCoord: Array<number> = getCoordAfterMove(posX, posY, dir);
            if(!canBlocMove(newCoord[0], newCoord[1], dir)){
                return false;
            }
        }
        if (curLvl[posX][posY] !== 2 && curLvl[posX][posY] !== 3){
            return true;
        }
    }
    return false;
}

function canBlocMove(posX: number, posY: number, dir: string): boolean{
    if(posX >= 0 && posY >= 0 && posX < curLvl.length && posY < curLvl[posX].length){
        if (curLvl[posX][posY] !== 2 && curLvl[posX][posY] !== 3 && curLvl[posX][posY] !== 4){
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

function drawEndGameScreen(div: HTMLDivElement){
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

function drawEndLvlScreen(div: HTMLDivElement){
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

function resetLvl(div: HTMLDivElement, lvl: number=0){
    resetDiv(div);
    initLvl(lvl);
    initGrid(div);
    keyNumber = 0;
}