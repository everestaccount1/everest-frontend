import { AddLiquidityField } from "./AddForm";
import { Contract, WagmiError } from "../../types";
import { ArrowLeft } from "react-feather";
import Link from "next/link";
import { FC, useContext, useMemo, useState } from "react";
import { Address, Chain, useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { FACTORY, LP_PROVIDER, TOKEN } from "../../constants";
import AddLiquidityContext from "../../context/AddLiquidityContext";
import { BigNumber, BigNumberish, ethers } from "ethers";
import DaylPairAbi from '../../constants/abis/DaylPair.json';
import formatError from "../../helpers/formatError";
import { ExternalLink } from "react-feather";
import NotificationContext from "../../context/NotificationContext";

interface AddLiquidityProps {
  tokenA: Contract,
  tokenB: Contract,
  chain: Chain
}

export const AddLiquidity: FC<AddLiquidityProps> = ({ tokenA, tokenB, chain }) => {
  const { 
    setLpBalanceA, 
    setLpBalanceB, 
    amountA, 
    amountB, 
    clearAmounts,
    sufficientAllowanceA, 
    sufficientAllowanceB 
  } = useContext(AddLiquidityContext);
  // user account
  const { address } = useAccount();
  const [pairAddress, setPairAddress] = useState<string>(ethers.constants.AddressZero);
  // loading state for pairing
  const [isPairing, setIsPairing] = useState<boolean>(false);
  // pop notifications
  const { popNotification } = useContext(NotificationContext);
  // token balances
  const [tokenABalance, setTokenABalance] = useState<string>('0');
  const [tokenBBalance, setTokenBBalance] = useState<string>('0');

  // the token that is not daylight
  const nonDayLightTokenAddr = useMemo(() => {
    if (tokenA?.[chain?.id]?.address.toLowerCase() === TOKEN[chain?.id]?.address?.toLowerCase()) {
      return tokenB?.[chain?.id]?.address;
    }
    return tokenA?.[chain?.id]?.address;
  }, [tokenA, tokenB, chain?.id]);

  useContractRead({
    address: FACTORY[chain?.id]?.address,
    abi: FACTORY.abi,
    functionName: 'getPair',
    args: [tokenA[chain?.id]?.address, tokenB[chain?.id]?.address],
    onSuccess (data: Address) {
      setPairAddress(data);
    },
  });

  useContractRead({
    address: pairAddress,
    abi: DaylPairAbi,
    functionName: 'getReserves',
    onSuccess (data: any) {
      // lowest sort order token is token0
      const bnTokenA = BigNumber.from(tokenA[chain?.id]?.address);
      const bnTokenB = BigNumber.from(tokenB[chain?.id]?.address);
      if (bnTokenA.lt(bnTokenB)) {
        setLpBalanceA(data[0]);
        setLpBalanceB(data[1]);
      } else {
        setLpBalanceA(data[1]);
        setLpBalanceB(data[0]);
      }
    }
  });

  console.log([
    nonDayLightTokenAddr === tokenA[chain?.id]?.address ? amountB : amountA, // daylight amount
    nonDayLightTokenAddr, 
    nonDayLightTokenAddr === tokenA[chain?.id]?.address ? amountA : amountB, // non daylight amount
  ])
  
  const { config, error, isLoading } = usePrepareContractWrite({
    address: LP_PROVIDER[chain?.id]?.address,
    abi: LP_PROVIDER.abi,
    functionName: 'pair',
    args: [
      nonDayLightTokenAddr === tokenA[chain?.id]?.address ? amountB : amountA, // daylight amount
      nonDayLightTokenAddr, 
      nonDayLightTokenAddr === tokenA[chain?.id]?.address ? amountA : amountB, // non daylight amount
    ],
  });

  console.log({ isLoading })

  const { refetch: refetchBalanceA } = useContractRead({
    address: tokenA?.[chain?.id]?.address,
    abi: tokenA?.abi,
    functionName: 'balanceOf',
    args: [address],
    onSuccess (data: BigNumberish) {
      setTokenABalance(ethers.utils.formatEther(data));
    }
  });

  const { refetch: refetchBalanceB } = useContractRead({
    address: tokenB?.[chain?.id]?.address,
    abi: tokenB?.abi,
    functionName: 'balanceOf',
    args: [address],
    onSuccess (data: BigNumberish) {
      setTokenBBalance(ethers.utils.formatEther(data));
    }
  });

  const wagmiError = useMemo(() => {
    return error as WagmiError
  }, [error]);

  const errorsIgnored = [
    'Transfer amount must be greater than zero',
    'execution reverted: Zero Amount',
    'execution reverted: Insufficient Allowance',
    "Error: Transaction reverted: function selector was not recognized and there's no fallback function",
  ];

  const SuccessNotificationDescription: FC = () => (
    <div className="flex items-center">
      <span className="mt-1">{`View on ${chain?.blockExplorers?.default?.name}`}</span> 
      <ExternalLink className="ml-1 h-5 w-5" />
    </div>
  )

  const { write } = useContractWrite({
    ...config,
    async onSuccess (data) {
      setIsPairing(true);
      popNotification({
        type: 'success',
        title: 'Pairing Submitted',
        description: SuccessNotificationDescription,
        link: `${chain?.blockExplorers?.default?.url}/tx/${data.hash}`
      });
      await data.wait();
      setIsPairing(false);
      refetchBalanceA();
      refetchBalanceB();
      popNotification({
        type: 'success',
        title: 'Pairing Complete',
        description: SuccessNotificationDescription,
        link: `${chain?.blockExplorers?.default?.url}/tx/${data.hash}`
      });
      clearAmounts();
    }
  });

  return (
    <div className="card grid grid-flow-row gap-2 w-full bg-brand-transparent-gray border border-brand-light-gray rounded-2.5xl p-8">
      <div className="grid grid-flow-row gap-2">
        <div className="w-full">
          <Link href="/">
            <a className="flex items-center mb-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Farm
            </a>
          </Link>
        </div>
        <div className="w-full text-3xl mb-4">
          Adding Liquidity
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AddLiquidityField chain={chain} tokenBalance={tokenABalance} token={tokenA} isTokenA={true} />
          <AddLiquidityField chain={chain} tokenBalance={tokenBBalance} token={tokenB} isTokenA={false} />
        </div>
        {sufficientAllowanceA && sufficientAllowanceB && (
          <div>
            <button 
              className={`btn btn-primary btn-block mt-2 ${isPairing || isLoading ? 'loading' : ''}`}
              disabled={!write}
              onClick={() => {
                setIsPairing(true);
                write?.();
              }}
            >
              {isLoading ? 'Loading...' : 'Pair'}
            </button>
          </div>
        )}
        {wagmiError && !errorsIgnored.find((e: string) => e.includes(formatError(wagmiError?.reason))) && (
          <div className="text-error text-xs text-center">
            {formatError(wagmiError?.reason)}
          </div>
        )}
      </div>
    </div>
  )
}

export default AddLiquidity;