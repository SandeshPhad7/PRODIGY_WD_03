const board = document.getElementById('board');
const statusText = document.getElementById('status');
const winLine = document.getElementById('winLine');

let gameState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const winCombos = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // columns
  [0,4,8], [2,4,6]           // diagonals
];

// create grid cells
for (let i = 0; i < 9; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.dataset.index = i;
  cell.addEventListener('click', handleClick);
  board.appendChild(cell);
}

function handleClick(e) {
  const index = e.target.dataset.index;

  if (gameState[index] !== "" || !gameActive) return;

  gameState[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin()) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
  } else if (!gameState.includes("")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWin() {
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      drawLine(combo);
      return true;
    }
  }
  return false;
}

function drawLine([a, b, c]) {
  const cells = document.querySelectorAll('.cell');
  const rectA = cells[a].getBoundingClientRect();
  const rectC = cells[c].getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();

  const x1 = rectA.left + rectA.width / 2 - boardRect.left;
  const y1 = rectA.top + rectA.height / 2 - boardRect.top;
  const x2 = rectC.left + rectC.width / 2 - boardRect.left;
  const y2 = rectC.top + rectC.height / 2 - boardRect.top;

  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

  winLine.style.left = `${x1}px`;
  winLine.style.top = `${y1}px`;
  winLine.style.width = `${length}px`;
  winLine.style.transform = `rotate(${angle}deg) scaleX(1)`;
}

function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Player X's turn";
  winLine.style.transform = "scaleX(0)";
  document.querySelectorAll('.cell').forEach(cell => cell.textContent = "");
}
