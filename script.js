function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = []

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for(let j = 0; j < columns; j++) {
            board[i].push("");
        }
        
    };

    const emptySpace = () => {
        let freeSpace = false;
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < columns; j++) {
                if(board[i][j] === "") {
                    freeSpace = true

                };
            };
        };
        return freeSpace;
    }

    const playerTurn = ([row, column], player) => {
        if (board[row][column] === "") {
            board[row][column] = player;
        } else {
            return "This position was already played"
        }
    };

    const getBoard = () => board.map((row) => row.slice());    

    const boardUI = () => {
        let column = 0;
        let container = document.querySelector(".container");
        const currentBoard = getBoard();
        container.textContent = "";
        for (row of currentBoard) {
            for (value of row ) {
                let newDiv = document.createElement("div");
                newDiv.textContent = value;
                newDiv.classList.add("token");
                newDiv.dataset.row = currentBoard.indexOf(row);
                newDiv.dataset.column = column;
                container.appendChild(newDiv);
                column ++;
                if (column === 3) {
                    column = 0;
                }; 
            };      
        };
    };

    return {
        getBoard,
        playerTurn,
        boardUI,
        emptySpace,
    };
};

function player(name, token) {
    return {
        name,
        token,
    };
};

function game() {
    const information = document.querySelector("h5");
    const afterMatch = document.querySelector("h3");
    player1Name = document.querySelector("#player1");
    player2Name = document.querySelector("#player2");
    afterMatch.textContent = "";
    information.textContent = "";

    const player1 = player(player1Name.value, "X");
    const player2 = player(player2Name.value, "0");

    const board = Gameboard();

    let currentPlayer = player1;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const getCurrentPlayer = () => currentPlayer;
    
    const printNewRound = () => {
        console.log(board.getBoard());
        board.boardUI();
        information.textContent = `${getCurrentPlayer().name}, it's your turn to play!`;
        console.log(`${getCurrentPlayer().name}, it's your turn to play!`);
    };

    const playRound = function([row, column]) {
        console.log(`${getCurrentPlayer().name} played cell ${[row, column]}`);
        const checkMove = board.playerTurn([row, column], getCurrentPlayer().token);

        //create a variable to hold the current player before to switch:
        const checkWinner = getCurrentPlayer();

        if (checkMove !== "This position was already played") {
            switchPlayer();
            printNewRound();
        } else {
            console.log(checkMove);
        };

        //check for the winner
        const arrayWinner = [];
        const boardMatrix = board.getBoard();
        console.log(boardMatrix.length)
        for (let i = 0; i < 3 ; i++) {
            arrayWinner.push(checkWinner.token);
        };

        //check Horyzontale winning
        for(const array of board.getBoard()) {
           if (array.join() === arrayWinner.join()) {
            information.textContent = "";
            afterMatch.textContent = `${checkWinner.name} win!`
            return "endgame";
           }
        };

        // check Vertical winning
        for(let i = 0; i < boardMatrix.length; i++) {
            if (boardMatrix[0][i] == checkWinner.token && 
                boardMatrix[1][i] == checkWinner.token && 
                boardMatrix[2][i] == checkWinner.token) {
                information.textContent = "";
                afterMatch.textContent = `${checkWinner.name} win!`
                return "endgame";
            };    
        };

        //check diagonal 
        if(
            (boardMatrix[0][0] === checkWinner.token && 
                boardMatrix[1][1] === checkWinner.token && 
                boardMatrix[2][2] === checkWinner.token)
            || 
            (boardMatrix[2][0] === checkWinner.token && 
                boardMatrix[1][1] === checkWinner.token && 
                boardMatrix[0][2] === checkWinner.token)) {

                information.textContent = "";
                afterMatch.textContent = `${checkWinner.name} win!`
                return "endgame";
            }; 
            
        //check for a tie
        if (board.emptySpace() === false) {
             information.textContent = "";
             afterMatch.textContent = "It's a tie!";
             return "endgame";
        };
    };

    printNewRound();

    return {
        getCurrentPlayer,
        playRound,
        player1,
        player2,
    }

};



function ScreenController() {

    let Game;
    const form = document.querySelector("form");
    const player1 = document.querySelector("#player1");
    const player2 = document.querySelector("#player2");
    const player1Name = document.querySelector("#player1-name");
    const player2Name = document.querySelector("#player2-name");
    const namePlayers = document.querySelector(".name-players");
    const newGameButton = document.querySelector(".new-game");
    const afterMatch = document.querySelector("h3");

    const checkName = () => {

        if(player1.value === "" || player2.value === "") {
            alert("Enter names to start new game!");
        } else {
             player1Name.textContent = player1.value;
             player2Name.textContent = player2.value;
             Game = game();
             form.style.display = "none";
             namePlayers.style.display = "block"    ;
        };
    }

    const displayAction = () => {
        const cells = document.querySelectorAll(".token");
        let endgame = false;
        const handleClick = (button) => {
            if (endgame === true) {
                return;
            }

            const row = button.dataset.row;
            const column = button.dataset.column;
            const result = Game.playRound([row, column]);

            if (result === "endgame") {
                endgame = true;
                newGameButton.style.display = "block";
            } else {
                displayAction();

            };     
        };

        cells.forEach((button) => {
            button.addEventListener("click", () => handleClick(button))

        });
        
    };

    const newGame = () => {
        form.reset();
        form.style.display = "block";
        namePlayers.style.display = "none";
        newGameButton.style.display = "none";
        afterMatch.textContent = "";
    };

    checkName();
    displayAction();
    newGameButton.addEventListener("click", () => newGame());
};


buttonStartGame = document.querySelector("button");
buttonStartGame.addEventListener("click", () => {
    ScreenController();
});

