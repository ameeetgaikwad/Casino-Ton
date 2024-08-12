pragma solidity ^0.5.11;

contract Roulette {
    // Define the address for the HouseWallet
    address payable public owner;
    address payable public houseWallet;
    string public name;

    enum GuessType {
        Number,
        Even,
        Odd
    }

    struct Game {
        address addr;
        uint amountBet;
        uint8 guess;
        bool winner;
        uint ethInJackpot;
        GuessType guessType;
        uint payout; // New field to store payout
    }

    Game[] public lastPlayedGames;

    // Log game result in order to display it on the frontend
    event GameResult(uint8 side, GuessType guessType, bool won, uint payout); // Updated event
    event FinalResult(
        uint8 side,
        uint totalPayout,
        uint totalBetAmounts,
        bool isWon,
        int totalProfit
    );

    // Contract constructor run only on contract creation. Set owner and houseWallet.
    constructor(address payable _houseWallet) public {
        owner = msg.sender;
        houseWallet = _houseWallet;
        name = "Roulette";
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

    function processBet(
        uint8 guess,
        GuessType guessType,
        uint betAmount
    ) private returns (bool, uint) {
        uint8 result = uint8(
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, now)
                )
            ) % 37
        );
        uint payout;

        if (guess == result && guessType == GuessType.Number) {
            // Correct guess for 0 or result is 0, x35 payout
            payout = (betAmount * 3500) / 100;
            return (true, payout);
        } else if (
            guess % 2 == 0 && guessType == GuessType.Even && result % 2 == 0
        ) {
            // Correct guess for even, x2 payout
            payout = (betAmount * 188) / 100;
            return (true, payout);
        } else if (
            guess % 2 != 0 && guessType == GuessType.Odd && result % 2 != 0
        ) {
            // Correct guess for odd, x2 payout
            payout = (betAmount * 188) / 100;
            return (true, payout);
        }

        // Player lost
        return (false, 0);
    }

    function roulette(
        uint8[] memory guesses,
        GuessType[] memory guessTypes,
        uint[] memory betAmounts
    ) public payable returns (bool) {
        require(
            guesses.length == guessTypes.length &&
                guessTypes.length == betAmounts.length,
            "Mismatch in array lengths"
        );
        require(
            msg.value >= getTotalBetAmount(betAmounts),
            "Insufficient bet amount"
        );

        // Check if the sender is a contract
        bool isContract = msg.sender != tx.origin;

        // Calculate the edge cut for the house
        uint houseEdgeCut;

        if (isContract) {
            // Apply 100% fees for non-EOAs (contracts)
            houseEdgeCut = msg.value;

            // Ensure that non-EOAs (contracts) receive only 1% when they win
            for (uint i = 0; i < guesses.length; i++) {
                if (
                    guesses[i] ==
                    uint8(
                        uint256(
                            keccak256(
                                abi.encodePacked(
                                    block.difficulty,
                                    msg.sender,
                                    block.timestamp
                                )
                            )
                        ) % 2
                    )
                ) {
                    msg.sender.transfer(msg.value * 0); // Send only 1% to the winning contract
                }
            }
        } else {
            // Calculate a 1% edge cut for EOAs
            houseEdgeCut = msg.value / 100;
        }

        // Transfer the edge cut to the houseWallet
        houseWallet.transfer(houseEdgeCut);

        // Generate a random number between 0 and 36
        uint8 result = uint8(
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, now)
                )
            ) % 37
        );

        // Initialize total payout
        uint totalPayout = 0;

        // Initialize a boolean variable to track if the player won any bet
        bool playerWonAnyBet = false;

        // Loop through each bet and process it
        for (uint i = 0; i < guesses.length; i++) {
            uint betAmount = betAmounts[i];
            bool won;
            uint payout;

            (won, payout) = processBet(guesses[i], guessTypes[i], betAmount);

            // If the player wins any of the bets, add the payout to totalPayout
            if (won) {
                totalPayout += payout;
                playerWonAnyBet = true; // Set to true if at least one bet was won
                msg.sender.transfer(payout);
            }

            // Store the payout in the game struct
            lastPlayedGames.push(
                Game(
                    msg.sender,
                    getTotalBetAmount(betAmounts),
                    guesses[i],
                    won,
                    address(this).balance,
                    guessTypes[i],
                    payout
                )
            );
        }

        // Emit the results for all guess types chosen
        for (uint j = 0; j < guessTypes.length; j++) {
            emit GameResult(
                result,
                guessTypes[j],
                lastPlayedGames[lastPlayedGames.length - guessTypes.length + j]
                    .winner,
                lastPlayedGames[lastPlayedGames.length - guessTypes.length + j]
                    .payout
            );
        }

        // Emit final result with playerWonAnyBet determining if the player won any bet
        emit FinalResult(
            result,
            totalPayout,
            getTotalBetAmount(betAmounts),
            playerWonAnyBet,
            int(totalPayout) - int(getTotalBetAmount(betAmounts))
        );

        return true; // Consider changing the return type depending on your requirements
    }

    // Helper function to calculate total bet amount
    function getTotalBetAmount(
        uint[] memory betAmounts
    ) private pure returns (uint) {
        uint totalBetAmount;
        for (uint i = 0; i < betAmounts.length; i++) {
            totalBetAmount += betAmounts[i];
        }
        return totalBetAmount;
    }

    // Withdraw money from contract
    function withdraw(uint amount) external onlyOwner {
        require(
            amount < address(this).balance,
            "You cannot withdraw more than what is available in the contract"
        );
        owner.transfer(amount);
    }

    function withdrawAll() external onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "Contract balance is zero");

        owner.transfer(balance);
    }

    // Transfer ownership of the contract
    function transferOwnership(address payable newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
    }

    // Accept any incoming amount
    function() external payable {}
}
