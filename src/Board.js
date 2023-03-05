import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 7, ncols = 7, chanceLightStartsOn = 0.2 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let i = 0; i < nrows; i++){
      let rowArray = []
      for (let k = 0; k < ncols; k++){
        rowArray.push(Math.random() < chanceLightStartsOn);
      }
      initialBoard.push(rowArray);
    }
    return initialBoard;
  }

  function hasWon() {
    return board.every(rowArray => rowArray.every(cell > !cell));
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const copy = oldBoard.map(rowArray => [...rowArray]);
      flipCell(y, x, copy);
      flipCell(y+1, x, copy);
      flipCell(y-1, x, copy);
      flipCell(y, x+1, copy);
      flipCell(y, x-1, copy);
      return copy
    });
  }

  if (hasWon()){
    return <div>Winner!</div>;
  }

  let tableBoard = [];
  for (let i = 0; i < nrows; i++){
    let rowArray = [];
    for (let k = 0; k < ncols; k++){
      let coord = `${y} - ${x}`;
      rowArray.push(
        <Cell
          key = {coord}
          isLit = {board[y][x]}
          flipCellsAroundMe = {() => flipCellsAround(coord)}
        />
        );
    }
    tableBoard.push(<tr key = {y}>{rowArray}</tr>);
  }

  return(
    <table className = "Board">
      <tbody>{tableBoard}</tbody>
    </table>
  );
}
export default Board;
