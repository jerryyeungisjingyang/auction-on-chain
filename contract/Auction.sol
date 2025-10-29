// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

error Auction__NotOwner();
error Auction__NotEnoughDeposit();
error Auction__TradeNotExist();
error Auction__TransferFailed();
error Auction__RefundFailed();
error Auction__ParamsError();
error Auction__FinalizeFailed();
error Auction__NotSeller();

contract Auction {
    event NewTrade(
        address indexed seller,
        uint256 amount,
        uint256 startTimeStamp,
        uint256 endTimeStamp,
        uint256 minimumBidAmount,
        uint256 initPriceOfUint
    );

    event Deposit(address indexed buyer, string tradeID, uint256 amount);

    event RefundDeposit(address indexed buyer, string tradeID, uint256 amount);

    event FinalizeAuction(
        address indexed buyer,
        string tradeID,
        uint256 allowanceAmount,
        uint256 additionalAmountToPay
    );

    event WithdrawAuctionAmount(address indexed user, uint256 amount);

    struct trade {
        address seller;
        uint256 sellAmount;
        uint256 startTimeStamp;
        uint256 endTimeStamp;
        uint256 minimumBidAmount;
        uint256 initPriceOfUint; 
        string itemInfo; 
        mapping(address => uint256) deposits;
        mapping(address => string) bidInfos;
        mapping(address => string) bidSecrets;
    }

    mapping(address => uint256) private s_addressToAllowances;
    mapping(address => uint256) private s_frozenAllowances;
    mapping(string => uint256) private s_deposit;
    mapping(string => trade) private s_trades;
    mapping(address => uint256) private s_auctionAmount;

    address private immutable i_owner;

    constructor() {
        i_owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert Auction__NotOwner();
        }
        _;
    }

    function getAllownance(address user) public view returns (uint256) {
        return s_addressToAllowances[user];
    }

    function issueAllowance(address user, uint256 allowance) public onlyOwner {
        s_addressToAllowances[user] += allowance;
    }

    function freezeAllowance(
        address user,
        uint256 freezedAmount
    ) public onlyOwner {
        s_addressToAllowances[user] -= freezedAmount;
        s_frozenAllowances[user] += freezedAmount;
    }

    function getFrozenAllowance(address user) public view returns (uint256) {
        return s_frozenAllowances[user];
    }

    function unfreezeAllowance(
        address user,
        uint256 unfreezedAmount
    ) public onlyOwner {
        s_addressToAllowances[user] += unfreezedAmount;
        s_frozenAllowances[user] -= unfreezedAmount;
    }

    function destoryAllowance(
        address user,
        uint256 destoryAmount
    ) public onlyOwner {
        s_addressToAllowances[user] -= destoryAmount;
    }

    function destoryAllAllowance(address user) public onlyOwner {
        s_addressToAllowances[user] = 0;
        s_frozenAllowances[user] = 0;
    }

    function startTrade(
        string memory tradeID,
        uint256 amount,
        uint256 startTimeStamp,
        uint256 endTimeStamp,
        uint256 minimumBidAmount,
        uint256 initPriceOfUint
    ) public {
        if (
            amount <= 0 ||
            startTimeStamp >= endTimeStamp ||
            minimumBidAmount <= 0 ||
            initPriceOfUint <= 0 ||
            minimumBidAmount > amount
        ) revert Auction__ParamsError();
        trade storage newTrade = s_trades[tradeID];
        newTrade.seller = msg.sender;
        newTrade.sellAmount = amount;
        newTrade.startTimeStamp = startTimeStamp;
        newTrade.endTimeStamp = endTimeStamp;
        newTrade.minimumBidAmount = minimumBidAmount;
        newTrade.initPriceOfUint = initPriceOfUint;

        s_addressToAllowances[msg.sender] -= amount;
        s_frozenAllowances[msg.sender] += amount;

        emit NewTrade(
            msg.sender,
            amount,
            startTimeStamp,
            endTimeStamp,
            minimumBidAmount,
            initPriceOfUint
        );
    }

    function getTrade(
        string memory tradeID
    )
        public
        view
        returns (address, uint256, uint256, uint256, uint256, uint256)
    {
        trade storage currentTrade = s_trades[tradeID];
        return (
            currentTrade.seller,
            currentTrade.sellAmount,
            currentTrade.startTimeStamp,
            currentTrade.endTimeStamp,
            currentTrade.minimumBidAmount,
            currentTrade.initPriceOfUint
        );
    }

    function deposit(
        string memory tradeID,
        string memory info
    ) public payable {
        trade storage currentTrade = s_trades[tradeID];
        if (currentTrade.seller == address(0))
            revert Auction__TradeNotExist();
        if (msg.value < currentTrade.initPriceOfUint)
            revert Auction__NotEnoughDeposit();

        currentTrade.deposits[msg.sender] = msg.value;
        emit Deposit(msg.sender, tradeID, msg.value);

        setBidInfo(tradeID, info);
    }

    function refundDeposit(string memory tradeID) public {
        trade storage currentTrade = s_trades[tradeID];
        uint256 depositAmount = currentTrade.deposits[msg.sender];
        currentTrade.deposits[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: depositAmount}("");
        if (!success) {
            currentTrade.deposits[msg.sender] = depositAmount;
            revert Auction__TransferFailed();
        }
        emit RefundDeposit(msg.sender, tradeID, depositAmount);
    }

    function setBidInfo(string memory tradeID, string memory info) public {
        trade storage currentTrade = s_trades[tradeID];
        currentTrade.bidInfos[msg.sender] = info;
    }

    function setBidSecret(string memory tradeID, string memory secret) public {
        trade storage currentTrade = s_trades[tradeID];
        currentTrade.bidSecrets[msg.sender] = secret;
    }

    function setTradeItemInfo(string memory tradeID, string memory info) public {
        trade storage currentTrade = s_trades[tradeID];
        if (currentTrade.seller != msg.sender) revert Auction__NotSeller();
        currentTrade.itemInfo = info;
    }

    function getTradeItemInfo(string memory tradeID) public view returns (string memory) {
        trade storage currentTrade = s_trades[tradeID];
        return currentTrade.itemInfo;
    }

    function getBidInfo(
        string memory tradeID
    ) public view returns (string memory) {
        trade storage currentTrade = s_trades[tradeID];
        return currentTrade.bidInfos[msg.sender];
    }

    function getBidSecret(
        string memory tradeID
    ) public view returns (string memory) {
        trade storage currentTrade = s_trades[tradeID];
        return currentTrade.bidSecrets[msg.sender];
    }

    function getTradeDeposit(
        string memory tradeID
    ) public view returns (uint256) {
        return s_trades[tradeID].deposits[msg.sender];
    }

    function getAuctionAmount() public view returns (uint256) {
        return s_auctionAmount[msg.sender];
    }

    function finalizeAuction(
        string memory tradeID,
        uint256 allowanceAmount,
        uint256 additionalAmountToPay
    ) public payable {
        uint256 depositAmount = s_trades[tradeID].deposits[msg.sender];
        s_trades[tradeID].deposits[msg.sender] = 0;
        address seller = s_trades[tradeID].seller;
        if (msg.value != additionalAmountToPay) revert Auction__ParamsError();
        s_auctionAmount[seller] += (depositAmount + msg.value);
        s_frozenAllowances[seller] -= allowanceAmount;
        s_addressToAllowances[msg.sender] += allowanceAmount;
        emit FinalizeAuction(msg.sender, tradeID, allowanceAmount, msg.value);
    }

    function withdrawAuctionAmount() public {
        uint256 auctionAmount = s_auctionAmount[msg.sender];
        s_auctionAmount[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: auctionAmount}("");
        if (!success) revert Auction__RefundFailed();
        emit WithdrawAuctionAmount(msg.sender, auctionAmount);
    }
}
