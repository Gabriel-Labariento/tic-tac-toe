const displayController = (function() {
    let playerName;
    let startButton = document.querySelector(".start-button");
    let playerNameFormContainer = document.querySelector(".player-name-form-container")
    
    startButton.addEventListener("click", () => {
        startButton.classList.add("hidden");
        playerNameFormContainer.classList.remove("hidden")
    })

    let playerNameForm = document.querySelector(".player-name-form");
    playerNameForm.addEventListener("submit", (event) => {
        event.preventDefault();     
        let playerNameInput = document.querySelector(".player-name-input")
        playerName = playerNameInput.value
        if (playerName && playerName.length <= 9 && playerName.length >= 1) {
            let body = document.querySelector("body") 
            gameMaster(playerName).playGame();
            setTimeout(() => {
                body.removeChild(body.firstElementChild)
                document.querySelector(".game-display-container").classList.remove("hidden")
            }, 1000);
        } else {
            playerNameInput.setAttribute("placeholder", " enter name")
        }
    })

    const getPlayerName = () => playerName;
    
    return {getPlayerName}
})();

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
        return new Promise((resolve) => {
            const tiles = Array.from(document.querySelectorAll(".boardTile"));
            
            const handleClick = (event) => {
                const choice = parseInt(event.target.dataset.tileNumber);
                const availableSquares = gameBoard.getAvailableSquares();
                
                if (availableSquares.includes(choice)) {
                    // Remove event listeners from all tiles once a valid choice is made
                    tiles.forEach(tile => tile.removeEventListener("click", handleClick));
                    resolve(choice);
                }
            };

            // Add click event listener to each tile
            tiles.forEach(tile => tile.addEventListener("click", handleClick));
        });
    };



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
        const tiles = Array.from(document.querySelectorAll(".boardTile"));
        tiles.forEach(tile => tile.textContent = "")
        

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

    const addMark = (position, player) => {
        let token = player.getToken();
        if (position < 0 || position > 8) return false;
        
        let tile = document.querySelector(`#tile-${position}`);
        tile.textContent = `${token}`


    }

    return{getBoard, printBoard, resetBoard, placeToken, getAvailableSquares, addMark};
})();

const gameMaster = function(playerName){
    const TIMEOUT = 1000;
    const maxScore = 5;
    const playerOne = playerMaker(playerName, "X");
    const playerTwo = playerMaker("Computer", "O");
    let numOfRounds = 0;

    const gameHasWinner = () => {
        return (playerOne.getScore() >= maxScore ||playerTwo.getScore() >= maxScore)  
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

    const playRound = async () => {
        numOfRounds++;
        setTimeout(() => {
            gameBoard.resetBoard()
            document.querySelector(".round-number").textContent = `Round ${numOfRounds}`
        }, TIMEOUT)
        playerOne.resetTakenSquares();
        playerTwo.resetTakenSquares();

        let turnCounter = 1;
        while (roundHasWinner() === -1) {
            if (turnCounter % 2 == 0) {
                let computerChoice = playerTwo.getComputerChoice()
                playerTwo.makeMove(computerChoice);
                setTimeout(() => gameBoard.addMark(computerChoice, playerTwo), TIMEOUT / 2)                
            } else {
                const humanChoice = await playerOne.getHumanChoice();
                playerOne.makeMove(humanChoice);
                gameBoard.addMark(humanChoice, playerOne)
            }
            turnCounter++;
            
            let availableSquares = gameBoard.getAvailableSquares();
            if (availableSquares.length === 0) {
                console.log("Tie round");
                return;
            }
            gameBoard.printBoard();
        }

        if (roundHasWinner() !== -1) {
            (roundHasWinner() === 0) ? playerOne.addPoints() : playerTwo.addPoints();
            setTimeout(() => {
                document.querySelector(".player-score").textContent = playerOne.getScore();
                document.querySelector(".computer-score").textContent = playerTwo.getScore();
            }, TIMEOUT)
        }
    };

    const playGame = async function() {
        console.log("New Game Starting");
        let roundCounter = 1;
        while (!gameHasWinner()) {
            console.log(`Round ${roundCounter} begins!`);
            await playRound();
            roundCounter++;
            console.log(`${playerOne.getName()}: ${playerOne.getScore()}`);
            console.log(`Computer: ${playerTwo.getScore()}`);
        }
        
        let winner = (playerOne.getScore() > playerTwo.getScore()) ? playerOne.getName() : playerTwo.getName();
        setTimeout(() => {
            document.querySelector(".round-number").textContent = `${winner} wins!`     
        }, TIMEOUT);
        
    };

    return {playGame}
};



