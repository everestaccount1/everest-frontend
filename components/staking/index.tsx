import { FC, useState, useEffect } from 'react';
import Deposit from './Deposit';
import Withdraw from './Withdrawl';
import Image, { StaticImageData } from 'next/image';
import { Contract, Button } from '../../types';
import Link from 'next/link';

import { useContractRead, useAccount, useNetwork, Chain } from 'wagmi';
import { TOKEN, validChains } from '../../constants';
import { BigNumberish, ethers } from 'ethers';

interface StakingProps {
  pool: Contract,
  token: Contract,
  poolImg: StaticImageData,
  depositFunction: string,
  name: string,
  reward: string,
  rewardImg: StaticImageData,
  primaryBtn?: Button,
  secondaryBtn?: Button,
  showClaimBtn: boolean,
  pendingRewardsFunction: string,
  hasUnlockTime: boolean,
}

const Staking: FC<StakingProps> = ({ 
  pool, token, poolImg, name, reward, rewardImg, depositFunction, primaryBtn, secondaryBtn, showClaimBtn, pendingRewardsFunction, hasUnlockTime
}) => {
  const { address, isConnected } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const [chain, setChain] = useState<Chain>(validChains[0]);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [totalStaked, setTotalStaked] = useState('0');
  const [totalRewards, setTotalRewards] = useState('0');

  const { refetch: refetchTotalStaked } = useContractRead({
    address: pool[chain?.id]?.address,
    abi: pool?.abi,
    functionName: 'totalSupply',
    onSuccess (data: BigNumberish) {
      setTotalStaked(ethers.utils.formatUnits(data, 18));
    }
  });

  const { refetch: refetchTotalRewards } = useContractRead({
    address: pool[chain?.id]?.address,
    abi: pool?.abi,
    functionName: 'totalRewards',
    onSuccess (data: BigNumberish) {
      setTotalRewards(ethers.utils.formatUnits(data, 18));
    }
  });

  useEffect(() => {
    if (isConnected && connectedChain) {
      setChain(connectedChain);
    } else {
      setChain(validChains[0]);
    }
  }, [isConnected, connectedChain]);

  const { refetch: refetchTokenBalance } = useContractRead({
    address: token[chain?.id]?.address,
    abi: token?.abi,
    functionName: 'balanceOf',
    args: [address],
    onSuccess (data: BigNumberish) {
      setTokenBalance(ethers.utils.formatUnits(data, 18));
    }
  });

  const { refetch: refetchStakedBalance } = useContractRead({
    address: pool[chain?.id]?.address,
    abi: pool?.abi,
    functionName: 'balanceOf',
    args: [address],
    onSuccess (data: BigNumberish) {
      setStakedBalance(ethers.utils.formatUnits(data, 18));
    },
    onError (error) {
      console.log('Error', error)
    },
  });

  const refetchBalances = () => {
    refetchTokenBalance();
    refetchStakedBalance();
    refetchTotalRewards();
    refetchTotalStaked();
  }

  return (
    <div className="grid grid-flow-row gap-2 bg-black bg-opacity-30 backdrop-blur-lg border border-brand-light-gray rounded-2.5xl p-8">
      <div className="hidden sm:grid grid-cols-12 gap-2 font-bold p-2 pb-0">
        <div className="col-span-4">Pool</div>
        <div className="col-span-2 mx-auto">Deposited</div>
        <div className="col-span-2 mx-auto">TVL</div>
        <div className="col-span-2 mx-auto">Rewards</div>
        <div className="col-span-2 mx-auto">APY</div>
      </div>
      <div className="grid sm:grid-cols-12 grid-cols-2 gap-2 border border-brand-light-gray rounded-2.5xl p-4 sm:p-2 text-sm">
        <div className="sm:col-span-4 flex flex-col items-center">
          <div className="flex sm:hidden text-xs w-full">
            Pool
          </div>
          <div className="flex items-center w-full">
            <div className="pt-3 mr-2 sm:mx-2">
              <Image src={poolImg} alt={name} width={32} height={32} />
            </div>
            <div className="pt-1">{name}</div>
          </div>
        </div>
        <div className="sm:col-span-2 sm:mx-auto flex flex-col items-center">
          <div className="flex sm:hidden text-xs w-full">
            Deposited
          </div>
          <div className="flex items-center h-full w-full">
            {parseFloat(totalStaked)?.toLocaleString([],{})} TRUTH
          </div>
        </div>
        <div className="sm:col-span-2 sm:mx-auto flex flex-col items-center">
          <div className="flex sm:hidden text-xs w-full">
            TVL
          </div>
          <div className="flex items-center h-full w-full">
            {parseFloat(totalStaked)?.toLocaleString([],{})} TRUTH
          </div>
        </div>
        <div className="sm:col-span-2 sm:mx-auto flex flex-col items-center">
          <div className="flex sm:hidden text-xs w-full">
            Rewards
          </div>
          <div className="flex items-center w-full h-full">
            <Image src={rewardImg} alt={reward} width={32} height={32} />
            <div className="ml-2 flex flex-col">
              <div>{reward}</div>
              <div className="text-xs">
                {parseFloat(totalRewards)?.toLocaleString([],{})} {reward}
              </div>
            </div>
          </div>
        </div>
        <div className="sm:col-span-2 sm:mx-auto flex flex-col items-center justify-start">
          <div className="sm:hidden text-xs flex justify-start w-full">
            APY
          </div>
          <div className="flex justify-start sm:justify-center items-center h-full w-full">
            <div className="badge badge-accent bg-opacity-80 badge-lg pr-0 flex justify-start">
              <div className="flex items-center justify-between">
                <div className="text-sm pt-1">∞</div>
                <Image src={rewardImg} alt="TRUTH" width={26} height={26} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        {primaryBtn && primaryBtn.linkIsInternal && (
          <Link href={primaryBtn.href}>
            <button className="btn btn-sm btn-primary rounded-3xl pt-0.5">
              {primaryBtn.text}
            </button>
          </Link>
        )}
        {primaryBtn && !primaryBtn.linkIsInternal && (
          <a href={primaryBtn.href} rel="noreferrer" target='_blank' className="btn btn-sm btn-primary rounded-3xl pt-0.5">
            {primaryBtn.text}
          </a>
        )}
        {secondaryBtn && secondaryBtn.linkIsInternal && (
          <Link href={secondaryBtn.href}>
            <button className="btn btn-sm btn-primary rounded-3xl pt-0.5">
              {secondaryBtn.text}
            </button>
          </Link>
        )}
        {secondaryBtn && (
          <a href={secondaryBtn.href} rel="noreferrer" target='_blank' className="btn btn-sm btn-secondary ml-2 rounded-3xl pt-0.5">
            {secondaryBtn.text}
          </a>
        )}
      </div>
      <div className={`grid md:grid-cols-3 grid-cols-1 gap-10`}>
        <Deposit tokenBalance={tokenBalance} chain={chain} callback={refetchBalances} poolImg={poolImg}  
          address={pool[chain?.id]?.address} pool={pool} abi={pool?.abi} depositFunction={depositFunction} token={token} hasUnlockTime={hasUnlockTime}
        />
        <Withdraw stakedBalance={stakedBalance} chain={chain} callback={refetchBalances} poolImg={poolImg}
          address={pool[chain?.id]?.address} abi={pool?.abi} hasUnlockTime={hasUnlockTime}
         />
        
      </div>
    </div>
  )
}

export default Staking;