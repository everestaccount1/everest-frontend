import { BigNumber, BigNumberish, ethers } from "ethers";
import { FC, useEffect, useState } from "react";
import { Chain, useAccount, useContractRead, useNetwork } from "wagmi";
import { validChains } from "../../constants";
import { StakingListItem } from "../../types";
import Claim from "./Claim";
import Deposit from "./Deposit";
import UserInfo from "./UserInfo";
import Withdraw from "./Withdrawl";

interface EnhanceProps {
  stakingListItem: StakingListItem,
  activePoolIndex: number,
}

export const Enhance: FC<EnhanceProps> = ({ stakingListItem, activePoolIndex }) => {
  const tabs = ['Deposit', 'Withdraw'];
  const [activeTab, setActiveTab] = useState<number>(0);

  const { address, isConnected } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const [chain, setChain] = useState<Chain>(validChains[0]);

  const [tokenBalance, setTokenBalance] = useState('0');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [totalStaked, setTotalStaked] = useState('0');
  const [userRewards, setUserRewards] = useState('0');
  const [leaveEarlyFee, setLeaveEarlyFee] = useState('0');
  const [rewards, setRewards] = useState('0');

  useEffect(() => {
    if (isConnected && connectedChain) {
      setChain(connectedChain);
    } else {
      setChain(validChains[0]);
    }
  }, [isConnected, connectedChain]);

  const { refetch: refetchTotalStaked } = useContractRead({
    address: stakingListItem.pool[chain?.id]?.address,
    abi: stakingListItem.pool.abi,
    functionName: 'totalSupply',
    onSuccess (data: BigNumberish) {
      setTotalStaked(ethers.utils.formatUnits(data, 18));
    },
    onError (e) {
      if (e) {
        setTotalStaked('0');
      }
    }
  });

  const { refetch: refetchTotalRewards } = useContractRead({
    address: stakingListItem.pool[chain?.id]?.address,
    abi: stakingListItem.pool.abi,
    functionName: 'totalRewards',
    args: [address],
    onSuccess (data: BigNumberish) {
      console.log('total rewards for ' + stakingListItem[chain?.id]?.address + ' ' + data.toString())
      setUserRewards(ethers.utils.formatUnits(data, 18));
    },
    onError (e: any) {
      if (e) {
        setUserRewards('0');
      }
    }
  });

  const { refetch: refetchTokenBalance } = useContractRead({
    address: stakingListItem.token[chain?.id]?.address,
    abi: stakingListItem.token.abi,
    functionName: 'balanceOf',
    args: [address],
    onSuccess (data: BigNumberish) {
      setTokenBalance(ethers.utils.formatUnits(data, 18));
    },
    onError (e) {
      if (e) {
        setTokenBalance('0');
      }
    }
  });

  useContractRead({
    address: stakingListItem.pool[chain?.id]?.address,
    abi: stakingListItem.pool.abi,
    functionName: 'pendingRewards',
    args: [address],
    enabled: true,
    onSettled: (data, error) => {
      if (error) {
        console.log('Rewards Error');
      } else if (data) {
        console.log('Rewards: ', ethers.utils.formatEther(data as BigNumber));
        setRewards(ethers.utils.formatEther(data as BigNumber));
      }
    }
  });

  const { refetch: refetchStakedBalance } = useContractRead({
    address: stakingListItem.pool[chain?.id]?.address,
    abi: stakingListItem.pool.abi,
    functionName: 'balanceOf',
    args: [address],
    onSuccess (data: BigNumberish) {
      setStakedBalance(ethers.utils.formatUnits(data, 18));
    },
    onError (e) {
      if (e) {
        setStakedBalance('0');
      }
    },
  });

  const { refetch: refetchLeaveEarlyFee } = useContractRead({
    address: stakingListItem.pool[chain?.id]?.address,
    abi: stakingListItem.pool.abi,
    functionName: 'leaveEarlyFee',
    onSuccess (data: BigNumberish) {
      console.log('leaveEarlyFee', BigNumber.from(data).div(10).toString() + '%');
      setLeaveEarlyFee(BigNumber.from(data).div(10).toString());
    },
    onError (e) {
      if (e) {
        setLeaveEarlyFee('0');
      }
    }
  });

  const refetchBalances = () => {
    refetchTokenBalance();
    refetchStakedBalance();
    refetchTotalRewards();
    refetchTotalStaked();
    refetchLeaveEarlyFee();
  }

  useEffect(() => {
    console.log('refetching balances', stakingListItem.name)
    refetchBalances();
  }, [activePoolIndex])

  const getTokensPerDay = () => {
    return 1000;
  }

  const getAPY = () => {
    return (36500 * getTokensPerDay() / parseFloat(totalStaked)).toFixed(2);
  }
  
  return (
    <div className="flex flex-col justify-center w-full bg-black bg-opacity-30 backdrop-blur-lg border border-brand-light-gray rounded-2.5xl p-8">
      <div className="mx-auto mb-4">
        <div className="tabs tabs-boxed">
          {tabs.map((tab: string, i: number) => (
            <a 
              key={i}
              className={`tab ${activeTab === i ? 'tab-active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </a>
          ))}
        </div>
      </div>
      <UserInfo
        stakedBalance={stakedBalance}
        totalStaked={totalStaked} 
        tokenBalance={tokenBalance} 
        profit={userRewards}
        apy={getAPY()}
        leaveEarlyFee={leaveEarlyFee}
      />
      <div>
        {activeTab === 0 && (              
          <Deposit 
            tokenBalance={tokenBalance}
            chain={chain}
            callback={refetchBalances}
            stakingListItem={stakingListItem}
          />
        )}
        {activeTab === 1 && (
          <Withdraw
            stakedBalance={stakedBalance}
            chain={chain}
            callback={refetchBalances}
            stakingListItem={stakingListItem}          
          />
        )}
        <Claim 
        chain={chain}
        callback={refetchBalances}
        address={stakingListItem.pool[chain?.id]?.address}
        showClaimBtn={true}
        pRewards={rewards}
        />
      </div>
    </div>
  )
}

export default Enhance;