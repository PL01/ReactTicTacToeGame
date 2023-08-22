import React from 'react';
import { useState } from 'react';

// we import useState. It's a special function by React that can call from
// the componenet to "remember" things.


function Square({value, onSquareClick}) {
    return(
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
  }

function Board({xIsNext, squares, onPlay}){

    function handleClick(i){

        if(squares[i] || calculateWinner(squares)){
            return;
        }
        /*
        When you mark a square with a X or an O you aren’t first checking to see if the square already has a X or O value. 
        You can fix this by returning early. You’ll check to see if the square already has a X or an O. If the square is already
        filled, you will return in the handleClick function early—before it tries to update the board state.
        
        Call calculateWinner(squares) in the Board component’s handleClick function to check if a player has won.
        You can perform this check at the same time you check if a user has clicked a square that already has a X or and O. 
        */

        const nextSquares = squares.slice();
        //The handleClick function creates a copy of the squares array (nextSquares) with the JavaScript slice() Array method
        if(xIsNext){
            nextSquares[i] = "X";
        }
        else{
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);

        // handleClick updates the nextSquares array to add X to the first ([0] index) square.
        // we add an argument i to the handleClick function that takes the index of the square to update
        /*
        * Calling the setSquares function lets React know the state of the component has changed.
        * This will trigger a re-render of the components that use the squares state (Board) 
        * as well as its child components (the Square components that make up the board).
        */
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner){
        status = "Winner: " + winner;
    }
    else{
        status = "Next player: " + (xIsNext ? "X" : "O");
    }
    /*
    To let the players know when the game is over, you can display text such as “Winner: X” or “Winner: O”. 
    To do that you’ll add a status section to the Board component. 
    The status will display the winner if the game is over and if the game is ongoing you’ll display which player’s turn is next.
    */

    return(
        <React.Fragment>
            <div className='status'>{status}</div>
            <div className="board-row">
            <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
            <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
            <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div> 
            <div className="board-row">
            <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
            <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
            <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
            <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
            <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
            <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </React.Fragment>
        // To make the grid state, we surround 3 square buttons with divs.
    );
}

export default function Game(){

    const [xIsNext, setXIsNext] = useState(true);
    const [history, setHistory] = useState(Array(9).fill(null)); 
    // Array(9).fill(null) creates an array with nine elements and sets each of them to null
    // The useState() declares a squares state variable that’s initially set to that array. 
    // Each entry in the array corresponds to the value of a square.

    const [currentMove, setCurrentMove] = useState(0);

    const currentSquares = history[currentMove];

    function handleplay(nextSquares){
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        //[...history, nextSquares] creates a new array that contains all the items in history, followed by nextSquares
        setHistory(nextHistory); 
        setCurrentMove(nextHistory.length - 1);
        setXIsNext(!xIsNext);
    }

    function jumpTo(nextMove){
        setCurrentMove(nextMove);
        setXIsNext(nextMove % 2 === 0);
    }

    const moves = history.map((squares, move) => {
        let description;
        if(move > 0){
            description = 'Go to move #' + move;
        }
        else{
            description = 'Go to game start';
        }
        return(
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return(
        <div className='game'>
            <div className='game-board'>
                <Board xIsNext={xIsNext} squares = {currentSquares} onPlay = {handleplay}/>
            </div>
            <div className='game-info'>
                <ol>{moves}</ol>
            </div>
        </div>
    )
}

function calculateWinner(squares){
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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
        }
    }
    return null;
}

/* NOTES:
* In React, a COMPONENT is a piece of reusable code that represents a part of a user interface. 
* Components are used to render, manage, and update the UI elements in your application.
* export makes it available outside the file, default tells other files using your code that it’s the main function in your file
* <button> is a JSX element. A JSX element is a combination of JavaScript code and HTML tags that describes what you’d like to display.
* className="square" is a button property or prop that tells CSS how to style the button.
* React components need to return a single JSX element and not multiple adjacent JSX elements like two buttons. 
* Unlike the browser divs, your own components Board and Square must start with a capital letter
*
* By calling the set function from an onClick handler, you’re telling React to re-render that Square whenever its <button> is clicked. 
* After the update, the Square’s value will be 'X', so you’ll see the “X” on the game board.
* Each Square has its own state: the value stored in each Square is completely independent of the others. 
* When you call a set function in a component, React automatically updates the child components inside too.
*
* To collect data from multiple children, or to have two child components communicate with each other, declare the shared state in their parent component instead. 
* The parent component can pass that state back down to the children via props. This keeps the child components in sync with each other and with their parent.
key is a special and reserved property in React. When an element is created, React extracts the key property and stores the key directly on the returned element. 
*
* Even though key may look like it is passed as props, React automatically uses key to decide which components to update. 
* There’s no way for a component to ask what key its parent specified.
* It’s strongly recommended that you assign proper keys whenever you build dynamic lists. 
* If you don’t have an appropriate key, you may want to consider restructuring your data so that you do.


*/