import React, { useState } from "react";

// square component that'll be called/used in Board funct. to add more squares
// Board component will render square component using JSX syntax (ex: <Square/>)
  // using props, we'll pass values to each square from parent component(Board) to it's child(square)

  // since the square's state is being tracked/handled in board component, we won't need a useState function in the square function..
  // ..as well as the handleClick function, we just need the return with the prop value
  // square component will now receive the board component's square state value thru a prop

  // with the prop from board component being passed to square component, we'll need to accept that prop (onSquareClick)
  function Square({ value, onSquareClick }) {

/*
  // using state function, we can store current value of square in state and change it when square is clicked
  // using value prop, we'll store current value which is null, and setValue will update value when square it's clicked  
  const [value, setValue] = useState(null);

  // making component interactive by creating a function that'll perform an action when button clicked 
  // when button is clicked, onClick property will call the function and execute function code
  function handleClick() {
    // we'll update setValue here so when it's clicked, it displays an X 
    // by calling setValue funct. from onClick handler, 
    // ..we're telling react to re-render square whenever button is clicked
    setValue('X');
  }

  // since we're now using state, each square has it's own state.. 
  // ..the value stored in square is independent of the others. 
  // ..when calling a set funct. in a component, react auto updates the child components inside too  
  return <button className="square" onClick={handleClick}>{value}</button>
*/

  // we're returning the square's state value that's coming from the board component
  // when a square's button is clicked, we'll call the function that handle the click event in board component
  return <button className="square" onClick={onSquareClick}>{value}</button>
}


// board function is controlled by the props it receives
// board will call onPlay function with the updated squares array when player makes a move
function Board({ xIsNext, squares, onPlay }) {

  // lifting state up; 
  // since each square component maintains a part of the game's state..
  // ..we need to somehow know the state of each 9 square componenets
    // best way to do this is store the game's state in the parent board component instead of each square
    // the board component can tell each square what to display by passing a prop
      // declaring shared state in the parent component allows us to collect data from multiple children (or have two child components communicate with each other)..
      // the parent component can pass that state back down to the children thru props
      // this keeps the child component in sync with each other and with their parent


/*
  // declaring a square state var that defaults to an array of 9 nulls, corresponding to the 9 squares
    // each array entry corresponds to the value of a square
  // when filling the board later, it'll look like this --> ['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
  const [squares, setSquares] = useState(Array(9).fill(null));

  // each time a player moves, xIsNext will be flipped to determine which player goes next, saving the game's state
  const [xIsNext, setXIsNext] = useState(true);
*/


  // to change what happens when a square is clicked, board component will need to maintain which squares are filled
  // to create a way for square component to update board's state, we need to pass down a function from board to square component..
  // ..which square component will call when a square is clicked.
  // since square component is receiving and calling that function when clicked.. 
  // ..it'll be a prop passed in to square component and called in an onClick property..
  // board component will construct that function where it'll handle the click event..
  // ..then we'll connect that function to the prop that'll be passed to square component
  
  // this function will update the square by updating the squares array holding board's state
  function handleClick(i) {
    // checking to see if a square already has an X or O value, or if a player has won 
    // in either case, exit early by returning
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // creating a copy of the squares array 
    const nextSquares = squares.slice();

    // we'll update the board's handleClick function to flip the value fo xIsNext
    // updating nextSquares to add X to the square in question
    if (xIsNext) {  
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    
  /*
    // updating the changed state of a square, triggerring a re-render of squares state component
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  */
    onPlay(nextSquares);
  }


  // letting players know when game is over and who won
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    // declaring winner
    status = "Winner: " + winner;
  } else {
    // ternary operator determining which player's turn is next
    status = "Next player: " + (xIsNext ? "X" : "O");
  }



  // react components need to return a single JSX elems, not multiple
  // to wrap multiple JSX elems, you need fragments <>..</>
  return ( 
    // adding multiple squares below puts them all in a singe line
    // to group them in rows, need to group square with div's and css classes
    // add value prop to each square component render by board component (ex: <Square value="1" />)

    // with the square state variable, board component can pass the value prop down to each square that it renders 
    
    // we'll now connect the prop to function handling the click event
    // to update each square when clicked, we'll need to call the handleClick function with it's correponsding array index
      // cannot call handleClick(0). This handleClick(0) call will be part of rendering the board component
      // Calling handleClick(0) will alter the state of board component by calling setSquares, which will call the board componen over and over again
      // instead of create and calling a separate function that'll handle each squares event..
      // ..we'll use an arrow function (() => ...) which will execute the code when a square is clicked, calling handleClick(0)

    <React.Fragment>
      <div className="status">{status}</div>
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
  );
}

// component, piece of resuable code that represents parts of a UI
// components are used to render, manage, and update the UI elems in the application
// export keyword makes funct. accessible outside this file. 
// default keyword tells other files using your code that this is the main function in file
  // game component will display a list of past moves, containing the history of entire game
export default function Game() {

  // this states tracks the history of moves
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // need to keep track of which step the user is currently viewing
  const [currentMove, setCurrentMove] = useState(0);
    // if we already now the value of currentMove(depending on if it's even or odd)..
    // ..we can always figure out what xIsNext should be based on currentMove
      // const [xIsNext, setXIsNext] = useState(true);
  const xIsNext = currentMove % 2 === 0;  

  // to render the squares for the current move, read the last squares array from history
  // modifying game component to render the currently selected move, instead of always rendering final move
  const currentSquares = history[currentMove];

  // handlePlay function will be called by board component to update the game
  // we'll update history by appending the updated squares array as a new history entry
  // this function will update game's state to trigger a re-render 
  function handlePlay(nextSquares) {
    // [...history, nextSquares] <-- creating a new array containing all items in history followed by nextSquares
      // ex: if history is [[null,null,null], ["X",null,null]] and nextSquares is ["X",null,"O"]... 
      // ..then the new [...history, nextSquares] array will be [[null,null,null], ["X",null,null], ["X",null,"O"]]

    // if going back in time and making a new move from that point, we only want to keep the history up to that point
    // adding nextSquares after all items in history.slice(0, cM+1) so we're only keep that portion of the old history
    const nextHistory = [...history.slice(0, currentMove+1), nextSquares];
    setHistory(nextHistory);
    // each time a move is made, update current move to point to the latest history entry
    setCurrentMove(nextHistory.length-1);
  }


  // updating player's current move & setting setXIsNext true if currentMove is even
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }


  // transforming history of moves into react elems representing buttons on the screen
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    // displaying list of buttons to "jump" to past moves
    // each past move has a unique ID associated with it, we can use move as key for the lists key
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })


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



// calculating a winner by checking which squares are filled with same X's or O's
function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  for (let i=0; i<lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}