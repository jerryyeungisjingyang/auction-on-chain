import { ethers } from "ethers";

export const auctionAbi = [
  {
    type: "function",
    name: "getAllownance",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getFrozenAllowance",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getTrade",
    stateMutability: "view",
    inputs: [{ name: "tradeID", type: "string" }],
    outputs: [
      { name: "seller", type: "address" },
      { name: "sellAmount", type: "uint256" },
      { name: "startTimeStamp", type: "uint256" },
      { name: "endTimeStamp", type: "uint256" },
      { name: "minimumBidAmount", type: "uint256" },
      { name: "initPriceOfUint", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "getTradeDeposit",
    stateMutability: "view",
    inputs: [{ name: "tradeID", type: "string" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getAuctionAmount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },

  // writes
  {
    type: "function",
    name: "startTrade",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tradeID", type: "string" },
      { name: "amount", type: "uint256" },
      { name: "startTimeStamp", type: "uint256" },
      { name: "endTimeStamp", type: "uint256" },
      { name: "minimumBidAmount", type: "uint256" },
      { name: "initPriceOfUint", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "deposit",
    stateMutability: "payable",
    inputs: [
      { name: "tradeID", type: "string" },
      { name: "info", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "refundDeposit",
    stateMutability: "nonpayable",
    inputs: [{ name: "tradeID", type: "string" }],
    outputs: [],
  },
  {
    type: "function",
    name: "setBidInfo",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tradeID", type: "string" },
      { name: "info", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setBidSecret",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tradeID", type: "string" },
      { name: "secret", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setTradeItemInfo",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tradeID", type: "string" },
      { name: "info", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getTradeItemInfo",
    stateMutability: "view",
    inputs: [{ name: "tradeID", type: "string" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "getBidInfo",
    stateMutability: "view",
    inputs: [{ name: "tradeID", type: "string" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "getBidSecret",
    stateMutability: "view",
    inputs: [{ name: "tradeID", type: "string" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "finalizeAuction",
    stateMutability: "payable",
    inputs: [
      { name: "tradeID", type: "string" },
      { name: "allowanceAmount", type: "uint256" },
      { name: "additionalAmountToPay", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "withdrawAuctionAmount",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
];

// 后续更改为合约地址
export const AUCTION_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000001";

export function getContractAddress(): string {
  return AUCTION_CONTRACT_ADDRESS;
}

export function getCarbonTraderContract(providerOrSigner: ethers.Provider | ethers.Signer) {
  return new ethers.Contract(getContractAddress(), auctionAbi, providerOrSigner);
}


