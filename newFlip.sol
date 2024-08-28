// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Flip {
    address payable public owner;
    address payable public operator;
    address payable public houseWallet;
    string public name;
    bool public paused = false;

    uint256 public platformFeePercentage = 1; // Default 1%
    uint256 public winnerBetPercentage = 188; // Default 188%
    uint256 public maxBetPercentage = 10; // Default 10% of contract balance

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
    uint256 public nextGameId = 0;

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

    event FeeUpdated(string feeType, uint256 newValue);

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

    function setPlatformFeePercentage(
        uint256 newPercentage
    ) external onlyOwner {
        require(newPercentage <= 100, "House edge must be 100% or less");
        platformFeePercentage = newPercentage;
        emit FeeUpdated("PlatformFee", newPercentage);
    }

    function setWinnerBetPercentage(uint256 newMultiplier) external onlyOwner {
        require(
            newMultiplier > 100,
            "Win multiplier must be greater than 100%"
        );
        winnerBetPercentage = newMultiplier;
        emit FeeUpdated("winnerBetPercentage", newMultiplier);
    }

    function setMaxBetPercentage(uint256 newPercentage) external onlyOwner {
        require(
            newPercentage <= 100,
            "Max bet percentage must be 100% or less"
        );
        maxBetPercentage = newPercentage;
        emit FeeUpdated("MaxBet", newPercentage);
    }

    function flipit(uint8 guess) public payable onlyUnpaused {
        require(
            guess == 0 || guess == 1,
            "Guess should be 0 (heads) or 1 (tails)"
        );
        require(msg.value > 0, "Bet must be greater than 0");

        uint256 houseEdgeCut = (msg.value * platformFeePercentage) / 100;
        houseWallet.transfer(houseEdgeCut);
        uint256 actualBet = msg.value - houseEdgeCut;

        require(
            actualBet <= (address(this).balance * maxBetPercentage) / 100,
            "Bet exceeds maximum allowed"
        );

        uint256 gameId = nextGameId++;
        pendingGames[gameId] = Game(msg.sender, msg.value, guess, false, 0, 0);

        emit GameInitiated(gameId, msg.sender, guess, msg.value);
    }

    function resolveGame(
        uint256 gameId,
        uint8 result
    ) external onlyOperatorOrOwner {
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
            totalPayout = (game.amountBet * winnerBetPercentage) / 100;
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
    function getGameEntry(
        uint256 index
    )
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
