// CONSTANT VALUES

const Y = document.getElementById("boardsize").dataset.y;
const X = document.getElementById("boardsize").dataset.x;
const ARRAY = [
    "fas fa-crow",
    "fas fa-dove",
    "fas fa-frog",
    "fas fa-kiwi-bird",
    "fas fa-feather",
    "fas fa-leaf",
    "fas fa-rocket",
    "fas fa-paper-plane",
    "fas fa-futbol",
    "fas fa-volleyball-ball",
    "fas fa-baseball-ball",
    "fas fa-basketball-ball",
    "fas fa-bowling-ball",
    "fas fa-football-ball",
    "fas fa-bomb",
    "fas fa-beer",
    "fas fa-coffee",
    "fas fa-flask",
    "fas fa-glass-martini",
    "fas fa-wine-glass",
    "fas fa-sun",
    "fas fa-moon",
    "fas fa-star",
    "fas fa-snowflake",
    "fas fa-cloud",
    "fas fa-fire",
    "fas fa-dice-one",
    "fas fa-dice-two",
    "fas fa-dice-three",
    "fas fa-dice-four",
    "fas fa-dice-five",
    "fas fa-dice-six"
]

// GLOBAL VALUES

let flippedCounter = 0;
let flippedIds = [];
let flipped = [];
let endGame = false;

// MENU LOGIC

function submit() {
    let x = document.forms["gameOptions"]["x"].value;
    let y = document.forms["gameOptions"]["y"].value;
    if (x != "" && y != "") {
        document.forms["gameOptions"].submit();
    } else {
        if (x == "") {
            wrongInput("select-x");
        }
        if (y == "") {
            wrongInput("select-y");
        }
    }
}

// GAME LOGIC

function newArray() {
    let array = ARRAY.map(function (item) {
        return [item, item];
    }).reduce(function (a, b) {
        return a.concat(b)
    });
    return shuffle(array.slice(0, X * Y));
}

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
            icon.setAttribute("class", "icon " + array[i]);

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
                    endScreen();
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

// TIME COUNTER

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

// GAME VISUALS

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

function endScreen() {
    endGame = true;
    let time = document.getElementById("time").innerHTML;
    let modal = document.getElementById('modal');
    let elements = document.querySelectorAll('.js-fade');
    modal.style.display = "block";
    for (let i = 0; i < elements.length; ++i) {
        if (elements[i].classList.contains('is-paused')) {
            elements[i].classList.remove('is-paused');
        }
    }
    document.getElementById("modalTimeNumber").innerHTML = time;
}

function setHudWidth() {
    let width = document.getElementById("gameboard").offsetWidth;
    let hud = document.getElementById("hud");
    hud.style.width = width + "px";
    hud.style.transition = "1s";
    hud.style.color = "#000";
}

// MENU VISUALS

function menuFadeIn() {
    let elements = document.querySelectorAll('.js-fade');
    for (let i = 0; i < elements.length; ++i) {
        if (elements[i].classList.contains('is-paused')) {
            elements[i].classList.remove('is-paused');
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function wrongInput(id) {
    document.getElementById(id).style.backgroundColor = '#f73859bb';
    document.getElementById(id).style.boxShadow = '0 0 6px 2px #f73859bb';
    document.getElementById(id).style.borderColor = '#f73859'
    await sleep(200);
    document.getElementById(id).style.backgroundColor = '#fff';
    document.getElementById(id).style.boxShadow = 'none';
    document.getElementById(id).style.borderColor = '#ccc';
}