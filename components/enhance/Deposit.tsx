import Image from 'next/image';
import { FC, useEffect, useState, useContext, useMemo } from 'react';
import { utils, BigNumber } from 'ethers';
import { StakingListItem, WagmiError } from '../../types';
import { usePrepareContractWrite, useContractWrite, Chain, useContractRead, useAccount } from 'wagmi';
import formatError from '../../helpers/formatError';
import Approve from '../utils/Approve';
import NotificationContext from '../../context/NotificationContext';
import { ExternalLink } from 'react-feather';
import LockTime from './LockTime';

interface DepositProps {
  tokenBalance: string,
  chain: Chain,
  callback: () => void,
  stakingListItem: StakingListItem,
}

const Deposit: FC<DepositProps> = ({
  tokenBalance,
  chain,
  callback,
  stakingListItem
}) => {
  const { popNotification } = useContext(NotificationContext);
  const [amount, setAmount] = useState('');
  const [depositInProgress, setDepositInProgress] = useState(false);
  const [insufficientAllowance, setInsufficentAllowance] = useState(false);
  const [allowance, setAllowance] = useState<BigNumber>(BigNumber.from(0));
  const account = useAccount();

  const maxDeposit = () => {
    setAmount(tokenBalance);
  }

  const SuccessNotificationDescription = () => (
    <div className="flex items-center">
      <span className="mt-1">{`View on ${chain?.blockExplorers?.default?.name}`}</span> 
      <ExternalLink className="ml-1 h-5 w-5" />
    </div>
  )

  const handleChangeAmount = (e) => {
    if (isNaN(Number(e.target.value))) return;
    setAmount(e.target.value);
  }

  const { config, error, refetch: refetchDeposit } = usePrepareContractWrite({
    address: stakingListItem.pool[chain?.id]?.address,
    abi: stakingListItem.pool.abi,
    functionName: stakingListItem.depositFunction,
    args: [utils.parseEther(amount || '0')],
  });

  console.log({ error })

  const wagmiError = error as WagmiError;

  const { refetch: refetchAllowance } = useContractRead({
    address: stakingListItem.token[chain?.id]?.address,
    abi: stakingListItem.token?.abi,
    functionName: 'allowance',
    args: [account?.address, stakingListItem.pool[chain?.id]?.address],
    onSuccess(data: BigNumber) {
      setAllowance(data);
    },
    watch: true
  });

  const refetch = () => {
    refetchAllowance();
    refetchDeposit();
  }

  useEffect(() => {
    if (!amount) return setInsufficentAllowance(false);
    if (allowance.lt(utils.parseEther(amount)?.toString() || '0')) {
      setInsufficentAllowance(true);
    } else {
      setInsufficentAllowance(false);
    }
  }, [allowance, amount]);

  const { write, isLoading } = useContractWrite({
    ...config,
    async onSuccess (data) {
      setDepositInProgress(true);
      popNotification({
        type: 'success',
        title: 'Deposit Submitted',
        description: SuccessNotificationDescription,
        link: `${chain?.blockExplorers?.default?.url}/tx/${data.hash}`
      });
      await data.wait();
      callback();
      setAmount('');
      setDepositInProgress(false);
      popNotification({
        type: 'success',
        title: 'Deposit Complete',
        description: SuccessNotificationDescription,
        link: `${chain?.blockExplorers?.default?.url}/tx/${data.hash}`
      });
    },
    onError (e) {
      const error = e as WagmiError
      popNotification({
        type: 'error',
        title: 'Deposit Error!',
        description: formatError(error?.reason),
      });
    }
  });

  useEffect(() => {
    // if (!error) return setInsufficentAllowance(false);
    if (formatError(wagmiError?.reason).toLowerCase().includes('allowance')) {
      setInsufficentAllowance(true);
    }
  }, [error, wagmiError]);

  const ignoreError = useMemo(() => {
    const errorsToIgnore = [
      "Error: Transaction reverted: function selector was not recognized and there's no fallback function"
    ].map(e => e.toLowerCase());
    if (!wagmiError) return false;
    return errorsToIgnore.includes(formatError(wagmiError?.reason).toLowerCase());
  }, [wagmiError]);

  return (
    <div className="grid grid-flow-row gap-2">
      <div className="grid grid-cols-1 gap-2">
        <div className="col-span-1">
          <label className="label">
            <span className="label-text">
              Balance: {parseFloat(tokenBalance?.toString()).toLocaleString([], {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
            {stakingListItem.hasUnlockTime  && (
              <span className="label-text-alt">
                {/* <LockTime 
                  stakingListItem={stakingListItem}
                  chain={chain}
                /> */}
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
              placeholder="Deposit"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <div className="badge badge-primary py-2 rounded-sm mr-4 cursor-pointer text-sm" onClick={maxDeposit}>MAX</div>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          {insufficientAllowance ? (
            <Approve 
              chain={chain} 
              callback={refetch} 
              token={stakingListItem.token} 
              spender={stakingListItem.pool} 
            />
          )
          : (
            <button 
              className={`btn btn-block btn-primary ${isLoading || depositInProgress ? 'loading' : ''}`}
              onClick={() => write?.()}
              disabled={!write}
            >
              Deposit
            </button>
          )}
        </div>
      </div>
      <div className="w-full flex justify-end">
        {!insufficientAllowance && wagmiError && amount && !ignoreError && (
          <div className="text-error text-opacity-50 text-xs">{formatError(wagmiError?.reason)}</div>
        )}
      </div>
      <div className="justify-center text-center">
        1% Fee On Stake And Unstake
      </div>
    </div>
  )
}

export default Deposit;