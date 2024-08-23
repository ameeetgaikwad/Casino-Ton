// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Flip {
    address payable public owner;
    address payable public operator;
    address payable public houseWallet;
    string public name;
    bool public paused = false;

    struct Game {
        address player;
        uint256 amountBet;
        uint8 guess;
        bool winner;
        uint256 totalPayout;
        int256 totalProfit;
    }

    Game[] public lastPlayedGames;
    mapping(uint256 => Game) public pendingGames;
    uint256 public nextGameId = 1;

    event GameInitiated(
        uint256 gameId,
        address player,
        uint8 guess,
        uint256 amountBet
    );
    event GameResult(uint256 gameId, uint8 result);
    event DetailedGameResult(
        address player,
        uint256 amountBet,
        uint8 guess,
        bool winner,
        uint256 totalPayout,
        int256 totalProfit
    );

    constructor(address payable _houseWallet, address payable _operator) {
        owner = payable(msg.sender);
        houseWallet = _houseWallet;
        operator = _operator;
        name = "Flipit";
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyUnpaused() {
        require(paused == false, "Cannot execute when contract is paused");
        _;
    }

    modifier onlyOperatorOrOwner() {
        require(
            msg.sender == operator || msg.sender == owner,
            "Only the operator or owner can call this function"
        );
        _;
    }

    function setHouseWallet(address payable newHouseWallet) external onlyOwner {
        require(newHouseWallet != address(0), "Invalid house wallet address");
        houseWallet = newHouseWallet;
    }

    function flipit(uint8 guess) public payable onlyUnpaused {
        require(
            guess == 0 || guess == 1,
            "Guess should be 0 (heads) or 1 (tails)"
        );
        require(msg.value > 0, "Bet must be greater than 0");

        uint256 houseEdgeCut = msg.value / 100;
        houseWallet.transfer(houseEdgeCut);
        uint256 actualBet = msg.value - houseEdgeCut;

        require(
            actualBet <= (address(this).balance * 10) / 100,
            "You cannot bet more than what is available in the jackpot"
        );

        uint256 gameId = nextGameId++;
        pendingGames[gameId] = Game(msg.sender, msg.value, guess, false, 0, 0);

        emit GameInitiated(gameId, msg.sender, guess, msg.value);
    }

    function resolveGame(uint256 gameId, uint8 result)
        external
        onlyOperatorOrOwner
    {
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
        uint256 totalPayout = 0;
        int256 totalProfit = 0;
        uint256 finalPayout = 0;

        if (won) {
            finalPayout = 2 * game.amountBet;
            totalPayout = (game.amountBet * 188) / 100;
            payable(game.player).transfer(totalPayout);
            payable(operator).transfer(finalPayout - totalPayout);
            totalProfit = int256(totalPayout) - int256(game.amountBet);
        } else {
            totalProfit = -int256(game.amountBet);
        }

        game.winner = won;
        game.totalPayout = totalPayout;
        game.totalProfit = totalProfit;

        lastPlayedGames.push(game);

        emit GameResult(gameId, result);
        emit DetailedGameResult(
            game.player,
            game.amountBet,
            game.guess,
            won,
            totalPayout,
            totalProfit
        );

    }

    // Get amount of games played so far
    function getGameCount() public view returns (uint256) {
        return lastPlayedGames.length;
    }

    // Get stats about a certain played game, e.g. address of player, amount bet, won or lost, total payout, and total profit
    function getGameEntry(uint256 index)
        public
        view
        returns (
            address addr,
            uint256 amountBet,
            uint8 guess,
            bool winner,
            uint256 totalPayout,
            int256 totalProfit
        )
    {
        return (
            lastPlayedGames[index].player,
            lastPlayedGames[index].amountBet,
            lastPlayedGames[index].guess,
            lastPlayedGames[index].winner,
            lastPlayedGames[index].totalPayout,
            lastPlayedGames[index].totalProfit
        );
    }

    // Withdraw money from contract
    function withdraw(uint256 amount) external onlyOwner {
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

    // Get the operator wallet address
    function getOperatorWallet() external view returns (address payable) {
        return operator;
    }

    // Set the operator wallet address
    function setOperatorWallet(address payable newOperator) external {
        operator = newOperator;
    }

    // Pause the contract
    function pauseContract() external onlyOwner {
        paused = true;
    }

    // Pause the contract
    function unpauseContract() external onlyOwner {
        paused = false;
    }

    // Accept any incoming amount
    receive() external payable {}
}
