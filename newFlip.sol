// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Flip {
    address payable public owner;
    address payable public houseWallet;
    string public name;

    struct Game {
        address player;
        uint amountBet;
        uint8 guess;
        bool winner;
        uint totalPayout;
        int totalProfit;
    }

    Game[] public lastPlayedGames;
    mapping(uint => Game) public pendingGames;
    uint public nextGameId = 1;

    event GameInitiated(
        uint gameId,
        address player,
        uint8 guess,
        uint amountBet
    );
    event GameResult(uint gameId, uint8 result);
    event DetailedGameResult(
        uint gameId,
        address player,
        uint amountBet,
        uint8 guess,
        bool winner,
        uint totalPayout,
        int totalProfit
    );

    constructor(address payable _houseWallet) {
        owner = payable(msg.sender);
        houseWallet = _houseWallet;
        name = "Flipit";
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == owner, "Only the oracle can call this function");
        _;
    }

    function setHouseWallet(address payable newHouseWallet) external onlyOwner {
        require(newHouseWallet != address(0), "Invalid house wallet address");
        houseWallet = newHouseWallet;
    }

    function flipit(uint8 guess) public payable {
        require(
            guess == 0 || guess == 1,
            "Guess should be 0 (heads) or 1 (tails)"
        );
        require(msg.value > 0, "Bet must be greater than 0");

        uint houseEdgeCut = msg.value / 100;
        houseWallet.transfer(houseEdgeCut);
        uint actualBet = msg.value - houseEdgeCut;

        require(
            actualBet <= (address(this).balance * 10) / 100,
            "Bet exceeds max allowed"
        );

        uint gameId = nextGameId++;
        pendingGames[gameId] = Game(msg.sender, msg.value, guess, false, 0, 0);

        emit GameInitiated(gameId, msg.sender, guess, msg.value);
    }

    function resolveGame(uint gameId, uint8 result) external onlyOracle {
        require(
            result == 0 || result == 1,
            "Result should be 0 (heads) or 1 (tails)"
        );
        require(
            pendingGames[gameId].player != address(0),
            "Game does not exist"
        );

        Game storage game = pendingGames[gameId];
        bool won = (game.guess == result);
        uint totalPayout = 0;
        int totalProfit = 0;

        if (won) {
            totalPayout = (game.amountBet * 188) / 100;
            payable(game.player).transfer(totalPayout);
            totalProfit = int(totalPayout) - int(game.amountBet);
        } else {
            totalProfit = -int(game.amountBet);
        }

        game.winner = won;
        game.totalPayout = totalPayout;
        game.totalProfit = totalProfit;

        lastPlayedGames.push(game);

        emit GameResult(gameId, result);
        emit DetailedGameResult(
            gameId,
            game.player,
            game.amountBet,
            game.guess,
            won,
            totalPayout,
            totalProfit
        );

        delete pendingGames[gameId];
    }

    // Get amount of games played so far
    function getGameCount() public view returns (uint) {
        return lastPlayedGames.length;
    }

    // Get stats about a certain played game, e.g. address of player, amount bet, won or lost, total payout, and total profit
    function getGameEntry(
        uint index
    )
        public
        view
        returns (
            address addr,
            uint amountBet,
            uint8 guess,
            bool winner,
            uint totalPayout,
            int totalProfit
        )
    {
        return (
            lastPlayedGames[index].addr,
            lastPlayedGames[index].amountBet,
            lastPlayedGames[index].guess,
            lastPlayedGames[index].winner,
            lastPlayedGames[index].totalPayout,
            lastPlayedGames[index].totalProfit
        );
    }

    // Withdraw money from contract
    function withdraw(uint amount) external onlyOwner {
        require(
            amount <= address(this).balance,
            "You cannot withdraw more than what is available in the contract"
        );
        owner.transfer(amount);
    }

    // Withdraw all balance from the contract
    function withdrawAll() external onlyOwner {
        owner.transfer(address(this).balance);
    }

    // Transfer ownership of the contract
    function transferOwnership(address payable newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
    }

    // Get the owner wallet address
    function getOwnerWallet() external view returns (address payable) {
        return owner;
    }

    // Accept any incoming amount
    receive() external payable {}

}
