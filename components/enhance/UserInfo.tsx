import { FC } from 'react';
import CountUp from 'react-countup';

interface UserInfoProps {
  tokenBalance: string,
  totalStaked: string,
  stakedBalance: string,
  profit: string,
  apy: string,
  leaveEarlyFee: string,
}

const UserInfo: FC<UserInfoProps> = ({ 
  tokenBalance, 
  totalStaked, 
  stakedBalance, 
  profit,
  apy,
  leaveEarlyFee,
}) => {

  if (apy == 'Infinity') {
    apy = '0';
  }

  return (
    <div className="grid grid-row-2 gap-2">
      <div className="flex justify-between">
      <div>
        <div className="text-left">
            Balance
          </div>
          <div className="text-left font-bold text-lg">
            <CountUp end={Number(tokenBalance)} decimals={0} separator="," />
          </div>
        </div>
        <div>
          <div className="text-right">
            Your Staked Balance
          </div>
          <div className="text-right font-bold text-lg">
            
            <CountUp end={Number(stakedBalance)} decimals={0} separator="," />
          </div>
        </div>
        
      </div>
      <div className="flex justify-between">
        <div>
          <div className="text-left">
            Total Staked
          </div>
          <div className="text-left font-bold text-lg">
            <CountUp end={Number(totalStaked) || 0} decimals={0} separator="," />
          </div>
        </div>
        <div>
          <div className="text-right">
            Total Rewards
          </div>
          <div className="text-right font-bold text-lg">
            <CountUp end={Number(profit) || 0} decimals={0} separator="," /> USDC
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <div className="text-left">
            Leave Early Fee
          </div>
          <div className="text-left font-bold text-lg">
            <CountUp end={Number(leaveEarlyFee) || 0} decimals={0} separator="," suffix='%' />
          </div>
        </div>
        <div>
          <div className="text-right">
            APY
          </div>
          <div className="text-right font-bold text-lg">
            <CountUp end={Number('1000') || 0} decimals={0} separator="," suffix='%' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo;