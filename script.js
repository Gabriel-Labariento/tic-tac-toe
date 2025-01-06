const cell = (function() {
    let value = null;

    const takeToken = (token) => {value = token};
    const getValue = () => value;

    return {takeToken, getValue};
}
)();

const playerMaker = ((name, token) => {
    const playerToken = token;
    const playerName = name;
    let points = 0;
    
    const placeToken = () => playerToken;
    const getName = () => playerName;
    const addPoints = () => points++;
    const getPoints = () => points;
    
    return {placeToken, addPoints, getPoints, getName}
})();

const gameBoard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++){
        board[i] = []
        for (let j = 0; j < columns; j++){
            board[i].push(cell);
        }
    }

    const getBoard = () => board;
    const printBoard = () => {
        const formattedBoard = board.map(row => 
            row.map(cell => cell.getValue())
        )
        console.table(formattedBoard);
    }

    const resetBoard = (function() {
        board.map(row => row.map(cell => cell.takeToken(null))
        )
    })
    
    return{getBoard, printBoard, resetBoard};
})();

const gameMaster = (function(){
    
})();


