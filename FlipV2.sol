// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Heads or tails game contract
contract Flip {
    // Define the address for the HouseWallet
    address payable owner;
    address payable houseWallet;
    string public name;

    struct Game {
        address addr;
        uint amountBet;
        uint8 guess;
        bool winner;
        uint totalPayout;
        int totalProfit;
    }

    Game[] lastPlayedGames;

    // Log game result (heads 0 or tails 1) in order to display it on the frontend
    event GameResult(uint8 side);

    // Log game result with additional information
    event DetailedGameResult(
        address player,
        uint amountBet,
        uint8 guess,
        bool winner,
        uint totalPayout,
        int totalProfit
    );

    // Contract constructor run only on contract creation. Set owner and houseWallet.
    constructor(address payable _houseWallet) {
        owner = payable(msg.sender);
        houseWallet = _houseWallet;
        name = "Flipit";
    }

    // Add this modifier to functions, which should only be accessible by the owner
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "This function can only be launched by the owner"
        );
        _;
    }

    // Set or update the houseWallet address
    function setHouseWallet(address payable newHouseWallet) external onlyOwner {
        require(newHouseWallet != address(0), "Invalid house wallet address");
        houseWallet = newHouseWallet;
    }

    // Play the game!
    function flipit(uint8 guess) public payable returns (bool) {
        require(
            guess == 0 || guess == 1,
            "Variable 'guess' should be either 0 ('heads') or 1 ('tails')"
        );
        require(msg.value > 0, "Bet more than 0");

        // Calculate the 1% edge cut for the house
        uint houseEdgeCut = msg.value / 100;

        // Transfer the 1% edge cut to the houseWallet
        houseWallet.transfer(houseEdgeCut);

        // Calculate the actual amount to be considered as the bet
        uint actualBet = msg.value - houseEdgeCut;
        uint amountBet = msg.value;

        // Ensure the actual bet is not more than what is available in the jackpot
        require(
            actualBet <= (address(this).balance * 10) / 100,
            "You cannot bet more than what is available in the jackpot"
        );

        // Create a random number. Use the mining difficulty & the player's address, hash it, convert this hex to int, divide by modulo 2 which results in either 0 or 1 and return as uint8
        uint8 result = uint8(
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        msg.sender,
                        block.timestamp
                    )
                )
            ) % 2
        );
        bool won = false;
        uint totalPayout = 0;
        int totalProfit = 0;

        if (guess == result) {
            // Won!
            totalPayout = (amountBet * 188) / 100;  
            payable(msg.sender).transfer(totalPayout);
            won = true;
            totalProfit = int(totalPayout) - int(amountBet);
        } else {
            // Lost
            totalProfit = -int(amountBet);
        }

        emit GameResult(result);
        emit DetailedGameResult(
            msg.sender,
            amountBet,
            guess,
            won,
            totalPayout,
            totalProfit
        );
        lastPlayedGames.push(
            Game(msg.sender, amountBet, guess, won, totalPayout, totalProfit)
        );
        return won;
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
