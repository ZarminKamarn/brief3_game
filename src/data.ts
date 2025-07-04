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
        [2,2,2,2,0,0,0,2,0,0,3],
        [2,0,0,0,4,0,2,2,4,5,3],
        [2,0,2,0,0,3,3,0,0,0,0],
        [3,0,0,2,3,3,3,4,4,4,3],
        [0,4,4,3,3,0,0,0,0,0,3],
        [3,0,4,0,3,0,0,0,0,3,3],
        [3,0,0,3,0,0,0,0,0,0,0],
        [3,0,0,0,0,0,0,0,2,2,0],
        [0,3,0,0,0,0,0,2,2,2,2],
        [0,3,0,0,0,0,0,2,2,2,2],
        [0,0,3,0,0,1,0,2,2,2,2]
    ]
];

export const keysByLvl: Array<number> = [1, 1];

export const correspondance: Array<string> = [
    "",
    "../images/character.png",
    "../images/tree.png",
    "../images/boulder.png",
    "../images/bloc.png",
    "../images/key.png",
    "",
    "",
    "",
    ""
];

export const instructions: Array<string> = [
    "Ce petit personnage est Lolo. C’est avec lui que tu vivras cette aventure.",
    "Utilise les flèches de ton clavier ou celles en dessous pour te déplacer.",
    "Les rochers et les arbres bloquent ton chemin. Il faut passer ailleurs",
    "Tu peux pousser les blocs pour te déplacer. Mais attention à ne pas te bloquer.",
    "Tu peux redémarrer le niveau si tu es bloqué, mais cela te fait perdre une vie. N’en abuse pas.",
    "Récupère la clé pour ouvrir la porte et passer au niveau suivant",
    "Bonne chance !"
];

export const instructionsImg: Array<Array<number>> = [
    [1],
    [],
    [2, 3],
    [4],
    [],
    [5],
    []
];

export const keys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
export const arrows = ["../images/arrowLeft.png", "../images/arrowRight.png", "../images/arrowUp.png", "../images/arrowDown.png"];