const Y = document.getElementById("boardsize").dataset.y;
const X = document.getElementById("boardsize").dataset.x;
const ARRAY = [
    'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D',
    'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H',
    'I', 'I', 'J', 'J', 'K', 'K', 'L', 'L',
    'M', 'M', 'N', 'N', 'O', 'O', 'P', 'P',
    'Q', 'Q', 'R', 'R', 'S', 'S', 'T', 'T',
    'U', 'U', 'V', 'V', 'W', 'W', 'X', 'X',
    'Y', 'Y', 'Z', 'Z', 'AA', 'AA', 'BB', 'BB',
    'CC', 'CC', 'DD', 'DD', 'EE', 'EE', 'FF', 'FF',
];
const ICONS = {
    A: "fas fa-crow",
    B: "fas fa-dove",
    C: "fas fa-frog",
    D: "fas fa-kiwi-bird",
    E: "fas fa-feather",
    F: "fas fa-leaf",

    G: "fas fa-rocket",
    H: "fas fa-paper-plane",

    I: "fas fa-futbol",
    J: "fas fa-volleyball-ball",
    K: "fas fa-baseball-ball",
    L: "fas fa-basketball-ball",
    M: "fas fa-bowling-ball",
    N: "fas fa-football-ball",
    O: "fas fa-bomb",

    P: "fas fa-beer",
    Q: "fas fa-coffee",
    R: "fas fa-flask",
    S: "fas fa-glass-martini",
    T: "fas fa-wine-glass",

    U: "fas fa-sun",
    V: "fas fa-moon",
    W: "fas fa-star",
    X: "fas fa-snowflake",
    Y: "fas fa-cloud",
    Z: "fas fa-fire",

    AA: "fas fa-dice-one",
    BB: "fas fa-dice-two",
    CC: "fas fa-dice-three",
    DD: "fas fa-dice-four",
    EE: "fas fa-dice-five",
    FF: "fas fa-dice-six"
}

let flippedCounter = 0;
let flippedIds = [];
let flipped = [];
let endGame = false;

function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


function newArray() {
    return shuffle(ARRAY.slice(0, X * Y));
}


function newGameBoard() {
    let array = newArray();
    let gameBoard = document.getElementById("gameboard");
    let i = 0;
    for (var row = 0; row < Y; row++) {
        let rowElem = document.createElement("div");
        rowElem.setAttribute("class", "row");
        gameBoard.appendChild(rowElem);
        for (var column = 0; column < X; column++) {
            let scene = document.createElement("div");
            let card = document.createElement("div");
            let cardFront = document.createElement("div");
            let cardBack = document.createElement("div");
            let empty = document.createTextNode(" ");
            let icon = document.createElement("i");
            scene.setAttribute("class", "scene");
            card.setAttribute("data-flipped", "false");
            card.setAttribute("class", "card js-fade-card fade-in-card is-paused");
            card.setAttribute("id", 'card_' + i);
            card.setAttribute("onClick", 'flip(this,\'' + array[i] + '\',' + array.length + ')');
            cardFront.setAttribute("class", "card__face card__face--front");
            cardBack.setAttribute("class", "card__face card__face--back");
            icon.setAttribute("class", "icon " + ICONS[array[i]]);

            cardFront.appendChild(empty);
            cardBack.appendChild(icon);
            rowElem.appendChild(scene);
            scene.appendChild(card);
            card.appendChild(cardFront);
            card.appendChild(cardBack);
            i++;
        }
    }
    fadeInCards()
}

function fadeInCards() {
    let elements = document.querySelectorAll('.js-fade-card');
    for (let i = 0; i < elements.length; ++i) {
        setInterval(function () {
            if (elements[i].classList.contains('is-paused')) {
                elements[i].classList.remove('is-paused');
            }
        }, i * 30);
    }
    for (let i = 0; i < elements.length; ++i) {
        setInterval(function () {
            if (elements[i].classList.contains('fade-in-card')) {
                elements[i].setAttribute("class", "card hover js-fade-card is-paused");
            }
        }, (i * 30) + 600);
    }
}

function flip(card, value, arrayLength) {
    if (card.dataset.flipped == "false" && flipped.length < 2) {
        card.dataset.flipped = "true";
        card.setAttribute("class", "card hover is-flipped");
        if (flipped.length == 0) {
            flipped.push(value);
            flippedIds.push(card.id);
            document.getElementById(flippedIds[0]).classList.remove('hover');
        } else if (flipped.length == 1) {
            flipped.push(value);
            flippedIds.push(card.id);
            document.getElementById(flippedIds[1]).classList.remove('hover');
            if (flipped[0] == flipped[1]) {
                flippedCounter += 2;
                flippedIds = [];
                flipped = [];
                if (flippedCounter == arrayLength) {
                    won();
                }
            } else {
                function flipBack() {
                    let firstCard = document.getElementById(flippedIds[0]);
                    let secondCard = document.getElementById(flippedIds[1]);
                    firstCard.setAttribute("class", "card hover");
                    secondCard.setAttribute("class", "card hover");
                    firstCard.dataset.flipped = "false";
                    secondCard.dataset.flipped = "false";
                    flippedIds = [];
                    flipped = [];
                }
                setTimeout(flipBack, 1000);
            }
        }
    }
}

function setHudWidth() {
    let width = document.getElementById("gameboard").offsetWidth;
    let hud = document.getElementById("hud");
    hud.style.width = width + "px";
    hud.style.transition = "1s";
    hud.style.color = "#000";
}

function countTime() {
    let s = 0;
    let m = 0;
    let h = 0;
    function seconds() {
        if (!endGame) {
            if (s < 59) {
                s++;
            } else {
                s = 0;
                if (m < 59) {
                    m++;
                } else {
                    m = 0;
                    h++;
                }
            }
            displayTime(h, m, s)
        }
    }
    setInterval(seconds, 1000);
}

function displayTime(h, m, s) {
    let seconds = (s < 10) ? "0" + s : s;
    let minutes = (m < 10) && (h > 0) ? "0" + m : m;
    let hours = h;
    let time;
    if (h > 0) {
        time = hours + ":" + minutes + ":" + seconds;
    } else {
        time = minutes + ":" + seconds;
    }
    document.getElementById("time").innerHTML = time;
}

function won() {
    endGame = true;
    let time = document.getElementById("time").innerHTML;
    let modal = document.getElementById('myModal');
    let elements = document.querySelectorAll('.js-fade');
    modal.style.display = "block";
    for (let i = 0; i < elements.length; ++i) {
        if (elements[i].classList.contains('is-paused')) {
            elements[i].classList.remove('is-paused');
        }
    }
    document.getElementById("modalTimeNumber").innerHTML = time;
    // When the user clicks anywhere outside of the modal, close it
    // window.onclick = function (event) {
    //     if (event.target == modal) {
    //         modal.style.display = "none";
    //     }
    // }
}

function menuFadeIn() {
    let elements = document.querySelectorAll('.js-fade');
    for (let i = 0; i < elements.length; ++i) {
        if (elements[i].classList.contains('is-paused')) {
            elements[i].classList.remove('is-paused');
        }
    }
}