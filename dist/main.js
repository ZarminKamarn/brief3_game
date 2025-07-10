var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { levels, correspondance, instructions, arrows, instructionsImg, keys, keysByLvl, letters, maxLvl, gameArea, gameScreen, characterOrientation, shootOrientation, monsterOrientation, sleepingMonsterOrientation, totemArrowOrientation } from "./data.js";
let curLvl = [];
let lvlNumber = 0;
let lastMoveTime = 0;
let keyNumber = 0;
let maxKeys = keysByLvl[lvlNumber];
let curInstruction = 0;
let curMovement = 3;
let curMonsterMovement = 3;
let totemShootDirection = -1;
let lives = 2;
let maxAmmo = 2;
let ammo = maxAmmo;
let shotAmmo = false;
const arrowUp = document.getElementById("ArrowUp");
const arrowLeft = document.getElementById("ArrowLeft");
const arrowDown = document.getElementById("ArrowDown");
const arrowRight = document.getElementById("ArrowRight");
const btnShoot = document.getElementById("shoot");
if (gameScreen) {
    initTitleScreen(gameScreen);
}
function howToPlay(div) {
    resetDiv(div);
    generateTitleHowToPlay(div);
    generateInstructionCard(div, curInstruction);
    const btnBack = document.getElementById("previous");
    if (btnBack) {
        btnBack.addEventListener("click", function () {
            curInstruction--;
            howToPlay(div);
        });
    }
    const btnNext = document.getElementById("next");
    if (btnNext) {
        btnNext.addEventListener("click", function () {
            curInstruction++;
            howToPlay(div);
        });
    }
    const btnReturn = document.getElementById("returnBtn");
    if (btnReturn) {
        btnReturn.addEventListener("click", function () {
            initTitleScreen(div);
        });
    }
}
function initTitleScreen(div) {
    div.classList.add("game-screen-accueil");
    div.classList.remove("game-screen-game");
    resetCharacter();
    resetGame(div);
    const btnPlay = generateButton("Jouer");
    btnPlay.id = "playGame";
    const btnHow = generateButton("Comment jouer ?");
    btnHow.id = "howToPlay";
    const img = generateImage(correspondance[1]);
    img.classList.add("icon");
    div.append(btnPlay, img, btnHow);
    btnPlay.addEventListener("click", function () {
        initFirstGame(div);
    });
    btnHow.addEventListener("click", function () {
        howToPlay(div);
    });
}
function resetGame(div) {
    resetDiv(div);
    initLvl();
    curInstruction = 0;
    lvlNumber = 0;
    keyNumber = 0;
    ammo = maxAmmo;
    removeGameListener(div);
    const sideDiv = document.getElementById("sideDiv");
    const gameArea = document.getElementById("gameArea");
    if (sideDiv && gameArea) {
        gameArea.removeChild(sideDiv);
    }
}
function resetDiv(div) {
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}
function initFirstGame(div) {
    lives = 2;
    addSideInfos(div);
    initGame(div);
    addGameListener(div);
}
function addSideInfos(div) {
    if (gameArea) {
        const sideDiv = document.createElement("div");
        sideDiv.id = "sideDiv";
        const divLives = document.createElement("div");
        divLives.classList.add("side-div");
        const imgLives = document.createElement("img");
        imgLives.src = "./images/characterDown.png";
        imgLives.classList.add("icon");
        const pLives = document.createElement("p");
        pLives.innerText = lives.toString();
        pLives.id = "lives";
        pLives.classList.add("side-text");
        divLives.append(imgLives, pLives);
        const divAmmo = document.createElement("div");
        divAmmo.classList.add("side-div");
        const imgAmmo = document.createElement("img");
        imgAmmo.src = "./images/ammos.png";
        imgAmmo.classList.add("icon");
        const pAmmo = document.createElement("p");
        pAmmo.innerText = ammo.toString();
        pAmmo.id = "ammo";
        pAmmo.classList.add("side-text");
        divAmmo.append(imgAmmo, pAmmo);
        const btn = document.createElement("button");
        btn.innerText = "RESET";
        btn.classList.add("reset-btn");
        btn.id = "reset";
        sideDiv.classList.add("aside");
        sideDiv.append(divLives, divAmmo, btn);
        gameArea.appendChild(sideDiv);
        btn.addEventListener("click", function () {
            resetLvl(div, lvlNumber);
        });
    }
}
function addGameListener(div) {
    if (arrowUp && arrowLeft && arrowDown && arrowRight) {
        const arrArrows = [arrowUp, arrowDown, arrowRight, arrowLeft];
        arrArrows.forEach(function (arrow) {
            arrow.addEventListener("click", function () {
                movementListener(div, arrow.id);
            });
        });
    }
    if (btnShoot) {
        btnShoot.addEventListener("click", shoot);
    }
    document.addEventListener("keydown", keydownEvent);
}
function removeGameListener(div) {
    if (arrowUp && arrowLeft && arrowDown && arrowRight) {
        const arrArrows = [arrowUp, arrowDown, arrowRight, arrowLeft];
        arrArrows.forEach(function (arrow) {
            arrow.removeEventListener("click", function () {
                movementListener(div, arrow.id);
            });
        });
    }
    if (btnShoot) {
        btnShoot.removeEventListener("click", shoot);
    }
    document.removeEventListener("keydown", keydownEvent);
}
function keydownEvent(event) {
    if (gameScreen) {
        if (event.key === " ") {
            shoot();
        }
        if (keys.indexOf(event.key) !== -1) {
            event.preventDefault();
            movementListener(gameScreen, event.key);
        }
        ;
    }
}
function initGame(div) {
    keyNumber = 0;
    div.classList.add("game-screen-game");
    div.classList.remove("game-screen-accueil");
    ammo = maxAmmo;
    maxKeys = keysByLvl[lvlNumber];
    setAmmo();
    setLives();
    initLvl(lvlNumber);
    resetDiv(div);
    resetCharacter();
    initGrid(div);
    for (let i = 0; i < curLvl.length; i++) {
        for (let j = 0; j < curLvl[i].length; j++) {
            if (curLvl[i][j] === 9) {
                initMonster(i, j);
            }
        }
    }
}
function initGrid(div) {
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 11; j++) {
            const divGrid = document.createElement("div");
            divGrid.classList.add("fit-element");
            divGrid.id = generateId(i, j);
            generateGridImage(divGrid, i, j);
            div.append(divGrid);
        }
    }
}
function generateId(x, y) {
    let id;
    if (y < 10) {
        id = `${letters[x]}0${y}`;
    }
    else {
        id = `${letters[x]}${y}`;
    }
    return id;
}
function generateGridImage(div, i, j) {
    resetDiv(div);
    const src = correspondance[curLvl[i][j]];
    if (src !== "") {
        const img = generateImage(src);
        img.classList.add("game-image");
        div.appendChild(img);
    }
}
function generateInstructionCard(div, num) {
    const card = document.createElement("div");
    card.classList.add("glass-element", "card");
    generateCardImages(card, num);
    generateReturnButton(card);
    const p = document.createElement("p");
    p.innerText = instructions[num];
    p.style.textAlign = "center";
    card.appendChild(p);
    generateCardButtons(card, num);
    div.appendChild(card);
}
function generateReturnButton(div) {
    const btn = document.createElement("button");
    btn.classList.add("return-btn");
    btn.id = "returnBtn";
    const p = document.createElement("p");
    p.innerText = "X";
    btn.appendChild(p);
    div.appendChild(btn);
}
function generateCardImages(div, num) {
    if (instructionsImg[num].length !== 0) {
        const divImg = document.createElement("div");
        divImg.classList.add("card-images");
        instructionsImg[num].forEach(function (imgId) {
            const img = generateImage(correspondance[imgId]);
            img.classList.add("icon");
            divImg.appendChild(img);
        });
        div.appendChild(divImg);
    }
}
function generateCardButtons(div, num) {
    const divBtn = document.createElement("div");
    divBtn.classList.add("card-btns");
    if (num > 0) {
        const btnBack = generateButtonArrow(0);
        btnBack.id = "previous";
        divBtn.appendChild(btnBack);
    }
    else {
        divBtn.style.justifyContent = "flex-end";
    }
    if (num < instructions.length - 1) {
        const btnForward = generateButtonArrow(1);
        btnForward.id = "next";
        divBtn.appendChild(btnForward);
    }
    div.appendChild(divBtn);
}
function generateButtonArrow(num) {
    const btn = document.createElement("button");
    const img = generateImage(arrows[num]);
    btn.classList.add("card-btn");
    img.classList.add("fit-element");
    btn.appendChild(img);
    return btn;
}
function generateButton(text) {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.classList.add("glass-element", "btn");
    return btn;
}
function generateTitleHowToPlay(div) {
    const title = document.createElement("p");
    title.innerText = "Comment jouer ?";
    title.classList.add("glass-element", "instruction-title");
    div.appendChild(title);
}
function movementListener(div, key) {
    const now = Date.now();
    if (now - lastMoveTime < 100) {
        return; // trop tôt, on ignore cette pression
    }
    if (curMovement === keys.indexOf(key)) {
        moveCharacter(div, key);
    }
    else {
        turnCharacter(key);
        return;
    }
    lastMoveTime = now;
}
function turnCharacter(dir) {
    const curCoord = getCurrentCoord();
    const curTile = document.getElementById(generateId(curCoord[0], curCoord[1]));
    if (curTile) {
        switch (dir) {
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
function moveCharacter(div, dir) {
    const curCoord = getCurrentCoord();
    const nextCoord = getCoordAfterMove(curCoord[0], curCoord[1], dir);
    if (canCharacterMove(nextCoord[0], nextCoord[1], dir)) {
        const moveToCase = curLvl[nextCoord[0]][nextCoord[1]];
        if (moveToCase === 4 || moveToCase === 7) {
            moveElement(nextCoord[0], nextCoord[1], dir);
        }
        moveElement(curCoord[0], curCoord[1], dir);
        isSeenByTotem(div, nextCoord[0], nextCoord[1]);
        if (moveToCase === 5) {
            keyNumber++;
        }
        if (isLevelOver(nextCoord[0], nextCoord[1])) {
            if (lvlNumber === maxLvl) {
                drawEndGameScreen(div);
            }
            else {
                lvlNumber++;
                drawEndLvlScreen(div);
            }
        }
    }
    else if (nextCoord[0] >= 0 && nextCoord[1] >= 0 && nextCoord[0] < curLvl.length && nextCoord[1] < curLvl[nextCoord[0]].length) {
        if (curLvl[nextCoord[0]][nextCoord[1]] === 9) {
            freezeMonster(nextCoord[0], nextCoord[1]);
        }
    }
}
function getCurrentCoord() {
    let curX = -1, curY = -1;
    for (let i = 0; i < curLvl.length; i++) {
        if (curLvl[i].indexOf(1) !== -1) {
            curX = i;
            curY = curLvl[i].indexOf(1);
            break;
        }
    }
    return [curX, curY];
}
function getCoordAfterMove(posX, posY, dir) {
    let nextX = posX, nextY = posY;
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
function moveElement(coordX, coordY, dir) {
    const nextCoord = getCoordAfterMove(coordX, coordY, dir);
    curLvl[nextCoord[0]][nextCoord[1]] = curLvl[coordX][coordY];
    curLvl[coordX][coordY] = 0;
    const curTile = document.getElementById(generateId(coordX, coordY));
    const nextTile = document.getElementById(generateId(nextCoord[0], nextCoord[1]));
    if (curTile && nextTile) {
        generateGridImage(curTile, coordX, coordY);
        generateGridImage(nextTile, nextCoord[0], nextCoord[1]);
    }
}
function canCharacterMove(posX, posY, dir) {
    if (posX >= 0 && posY >= 0 && posX < curLvl.length && posY < curLvl[posX].length) {
        if (curLvl[posX][posY] === 4 || curLvl[posX][posY] === 7) {
            const newCoord = getCoordAfterMove(posX, posY, dir);
            if (!canBlocMove(newCoord[0], newCoord[1], dir)) {
                return false;
            }
            else {
                return true;
            }
        }
        if (curLvl[posX][posY] === 0 || curLvl[posX][posY] === 13 || curLvl[posX][posY] === 5) {
            return true;
        }
    }
    return false;
}
function canBlocMove(posX, posY, dir) {
    if (posX >= 0 && posY >= 0 && posX < curLvl.length && posY < curLvl[posX].length) {
        if (curLvl[posX][posY] === 0 || curLvl[posX][posY] === 13) {
            return true;
        }
    }
    return false;
}
function isLevelOver(posX, posY) {
    if (posX === 0 && posY === 4 && keyNumber === maxKeys) {
        return true;
    }
    return false;
}
function drawEndGameScreen(div) {
    const divEndScreen = document.createElement("div");
    divEndScreen.classList.add("end-lvl-area");
    const divText = document.createElement("div");
    divText.classList.add("glass-element");
    divText.classList.add("end-lvl");
    const p = document.createElement("p");
    p.innerHTML = "Félicitations, vous avez fini le jeu!";
    divText.appendChild(p);
    const btn = generateButton("Retour à l'accueil");
    btn.id = "returnBtn";
    divEndScreen.append(divText, btn);
    div.appendChild(divEndScreen);
    btn.addEventListener("click", function () {
        initTitleScreen(div);
    });
}
function drawEndLvlScreen(div) {
    const divEndScreen = document.createElement("div");
    divEndScreen.classList.add("end-lvl-area");
    const divText = document.createElement("div");
    divText.classList.add("glass-element");
    divText.classList.add("end-lvl");
    const p = document.createElement("p");
    p.innerHTML = `Vous avez fini le niveau ${lvlNumber}!`;
    divText.appendChild(p);
    const btn = generateButton("Niveau suivant");
    btn.id = "returnBtn";
    divEndScreen.append(divText, btn);
    div.appendChild(divEndScreen);
    btn.addEventListener("click", function () {
        initGame(div);
    });
}
function drawGameOverScreen(div) {
    const divEndScreen = document.createElement("div");
    divEndScreen.classList.add("end-lvl-area");
    const divText = document.createElement("div");
    divText.classList.add("glass-element");
    divText.classList.add("end-lvl");
    const p = document.createElement("p");
    p.innerHTML = `Game Over! Vous n'avez plus de vie`;
    divText.appendChild(p);
    const btn = generateButton("Retour à l'accueil");
    btn.id = "returnBtn";
    divEndScreen.append(divText, btn);
    div.appendChild(divEndScreen);
    btn.addEventListener("click", function () {
        initTitleScreen(div);
    });
}
function initLvl(lvl = 0) {
    curLvl = [];
    let arr = [];
    for (let i = 0; i < levels[lvl].length; i++) {
        arr = [];
        for (let j = 0; j < levels[lvl][i].length; j++) {
            arr.push(levels[lvl][i][j]);
        }
        curLvl.push(arr);
    }
}
function resetLvl(div, lvl = 0) {
    initGame(div);
    lives--;
    setLives();
    if (lives === 0) {
        drawGameOverScreen(div);
    }
}
function resetCharacter() {
    curMovement = 3;
    correspondance[1] = characterOrientation[curMovement];
    curMonsterMovement = 3;
    correspondance[9] = monsterOrientation[curMonsterMovement];
    correspondance[11] = "./images/totem.png";
}
function generateImage(src) {
    const img = document.createElement("img");
    img.src = src;
    return img;
}
function shoot() {
    if (!shotAmmo && ammo > 0) {
        shotAmmo = true;
        ammo--;
        setAmmo();
        const dir = keys[curMovement];
        const curCoord = getCurrentCoord();
        const coordShoot = getCoordAfterMove(curCoord[0], curCoord[1], dir);
        if (canBlocMove(coordShoot[0], coordShoot[1], dir)) {
            const shootTile = document.getElementById(generateId(coordShoot[0], coordShoot[1]));
            if (shootTile) {
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
function setAmmo() {
    const pAmmo = document.getElementById("ammo");
    if (pAmmo) {
        pAmmo.innerText = ammo.toString();
    }
}
function setLives() {
    const pLives = document.getElementById("lives");
    if (pLives) {
        pLives.innerText = lives.toString();
    }
}
function drawShootMovement(posX, posY, dir) {
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
        curLvl[posX][posY] = 0;
        const shootTile = document.getElementById(generateId(posX, posY));
        if (shootTile) {
            generateGridImage(shootTile, posX, posY);
        }
        shotAmmo = false;
    });
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function shootSnake(posX, posY) {
    curLvl[posX][posY] = 7;
    const snakeTile = document.getElementById(generateId(posX, posY));
    if (snakeTile) {
        generateGridImage(snakeTile, posX, posY);
    }
}
function shootBall(posX, posY) {
    curLvl[posX][posY] = 0;
    const ballTile = document.getElementById(generateId(posX, posY));
    if (ballTile) {
        generateGridImage(ballTile, posX, posY);
    }
}
function killEnemyIfPossible(posX, posY) {
    if (posX >= 0 && posY >= 0 && posX < curLvl.length - 1 && posY < curLvl[posX].length - 1) {
        if (curLvl[posX][posY] === 7) {
            shootBall(posX, posY);
        }
        else if (curLvl[posX][posY] === 6) {
            shootSnake(posX, posY);
        }
    }
}
function initMonster(posX, posY) {
    return __awaiter(this, void 0, void 0, function* () {
        while (curLvl[posX][posY] === 9) {
            const nextMovement = Math.floor(Math.random() * 4);
            if (nextMovement !== curMonsterMovement) {
                curMonsterMovement = nextMovement;
                correspondance[9] = monsterOrientation[curMonsterMovement];
                const curTile = document.getElementById(generateId(posX, posY));
                if (curTile) {
                    generateGridImage(curTile, posX, posY);
                }
            }
            const nextCoord = getCoordAfterMove(posX, posY, keys[curMonsterMovement]);
            if (canBlocMove(nextCoord[0], nextCoord[1], keys[curMonsterMovement])) {
                moveElement(posX, posY, keys[curMonsterMovement]);
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
function encounterPlayer(posX, posY) {
    if (posX >= 0 && posY >= 0 && posX < curLvl.length && posY < curLvl[posX].length) {
        if (curLvl[posX][posY] === 1) {
            return true;
        }
    }
    return false;
}
function freezeMonster(posX, posY) {
    correspondance[10] = sleepingMonsterOrientation[curMonsterMovement];
    curLvl[posX][posY] = 10;
    const curTile = document.getElementById(generateId(posX, posY));
    if (curTile) {
        generateGridImage(curTile, posX, posY);
    }
}
function isSeenByTotem(div, posX, posY) {
    deactivateAllTotems();
    for (let i = 0; i < curLvl.length; i++) {
        if (curLvl[posX][i] === 11) {
            activateTotem(posX, i);
            if (canTotemShoot(posX, i, posX, posY)) {
                getTotemDirection(posX, i, posX, posY);
                totemShoots(div, posX, i);
                return;
            }
        }
        if (curLvl[i][posY] === 11) {
            activateTotem(i, posY);
            if (canTotemShoot(i, posY, posX, posY)) {
                getTotemDirection(i, posY, posX, posY);
                totemShoots(div, i, posY);
            }
        }
    }
}
function activateTotem(posX, posY) {
    correspondance[11] = "./images/activeTotem.png";
    const curTile = document.getElementById(generateId(posX, posY));
    if (curTile) {
        generateGridImage(curTile, posX, posY);
    }
}
function deactivateAllTotems() {
    for (let i = 0; i < curLvl.length; i++) {
        for (let j = 0; j < curLvl[i].length; j++) {
            if (curLvl[i][j] === 11) {
                deactivateTotem(i, j);
            }
        }
    }
}
function deactivateTotem(posX, posY) {
    correspondance[11] = "./images/totem.png";
    const curTile = document.getElementById(generateId(posX, posY));
    if (curTile) {
        generateGridImage(curTile, posX, posY);
    }
}
function canTotemShoot(posX, posY, targetX, targetY) {
    if (posX === targetX) {
        const min = Math.min(posY, targetY);
        const max = Math.max(posY, targetY);
        for (let i = min + 1; i < max; i++) {
            if (curLvl[posX][i] !== 0 && curLvl[posX][i] !== 2) {
                return false;
            }
        }
    }
    else if (posY === targetY) {
        const min = Math.min(posX, targetX);
        const max = Math.max(posX, targetX);
        for (let i = min + 1; i < max; i++) {
            if (curLvl[i][posY] !== 0 && curLvl[i][posY] !== 2) {
                return false;
            }
        }
    }
    return true;
}
function totemShoots(div, posX, posY) {
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
                curLvl[nextCoord[0]][nextCoord[1]] = 12;
                generateGridImage(nextTile, nextCoord[0], nextCoord[1]);
            }
            nextCoord = getCoordAfterMove(posX, posY, dir);
            while (!encounterPlayer(nextCoord[0], nextCoord[1])) {
                yield sleep(60);
                moveElement(posX, posY, dir);
                if (levels[lvlNumber][posX][posY]) {
                    const treeTile = document.getElementById(generateId(posX, posY));
                    if (treeTile) {
                        curLvl[posX][posY] = 2;
                        generateGridImage(treeTile, posX, posY);
                    }
                }
                posX = nextCoord[0];
                posY = nextCoord[1];
                nextCoord = getCoordAfterMove(posX, posY, dir);
            }
            curLvl[posX][posY] = 12;
            const shootTile = document.getElementById(generateId(posX, posY));
            if (shootTile) {
                generateGridImage(shootTile, posX, posY);
                yield sleep(60);
                curLvl[posX][posY] = 0;
                generateGridImage(shootTile, posX, posY);
            }
            yield sleep(60);
        }
        resetLvl(div);
        addGameListener(div);
    });
}
function getTotemDirection(posX, posY, targetX, targetY) {
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
