export const levels : Array<Array<Array<number>>> = [
    [
        [2,2,2,2,0,0,0,2,0,5,3],
        [2,0,0,0,4,0,2,2,4,0,3],
        [2,0,2,0,0,3,3,0,0,2,0],
        [3,0,0,2,3,3,3,0,0,2,3],
        [0,4,4,3,3,0,0,0,0,3,3],
        [3,0,4,0,3,0,0,0,0,3,3],
        [3,0,0,3,0,0,0,0,0,0,0],
        [3,0,0,0,0,0,0,0,2,2,0],
        [0,3,0,0,0,0,0,2,2,2,2],
        [0,3,0,0,0,0,0,2,2,2,2],
        [0,0,3,0,0,1,0,2,2,2,2]
    ],
    [
        [2,2,2,2,0,0,0,2,3,3,3],
        [2,0,0,0,4,0,2,2,2,5,3],
        [2,0,2,0,0,3,3,0,0,0,0],
        [3,6,0,2,3,3,3,4,4,4,3],
        [0,0,0,0,0,0,0,0,0,0,3],
        [3,0,0,0,0,0,0,0,0,3,3],
        [3,0,0,0,0,0,0,0,0,0,0],
        [3,0,0,0,0,0,0,0,2,2,5],
        [0,3,0,0,0,0,0,2,2,2,2],
        [0,3,0,0,0,0,0,2,2,2,2],
        [0,0,3,0,0,1,0,2,2,2,2]
    ],
    [
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,2,2,2,0,3,3,3,0],
        [0,3,2,2,2,2,5,3,3,3,0],
        [0,3,3,3,3,3,3,3,3,3,9],
        [0,3,5,2,0,6,0,2,0,0,0],
        [0,0,0,2,0,2,0,2,0,0,0],
        [0,3,0,2,0,2,0,0,0,0,0],
        [0,3,0,2,0,2,2,3,3,3,0],
        [0,3,0,2,0,0,1,3,3,3,0],
        [0,3,0,3,3,3,3,3,3,3,5],
        [0,0,0,0,0,0,0,0,0,5,2]
    ],
    [
        [3,3,3,3,0,3,3,3,3,3,3],
        [3,3,0,5,0,0,2,5,0,3,3],
        [2,0,0,0,0,0,0,0,0,0,2],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,11,0,0,5,0,0,11,0,0],
        [0,0,0,4,0,0,0,4,0,0,0],
        [0,0,2,0,4,0,4,0,2,0,0],
        [5,0,0,0,0,0,0,0,0,0,5],
        [2,0,5,0,0,0,0,0,5,0,2],
        [3,3,0,0,0,0,0,0,0,3,3],
        [0,0,0,3,0,1,0,3,3,3,3]
    ]
];

export const keysByLvl: Array<number> = [1, 2, 4, 7];

export const correspondance: Array<string> = [
    "",
    "../images/characterDown.png",
    "../images/tree.png",
    "../images/boulder.png",
    "../images/bloc.png",
    "../images/key.png",
    "../images/snake.png",
    "../images/ball.png",
    "../images/shootDown.png",
    "../images/monsterDown.png",
    "../images/sleepingMonsterDown.png",
    "../images/totem.png",
    "../images/arrowShotDown.png",
    ""
];

export const instructions: Array<string> = [
    "Ce petit personnage est Lolo. C’est avec lui que tu vivras cette aventure.",
    "Utilise les flèches de ton clavier ou celles en dessous pour te déplacer.",
    "Utilise la barre espace ou le bouton 'Shoot' pour tirer sur les ennemis.",
    "Les rochers et les arbres bloquent ton chemin. Il faut passer ailleurs.",
    "Tu peux pousser les blocs pour te déplacer. Mais attention à ne pas te bloquer.",
    "Le serpent te bloque le passage. Peut-être faut-il essayer de lui tirer dessus.",
    "Tu peux redémarrer le niveau si tu es bloqué, mais cela te fait perdre une vie. N’en abuse pas.",
    "Récupère toutes les clés pour ouvrir la porte et passer au niveau suivant",
    "Bonne chance !"
];

export const instructionsImg: Array<Array<number>> = [
    [1],
    [],
    [],
    [2, 3],
    [4],
    [6],
    [],
    [5],
    []
];

export const keys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
export const characterOrientation = ["../images/characterRight.png", "../images/characterLeft.png", "../images/characterUp.png", "../images/characterDown.png"];
export const shootOrientation = ["../images/shootRight.png", "../images/shootLeft.png", "../images/shootUp.png", "../images/shootDown.png"];
export const monsterOrientation = ["../images/monsterRight.png", "../images/monsterLeft.png", "../images/monsterUp.png", "../images/monsterDown.png"];
export const sleepingMonsterOrientation = ["../images/sleepingMonsterRight.png", "../images/sleepingMonsterLeft.png", "../images/sleepingMonsterUp.png", "../images/sleepingMonsterDown.png"];
export const arrows = ["../images/arrowLeft.png", "../images/arrowRight.png", "../images/arrowUp.png", "../images/arrowDown.png"];
export const letters: Array<string> = ["a","b","c","d","e","f","g","h","i","j","k"];
export const maxLvl: number = levels.length-1;
export const gameArea: HTMLElement | null = document.getElementById("gameArea");
export const gameScreen: HTMLElement | null = document.getElementById("gameScreen");