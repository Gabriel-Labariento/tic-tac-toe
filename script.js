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
    let takenSquares = [];


    const makeMove = (position) => {
        takenSquares.push(position);
        gameBoard.placeToken(position, playerToken)
    };
    
    const getName = () => playerName;
    const addPoints = () => points++;
    const getScore = () => points;
    const getToken = () => playerToken;
    const getTakenSquares = () => takenSquares;
    const resetTakenSquares = () => takenSquares = [];    
    const getComputerChoice = () => {
        let availableSquares = gameBoard.getAvailableSquares();
        return availableSquares[Math.floor(Math.random() * availableSquares.length)]; 
    }
    const getHumanChoice = () => {
        let availableSquares = gameBoard.getAvailableSquares();
        return Math.floor(Math.random() * availableSquares.length);
    }


    return {makeMove, addPoints, getScore, getName, getToken, getComputerChoice, getHumanChoice, getTakenSquares, resetTakenSquares}
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

    const placeToken = (position, token) => {
        if (position < 0 || position > 8) return false;
        const row = Math.floor(position / 3); 
        const column = position % 3;
        board[row][column].setValue(token);
    }

    const getAvailableSquares = () => {
        let availableSquares = [];
        for (let i = 0; i < rows; i++){
            for (let j = 0; j < columns; j++){
                if (board[i][j].getValue() === null){
                    let squarePosition = (i * 3) + j;
                    availableSquares.push(squarePosition)
                }
            }
        }
        return availableSquares;
    }

    return{getBoard, printBoard, resetBoard, placeToken, getAvailableSquares};
})();

const gameMaster = (function(){
    const playerOne = playerMaker("playerOne", "X");
    const playerTwo = playerMaker("playerTwo", "O");
    const maxScore = 5;

    const gameHasWinner = () => {
        return (playerOne.getScore() >= maxScore || playerTwo.getScore() >= maxScore)  
    }

    const roundHasWinner = () => {
        const winningPositions = [
            [0,1,2], [3,4,5], [6,7,8], // Horizontal wins
            [0,3,6], [1,4,7], [2,5,8], // Vertical wins
            [0,4,8], [2,4,6]          // Diagonal wins
        ]
        
        let playerOneSquares = playerOne.getTakenSquares().sort((a,b) => a - b)
        let playerTwoSquares = playerTwo.getTakenSquares().sort((a,b) => a - b)

        for (let position of winningPositions){
            if (position.every(num => playerOneSquares.includes(num))) return 0;
            else if (position.every(num => playerTwoSquares.includes(num))) return 1;
        }
        return -1;
        
    }

    const playRound = () => {
        gameBoard.resetBoard();
        playerOne.resetTakenSquares();
        playerTwo.resetTakenSquares();

        let turnCounter = 1;
        while (roundHasWinner() === -1){
            if (turnCounter % 2 == 0){
                playerTwo.makeMove(playerTwo.getComputerChoice());
            } else {
                playerOne.makeMove(playerOne.getComputerChoice());
            }
            turnCounter++;
            availableSquares = gameBoard.getAvailableSquares();
            if (availableSquares.length === 0) {
                console.log("Tie round");
                return;
            }
            gameBoard.printBoard();
        }

        if (roundHasWinner !== -1){
            (roundHasWinner() === 0 ) ? playerOne.addPoints() : playerTwo.addPoints();
        }

        
    }

    const playGame = () => {
        console.log("New Game Starting")
        let roundCounter = 1;
        while (!gameHasWinner()){
            console.log(`Round ${roundCounter} begins!`)
            playRound();
            roundCounter++;
            console.log(`Player One: ${playerOne.getScore()}`)
            console.log(`Player Two: ${playerTwo.getScore()}`)  
        }
        
        let winner = (playerOne.getScore() > playerTwo.getScore()) ? playerOne.getName() : playerTwo.getName();

        console.log(`${winner} wins!`)
    }

    return {playGame}
})();

gameMaster.playGame();
