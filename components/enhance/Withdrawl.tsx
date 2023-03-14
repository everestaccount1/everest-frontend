import Image, { StaticImageData } from 'next/image';
import { FC, useState, useContext } from 'react';
import { utils } from 'ethers';
import { usePrepareContractWrite, useContractWrite, Chain } from 'wagmi';
import formatError from '../../helpers/formatError';
import { ExternalLink } from 'react-feather';
import NotificationContext from '../../context/NotificationContext';
import { StakingListItem, WagmiError } from '../../types';
import UnlockTime from './UnlockTime';

interface WithdrawlProps {
  stakedBalance: string,
  chain: Chain,
  callback: () => void,
  stakingListItem: StakingListItem
}

const Withdraw: FC<WithdrawlProps> = ({ 
  stakedBalance, 
  chain, 
  callback,
  stakingListItem
}) => {
  const { popNotification } = useContext(NotificationContext);
  const [amount, setAmount] = useState('');
  const [inProgress, setInProgress] = useState(false);

  const max = () => {
    setAmount(stakedBalance);
  }

  const handleChangeAmount = (e) => {
    if (isNaN(Number(e.target.value))) return;
    setAmount(e.target.value);
  }

  const SuccessNotificationDescription = () => (
    <div className="flex items-center">
      <span className="mt-1">{`View on ${chain?.blockExplorers?.default?.name}`}</span> 
      <ExternalLink className="ml-1 h-5 w-5" />
    </div>
  )

  const { config, error } = usePrepareContractWrite({
    address: stakingListItem.pool[chain?.id]?.address,
    abi: stakingListItem.pool.abi,
    functionName: 'withdraw',
    args: [utils.parseEther(amount || '0')],
  });

  const wagmiError = error as WagmiError;

  const { write, isLoading } = useContractWrite({
    ...config,
    async onSuccess (data) {
      setInProgress(true);
      popNotification({
        type: 'success',
        title: 'Withdrawl Submitted',
        description: SuccessNotificationDescription,
        link: `${chain?.blockExplorers?.default?.url}/tx/${data.hash}`
      });
      await data.wait();
      callback();
      setInProgress(false);
      setAmount('');
      popNotification({
        type: 'success',
        title: 'Withdrawl Complete',
        description: SuccessNotificationDescription,
        link: `${chain?.blockExplorers?.default?.url}/tx/${data.hash}`
      });
    },
    onError (e) {
      const error = e as WagmiError;
      popNotification({
        type: 'error',
        title: 'Approval Error!',
        description: formatError(error?.reason),
      });
    }
  });

  return (
    <div className="grid grid-flow-row gap-2">
      <div className="grid grid-cols-1 gap-2">
        <div className="col-span-1">
          <label className="label">
            <span className="label-text">
              Balance: {parseFloat(stakedBalance?.toString()).toLocaleString([], {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
            {stakingListItem.hasUnlockTime && (
              <span className="label-text-alt">
                <UnlockTime 
                  chain={chain}
                  stakingListItem={stakingListItem}
                />
              </span>
            )}
          </label>
          <div className="relative rounded-sm shadow-sm">
            <div className="absolute inset-y-0 ml-3 flex items-center">
              <Image
                src={stakingListItem.poolImg}
                height={26}
                width={26}
                alt="AVIATE lp"
              />
            </div>
            <input 
              value={amount}
              onChange={handleChangeAmount} 
              className="input input-bordered w-full pl-14" 
              placeholder="Withdraw"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <div className="badge badge-primary py-2 mr-4 rounded-sm cursor-pointer text-sm" onClick={max}>MAX</div>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <button 
            className={`btn btn-block btn-primary ${isLoading || inProgress ? 'loading' : ''}`}
            onClick={() => write?.()}
            disabled={!write}
          >
            Withdraw
          </button>
        </div>
      </div>
      
      <div className="w-full flex justify-end">
        {error && amount && (
          <div className="text-error text-opacity-50 text-xs">{formatError(wagmiError?.reason)}</div>
        )}
      </div>
    </div>
  )
}

export default Withdraw;