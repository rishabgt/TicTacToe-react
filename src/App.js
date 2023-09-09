import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === 0) {
      description = "Go to game start";
    } else if (move === currentMove) {
      return (
        <li key={move}>
          <pre>You are at move number {move}</pre>
        </li>
      );
    } else {
      description = "Go to move number " + move;
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Square(props) {
let highlight = false;
  if(props.winner !== null){
    props.winner[1].forEach(element => {
        if(element === props.id)
            highlight = true;
    });
  }
  return (
    <button className={`square ${highlight?'highlight':''}`} onClick={()=>props.onSquareClick()}>
      {props.value}
    </button>
  );
}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    if (xIsNext) nextSquares[i] = "X";
    else nextSquares[i] = "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner is " + winner[0];
  } else {
    status = "Next player is " + (xIsNext ? "X" : "O");
  }
  const board = Array(3)
    .fill(0)
    .map((value, index) => {
      return (
        <div key={index} className="board-row">
          {Array(3)
            .fill(0)
            .map((val, i) => {
              let offset = 3 * index;
              return (
                <Square
                  id={offset+i}
                  winner={winner}
                  key={offset + i}
                  value={squares[i + offset]}
                  onSquareClick={() => handleClick(i + offset)}
                />
              );
            })}
        </div>
      );
    });
  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return [squares[a],lines[i]];
      }
    }
    return null;
  }
}
