import { Address } from "wagmi";
import { StaticImageData } from "next/image";
import { BigNumber } from "ethers";

export interface Contract {
  1337?: {
    address: Address
  },
  97?: {
    address: Address
  },
  56?: {
    address: Address
  },
  abi: any
}

export interface Notification {
  title: string;
  description: string | React.ReactNode;
  duration: number;
  type: 'success' | 'warning' | 'info' | 'error';
  link?: string;
}

export interface INotificationContext {
  notification: Notification | null;
  showNotification: boolean;
  dismissNotification: () => void;
  popNotification: (notification: any) => void;
}

export interface IAddLiquidityContext {
  amountA: string;
  amountB: string;
  setAmountA: (amount: string) => void;
  setAmountB: (amount: string) => void;
  setLpBalanceA: (amount: string) => void;
  setLpBalanceB: (amount: string) => void;
  setExactTokenIsA: (isA: boolean) => void;
  exactTokenIsA: boolean;
  setSufficientAllowanceA: (isSufficient: boolean) => void;
  setSufficientAllowanceB: (isSufficient: boolean) => void;
  sufficientAllowanceA: boolean;
  sufficientAllowanceB: boolean;
  clearAmounts: () => void;
}

export type Button = {
  href: string;
  text: string;
  linkIsInternal?: boolean;
}

export type StakingListItem = {
  shortName: string;
  apy: string;
  pool: Contract;
  token: Contract;
  name: string;
  reward: string;
  depositFunction: string;
  poolImg: StaticImageData;
  primaryBtn?: Button;
  secondaryBtn?: Button;
  showClaimBtn: boolean;
  pendingRewardsFunction?: string;
  hasUnlockTime: boolean;
  unlockTimeFunction?: string;
  lockTimeFunction?: string;
}

export type WagmiError = {
  reason?: string;
}