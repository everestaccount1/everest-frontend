import CountUp from 'react-countup';
import { ethers } from 'ethers';

const UserInfo = ({ tokenBalance, totalStaked, stakedBalance, profit }) => {
  return (
    <div className="grid grid-row-2 gap-2">
      <div className="flex justify-between">
      <div>
        <div className="text-left">
            Balance
          </div>
          <div className="text-left font-bold text-lg">
            <CountUp end={tokenBalance?.toString()} decimals={0} separator="," />
          </div>
        </div>
        <div>
          <div className="text-right">
            Staked Balance
          </div>
          <div className="text-right font-bold text-lg">
            
            <CountUp end={stakedBalance?.toString()} decimals={0} separator="," />
          </div>
        </div>
        
      </div>
      <div className="flex justify-between">
        <div>
          <div className="text-left">
            Total Staked
          </div>
          <div className="text-left font-bold text-lg">
            <CountUp end={totalStaked?.toString() || '0'} decimals={0} separator="," />
          </div>
        </div>
        <div>
          <div className="text-right">
            Your Staking Profit
          </div>
          <div className="text-right font-bold text-lg">
            <CountUp end={profit?.toString() || '0'} decimals={0} separator="," />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo;