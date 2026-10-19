"use strict";

/* =====================================
   BRAINBOX - MAIN NAVIGATION
===================================== */

const gameIds = ["guessGame", "reactionGame", "wordGame", "ticGame"];

function showHome() {
    document.getElementById("homeScreen").hidden = false;

    gameIds.forEach((id) => {
        document.getElementById(id).hidden = true;
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function openGame(gameId) {
    if (!gameIds.includes(gameId)) return;

    document.getElementById("homeScreen").hidden = true;

    gameIds.forEach((id) => {
        document.getElementById(id).hidden = id !== gameId;
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (gameId === "guessGame") {
        document.getElementById("guessInput").focus();
    } else if (gameId === "wordGame") {
        document.getElementById("wordInput").focus();
    }
}

/* =====================================
   GAME 1: NUMBER GUESS
===================================== */

let secretNumber = randomNumber(1, 100);
let guessAttempts = 0;
let guessFinished = false;

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");
const guessResult = document.getElementById("guessResult");
const attemptsDisplay = document.getElementById("attempts");
const guessButton = document.getElementById("guessButton");

guessForm.addEventListener("submit", function (event) {
    event.preventDefault();
    checkGuess();
});

function checkGuess() {
    if (guessFinished) return;

    const value = guessInput.value.trim();

    if (value === "") {
        setFeedback(guessResult, "Enter a number first!", "error");
        guessInput.focus();
        return;
    }

    const guess = Number(value);

    if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
        setFeedback(guessResult, "Enter a whole number from 1 to 100.", "error");
        guessInput.focus();
        return;
    }

    guessAttempts++;
    attemptsDisplay.textContent = guessAttempts;

    if (guess === secretNumber) {
        guessFinished = true;
        setFeedback(
            guessResult,
            `🎉 Correct! You found ${secretNumber} in ${guessAttempts} attempt${guessAttempts === 1 ? "" : "s"}!`,
            "success"
        );
        guessButton.disabled = true;
        guessInput.disabled = true;
        return;
    }

    const difference = Math.abs(secretNumber - guess);
    let hint = guess < secretNumber ? "Too low! Try a higher number." : "Too high! Try a lower number.";

    if (difference <= 5) {
        hint += " 🔥 You're very close!";
    } else if (difference <= 15) {
        hint += " 🌡️ Getting warmer!";
    }

    setFeedback(guessResult, hint, "info");
    guessInput.select();
}

function resetGuess() {
    secretNumber = randomNumber(1, 100);
    guessAttempts = 0;
    guessFinished = false;

    guessInput.value = "";
    guessInput.disabled = false;
    guessButton.disabled = false;
    attemptsDisplay.textContent = "0";

    setFeedback(guessResult, "New number picked! Take your first guess.", "");
    guessInput.focus();
}

/* =====================================
   GAME 2: REACTION TEST
===================================== */

const reactionStartButton = document.getElementById("reactionStart");
const reactionBox = document.getElementById("reactionBox");
const reactionMessage = document.getElementById("reactionMessage");
const reactionHint = document.getElementById("reactionHint");
const reactionEmoji = document.getElementById("reactionEmoji");
const reactionResult = document.getElementById("reactionResult");
const reactionLast = document.getElementById("reactionLast");
const reactionBest = document.getElementById("reactionBest");

let reactionState = "idle";
let reactionTimer = null;
let reactionStartTime = 0;
let bestReaction = null;

function startReaction() {
    clearTimeout(reactionTimer);

    reactionState = "waiting";
    reactionStartButton.disabled = true;
    reactionStartButton.textContent = "Wait for green...";
    reactionBox.disabled = false;
    reactionBox.className = "reaction-box waiting";

    reactionEmoji.textContent = "👀";
    reactionMessage.textContent = "Wait for green...";
    reactionHint.textContent = "Don't click yet!";
    setFeedback(reactionResult, "Stay focused. The color will change randomly.", "");

    const delay = randomNumber(1800, 5000);

    reactionTimer = setTimeout(function () {
        if (reactionState !== "waiting") return;

        reactionState = "ready";
        reactionStartTime = performance.now();

        reactionBox.className = "reaction-box ready";
        reactionEmoji.textContent = "🟢";
        reactionMessage.textContent = "CLICK NOW!";
        reactionHint.textContent = "As fast as you can!";
    }, delay);
}

function reactionClick() {
    if (reactionState === "waiting") {
        clearTimeout(reactionTimer);
        reactionState = "idle";

        reactionBox.className = "reaction-box too-soon";
        reactionEmoji.textContent = "⏰";
        reactionMessage.textContent = "Too early!";
        reactionHint.textContent = "Wait for the green box next time.";

        reactionStartButton.disabled = false;
        reactionStartButton.textContent = "Try again →";

        setFeedback(reactionResult, "You clicked before green appeared. Try again!", "error");
        return;
    }

    if (reactionState !== "ready") return;

    const elapsed = Math.round(performance.now() - reactionStartTime);
    reactionState = "finished";

    reactionBox.className = "reaction-box finished";
    reactionEmoji.textContent = "⚡";
    reactionMessage.textContent = `${elapsed} ms`;
    reactionHint.textContent = reactionComment(elapsed);

    reactionLast.textContent = `${elapsed} ms`;

    if (bestReaction === null || elapsed < bestReaction) {
        bestReaction = elapsed;
        reactionBest.textContent = `${bestReaction} ms`;
        setFeedback(reactionResult, "🏆 New personal best! Amazing reflexes!", "success");
    } else {
        setFeedback(reactionResult, `Nice try! Your best is ${bestReaction} ms.`, "info");
    }

    reactionStartButton.disabled = false;
    reactionStartButton.textContent = "Play again →";
}

function reactionComment(ms) {
    if (ms < 180) return "Lightning fast! ⚡";
    if (ms < 250) return "Super quick reflexes!";
    if (ms < 350) return "Nice reaction time!";
    if (ms < 500) return "Good start. Try again!";
    return "Keep practising your reflexes!";
}

/* =====================================
   GAME 3: WORD SCRAMBLE
===================================== */

const words = [
    { word: "BRAIN", category: "MIND" },
    { word: "CLOUD", category: "TECH" },
    { word: "APPLE", category: "FOOD" },
    { word: "PIXEL", category: "TECH" },
    { word: "PLANT", category: "NATURE" },
    { word: "ROBOT", category: "TECH" },
    { word: "TIGER", category: "ANIMALS" },
    { word: "OCEAN", category: "NATURE" },
    { word: "CHAIR", category: "EVERYDAY" },
    { word: "SPACE", category: "SCIENCE" },
    { word: "MUSIC", category: "ARTS" },
    { word: "GRAPE", category: "FOOD" },
    { word: "TRAIN", category: "TRAVEL" },
    { word: "LIGHT", category: "SCIENCE" },
    { word: "SMILE", category: "FEELINGS" },
    { word: "PHONE", category: "TECH" },
    { word: "WATER", category: "NATURE" },
    { word: "DREAM", category: "MIND" },
    { word: "SNAKE", category: "ANIMALS" },
    { word: "MOUSE", category: "TECH" }
];

let currentWord = null;
let wordScore = 0;
let wordRound = 0;
let usedWords = [];
let wordSolved = false;

const wordForm = document.getElementById("wordForm");
const wordInput = document.getElementById("wordInput");
const scrambledWordDisplay = document.getElementById("scrambledWord");
const wordCategory = document.getElementById("wordCategory");
const wordResult = document.getElementById("wordResult");

wordForm.addEventListener("submit", function (event) {
    event.preventDefault();
    checkWord();
});

function shuffledLetters(word) {
    const letters = word.split("");

    for (let i = letters.length - 1; i > 0; i--) {
        const j = randomNumber(0, i);
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    // Avoid displaying the original word when possible.
    if (letters.join("") === word && word.length > 1) {
        [letters[0], letters[1]] = [letters[1], letters[0]];
    }

    return letters.join("");
}

function newWord() {
    if (usedWords.length === words.length) {
        usedWords = [];
    }

    const availableWords = words.filter((item) => !usedWords.includes(item.word));
    currentWord = availableWords[randomNumber(0, availableWords.length - 1)];
    usedWords.push(currentWord.word);

    wordRound++;
    wordSolved = false;

    scrambledWordDisplay.textContent = shuffledLetters(currentWord.word).split("").join(" ");
    wordCategory.textContent = `CATEGORY: ${currentWord.category}`;
    document.getElementById("wordScore").textContent = wordScore;
    document.getElementById("wordRound").textContent = wordRound;

    wordInput.value = "";
    wordInput.disabled = false;
    wordForm.querySelector("button").disabled = false;

    setFeedback(wordResult, "Unscramble the letters and enter your answer!", "");
    wordInput.focus();
}

function checkWord() {
    if (wordSolved || !currentWord) return;

    const answer = wordInput.value.trim().toUpperCase();

    if (!answer) {
        setFeedback(wordResult, "Type your answer first!", "error");
        wordInput.focus();
        return;
    }

    if (answer === currentWord.word) {
        wordSolved = true;
        wordScore++;

        document.getElementById("wordScore").textContent = wordScore;

        setFeedback(wordResult, `🎉 Correct! The word was ${currentWord.word}.`, "success");

        wordInput.disabled = true;
        wordForm.querySelector("button").disabled = true;

        // Automatically prepare the next word after a short pause.
        setTimeout(function () {
            if (!document.getElementById("wordGame").hidden && wordSolved) {
                newWord();
            }
        }, 1400);
    } else {
        setFeedback(wordResult, "Not quite! Rearrange the letters and try again.", "error");
        wordInput.select();
    }
}

/* =====================================
   GAME 4: TIC-TAC-TOE WITH SMART AI
===================================== */

let ticBoard = Array(9).fill("");
let ticGameOver = false;
let ticComputerThinking = false;
let ticTimer = null;

let playerXScore = 0;
let playerOScore = 0;
let drawScore = 0;

const ticCells = Array.from(document.querySelectorAll(".tic-cell"));
const ticMessage = document.getElementById("ticMessage");

const winningLines = [
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
        ticGameOver ||
        ticComputerThinking ||
        ticBoard[index] !== ""
    ) {
        return;
    }

    makeTicMove(index, "X");

    if (finishIfNeeded()) return;

    ticComputerThinking = true;
    updateTicMessage("Computer is thinking...");

    ticTimer = setTimeout(function () {
        if (ticGameOver) return;

        const move = findBestMove();

        if (move !== -1) {
            makeTicMove(move, "O");
        }

        ticComputerThinking = false;

        if (!finishIfNeeded()) {
            updateTicMessage("Your move! Choose a square.");
        }
    }, 350);
}

function makeTicMove(index, symbol) {
    ticBoard[index] = symbol;

    const cell = ticCells[index];
    cell.textContent = symbol;
    cell.disabled = true;
    cell.classList.add(symbol === "X" ? "cell-x" : "cell-o");
}

function getWinningLine(board) {
    for (const line of winningLines) {
        const [a, b, c] = line;

        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return line;
        }
    }

    return null;
}

function finishIfNeeded() {
    const winningLine = getWinningLine(ticBoard);

    if (winningLine) {
        ticGameOver = true;

        winningLine.forEach((index) => {
            ticCells[index].classList.add("winning-cell");
        });

        ticCells.forEach((cell) => {
            cell.disabled = true;
        });

        const winner = ticBoard[winningLine[0]];

        if (winner === "X") {
            playerXScore++;
            updateTicMessage("🎉 You win! Brilliant move!");
        } else {
            playerOScore++;
            updateTicMessage("Computer wins this round. Try again!");
        }

        updateTicScores();
        return true;
    }

    if (ticBoard.every((cell) => cell !== "")) {
        ticGameOver = true;
        drawScore++;

        updateTicScores();
        updateTicMessage("🤝 It's a draw! Well played.");

        ticCells.forEach((cell) => {
            cell.disabled = true;
        });

        return true;
    }

    return false;
}

/*
 * Minimax checks the possible future moves.
 * It gives the computer a win when possible,
 * blocks player wins, and avoids losing.
 */
function minimax(board, depth, isMaximizing) {
    const winnerLine = getWinningLine(board);

    if (winnerLine) {
        const winner = board[winnerLine[0]];

        if (winner === "O") return 10 - depth;
        if (winner === "X") return depth - 10;
    }

    if (board.every((cell) => cell !== "")) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                const score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }

        return bestScore;
    }

    let bestScore = Infinity;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "X";
            const score = minimax(board, depth + 1, true);
            board[i] = "";
            bestScore = Math.min(score, bestScore);
        }
    }

    return bestScore;
}

function findBestMove() {
    let bestScore = -Infinity;
    let bestMoves = [];

    for (let i = 0; i < 9; i++) {
        if (ticBoard[i] === "") {
            ticBoard[i] = "O";
            const score = minimax(ticBoard, 0, false);
            ticBoard[i] = "";

            if (score > bestScore) {
                bestScore = score;
                bestMoves = [i];
            } else if (score === bestScore) {
                bestMoves.push(i);
            }
        }
    }

    if (bestMoves.length === 0) return -1;

    // Random choice between equally good moves makes play less predictable.
    return bestMoves[randomNumber(0, bestMoves.length - 1)];
}

function updateTicScores() {
    document.getElementById("playerXScore").textContent = playerXScore;
    document.getElementById("playerOScore").textContent = playerOScore;
    document.getElementById("drawScore").textContent = drawScore;
}

function updateTicMessage(message) {
    ticMessage.textContent = message;
}

function resetTic() {
    clearTimeout(ticTimer);

    ticBoard = Array(9).fill("");
    ticGameOver = false;
    ticComputerThinking = false;

    ticCells.forEach((cell) => {
        cell.textContent = "";
        cell.disabled = false;
        cell.classList.remove("cell-x", "cell-o", "winning-cell");
    });

    document.getElementById("playerXCard").classList.add("active-player");
    document.getElementById("playerOCard").classList.remove("active-player");

    updateTicMessage("Your move! Choose a square.");
}

/* =====================================
   SHARED UI HELPERS
===================================== */

function setFeedback(element, message, type) {
    element.textContent = message;
    element.classList.remove("success", "error", "info");

    if (type) {
        element.classList.add(type);
    }
}

/* Highlight the current Tic-Tac-Toe turn. */
const originalTicMove = ticMove;

ticMove = function (index) {
    originalTicMove(index);

    if (ticComputerThinking) {
        document.getElementById("playerXCard").classList.remove("active-player");
        document.getElementById("playerOCard").classList.add("active-player");
    } else if (!ticGameOver) {
        document.getElementById("playerXCard").classList.add("active-player");
        document.getElementById("playerOCard").classList.remove("active-player");
    } else {
        document.getElementById("playerXCard").classList.remove("active-player");
        document.getElementById("playerOCard").classList.remove("active-player");
    }
};

/* Start with a fresh word when the page loads. */
newWord();
