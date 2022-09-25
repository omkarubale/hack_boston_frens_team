// SPDX-License-Identifier: UNLICENCED

pragma solidity >=0.7.0 <0.9.0;


// TicTacToe is a solidity implementation of the tic tac toe game.
// You can find the rules at https://en.wikipedia.org/wiki/Tic-tac-toe
contract TicTacToe {

    // Players enumerates all possible players
    enum Players { None, PlayerOne, PlayerTwo }
    // Winners enumerates all possible winners
    enum Winners { None, PlayerOne, PlayerTwo, Draw }

    // Game stores the state of a round of tic tac toe.
    // As long as `winner` is `None`, the game is not over.
    // `playerTurn` defines who may go next.
    // Player one must make the first move.
    // The `board` has the size 3x3 and in each cell, a player
    // can be listed. Initializes as `None` player, as that is the
    // first element in the enumeration.
    // That means that players are free to fill in any cell at the
    // start of the game.
    struct Game {
        address playerOne;
        address playerTwo;
        Winners winner;
        Players playerTurn;
        uint8[3][3] board;
    }

    // games stores all the games.
    // Games that are already over as well as games that are still running.
    // It is possible to iterate over all games, as the keys of the mapping
    // are known to be the integers from `1` to `nrOfGames`.
    mapping(uint256 => Game) private games;
    Game[] allGamesList;
    // nrOfGames stores the total number of games in this contract.
    uint256 private nrOfGames;

    // GameCreated signals that `creator` created a new game with this `gameId`.
    event GameCreated(uint256 gameId, address creator);
    // PlayerJoinedGame signals that `player` joined the game with the id `gameId`.
    // That player has the player number `playerNumber` in that game.
    event PlayerJoinedGame(uint256 gameId, address player, uint8 playerNumber);
    // PlayerMadeMove signals that `player` filled in the board of the game with
    // the id `gameId`. She did so at the coordinates `xCoordinate`, `yCoordinate`.
    event PlayerMadeMove(uint256 gameId, address player, uint xCoordinate, uint yCoordinate);
    // GameOver signals that the game with the id `gameId` is over.
    // The winner is indicated by `winner`. No more moves are allowed in this game.
    event GameOver(uint256 gameId, Winners winner);

    // newGame creates a new game and returns the new game's `gameId`.
    // The `gameId` is required in subsequent calls to identify the game.
    // Player 1 always starts the game.
    function newGame() public returns (uint256 gameId) {
        Game memory currentGame;
        currentGame.playerTurn = Players.PlayerOne;

        nrOfGames++;
        games[nrOfGames] = currentGame;
        allGamesList[nrOfGames] = currentGame;

        emit GameCreated(nrOfGames, msg.sender);

        return nrOfGames;
    }

    // joinGame lets the sender of the message join the game with the id `gameId`.
    // It returns `success = true` when joining the game was possible and
    // `false` otherwise.
    // `reason` indicates why a game was joined or not joined.
    function joinGame(uint256 _gameId) public returns (bool isSuccess, string memory reason) {
        if (_gameId > nrOfGames) {
            return (false, "No such game exists.");
        }

        address newPlayer = msg.sender;
        Game storage currentGame = games[_gameId];

        if(currentGame.winner != Winners.None) {
            return(false, "This game is already complete.");
        }

        // Assign the new player to slot 1 if it is still available.
        if (currentGame.playerOne == address(0)) {
            currentGame.playerOne = newPlayer;
            emit PlayerJoinedGame(_gameId, newPlayer, uint8(Players.PlayerOne));
            if(currentGame.playerTwo != address(0)) {
                currentGame.playerTurn = Players.PlayerOne;
                return(true, "Joined as player 1. Player 2 already exists. Player 1 can make the first move.");
            }

            return (true, "Joined as player 1. Game hasn't started yet.");
        }

        // If slot 1 is taken, assign the new player to slot 2 if it is still available.
        if (currentGame.playerTwo == address(0)) {
            currentGame.playerTwo = newPlayer;
            emit PlayerJoinedGame(_gameId, newPlayer, uint8(Players.PlayerTwo));
            if(currentGame.playerOne != address(0)) { 
                currentGame.playerTurn = Players.PlayerOne;
                return(true, "Joined as player 2. Player 1 can make the first move.");
            }
            return (true, "Joined as player 2. Game hasn't started yet.");
        }

        return (false, "This game already has 2 players.");
    }

    // makeMove inserts a player on the game board.
    // The player is identified as the sender of the message.
    function makeMove(uint256 _gameId, uint8 _xCoordinate, uint8 _yCoordinate) public returns (bool isSuccess, string memory reason) {
        if (_gameId > nrOfGames || (games[_gameId].playerOne == address(0) && games[_gameId].playerTwo == address(0))) {
            return (false, "No such game exists.");
        }

        if(_xCoordinate < 0 || _xCoordinate > 2) { 
            return(false, "Invalid input for x-coordinate.");
        }
        if(_yCoordinate < 0 || _yCoordinate > 2) { 
            return(false, "Invalid input for y-coordinate.");
        }

        if (games[_gameId].playerOne == address(0) || games[_gameId].playerTwo == address(0)) {
            return (false, "This game doesn't have two players yet.");
        }

        Game memory currentGame = games[_gameId];

        // Any winner other than `None` means that no more moves are allowed.
        if (currentGame.winner != Winners.None) {
            return (false, "The game has already ended.");
        }

        // Only the player whose turn it is may make a move.
        if (msg.sender != getCurrentPlayer(currentGame)) {
            // TODO: what if the player is not present in the game at all?
            return (false, "It is not your turn.");
        }

        // Players can only make moves in cells on the board that have not been played before.
        if (currentGame.board[_xCoordinate][_yCoordinate] == 1 || currentGame.board[_xCoordinate][_yCoordinate] == 2) {
            return (false, "There is already a mark at the given coordinates.");
        }

        // Now the move is recorded and the according event emitted.
        currentGame.board[_xCoordinate][_yCoordinate] = currentGame.playerTurn == Players.PlayerOne ? 1 : 2;
        emit PlayerMadeMove(_gameId, msg.sender, _xCoordinate, _yCoordinate);

        // Check if there is a winner now that we have a new move.
        Winners winner = calculateWinner(currentGame.board);
        if (winner != Winners.None) {
            // If there is a winner (can be a `Draw`) it must be recorded in the game and
            // the corresponding event must be emitted.
            currentGame.winner = winner;
            emit GameOver(_gameId, winner);

            return (true, "The game is over.");
        }

        // A move was made and there is no winner yet.
        // The next player should make her move.
        nextPlayer(currentGame);

        return (true, "");
    }

    // getCurrentPlayer returns the address of the player that should make the next move.
    // Returns the `0x0` address if it is no player's turn.
    function getCurrentPlayer(Game memory _currentGame) private pure returns (address player) {
        if (_currentGame.playerTurn == Players.PlayerOne) {
            return _currentGame.playerOne;
        }

        if (_currentGame.playerTurn == Players.PlayerTwo) {
            return _currentGame.playerTwo;
        }

        return address(0);
    }

    // calculateWinner returns the winner on the given board.
    // The returned winner can be `None` in which case there is no winner and no draw.
    function calculateWinner(uint8[3][3] memory _currentBoard) private pure returns (Winners winner) {
        // First we check if there is a victory in a row.
        // If so, assign a `Players` to `Winners`
        // Subsequently we do the same for columns and diagonals.

        // Row check
        Players player = winnerInRow(_currentBoard);
        if (player == Players.PlayerOne) {
            return Winners.PlayerOne;
        }
        if (player == Players.PlayerTwo) {
            return Winners.PlayerTwo;
        }

        // Column check
        player = winnerInColumn(_currentBoard);
        if (player == Players.PlayerOne) {
            return Winners.PlayerOne;
        }
        if (player == Players.PlayerTwo) {
            return Winners.PlayerTwo;
        }

        // diagonal check
        player = winnerInDiagonal(_currentBoard);
        if (player == Players.PlayerOne) {
            return Winners.PlayerOne;
        }
        if (player == Players.PlayerTwo) {
            return Winners.PlayerTwo;
        }

        // If board is full and no winner emerged
        // game is a draw
        if (isBoardFull(_currentBoard)) {
            return Winners.Draw;
        }

        return Winners.None;
    }

    // winnerInRow returns the player that wins in any row.
    // To win in a row, all cells in the row must belong to the same player
    // and that player must not be the `None` player.
    function winnerInRow(uint8[3][3] memory _currentBoard) private pure returns (Players winner) {
        for (uint8 x = 0; x < 3; x++) {
            if (
                (_currentBoard[x][0] == 1 || _currentBoard[x][0] == 2) 
                && _currentBoard[x][0] == _currentBoard[x][1]
                && _currentBoard[x][1]  == _currentBoard[x][2]
            ) {
                return _currentBoard[x][0] == 1 ? Players.PlayerOne : Players.PlayerTwo;
            }
        }

        return Players.None;
    }

    // winnerInColumn returns the player that wins in any column.
    // To win in a column, all cells in the column must belong to the same player
    // and that player must not be the `None` player.
    function winnerInColumn(uint8[3][3] memory _currentBoard) private pure returns (Players winner) {
        for (uint8 y = 0; y < 3; y++) {
            if (
                (_currentBoard[0][y] == 1 || _currentBoard[0][y] == 2)
                && _currentBoard[0][y] == _currentBoard[1][y]
                && _currentBoard[1][y] == _currentBoard[2][y]
            ) {
                return _currentBoard[0][y] == 1 ? Players.PlayerOne : Players.PlayerTwo;
            }
        }

        return Players.None;
    }

    // winnerInDiagoral returns the player that wins in any diagonal.
    // To win in a diagonal, all cells in the diaggonal must belong to the same player
    // and that player must not be the `None` player.
    function winnerInDiagonal(uint8[3][3] memory _currentBoard) private pure returns (Players winner) {
        if (
            (_currentBoard[0][0] == 1 || _currentBoard[0][0] == 2)
            && _currentBoard[0][0] == _currentBoard[1][1]
            && _currentBoard[1][1] == _currentBoard[2][2]
        ) {
            return _currentBoard[0][0] == 1 ? Players.PlayerOne : Players.PlayerTwo;
        }

        if (
            (_currentBoard[0][2] == 1 || _currentBoard[0][2] == 2)
            && _currentBoard[0][2] == _currentBoard[1][1]
            && _currentBoard[1][1] == _currentBoard[2][0]
        ) {
            return _currentBoard[0][2] == 1 ? Players.PlayerOne : Players.PlayerTwo;
        }

        return Players.None;
    }

    // isBoardFull returns true if all cells of the board belong to a player other
    // than `None`.
    function isBoardFull(uint8[3][3] memory _currentBoard) private pure returns (bool isFull) {
        for (uint8 x = 0; x < 3; x++) {
            for (uint8 y = 0; y < 3; y++) {
                if (_currentBoard[x][y] != 1 && _currentBoard[x][y] != 2) {
                    return false;
                }
            }
        }

        return true;
    }

    // nextPlayer changes whose turn it is for the given `_game`.
    function nextPlayer(Game memory _currentGame) private pure {
        if (_currentGame.playerTurn == Players.PlayerOne) {
            _currentGame.playerTurn = Players.PlayerTwo;
        } else {
            _currentGame.playerTurn = Players.PlayerOne;
        }
    }

    // get current state of the grid
    function getGameGrid(uint256 _gameId) public view returns(uint8[3][3] memory board) {
        Game memory currentGame = games[_gameId];
        return currentGame.board;
    }

    // get all games in the contract
    function getListOfGames() public view returns(Game[] memory returnedGames) {
        return allGamesList;
    }

    // get game info
    function getGameInfo(uint256 _gameId) public view returns(Game memory returnedGame) {
        Game memory currentGame = games[_gameId];
        return currentGame;
    }

    // gets game status: game has started or not
    function getGameStatus(uint256 _gameId) public view returns(string memory status) {
        Game memory currentGame = games[_gameId];

        // game is over checks
        if(currentGame.winner == Winners.PlayerOne) {
            return "Game is over. Player 1 won.";
        }
        if(currentGame.winner == Winners.PlayerTwo) {
            return "Game is over. Player 2 won.";
        }
        if(currentGame.winner == Winners.Draw) {
            return "Game is over. It was a draw.";
        }
        
        // game is still in progress
        if(currentGame.playerTurn == Players.PlayerOne) {
            return "It's Player 1's turn.";
        }
        if(currentGame.playerTurn == Players.PlayerTwo) {
            return "It's Player 2's turn.";
        }
        return "Game hasn't started yet.";
    }
    
    
}
