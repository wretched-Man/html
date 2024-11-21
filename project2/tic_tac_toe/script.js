// The player selects either X or O
// When the player clicks on a cell, put an X or O
// When the player changes from X or O, reset the game
// X starts

// Constants

const playground = document.getElementById('playground');
// Buttons for selecting player names
const controlButtons = document.querySelector('.control-buttons');


const playerNames = {
    'player-x': 'X',
    'player-o': 'O'
}


// ******************** Game Context Manager ********************

const gameContextManager = {
    playableCharacter: [],

    // Have a new set of playable characters
    resetPlayableCharacter: function () {
        this.playableCharacter.length = 0;

        for (child of playground.children) {
            this.playableCharacter.push(child.getAttribute('id'))
        }
    },

    //If written to, remove
    removePlayableCell: function (cellId) {
        let pos = this.playableCharacter.indexOf(cellId);
        this.playableCharacter.splice(pos, 1);
    },

    // Can we update the cell or is it written already
    isCellPlayable: function (cellId) {
        return this.playableCharacter.includes(cellId);
    },

    currentPlayer: 'player-x',

    // Who you play as
    userPlayAs: 'player-x',

    // Who the computer plays as
    computerPlayAs: function () {
        return Object.keys(playerNames).filter(
            key => key !== this.userPlayAs
        )[0];
    },

    usersTurn: function () { return this.currentPlayer == this.userPlayAs; },

    gameInPlay: function () { return this.playableCharacter.length >= 1; },

};


// ******************** Moves Context Manager ********************

const movesContextManager = {
    // All the ways a game can be won
    winningMoves: ['012', '345', '678',
                    '036', '147', '258',
                    '048', '246'],
    

    'player-x': [],


    'player-o': [],


    resetMoves: function () {
        // Reset 
        this["player-o"].length = 0;
        this["player-x"].length = 0;
    },


    moveNonPlayable: function (move) {
        let moveInX = this["player-x"]
            .some(cell => move.includes(cell) );
        let moveInO = this["player-o"]
            .some(cell => move.includes(cell) );

        if (moveInX && moveInO) {
            return true;
        }
        return false;
    },


}


// ******************** Functions ********************


const updateCurrentPlayer = (playerChosen) => {
    updateDisplay(`Current player is: ${playerNames[playerChosen]}`);
}


const updateBoxWithInput = (clickedBox) => {
    document.getElementById(clickedBox).textContent = playerNames[gameContextManager.currentPlayer];
    return true;
}


// Color the selected to show the player
const colorSelectedPlayer = (newlyChosenPlayer) => {
    document.getElementById(gameContextManager.userPlayAs).classList.remove('selected');
    document.getElementById(newlyChosenPlayer).classList.add('selected')
}


//Update the instructions
const updateDisplay = (messageStr) => {
    document.getElementById('display-instructions').textContent = messageStr;
}


const resetGame = () => {
    for (let playBox of playground['children']) {
        playBox.textContent = '';
    }
    startNewGameState();
}


const computerAlgo = () => {  
    // There are two algorithms that the computer uses:
    // A random selection and an intelligent game.

    let cellID = undefined;

    // ******************* Like A Rug - Random *******************
    const walkOver = () => {
        let cornerCellsList = ['0', '2', '6', '8'];
        for (cornerCell of cornerCellsList) {
            if (gameContextManager.isCellPlayable('cell-'+cornerCell)) {
                return 'cell-'+cornerCell;
            }
        }
    }


    // ********************* Utility ***********************
    // Get the current moves! User/opponent
    const movesInPlay = (userForMoves, lengthArr=1) => {
        let getCurrentMoves = movesContextManager.winningMoves.filter( (move) => {
            return !movesContextManager.moveNonPlayable(move) && (
                move.split('').filter( 
                    mcell => userForMoves.indexOf(mcell) >= 0
                ).length > lengthArr
            )
        });
        return getCurrentMoves;
    }


    // ******************** In a Nutshell - Intelligent ********************
    const fastPlayAlgo = (anyState, lengthArr) => {
        let typeOfPlay = movesInPlay(anyState, lengthArr);

        if(typeOfPlay.length < 1) {
            return false;
        }
        else {
            typeOfPlay = typeOfPlay[0].split('');
            for (let cell of typeOfPlay) {
                if (!anyState.includes(cell)) {
                    cellID = 'cell-'+cell;
                    return true;
                }
            }
        }
    }


    // Occupy the center, if possible.
    if (document.getElementById('cell-4').textContent == '') {
        inputProcess('cell-4');
    }
    else {
        const userState = movesContextManager[gameContextManager.computerPlayAs()];
        const opponentState = movesContextManager[gameContextManager.userPlayAs];

        if ( !fastPlayAlgo(userState, 1)     &&
             !fastPlayAlgo(opponentState, 1) &&
             !fastPlayAlgo(userState, 0)     )
        {
            cellID = walkOver();
        }

        inputProcess(cellID);
    }

}


const checkWinner = (playerID) => {

    if (movesContextManager[playerID].length < 3) {
        return false;
    }

    for(let move of movesContextManager.winningMoves) {
        if ( movesContextManager.moveNonPlayable(move) ) {
            continue;
        }

        let winMove = move.split('').every(
            cell => movesContextManager[playerID].includes(cell)
        );

        if (winMove) {
            gameContextManager.playableCharacter.length = 0;
            return true;
        }
    }
    return false;
}


const inputProcess = (playerKey) => {

    updateBoxWithInput(playerKey);

    let message = 'Game Over, Draw!';

    gameContextManager.removePlayableCell(playerKey);
    movesContextManager[gameContextManager.currentPlayer].push(playerKey[5]);
    
    if ( checkWinner(gameContextManager.currentPlayer) ) {
        message = `Game Over, ${playerNames[gameContextManager.currentPlayer]} Wins!`;
    }
    
    if ( gameContextManager.gameInPlay() ) {

        // If the computer was playing
        if (gameContextManager.currentPlayer == gameContextManager.computerPlayAs()) {
            gameContextManager.currentPlayer = gameContextManager.userPlayAs;
            updateCurrentPlayer(gameContextManager.currentPlayer)
        }
        else {
            gameContextManager.currentPlayer = gameContextManager.computerPlayAs();
            updateCurrentPlayer(gameContextManager.currentPlayer);

            setTimeout(computerAlgo, 2000);
        }
    }
    else {
        updateDisplay(message);
    }  
}


// This is now the game
const startNewGameState = () => {
    console.log('Starting a new game!')
    
    // Context manager variables
    gameContextManager.resetPlayableCharacter();
    gameContextManager.currentPlayer = 'player-x';

    // Moves manager variables
    movesContextManager.resetMoves();

    // Update screen
    updateCurrentPlayer(gameContextManager.currentPlayer);

    if (!gameContextManager.usersTurn()) {
        computerAlgo();
    }
}


// ------- Event listeners --------


// Listen for player move
playground.addEventListener(
    'click',
    function (event) {
        if (gameContextManager.usersTurn()) {
            let clickedKey = event.target.getAttribute('id');

            if (gameContextManager.isCellPlayable(clickedKey)) {
                inputProcess(clickedKey);
            }
        }
    }
);

// Listen for change in player Choice
controlButtons.addEventListener(
    'click',
    function (event) {
        let userSwitch = event.target.getAttribute('id');
        if (gameContextManager.userPlayAs !== userSwitch) {
            colorSelectedPlayer(userSwitch);
            gameContextManager.userPlayAs = userSwitch;
            resetGame();
        }
    }
);

colorSelectedPlayer(gameContextManager.userPlayAs);
updateDisplay('Welcome, ready to play?');
window.addEventListener('load', () => {
    let clickPositions = document.querySelectorAll('.click-pos');
    for (clickPos of clickPositions) {
        clickPos.classList.add('smooth-transition');
    }
    setTimeout(startNewGameState, 3000);
});;
