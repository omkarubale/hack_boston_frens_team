import { Chain } from "wagmi";

// klaytn testnet
export const klaytn_testnet: Chain = {
  id: 1001,
  name: "Klaytn Baobab",
  network: "Klaytn",
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

// telos testnet
export const telos_testnet: Chain = {
  id: 41,
  name: "Telos Testnet",
  network: "Telos",
  rpcUrls: {
    default: "https://testnet.telos.net/evm",
  },
  blockExplorers: {
    default: {
      name: "Telos Testnet",
      url: "https://testnet.telos.net/v2/explore/",
    },
  },
};

// bnb testnet
export const bnb_testnet: Chain = {
    id: 97,
    name: "Binance Smart Chain Testnet",
    network: "BNB",
    rpcUrls: {
      default: "https://data-seed-prebsc-1-s1.binance.org:8545",
    },
    blockExplorers: {
      default: {
        name: "BNB Testnet",
        url: "https://testnet.bscscan.com",
      },
    },
  };