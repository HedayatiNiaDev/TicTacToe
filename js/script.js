// =========================================================
// Tic-Tac-Toe Game Script
// Compatible with the original project structure
// =========================================================

// Game state
const board = ['', '', '', '', '', '', '', '', ''];

let currentPlayer = 'X';
let gameActive = false;
let gameMode = '';
let difficulty = '';

let scores = {
    X: 0,
    O: 0
};

let playerSymbol = 'X';
let computerSymbol = 'O';

// Winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// DOM elements
const statusDisplay = document.getElementById('status');
const equalDisplay = document.getElementById('equal');
const scoreBoard = document.getElementById('scoreboard');
const resetButton = document.getElementById('reset');
const changeModeButton = document.getElementById('changeMode');

const player2Name = document.getElementById('player2Name');
const player1Name = document.getElementById('player1Name');

const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');

const modeSelection = document.getElementById('modeSelection');
const player2Icon = document.getElementById('player2-icon');
const gameBoard = document.getElementById('gameBoard');
const hero = document.querySelector('.hero');

const symbolIsText = document.getElementById('symbolIsText');
const switchToText = document.getElementById('switchToText');

const player1ScoreEl = document.getElementById('player1Score');
const player2ScoreEl = document.getElementById('player2Score');

const player1SymbolDisplay = document.getElementById(
    'player1SymbolForDisplay'
);

const player2SymbolDisplay = document.getElementById(
    'player2SymbolForDisplay'
);

let player1NameCustom = false;
let player2NameCustom = false;

if (player1Name) {
    player1Name.addEventListener('input', () => {
        player1NameCustom = true;
    });
}

if (player2Name) {
    player2Name.addEventListener('input', () => {
        player2NameCustom = true;
    });
}

// =========================================================
// Translation and status
// =========================================================

function updateSymbolButtonText() {
    if (!symbolIsText || !switchToText) {
        return;
    }

    symbolIsText.textContent = t('symbolIs', {
        symbol: playerSymbol
    });

    switchToText.textContent = t('switchTo', {
        symbol: playerSymbol === 'X' ? 'O' : 'X'
    });
}

function updateStatusText() {
    if (!statusDisplay) {
        return;
    }

    if (gameMode === 'single') {
        statusDisplay.textContent = t('statusSingle', {
            difficulty: translatedDifficulty(difficulty)
        });
    } else if (gameMode === 'two') {
        statusDisplay.textContent = t('statusTwo');
    }
}

function onLanguageChanged() {
    updateSymbolButtonText();
    updateStatusText();

    if (gameMode === 'single') {
        if (!player1NameCustom && player1Name) {
            player1Name.textContent = t('you');
        }

        if (!player2NameCustom && player2Name) {
            player2Name.textContent = t('robot');
        }
    } else if (gameMode === 'two') {
        if (!player1NameCustom && player1Name) {
            player1Name.textContent = t('player1');
        }

        if (!player2NameCustom && player2Name) {
            player2Name.textContent = t('player2');
        }
    }
}

updateSymbolButtonText();

// =========================================================
// Board creation
// =========================================================

const boardElement = document.querySelector('.board');

const cellsFragment = document.createDocumentFragment();

for (let index = 0; index < 9; index++) {
    const cell = document.createElement('div');

    cell.classList.add('cell');
    cell.setAttribute('data-index', index);

    cellsFragment.appendChild(cell);
}

boardElement.appendChild(cellsFragment);

const cells = document.querySelectorAll('.cell');

// =========================================================
// Controls
// =========================================================

const controlsContainer = document.createElement('div');

controlsContainer.className = 'game-controls';

gameBoard.appendChild(controlsContainer);

controlsContainer.appendChild(resetButton);
controlsContainer.appendChild(changeModeButton);

// Game mode buttons
document.getElementById('twoPlayers').addEventListener('click', () => {
    gameMode = 'two';
    startGame();
});

document.getElementById('easy').addEventListener('click', () => {
    gameMode = 'single';
    difficulty = 'Easy';
    startGame();
});

document.getElementById('medium').addEventListener('click', () => {
    gameMode = 'single';
    difficulty = 'Medium';
    startGame();
});

document.getElementById('impossible').addEventListener('click', () => {
    gameMode = 'single';
    difficulty = 'Impossible';
    startGame();
});

// Switch symbol
document.getElementById('switchSymbol').addEventListener('click', () => {
    if (playerSymbol === 'X') {
        playerSymbol = 'O';
        computerSymbol = 'X';
    } else {
        playerSymbol = 'X';
        computerSymbol = 'O';
    }

    updateSymbolButtonText();

    if (gameMode === 'single' && playerSymbol === 'O') {
        currentPlayer = computerSymbol;

        if (gameActive) {
            gameActive = false;
            setTimeout(computerMove, 500);
        }
    } else {
        currentPlayer = 'X';
    }

    updateStatus();
});

// Game controls
resetButton.addEventListener('click', resetGame);
changeModeButton.addEventListener('click', changeMode);

// Delegated board listener
boardElement.addEventListener('click', (event) => {
    const cell = event.target.closest('.cell');

    if (cell) {
        cellClick(cell);
    }
});

// =========================================================
// Game mode
// =========================================================

function changeMode() {
    scores = {
        X: 0,
        O: 0
    };

    scoreXDisplay.textContent = '0';
    scoreODisplay.textContent = '0';

    gameMode = '';
    gameActive = false;

    gameBoard.style.display = 'none';
    modeSelection.style.display = '';
    hero.style.display = '';

    resetBoard();
}

function startGame() {
    player1NameCustom = false;
    player2NameCustom = false;

    clearCellAnimations();
    resetBoard();

    gameActive = true;
    currentPlayer = 'X';

    if (gameMode === 'single') {
        updateStatusText();

        player2Icon.classList.remove('bi-person-fill');
        player2Icon.classList.add('bi-robot');

        player1Name.textContent = t('you');
        player2Name.textContent = t('robot');

        player1SymbolDisplay.textContent = `(${playerSymbol}):`;
        player2SymbolDisplay.textContent = `(${computerSymbol}):`;

        if (playerSymbol === 'O') {
            currentPlayer = computerSymbol;
            gameActive = false;

            setTimeout(() => {
                if (gameMode === 'single') {
                    computerMove();
                }
            }, 500);
        }
    } else if (gameMode === 'two') {
        updateStatusText();

        player2Icon.classList.remove('bi-robot');
        player2Icon.classList.add('bi-person-fill');

        player1Name.textContent = t('player1');
        player2Name.textContent = t('player2');

        player1SymbolDisplay.textContent = '(X):';
        player2SymbolDisplay.textContent = '(O):';

        currentPlayer = 'X';
        gameActive = true;
    }

    modeSelection.style.display = 'none';
    hero.style.display = 'none';
    gameBoard.style.display = '';

    updateStatus();

    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.classList.add('visible');
        }, index * 100);
    });
}
function resetGame() {
    clearCellAnimations();
    resetBoard();

    gameActive = true;

    if (gameMode === 'single' && playerSymbol === 'O') {
        currentPlayer = computerSymbol;
        gameActive = false;

        updateStatus();

        setTimeout(() => {
            computerMove();
        }, 500);
    } else {
        currentPlayer = 'X';
        updateStatus();
    }

    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.classList.add('reset-animation');

            setTimeout(() => {
                cell.classList.remove('reset-animation');
                cell.classList.add('visible');
            }, 500);
        }, index * 50);
    });
}

function resetBoard() {
    board.fill('');

    currentPlayer = 'X';

    cells.forEach((cell) => {
        cell.textContent = '';
        cell.classList.remove(
            'win',
            'scale-in',
            'visible',
            'reset-animation'
        );
    });

    if (equalDisplay) {
        equalDisplay.classList.add('opacity-0');
    }

    if (scoreBoard) {
        scoreBoard.classList.remove('selectPlayerScore');
    }

    if (player1ScoreEl) {
        player1ScoreEl.classList.remove(
            'selectPlayerScore',
            'winPlayerScore'
        );
    }

    if (player2ScoreEl) {
        player2ScoreEl.classList.remove(
            'selectPlayerScore',
            'winPlayerScore'
        );
    }
}

// =========================================================
// Cell and player handling
// =========================================================

function cellClick(cell) {
    const index = Number(cell.getAttribute('data-index'));

    if (board[index] !== '' || !gameActive) {
        return;
    }

    if (
        gameMode === 'single' &&
        currentPlayer !== playerSymbol
    ) {
        return;
    }

    updateCell(cell, index);

    checkForWinner();

    if (!gameActive) {
        return;
    }

    if (gameMode === 'two') {
        return;
    }

    if (
        gameMode === 'single' &&
        currentPlayer === computerSymbol
    ) {
        gameActive = false;

        setTimeout(() => {
            if (gameMode === 'single' && !getWinner()) {
                computerMove();
            }
        }, 500);
    }
}

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('scale-in');
}

function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
}

function updateStatus() {
    if (!player1ScoreEl || !player2ScoreEl) {
        return;
    }

    if (currentPlayer === playerSymbol) {
        player1ScoreEl.classList.add('selectPlayerScore');
        player2ScoreEl.classList.remove('selectPlayerScore');
    } else {
        player1ScoreEl.classList.remove('selectPlayerScore');
        player2ScoreEl.classList.add('selectPlayerScore');
    }

    gameActive = true;
}

function clearScoreHighlights() {
    if (player1ScoreEl) {
        player1ScoreEl.classList.remove(
            'selectPlayerScore',
            'winPlayerScore'
        );
    }

    if (player2ScoreEl) {
        player2ScoreEl.classList.remove(
            'selectPlayerScore',
            'winPlayerScore'
        );
    }
}

function clearCellAnimations() {
    cells.forEach((cell) => {
        cell.classList.remove(
            'scale-in',
            'win',
            'visible',
            'reset-animation'
        );
    });

    clearScoreHighlights();

    if (equalDisplay) {
        equalDisplay.classList.add('opacity-0');
    }

    if (scoreBoard) {
        scoreBoard.classList.remove('selectPlayerScore');
    }
}

// =========================================================
// Winner and score
// =========================================================

function getWinner(state = board) {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

        if (
            state[a] !== '' &&
            state[a] === state[b] &&
            state[a] === state[c]
        ) {
            return state[a];
        }
    }

    if (!state.includes('')) {
        return 'tie';
    }

    return null;
}

function checkForWinner() {
    const winner = getWinner();

    if (winner === 'X' || winner === 'O') {
        gameActive = false;

        clearScoreHighlights();

        if (winner === playerSymbol) {
            player1ScoreEl.classList.add('winPlayerScore');
        } else {
            player2ScoreEl.classList.add('winPlayerScore');
        }

        const winningCombination = winningCombinations.find(
            ([a, b, c]) =>
                board[a] !== '' &&
                board[a] === board[b] &&
                board[a] === board[c]
        );

        if (winningCombination) {
            highlightWinningCells(winningCombination);
        }

        updateScore(winner);

        setTimeout(resetGame, 2005);

        return;
    }

    if (winner === 'tie') {
        clearScoreHighlights();

        equalDisplay.classList.remove('opacity-0');
        scoreBoard.classList.add('selectPlayerScore');

        gameActive = false;

        setTimeout(resetGame, 1500);

        return;
    }

    changePlayer();
}

function highlightWinningCells(combination) {
    combination.forEach((index) => {
        cells[index].classList.add('win');
    });
}

function updateScore(winningSymbol) {
    scores[winningSymbol]++;
    if (currentPlayer == 'X') {
        scoreXDisplay.textContent = scores.X;
        scoreODisplay.textContent = scores.O;
    }
    else {
        scoreXDisplay.textContent = scores.O;
        scoreODisplay.textContent = scores.X;
    }
}

// =========================================================
// Computer AI
// =========================================================

function computerMove() {
    if (gameMode !== 'single') {
        return;
    }

    if (getWinner() !== null) {
        return;
    }

    let index;

    switch (difficulty) {
        case 'Easy':
            index =
                Math.random() < 0.7
                    ? getSmartMove()
                    : getRandomEmptyCell();
            break;

        case 'Medium':
            index =
                Math.random() < 0.9
                    ? getSmartMove()
                    : getRandomEmptyCell();
            break;

        case 'Impossible':
            index = getBestMove();
            break;

        default:
            index = getRandomEmptyCell();
            break;
    }

    if (index === -1 || index === undefined) {
        return;
    }

    const cell = cells[index];

    currentPlayer = computerSymbol;

    updateCell(cell, index);
    checkForWinner();
}

// =========================================================
// Easy / Medium AI
// =========================================================

function getRandomEmptyCell() {
    const emptyCells = [];

    for (let index = 0; index < 9; index++) {
        if (board[index] === '') {
            emptyCells.push(index);
        }
    }

    if (emptyCells.length === 0) {
        return -1;
    }

    return emptyCells[
        Math.floor(Math.random() * emptyCells.length)
    ];
}

function getSmartMove() {
    // Computer winning move
    const computerWinningMove = findWinningMove(computerSymbol);

    if (computerWinningMove !== -1) {
        return computerWinningMove;
    }

    // Block player's winning move
    const playerWinningMove = findWinningMove(playerSymbol);

    if (playerWinningMove !== -1) {
        return playerWinningMove;
    }

    // Center
    if (board[4] === '') {
        return 4;
    }

    // Corners
    const corners = [0, 2, 6, 8];

    const freeCorners = corners.filter(
        (index) => board[index] === ''
    );

    if (freeCorners.length > 0) {
        return freeCorners[
            Math.floor(Math.random() * freeCorners.length)
        ];
    }

    // Edges
    const edges = [1, 3, 5, 7];

    const freeEdges = edges.filter(
        (index) => board[index] === ''
    );

    if (freeEdges.length > 0) {
        return freeEdges[
            Math.floor(Math.random() * freeEdges.length)
        ];
    }

    return getRandomEmptyCell();
}

function findWinningMove(symbol) {
    for (let index = 0; index < 9; index++) {
        if (board[index] !== '') {
            continue;
        }

        board[index] = symbol;

        const winner = getWinner();

        board[index] = '';

        if (winner === symbol) {
            return index;
        }
    }

    return -1;
}

// =========================================================
// Impossible AI
// Lightweight perfect Minimax
// No Map, no string cache, no duplicated functions
// =========================================================

const PERFECT_MOVE_ORDER = [
    4,
    0,
    2,
    6,
    8,
    1,
    3,
    5,
    7
];

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (const index of PERFECT_MOVE_ORDER) {
        if (board[index] !== '') {
            continue;
        }

        board[index] = computerSymbol;

        const score = minimax(
            0,
            false,
            -Infinity,
            Infinity
        );

        board[index] = '';

        if (score > bestScore) {
            bestScore = score;
            bestMove = index;
        }
    }

    return bestMove;
}

function minimax(depth, isMaximizing, alpha, beta) {
    const winner = getWinner();

    if (winner === computerSymbol) {
        return 10 - depth;
    }

    if (winner === playerSymbol) {
        return depth - 10;
    }

    if (winner === 'tie') {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;

        for (const index of PERFECT_MOVE_ORDER) {
            if (board[index] !== '') {
                continue;
            }

            board[index] = computerSymbol;

            const score = minimax(
                depth + 1,
                false,
                alpha,
                beta
            );

            board[index] = '';

            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, bestScore);

            if (beta <= alpha) {
                break;
            }
        }

        return bestScore;
    }

    let bestScore = Infinity;

    for (const index of PERFECT_MOVE_ORDER) {
        if (board[index] !== '') {
            continue;
        }

        board[index] = playerSymbol;

        const score = minimax(
            depth + 1,
            true,
            alpha,
            beta
        );

        board[index] = '';

        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, bestScore);

        if (beta <= alpha) {
            break;
        }
    }

    return bestScore;
}
