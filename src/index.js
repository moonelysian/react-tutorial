import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const boardRow = []
    for ( let i = 0 ; i < 3 ; i++ ) {
      const squares = []
      for (let j = 0 ; j < 3 ; j ++) {
        squares.push(this.renderSquare(3 * i + j))
      }
      boardRow.push(<div key={ i + 1 } className="board-row">{squares}</div>)
    } 
    return (
      <div>
        {boardRow}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          position: {
            row: null,
            col: null
          }
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isAsc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares, this.state.stepNumber) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          position: {
            row: Math.floor(i / 3 + 1),
            col: i % 3 + 1
          }
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  handleToggle() {
    this.setState({
      isAsc: !this.state.isAsc
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, this.state.stepNumber);
    const isAsc = this.state.isAsc;

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move} | (${step.position.row}, ${step.position.col})` :
        'Go to game start';
      return (
        <li key={move}>
          <button 
            onClick = {() => this.jumpTo(move)}
            className = { move === this.state.stepNumber ? 'font-weight-bold' : ''}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    if (!isAsc) {
      moves.reverse();
    }

    const reverseButton = (
      <label class="switch">
        <input type="checkbox" onClick = {() => this.handleToggle()}></input>
        <span class="slider round"></span>
      </label>
    )
    

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <ol>{reverseButton}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares, stepNumber) {
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
    
    if (stepNumber === 9) {
      return "무승부"
    }
  }
  return null;
}