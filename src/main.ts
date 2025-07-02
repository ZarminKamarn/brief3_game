import { lvl1, correspondance, instructions, arrows, instructionsImg, keys } from "./matrix.js";

const gameArea: HTMLElement | null = document.getElementById("gameArea");
const letters: Array<string> = ["a","b","c","d","e","f","g","h","i","j","k"];

let curLvl: Array<Array<number>> = [];
let lvlNumber: number = 0;
const maxLvl: number = 0;
let lastMoveTime = 0;
const moveDelay = 100;

let keyNumber: number = 0;
let curInstruction = 0;

if(gameArea){
    const gameScreen: HTMLDivElement = document.createElement("div");
    gameScreen.style.backgroundImage = "url(../images/gameBackground.png)";
    gameScreen.style.backgroundRepeat = "no-repeat";
    gameScreen.style.backgroundSize = "cover";
    gameScreen.style.width = "500px";
    gameScreen.style.height = "500px";
    gameScreen.style.padding = "38px";
    gameScreen.style.boxSizing = "border-box";
    gameScreen.style.display = "flex";

    initTitleScreen(gameScreen);
    gameArea.appendChild(gameScreen);
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
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.justifyContent = "space-evenly";
    div.style.alignItems = "center";

    resetGame(div);

    const btnPlay: HTMLButtonElement = generateButton("Jouer");
    btnPlay.id = "playGame";
    const btnHow: HTMLButtonElement = generateButton("Comment jouer ?");
    btnHow.id = "howToPlay";
    const img: HTMLImageElement = document.createElement("img");

    img.src = "../images/character.png";
    img.style.width = "35px";

    div.append(btnPlay, img, btnHow);

    btnPlay.addEventListener("click", function(){
        initGame(div);
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
}

function resetDiv(div: HTMLDivElement){
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

function initGame(div: HTMLDivElement){
    div.style.display = "grid";
    div.style.gridTemplateColumns = "repeat(11, 1fr)";
    div.style.gridTemplateRows= "repeat(11, 1fr)";

    resetDiv(div);

    initGrid(div);

    document.addEventListener("keydown", function(event){
        movementListener(div, event);
    })

}

function initGrid(div: HTMLDivElement){
    for(let i: number = 0; i < 11; i++){
        for(let j: number = 0; j < 11; j++){
            const divGrid: HTMLDivElement = document.createElement("div");
            divGrid.id = generateId(i, j);
            divGrid.style.height = "100%";
            divGrid.style.width = "100%";
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
        img.style.height = "90%";
        img.style.width = "auto";

        div.appendChild(img);
    }
}

function generateInstructionCard(div: HTMLDivElement, num: number): void{
    const card: HTMLParagraphElement = document.createElement("div");
    styleGlassElement(card);
    card.style.width = "90%";
    card.style.padding = "24px";
    card.style.height = "60%";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.justifyContent = "space-evenly";

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
    btn.style.backgroundColor = "white";
    btn.style.width = "30px";
    btn.style.height = "30px";
    btn.style.position = "absolute";
    btn.style.top = "0px";
    btn.style.right = "0px";
    btn.style.margin = "0";
    btn.style.color = "black";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.id = "returnBtn";

    const p: HTMLParagraphElement = document.createElement("p");
    p.innerText = "X";

    btn.appendChild(p);
    div.appendChild(btn);
}

function generateCardImages(div: HTMLDivElement, num: number){
    if(instructionsImg[num].length !== 0){
        const divImg: HTMLDivElement = document.createElement("div");
        divImg.style.display = "flex"
        divImg.style.gap = "20px";
        divImg.style.justifyContent = "center";

        instructionsImg[num].forEach(function(imgId){
            const img: HTMLImageElement = document.createElement("img");
            img.src = correspondance[imgId];
            img.style.width = "35px";
            divImg.appendChild(img);
        });
        div.appendChild(divImg);
    }
}

function generateCardButtons(div: HTMLDivElement, num: number){
    const divBtn: HTMLDivElement = document.createElement("div");
    divBtn.style.display = "flex";
    divBtn.style.justifyContent = "space-between";
    divBtn.style.width = "100%";
    if (num > 0){
        const btnBack: HTMLButtonElement = document.createElement("button");
        btnBack.id = "previous";
        const imgBack: HTMLImageElement = document.createElement("img");
        imgBack.src = arrows[0];
        imgBack.style.width = "50px";
        btnBack.appendChild(imgBack);
        divBtn.appendChild(btnBack);
    }
    else{
        divBtn.style.justifyContent = "flex-end";
    }
    if (num < instructions.length - 1){
        const btnForward: HTMLButtonElement = document.createElement("button");
        btnForward.id = "next";   
        const imgForward: HTMLImageElement = document.createElement("img");
        imgForward.src = arrows[1];
        imgForward.style.width = "50px";
        btnForward.appendChild(imgForward);
        divBtn.appendChild(btnForward);
    }
    div.appendChild(divBtn);
}

function generateButton(text: string): HTMLButtonElement{
    const btn: HTMLButtonElement = document.createElement("button");
    btn.innerText = text;
    styleGlassElement(btn);
    btn.style.borderRadius = "20px";
    btn.style.padding = "12px 48px";
    return btn;
}

function generateTitleHowToPlay(div: HTMLDivElement){
    const title: HTMLParagraphElement = document.createElement("p");
    title.innerText = "Comment jouer ?";
    styleGlassElement(title);
    title.style.padding = "12px 48px";

    div.appendChild(title);
}

function styleGlassElement(element: HTMLElement){
    element.style.border = "3px solid white";
    element.style.backgroundColor = "rgba(78, 38, 38, 0.25)";
    element.style.backdropFilter = "blur(2px)";
    element.style.boxSizing = "border-box";
    element.style.color = "white";
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
    let nextX: number = curX, nextY: number = curY;
    switch(dir){
    case "ArrowRight":
        nextY = curY + 1;
        break;
    case "ArrowLeft":
        nextY = curY - 1;
        break;
    case "ArrowUp":
        nextX = curX - 1;
        break;
    case "ArrowDown":
        nextX = curX + 1;
        break;
    }

    console.log(keyNumber);

    if(canMove(nextX, nextY)){
        const moveToCase = curLvl[nextX][nextY];

        curLvl[curX][curY] = 0;
        curLvl[nextX][nextY] = 1;

        generateGridImage(<HTMLDivElement>document.getElementById(generateId(curX, curY)), curX, curY);
        generateGridImage(<HTMLDivElement>document.getElementById(generateId(nextX, nextY)), nextX, nextY);

        if(moveToCase === 5){
            keyNumber++;
            generateExit();
        }

        if(isLevelOver(moveToCase) && lvlNumber === maxLvl){
            drawEndScreen(div);
        }
    }
}



function canMove(posX: number, posY: number): boolean{
    if(posX >= 0 && posY >= 0 && posX < curLvl.length && posY < curLvl[posX].length){
        if (curLvl[posX][posY] !== 2 && curLvl[posX][posY] !== 3){
            return true;
        }
    }
    return false;
}

function isLevelOver(caseValue: number): boolean{
    if(caseValue === 9 && keyNumber === 1){
        return true;
    }
    return false;
}

function drawEndScreen(div: HTMLDivElement){
    const divEndScreen: HTMLDivElement = document.createElement("div");
    divEndScreen.style.width = "100%";
    divEndScreen.style.height = "100%";
    divEndScreen.style.position = "absolute";
    divEndScreen.style.top = "0px";
    divEndScreen.style.left = "0px";
    divEndScreen.style.display = "flex";
    divEndScreen.style.flexDirection = "column";
    divEndScreen.style.justifyContent = "space-evenly";
    divEndScreen.style.alignItems = "center";

    div.style.position = "relative";

    const divText: HTMLDivElement = document.createElement("div");
    styleGlassElement(divText);
    divText.style.padding = "24px";
    divText.style.height = "40%";
    divText.style.display = "flex";
    divText.style.justifyContent = "center";
    divText.style.alignItems = "center";
    divText.style.textAlign = "center";
    divText.style.backgroundColor = "rgba(78, 38, 38, 0.9)";

    const p: HTMLParagraphElement = document.createElement("p");
    p.innerHTML = "Félicitations, vous avez fini le jeu!";
    divText.appendChild(p);

    const btn: HTMLButtonElement = document.createElement("button");
    styleGlassElement(btn);
    btn.innerText = "Retour à l'accueil";
    btn.style.borderRadius = "20px";
    btn.style.padding = "12px 48px";
    btn.id = "returnBtn";

    divEndScreen.append(divText, btn);
    div.appendChild(divEndScreen);

    btn.addEventListener("click", function(){
        initTitleScreen(div);
    })
}

function initLvl(lvl?: number){
    if(lvl){
        copyLvl();
    }
    else{
        copyLvl();
    }
}

function copyLvl(lvl?: number){
    curLvl = [];
    let arr = [];
    for(let i = 0; i < lvl1.length; i++){
        arr = [];
        for(let j = 0; j < lvl1[i].length; j++){
            arr.push(lvl1[i][j]);
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