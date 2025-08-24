/***** DOM HOOKS (UI only) *****/
const scoreX   = document.querySelector("#score-x");
const scoreO   = document.querySelector("#score-o");
const statusEl = document.querySelector("#status");
const boardEl  = document.querySelector("#board");
const cells    = document.querySelectorAll(".cell");
const resetBtn = document.querySelector(".reset");

// Creating Game skeleton
function createGame() {
  // Private variables
  let board = Array(9).fill(null);
  let currentPlayer = "X";
  let score = { X: 0, O: 0 };
  let gameOver = false;
  let winner = null
  let winLine = null

  const state = () => ({
    board: [...board],
    currentPlayer,
    score: { ...score },
    gameOver,
    winLine,
    winner
  });

  const LINES = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  const checkWinner = (B = board) => {
    for (const [a, b, c] of LINES) {
      if (B[a] && B[a] === B[b] && B[a] === B[c]) {
        return [a, b, c];
      }
    }
    return null;
  };

  const play = (i) => {
    if (gameOver) return state();
    if (board[i] !== null) return state();

    board[i] = currentPlayer;

    const line = checkWinner();
    if (line) {
      gameOver = true;
      score[currentPlayer] += 1;
      winner = currentPlayer
      winLine = line
      return state();
    }

    if (board.every(cell => cell !== null)) {
      gameOver = true;
      winLine = null
      winner = null
      return state()
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    return state();
  };

  const reset = () => {
    board.fill(null);
    currentPlayer = "X";
    gameOver = false;
    winner = null;      // NEW
    winLine = null;     // NEW
    // (Optionally keep or remove score reset line)
    return state();

  };

  return { state, reset, play };
}

function render(gameState) {
  // paint cells
  cells.forEach((btn, i) => {
    btn.textContent = gameState.board[i] ?? "";
    btn.classList.remove("win");
  });

  // highlight winning line if any
  if (gameState.winLine) {
    gameState.winLine.forEach(i => cells[i].classList.add("win"));
  }

  // status line (single source of truth)
  if (!gameState.gameOver) {
    statusEl.textContent = `${gameState.currentPlayer}'s turn`;
  } else if (gameState.winner) {
    statusEl.textContent = `${gameState.winner} wins`;
  } else {
    statusEl.textContent = "It's a draw";
  }

  // scores
  scoreX.textContent = gameState.score.X;
  scoreO.textContent = gameState.score.O;
}

// build + initial paint
const game = createGame();
render(game.state());

// reset
resetBtn.addEventListener("click", () => {
  const s = game.reset();
  render(s);
});

// clicks
boardEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".cell");
  if (!btn) return;

  const whichBtn = Number(btn.dataset.index);
  if (Number.isNaN(whichBtn)) return;

  const next = game.play(whichBtn);
  render(next);
});
