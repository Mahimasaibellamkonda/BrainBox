/* =========================
   GENERAL GAME FUNCTIONS
========================= */

function openGame(gameId) {

    closeGames();

    document.getElementById(gameId).style.display = "block";

    document.getElementById(gameId).scrollIntoView({
        behavior: "smooth"
    });

}


function closeGames() {

    const games =
        document.querySelectorAll(".game-box");

    games.forEach(function(game) {

        game.style.display = "none";

    });

}


/* =========================
   NUMBER GUESS
========================= */

let secretNumber =
    Math.floor(Math.random() * 100) + 1;

let guessAttempts = 0;


function checkGuess() {

    const input =
        document.getElementById("guessInput");

    const result =
        document.getElementById("guessResult");

    const guess =
        Number(input.value);


    if (guess < 1 || guess > 100) {

        result.textContent =
            "Enter a number between 1 and 100.";

        return;

    }


    guessAttempts++;

    document.getElementById("attempts")
        .textContent = guessAttempts;


    if (guess === secretNumber) {

        result.textContent =
            "🎉 Correct! You found the number!";

    }

    else if (guess < secretNumber) {

        result.textContent =
            "⬆️ Too low! Try again.";

    }

    else {

        result.textContent =
            "⬇️ Too high! Try again.";

    }

}


/* =========================
   REACTION TEST
========================= */

let reactionStartTime = 0;

let reactionTimer;


function startReaction() {

    const box =
        document.getElementById("reactionBox");

    const message =
        document.getElementById("reactionMessage");

    const result =
        document.getElementById("reactionResult");


    message.textContent =
        "Wait for it...";

    result.textContent = "";

    box.textContent = "WAIT";


    box.style.background = "#ddd";


    const randomTime =
        Math.floor(Math.random() * 4000) + 2000;


    reactionTimer = setTimeout(function() {

        box.textContent = "CLICK NOW!";

        box.style.background = "#6c5ce7";

        box.style.color = "white";

        reactionStartTime = Date.now();

    }, randomTime);

}


function reactionClick() {

    const box =
        document.getElementById("reactionBox");

    const result =
        document.getElementById("reactionResult");


    if (reactionStartTime === 0) {

        clearTimeout(reactionTimer);

        result.textContent =
            "Too early! Wait for the signal.";

        return;

    }


    const reactionTime =
        Date.now() - reactionStartTime;


    result.textContent =
        "⚡ Your reaction time: "
        + reactionTime
        + " ms";


    reactionStartTime = 0;

    box.textContent = "Press Start";

    box.style.background = "#ddd";

    box.style.color = "#222";

}


/* =========================
   WORD SCRAMBLE
========================= */

const words = [
    "javascript",
    "computer",
    "keyboard",
    "internet",
    "programming",
    "website",
    "developer",
    "algorithm"
];


let currentWord = "";


function shuffleWord(word) {

    let letters =
        word.split("");

    for (
        let i = letters.length - 1;
        i > 0;
        i--
    ) {

        let randomIndex =
            Math.floor(Math.random() * (i + 1));

        let temp =
            letters[i];

        letters[i] =
            letters[randomIndex];

        letters[randomIndex] =
            temp;

    }

    return letters.join("");

}


function newWord() {

    const randomIndex =
        Math.floor(Math.random() * words.length);


    currentWord =
        words[randomIndex];


    document.getElementById("scrambledWord")
        .textContent =
        shuffleWord(currentWord);


    document.getElementById("wordInput")
        .value = "";


    document.getElementById("wordResult")
        .textContent = "";

}


function checkWord() {

    const input =
        document.getElementById("wordInput")
            .value
            .toLowerCase()
            .trim();


    const result =
        document.getElementById("wordResult");


    if (input === currentWord) {

        result.textContent =
            "🎉 Correct! Great job!";

    }

    else {

        result.textContent =
            "❌ Not quite. Try again!";

    }

}


newWord();


/* =========================
   TIC TAC TOE
========================= */

let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];


let playerTurn = true;

let gameOver = false;


const winningPatterns = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


function ticMove(index) {

    if (
        board[index] !== "" ||
        !playerTurn ||
        gameOver
    ) {

        return;

    }


    board[index] = "X";

    updateBoard();


    if (checkWinner("X")) {

        document.getElementById("ticMessage")
            .textContent =
            "🎉 You won!";

        gameOver = true;

        return;

    }


    if (board.every(cell => cell !== "")) {

        document.getElementById("ticMessage")
            .textContent =
            "🤝 It's a draw!";

        gameOver = true;

        return;

    }


    playerTurn = false;


    document.getElementById("ticMessage")
        .textContent =
        "Computer's turn...";


    setTimeout(computerMove, 500);

}


function computerMove() {

    const emptyCells = [];


    board.forEach(function(cell, index) {

        if (cell === "") {

            emptyCells.push(index);

        }

    });


    if (emptyCells.length === 0) {

        return;

    }


    const randomIndex =
        Math.floor(
            Math.random() *
            emptyCells.length
        );


    const computerCell =
        emptyCells[randomIndex];


    board[computerCell] = "O";

    updateBoard();


    if (checkWinner("O")) {

        document.getElementById("ticMessage")
            .textContent =
            "💻 Computer won!";

        gameOver = true;

        return;

    }


    if (board.every(cell => cell !== "")) {

        document.getElementById("ticMessage")
            .textContent =
            "🤝 It's a draw!";

        gameOver = true;

        return;

    }


    playerTurn = true;


    document.getElementById("ticMessage")
        .textContent =
        "Your turn — you are X";

}


function updateBoard() {

    const cells =
        document.querySelectorAll(".board button");


    cells.forEach(function(cell, index) {

        cell.textContent =
            board[index];

    });

}


function checkWinner(player) {

    return winningPatterns.some(function(pattern) {

        return pattern.every(function(index) {

            return board[index] === player;

        });

    });

}


function resetTic() {

    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];


    playerTurn = true;

    gameOver = false;


    updateBoard();


    document.getElementById("ticMessage")
        .textContent =
        "Your turn — you are X";

}