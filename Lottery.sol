// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts@1.2.0/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts@1.2.0/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract SubscriptionConsumer is VRFConsumerBaseV2Plus, ReentrancyGuard {
    uint256 public constant HOUSE_FEE_PERCENTAGE = 12;

    address public adminWallet;

    enum LotteryStatus {
        NotStarted,
        Open,
        Closed,
        Completed
    }

    struct Lottery {
        uint256 id;
        uint256 prizePool;
        uint256 ticketPrice;
        uint256 totalTickets;
        uint256 soldTickets;
        address winner;
        LotteryStatus status;
    }

    struct Ticket {
        address player;
        uint256 lotteryId;
        uint256 ticketNumber;
        uint256 amount;
    }

    struct LotteryDetails {
        uint256 lotteryId;
        uint256 ticketsPurchased;
        uint256 ticketPrice;
        LotteryStatus status;
        uint256 remainingTickets;
        uint256 prizePool;
        address winner;
    }

    Lottery[] public lotteries;
    mapping(uint256 => Ticket[]) public tickets;
    mapping(address => Ticket[]) public playerTickets;

    event LotteryStarted(
        uint256 indexed lotteryId,
        uint256 prizePool,
        uint256 ticketPrice,
        uint256 totalTickets
    );
    event TicketPurchased(
        address indexed player,
        uint256 indexed lotteryId,
        uint256 ticketNumber
    );
    event LotteryCompleted(
        uint256 indexed lotteryId,
        address winner,
        uint256 prizeAmount
    );

    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    struct RequestStatus {
        bool fulfilled;
        bool exists;
        uint256[] randomWords;
        uint256 lotteryId;
    }
    mapping(uint256 => RequestStatus) public s_requests;

    uint256 public s_subscriptionId;

    uint256[] public requestIds;
    uint256 public lastRequestId;

    bytes32 public keyHash =
        0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;

    uint32 public callbackGasLimit = 1000000;

    uint16 public requestConfirmations = 3;

    uint32 public numWords = 2;

    constructor(uint256 subscriptionId)
        VRFConsumerBaseV2Plus(0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B)
    {
        s_subscriptionId = subscriptionId;
    }

    function startLottery(
        uint256 _prizePool,
        uint256 _ticketPrice,
        uint256 _totalTickets
    ) external onlyOwner {
        require(
            _prizePool > 0 && _ticketPrice > 0 && _totalTickets > 0,
            "Invalid lottery parameters"
        );

        lotteries.push(
            Lottery({
                id: lotteries.length,
                prizePool: _prizePool,
                ticketPrice: _ticketPrice,
                totalTickets: _totalTickets,
                soldTickets: 0,
                winner: address(0),
                status: LotteryStatus.Open
            })
        );

        emit LotteryStarted(
            lotteries.length,
            _prizePool,
            _ticketPrice,
            _totalTickets
        );
    }

    function buyTickets(uint256 _lotteryId, uint256 _numberOfTickets)
        external
        payable
        nonReentrant
    {
        Lottery storage lottery = lotteries[_lotteryId];
        require(lottery.status == LotteryStatus.Open, "Lottery is not open");
        require(
            msg.value == lottery.ticketPrice * _numberOfTickets,
            "Incorrect total price"
        );
        require(
            lottery.soldTickets + _numberOfTickets <= lottery.totalTickets,
            "Not enough tickets available"
        );
        for (uint256 i = 0; i < _numberOfTickets; i++) {
            uint256 ticketNumber = lottery.soldTickets + i;
            Ticket memory newTicket = Ticket({
                player: msg.sender,
                lotteryId: _lotteryId,
                ticketNumber: ticketNumber,
                amount: lottery.ticketPrice
            });

            tickets[_lotteryId].push(newTicket);
            playerTickets[msg.sender].push(newTicket);
            emit TicketPurchased(msg.sender, _lotteryId, ticketNumber);
        }

        lottery.soldTickets += _numberOfTickets;

        if (lottery.soldTickets == lottery.totalTickets) {
            lottery.status = LotteryStatus.Closed;
        }
    }

    function runLottery(uint256 _lotteryId) external {
        require(
            msg.sender == owner() || msg.sender == adminWallet,
            "Not authorized"
        );
        Lottery storage lottery = lotteries[_lotteryId];
        require(lottery.status == LotteryStatus.Closed, "Lottery not closed");

        this.requestRandomWords(_lotteryId);
    }

    function forceCompleteLottery(uint256 _lotteryId) external {
        require(
            msg.sender == owner() || msg.sender == adminWallet,
            "Not authorized"
        );
        Lottery storage lottery = lotteries[_lotteryId];
        require(lottery.status == LotteryStatus.Open, "Lottery not open");

        lottery.status = LotteryStatus.Closed;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] calldata _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;

        completeLottery(s_requests[_requestId].lotteryId, _randomWords[0]);

        emit RequestFulfilled(_requestId, _randomWords);
    }

    function requestRandomWords(uint256 lotteryId)
        external
        returns (uint256 requestId)
    {
        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false,
            lotteryId: lotteryId
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function completeLottery(uint256 _lotteryId, uint256 _randomNumber)
        private
    {
        Lottery storage lottery = lotteries[_lotteryId];
        require(lottery.status == LotteryStatus.Closed, "Lottery not closed");

        uint256 winningTicket = _randomNumber % lottery.soldTickets;
        address winner = tickets[_lotteryId][winningTicket].player;

        uint256 houseFee = ((lottery.ticketPrice * lottery.soldTickets) *
            HOUSE_FEE_PERCENTAGE) / 100;
        uint256 winnerPrize = (lottery.ticketPrice * lottery.soldTickets) -
            houseFee;

        lottery.winner = winner;
        lottery.status = LotteryStatus.Completed;

        payable(adminWallet).transfer(houseFee);
        payable(winner).transfer(winnerPrize);
        emit LotteryCompleted(_lotteryId, winner, winnerPrize);
    }

    function getLotteryInfo(uint256 _lotteryId)
        external
        view
        returns (Lottery memory)
    {
        return lotteries[_lotteryId];
    }

    function getPlayerTickets(address _player)
        external
        view
        returns (Ticket[] memory)
    {
        return playerTickets[_player];
    }

    function withdrawFunds() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function setAdminWallet(address _newAdminWallet) external onlyOwner {
        adminWallet = _newAdminWallet;
    }

    function getActiveLotteries() external view returns (Lottery[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < lotteries.length; i++) {
            if (lotteries[i].status == LotteryStatus.Open) {
                activeCount++;
            }
        }

        Lottery[] memory activeLotteries = new Lottery[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < lotteries.length; i++) {
            if (lotteries[i].status == LotteryStatus.Open) {
                activeLotteries[index] = lotteries[i];
                index++;
            }
        }

        return activeLotteries;
    }

    function getPlayerLotteries(address _player)
        external
        view
        returns (LotteryDetails[] memory)
    {
        uint256[] memory playerLotteryIds = new uint256[](lotteries.length);
        uint256 count = 0;

        for (uint256 i = 0; i < lotteries.length; i++) {
            for (uint256 j = 0; j < tickets[i].length; j++) {
                if (tickets[i][j].player == _player) {
                    playerLotteryIds[count] = i;
                    count++;
                    break;
                }
            }
        }

        assembly {
            mstore(playerLotteryIds, count)
        }

        LotteryDetails[] memory playerLotteryDetails = new LotteryDetails[](
            count
        );

        for (uint256 i = 0; i < count; i++) {
            playerLotteryDetails[i] = this.getLotteryDetailsForPlayer(
                playerLotteryIds[i],
                _player
            );
        }

        return playerLotteryDetails;
    }

    function getTotalTicketsSold(uint256 _lotteryId)
        external
        view
        returns (uint256)
    {
        require(_lotteryId < lotteries.length, "Invalid lottery ID");
        return lotteries[_lotteryId].soldTickets;
    }

    function getRemainingTickets(uint256 _lotteryId)
        external
        view
        returns (uint256)
    {
        require(_lotteryId < lotteries.length, "Invalid lottery ID");
        Lottery storage lottery = lotteries[_lotteryId];
        return lottery.totalTickets - lottery.soldTickets;
    }

    function getLotteryStatus(uint256 _lotteryId)
        external
        view
        returns (LotteryStatus)
    {
        require(_lotteryId < lotteries.length, "Invalid lottery ID");
        return lotteries[_lotteryId].status;
    }

    function getPlayerTicketsForLottery(address _player, uint256 _lotteryId)
        external
        view
        returns (uint256[] memory)
    {
        require(_lotteryId < lotteries.length, "Invalid lottery ID");
        uint256[] memory playerTicketNumbers = new uint256[](
            lotteries[_lotteryId].soldTickets
        );
        uint256 count = 0;

        for (uint256 i = 0; i < tickets[_lotteryId].length; i++) {
            if (tickets[_lotteryId][i].player == _player) {
                playerTicketNumbers[count] = tickets[_lotteryId][i]
                    .ticketNumber;
                count++;
            }
        }

        assembly {
            mstore(playerTicketNumbers, count)
        }

        return playerTicketNumbers;
    }

    function getTotalPlayerTickets(address _player)
        external
        view
        returns (uint256)
    {
        return playerTickets[_player].length;
    }

    function getPlayerRecentTickets(address _player, uint256 _count)
        external
        view
        returns (Ticket[] memory)
    {
        Ticket[] memory allTickets = playerTickets[_player];
        uint256 totalTickets = allTickets.length;
        uint256 returnCount = _count < totalTickets ? _count : totalTickets;

        Ticket[] memory recentTickets = new Ticket[](returnCount);
        for (uint256 i = 0; i < returnCount; i++) {
            recentTickets[i] = allTickets[totalTickets - 1 - i];
        }

        return recentTickets;
    }

    function getLotteryDetailsForPlayer(uint256 _lotteryId, address _player)
        external
        view
        returns (LotteryDetails memory)
    {
        require(_lotteryId < lotteries.length, "Invalid lottery ID");

        Lottery memory lottery = lotteries[_lotteryId];
        uint256 ticketsPurchased = this
            .getPlayerTicketsForLottery(_player, _lotteryId)
            .length;
        uint256 remainingTickets = this.getRemainingTickets(_lotteryId);

        return
            LotteryDetails({
                lotteryId: lottery.id,
                ticketsPurchased: ticketsPurchased,
                ticketPrice: lottery.ticketPrice,
                status: lottery.status,
                remainingTickets: remainingTickets,
                prizePool: lottery.prizePool,
                winner: lottery.winner
            });
    }
}
