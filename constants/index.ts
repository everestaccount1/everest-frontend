import wethJson from './abis/WBNB.json';
import tokenJson from './abis/DAYL.json';
import routerJson from './abis/Router.json';
import factoryJson from './abis/Factory.json';
import lpProviderJson from './abis/LPProvider.json';
import { Chain, erc20ABI } from 'wagmi';
import { Contract, StakingListItem } from '../types';
import daylImg from '../public/img/aviate_icon.png';
import stakingJson from './abis/Staking.json';

// use eth by default in prod and localhost by default in dev
export const defaultChainId = process.env.NODE_ENV === 'production' ? 56 : 1337
export const validChains = [
  {
    id: 56,
    name: 'BSC',
    network: 'bsc_mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://bsc-dataseed.binance.org',
      default2: 'https://bsc-dataseed1.defibit.io/',
      default3: 'https://bsc-dataseed1.ninicoin.io/',
    },
    blockExplorers: {
      etherscan: {
        name: 'BNB Chain Explorer',
        url: 'https://bscscan.com',
      },
      default: {
        name: 'BNB Chain Explorer',
        url: 'https://bscscan.com',
      },
    },
    testnet: false,
  } as Chain,
  {
    id: 97,
    name: 'BSC Testnet',
    network: 'bsc_testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    },
    blockExplorers: {
      etherscan: {
        name: 'BNB Testnet Explorer',
        url: 'https://testnet.bscscan.com/',
      },
      default: {
        name: 'BNB Testnet Explorer',
        url: 'https://testnet.bscscan.com/',
      },
    },
    testnet: false, // TODO: make this true when going live
  } as Chain,
  {
    id: 1337,
    name: 'Ganache',
    network: 'ganache',
    nativeCurrency: {
      decimals: 18,
      name: 'Ethereum',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: 'http://127.0.0.1:8545',
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://wagmi.sh' },
    },
    testnet: true
  } as Chain
].filter(chain => process.env.NODE_ENV === 'production' ? !chain.testnet : true);

export const WETH: Contract = {
  1337: {
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  },
  97: {
    address: '0x651c28254a7b769bef3F20749e6Fd2f86B1CBbC1'
  },
  56: {
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
  },
  abi: wethJson,
}

export const BUSD: Contract = {
  1337: {
    address: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'
  },
  97: {
    address: '0xBba56cd9666E2E2de2638DDA9c89A90f09D6E020'
  },
  56: {
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
  },
  abi: erc20ABI
}

export const TOKEN: Contract = {
  1337: {
    address: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
  },
  97: {
    address: '0xeB8b5b7b4fCC4c6b4C86fb187B308d3F6D6e6A00'
  },
  56: {
    address: '0x55a633B3FCe52144222e468a326105Aa617CC1cc'
  },
  abi: tokenJson,
}

export const FACTORY: Contract = {
  1337: {
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  },
  97: {
    address: '0xdAA34E63569280c7Aaa0c2bA50f24471080e0215'
  },
  56: {
    address: '0x3AefE13269a7Ed7506664598C400F17902AD2635'
  },
  abi: factoryJson,
}

export const ROUTER: Contract = {
  1337: {
    address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
  },
  97: {
    address: '0x552B371f8AD39D96E6Ac169808E29e7552FF5172'
  },
  56: {
    address: '0xb34DA672837aFe372eceF419b25a357A36f59F6f'
  },
  abi: routerJson,
}

export const STAKINGLIST: StakingListItem[] = [
  {
    pool: {
      56: {
        address: '0xcf8a986a9a7a57A3Daa0085E83DD2B2af5d9B372'
      },
      1337: {
        address: '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE',
      },
      abi: stakingJson,
    },
    token: {
      56: {
        address: '0x55a633B3FCe52144222e468a326105Aa617CC1cc'
      },
      1337: {
        address: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      },
      abi: erc20ABI,
    },
    name: '7 Days',
    shortName: '7d',
    apy: '0',
    depositFunction: 'deposit',
    unlockTimeFunction: 'remainingLockTime',
    lockTimeFunction: 'leaveEarlyFeeTimer',
    pendingRewardsFunction: 'getTotalProfits',
    hasUnlockTime: true,
    reward: 'TRUTH',
    poolImg: daylImg,
    showClaimBtn: false,
    primaryBtn: {
      text: 'Buy TRUTH',
      href: "https://dapp.daylightprotocol.com/swap?inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      linkIsInternal: false,
    },
  },
  {
    pool: {
      56: {
        address: '0x66AaeB0044A5a5084e1F5aB08B05e2f413415288'
      },
      1337: {
        address: '0x68B1D87F95878fE05B998F19b66F4baba5De1aed',
      },
      abi: stakingJson,
    },
    token: {
      56: {
        address: '0x55a633B3FCe52144222e468a326105Aa617CC1cc'
      },
      1337: {
        address: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      },
      abi: erc20ABI
    },
    name: '30 Days',
    shortName: '30d',
    apy: '0',
    reward: 'TRUTH',
    pendingRewardsFunction: 'getTotalProfits',
    depositFunction: 'deposit',
    unlockTimeFunction: 'remainingLockTime',
    poolImg: daylImg,
    showClaimBtn: true,
    hasUnlockTime: true,
    primaryBtn: {
      text: 'Add Liquidity',
      href: "/add?tokenA=0x9d0233857A7F75089924fF27E7CC554adab350Bb&tokenB=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      linkIsInternal: true,
    },
    secondaryBtn: {
      text: 'Remove Liquidity',
      href: "https://dapp.daylightprotocol.com/liquidity",
      linkIsInternal: false,
    }
  },
  {
    pool: {
      56: {
        address: '0x509865D9A76CdD310651bBcebcaE08C69F3357b9'
      },
      1337: {
        address: '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c',
      },
      abi: stakingJson,
    },
    token: {
      56: {
        address: '0x55a633B3FCe52144222e468a326105Aa617CC1cc'
      },
      1337: {
        address: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      },
      abi: erc20ABI,
    },
    name: '90 Days',
    shortName: '90d',
    apy: '0',
    reward: 'TRUTH',
    depositFunction: 'deposit',
    unlockTimeFunction: 'remainingLockTime',
    pendingRewardsFunction: 'getTotalProfits',
    poolImg: daylImg,
    showClaimBtn: true,
    hasUnlockTime: true,
    primaryBtn: {
      text: 'Add Liquidity',
      href: "/add?tokenA=0x9d0233857A7F75089924fF27E7CC554adab350Bb&tokenB=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      linkIsInternal: true,
    },
    secondaryBtn: {
      text: 'Remove Liquidity',
      href: "https://dapp.daylightprotocol.com/liquidity",
      linkIsInternal: false,
    }
  },
  {
    pool: {
      56: {
        address: '0x7058903eb501b62bE4A7ADD0B7Ab906Ec5E14EF8'
      },
      1337: {
        address: '0xc6e7DF5E7b4f2A278906862b61205850344D4e7d',
      },
      abi: stakingJson,
    },
    token: {
      56: {
        address: '0x55a633B3FCe52144222e468a326105Aa617CC1cc'
      },
      1337: {
        address: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      },
      abi: erc20ABI,
    },
    name: '180 Days',
    shortName: '180d',
    apy: '0',
    reward: 'TRUTH',
    depositFunction: 'deposit',
    unlockTimeFunction: 'remainingLockTime',
    pendingRewardsFunction: 'getTotalProfits',
    poolImg: daylImg,
    showClaimBtn: true,
    hasUnlockTime: true,
    primaryBtn: {
      text: 'Add Liquidity',
      href: "https://dapp.daylightprotocol.com/add",
      linkIsInternal: false,
    },
    secondaryBtn: {
      text: 'Remove Liquidity',
      href: "https://dapp.daylightprotocol.com/liquidity",
      linkIsInternal: false,
    }
  },
  {
    pool: {
      56: {
        address: '0xC5359c9a55bC5AF6781a02677E61bECA0254e9A6'
      },
      1337: {
        address: '0x59b670e9fA9D0A427751Af201D676719a970857b',
      },
      abi: stakingJson,
    },
    token: {
      56: {
        address: '0x55a633B3FCe52144222e468a326105Aa617CC1cc'
      },
      1337: {
        address: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
      },
      abi: erc20ABI,
    },
    name: '365 Days',
    shortName: '365d',
    apy: '0',
    reward: 'TRUTH',
    depositFunction: 'deposit',
    unlockTimeFunction: 'remainingLockTime',
    pendingRewardsFunction: 'getTotalProfits',
    poolImg: daylImg,
    showClaimBtn: true,
    hasUnlockTime: true,
    primaryBtn: {
      text: 'Add Liquidity',
      href: "https://dapp.daylightprotocol.com/add",
      linkIsInternal: false,
    },
    secondaryBtn: {
      text: 'Remove Liquidity',
      href: "https://dapp.daylightprotocol.com/liquidity",
      linkIsInternal: false,
    }
  },

]

export const LP_PROVIDER: Contract = {
  1337: {
    address: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
  },
  56: {
    address: '0x6CB72938CA3A31792E5b0a3cC2ED20fa3043058C'
  },
  abi: lpProviderJson
}

// export const STAKING: Contract = {
//   1337: {
//     address: '0x0165878A594ca255338adfa4d48449f69242Eb8F'
//   },
//   97: {
//     address: '0x6d939A024b9675AE977E63627f1aD6c345169bC7' 
//   },
//   56: {
//     address: '0x6d939A024b9675AE977E63627f1aD6c345169bC7' //<<
//   },
//   abi: stakingJson,
// }

// export const DAYL_MDB_POOL: Contract = {
//   1337: {
//     address: '0x0165878A594ca255338adfa4d48449f69242Eb8F'
//   },
//   97: {
//     address: '0x6d939A024b9675AE977E63627f1aD6c345169bC7' 
//   },
//   56: {
//     address: '0x6d939A024b9675AE977E63627f1aD6c345169bC7' //<<
//   },
//   abi: stakingJson,
// }

type NavItem = {
  name: string,
  link: string,
  active?: boolean,
}

export const NAV_ITEMS: Array<NavItem> = [
  {
    name: 'Home',
    link: 'https://aviate.finance/'
  },
  // {
  //   name: 'DEX',
  //   link: 'https://dapp.daylightprotocol.com'
  // },
  // {
  //   name: 'Supernova',
  //   link: 'https://daylightprotocol.com'
  // },
  {
    name: 'Earn',
    link: '/',
    active: true
  },
]