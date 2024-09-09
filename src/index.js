let board = [];
let openedSquares = [];
let flaggedSquares = [];
let bombCount = 0;
let squaresLeft = 0;

let bombProbability = 3;
let maxProbability = 15;

let currentDifficulty = 'easy'; 

function minesweeperGameBootstrapper(rowCount, colCount) {
    let difficulties = {
        'easy': { rowCount: 9, colCount: 9 },
        'medium': { rowCount: 16, colCount: 16 },
        'expert': { rowCount: 16, colCount: 30 }
    };

    let boardMetadata = difficulties[currentDifficulty];

    if (rowCount != null && colCount != null) {
        boardMetadata = { rowCount: rowCount, colCount: colCount };
    }

    generateBoard(boardMetadata);
}

function generateBoard(boardMetadata) {
    squaresLeft = boardMetadata.colCount * boardMetadata.rowCount;
    bombCount = 0;
    board = [];

    for (let i = 0; i < boardMetadata.rowCount; i++) {
        board[i] = [];
        for (let j = 0; j < boardMetadata.colCount; j++) {
            board[i][j] = new BoardSquare(false, 0); 
        }
    }

    for (let i = 0; i < boardMetadata.rowCount; i++) {
        for (let j = 0; j < boardMetadata.colCount; j++) {
            if (Math.random() * maxProbability < bombProbability) {
                board[i][j].hasBomb = true;
                bombCount++;
            }
        }
    }

    for (let i = 0; i < boardMetadata.rowCount; i++) {
        for (let j = 0; j < boardMetadata.colCount; j++) {
            if (!board[i][j].hasBomb) {
                board[i][j].bombsAround = countBombsAround(i, j, boardMetadata);
            }
        }
    }


    renderBoard(boardMetadata);
}

function countBombsAround(row, col, boardMetadata) {
    let bombCounter = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = row + i;
            let newCol = col + j;
            if (newRow >= 0 && newRow < boardMetadata.rowCount && newCol >= 0 && newCol < boardMetadata.colCount) {
                if (board[newRow][newCol].hasBomb) {
                    bombCounter++;
                }
            }
        }
    }
    return bombCounter;
}

function renderBoard(boardMetadata) {
    const boardDiv = document.getElementById('minesweeper-board');
    boardDiv.innerHTML = '';
    boardDiv.style.gridTemplateColumns = `repeat(${boardMetadata.colCount}, 30px)`;

    for (let i = 0; i < boardMetadata.rowCount; i++) {
        for (let j = 0; j < boardMetadata.colCount; j++) {
            const squareDiv = document.createElement('div');
            squareDiv.classList.add('square');
            squareDiv.setAttribute('data-row', i);
            squareDiv.setAttribute('data-col', j);
            squareDiv.addEventListener('click', handleSquareClick);
            squareDiv.addEventListener('contextmenu', handleRightClick);
            boardDiv.appendChild(squareDiv);
        }
    }
}

function handleSquareClick(event) {
    const row = parseInt(event.target.getAttribute('data-row'));
    const col = parseInt(event.target.getAttribute('data-col'));
    discoverTile(row, col);
}

function handleRightClick(event) {
    event.preventDefault();
    const row = parseInt(event.target.getAttribute('data-row'));
    const col = parseInt(event.target.getAttribute('data-col'));
    toggleFlag(row, col);
}

function discoverTile(row, col) {
    if (board[row][col].isOpened || board[row][col].isFlagged) {
        return;
    }


    openSquare(row, col);

    
    if (board[row][col].hasBomb) {
        revealBombs();
        alert("Game Over! You hit a bomb!");
        return;
    }

    
    if (board[row][col].bombsAround === 0) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let newRow = row + i;
                let newCol = col + j;
                if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length) {
                    discoverTile(newRow, newCol); 
                }
            }
        }
    }

    
    checkWin();
}

function openSquare(row, col) {
    const square = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    if (!board[row][col].isOpened) {
        board[row][col].isOpened = true;
        square.classList.add('opened');
        if (board[row][col].bombsAround > 0) {
            square.textContent = board[row][col].bombsAround;
        }
    }
}

function toggleFlag(row, col) {
    const square = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    if (!board[row][col].isOpened) {
        if (!board[row][col].isFlagged) {
            board[row][col].isFlagged = true;
            square.classList.add('flagged');
        } else {
            board[row][col].isFlagged = false;
            square.classList.remove('flagged');
        }
    }
}

function revealBombs() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].hasBomb) {
                const square = document.querySelector(`[data-row='${i}'][data-col='${j}']`);
                square.classList.add('bomb');
            }
        }
    }
}

function checkWin() {
    let totalSquares = board.length * board[0].length;
    let openedCount = document.querySelectorAll('.opened').length;
    if (openedCount === totalSquares - bombCount) {
        alert("Congratulations! You've cleared the minefield!");
    }
}

function resetGame() {
    bombProbability=3
    maxProbability=15
    document.getElementById("bomb-input").value="";
    document.getElementById("max-input").value="";
    minesweeperGameBootstrapper();
}

class BoardSquare {
    constructor(hasBomb, bombsAround) {
        this.hasBomb = hasBomb;
        this.bombsAround = bombsAround;
        this.isOpened = false;
        this.isFlagged = false;
    }
}

function selectBombProbability(){
    if(document.getElementById('bomb-input').value=="")
        alert("Value should not be null.");
    else{
        bombProbability=document.getElementById('bomb-input').value;
        alert("Bomb probability value is "+ bombProbability);
    }
}

function selectMaxProbability(){
    if(document.getElementById('max-input').value=="")
        alert("Value should not be null.");
    else{
        maxProbability=document.getElementById('max-input').value;
        alert("Maximum probability value is "+ maxProbability);
    }
}


document.getElementById('easy-btn').addEventListener('click', function () {
    currentDifficulty = 'easy';
    resetGame();
});

document.getElementById('medium-btn').addEventListener('click', function () {
    currentDifficulty = 'medium';
    resetGame();
});

document.getElementById('expert-btn').addEventListener('click', function () {
    currentDifficulty = 'expert';
    resetGame();
});


document.getElementById('restart-btn').addEventListener('click', resetGame);


document.getElementById('max-btn').addEventListener('click', selectMaxProbability);

document.getElementById('bomb-btn').addEventListener('click', selectBombProbability);


minesweeperGameBootstrapper();
