const cell = () => {
    let value = null;

    const setValue = (token) => {value = token};
    const getValue = () => value;

    return {setValue, getValue};
};

const playerMaker = (name, token) => {
    const playerToken = token;
    const playerName = name;
    let points = 0;
    
    const makeMove = (position) => gameBoard.placeToken(position, playerToken);
    const getName = () => playerName;
    const addPoints = () => points++;
    const getPoints = () => points;
    const getToken = () => token;
    
    return {makeMove, addPoints, getPoints, getName, getToken}
};

const gameBoard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++){
        board[i] = []
        for (let j = 0; j < columns; j++){
            board[i].push(cell());
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        const formattedBoard = board.map(row => 
            row.map(cell => cell.getValue())
        )
        console.table(formattedBoard);
    }

    const resetBoard = () => {
        board.map(row => row.map(cell => cell.setValue(null))
        )
    }

    const placeToken = (function(position, token) {
        let row = (position >= 3) ? Math.floor(position / 3) : 0; 
        let column = position - (3 * row);

        board[row][column].setValue(token);
    })
    return{getBoard, printBoard, resetBoard, placeToken};
})();

const gameMaster = (function(){
    const playerOne = playerMaker("playerOne", "X");
    const playerTwo = playerMaker("playerTwo", "O");
    
    playerOne.makeMove(0);
    playerTwo.makeMove(1);
    playerOne.makeMove(2);
    playerTwo.makeMove(3);
    playerOne.makeMove(4);
    playerTwo.makeMove(5);
    playerOne.makeMove(6);
    playerTwo.makeMove(7);
    playerOne.makeMove(8);
    gameBoard.printBoard(); 

})();


