export const chogRpsVsBotAbi = [
  {
    type: "function",
    name: "play",
    stateMutability: "nonpayable",
    inputs: [
      { name: "playerMove", type: "uint8" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "withdrawChog",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "withdrawChogAll",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "owner",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "deposit",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    type: "event",
    name: "GamePlayed",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "playerMove", type: "uint8", indexed: false },
      { name: "botMove", type: "uint8", indexed: false },
      { name: "outcome", type: "uint8", indexed: false },
      { name: "amount", type: "uint256", indexed: false },
      { name: "playerPayout", type: "uint256", indexed: false },
      { name: "buybackAmount", type: "uint256", indexed: false },
      { name: "hadNft", type: "bool", indexed: false },
    ],
  },
] as const;

export const erc20ApproveAbi = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
] as const;
