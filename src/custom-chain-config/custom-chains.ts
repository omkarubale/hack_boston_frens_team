import { Chain } from "wagmi";

export const klaytn_testnet: Chain = {
  id: 1001,
  name: "Klaytn Baobab",
  network: "hardhat",
  rpcUrls: {
    default: "https://api.baobab.klaytn.net:8651",
  },
  blockExplorers: {
    default: {
      name: "Baobab",
      url: "https://baobab.scope.klaytn.com/",
    },
  },
};
