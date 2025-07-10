import { arrows, correspondance, instructions, instructionsImg, variables } from "./data.js";
import { generateImage } from "./gameLogicFunctions.js";
import { initFirstGame, resetCharacter, resetDiv, resetGame } from "./gameScreenFunctions.js";
export function howToPlay(div) {
    resetDiv(div);
    generateTitleHowToPlay(div);
    generateInstructionCard(div, variables.curInstruction);
    const btnBack = document.getElementById("previous");
    if (btnBack) {
        btnBack.addEventListener("click", function () {
            variables.curInstruction--;
            howToPlay(div);
        });
    }
    const btnNext = document.getElementById("next");
    if (btnNext) {
        btnNext.addEventListener("click", function () {
            variables.curInstruction++;
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
export function initTitleScreen(div) {
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
export function generateInstructionCard(div, num) {
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
export function generateReturnButton(div) {
    const btn = document.createElement("button");
    btn.classList.add("return-btn");
    btn.id = "returnBtn";
    const p = document.createElement("p");
    p.innerText = "X";
    btn.appendChild(p);
    div.appendChild(btn);
}
export function generateCardImages(div, num) {
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
export function generateCardButtons(div, num) {
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
export function generateButtonArrow(num) {
    const btn = document.createElement("button");
    const img = generateImage(arrows[num]);
    btn.classList.add("card-btn");
    img.classList.add("fit-element");
    btn.appendChild(img);
    return btn;
}
export function generateButton(text) {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.classList.add("glass-element", "btn");
    return btn;
}
export function generateTitleHowToPlay(div) {
    const title = document.createElement("p");
    title.innerText = "Comment jouer ?";
    title.classList.add("glass-element", "instruction-title");
    div.appendChild(title);
}
