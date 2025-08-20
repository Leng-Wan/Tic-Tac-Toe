let score_x = document.querySelector("#score-x")
let score_o = document.querySelector("#score-o")
let statusEl = document.querySelector(".status")
let cells = document.querySelectorAll(".cell")
let reset = document.querySelector(".reset")
let boardEl = document.querySelector("#board")
let gameOver = false;
let board = Array(9).fill(null)
let currentPlayer = "X"
let win = [
    [0,1,2],[3,4,5],[6,7,8], //rows
    [0,3,6],[1,4,7],[2,5,8], //columns
    [0,4,8],[2,4,6] //diagonals
]
let score = {X:0, O:0}
function checkWinner()
{
    for(const[a,b,c] of win)
    {
        if(board[a] && board[a] === board[b] && board[a] === board[c])
        {
            return [a,b,c]
        }
    }
    return null;
}

function endGame(winner,line)
{
    gameOver = true
    statusEl.textContent = `${winner} wins`
    line.forEach(i =>
    {
        cells[i].classList.add("win")
    }
    )
    score[winner]++;
    score_x.textContent = score.X;
    score_o.textContent = score.O;
}
boardEl.addEventListener("click", (e) =>
{
    let btn = e.target.closest(".cell")
    if(!btn)
        return;

    console.log(btn.dataset.index)
    if(gameOver)
    {
        statusEl.textContent = "Restart"
        return
    }

    if(!gameOver)
    {
        let i = Number(btn.dataset.index)
        if(board[i] != null)
            {
                statusEl.textContent = "Cell already filled"
                return
            }
            
        cells[i].textContent = currentPlayer // displaying on UI
        board[i]=currentPlayer //storing in main logic "board"

        //checking winner
        let line = checkWinner()
        if(line)
        {
            endGame(currentPlayer, line)
            return;
        }
        
        //check draw
        if(board.every(cell => cell !==null)) //if(!board.includes(null))
        {
            gameOver = true;
            statusEl.textContent = "It's a draw"
            return
        }

        //switch turn
        currentPlayer = currentPlayer === 'X'?"O":"X"
        statusEl.textContent = `${currentPlayer}'s turn`

        
    }
    
   
})

reset.addEventListener("click", function()
{
    board.fill(null)
    gameOver = false
    currentPlayer = "X"
    statusEl.textContent = "X's turn.."
    cells.forEach(c => 
        {
            c.textContent = "";
            c.classList.remove("win")
        })
})