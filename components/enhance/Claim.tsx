import { useState, useContext } from 'react';
import { usePrepareContractWrite, useContractWrite, useContractRead, useAccount, ContractMethodRevertedError } from "wagmi";
import formatError from '../../helpers/formatError';
import NotificationContext from '../../context/NotificationContext';
import { ExternalLink } from 'react-feather';
import { BigNumber, BigNumberish, ethers } from 'ethers';

const Claim = ({ chain, callback, address: stakingAddress, abi, showClaimBtn, pRewards }) => {
  const { address } = useAccount();
  const { popNotification } = useContext(NotificationContext);
  const [inProgress, setInProgress] = useState(false);
  const [rewards, setRewards] = useState('0');
  
  const SuccessNotification = () => (
    <div className="flex items-center">
      <span className="mt-1">{`View on ${chain?.blockExplorers?.default?.name}`}</span> 
      <ExternalLink className="ml-1 h-5 w-5" />
    </div>
  );

  const { config } = usePrepareContractWrite({
    address: stakingAddress,
    abi: abi,
    functionName: 'claimRewards',
  });

  const { write, isLoading } = useContractWrite({
    ...config,
    async onSuccess (data) {
      setInProgress(true);
      popNotification({
        type: 'success',
        title: `Claim Submitted`,
        description: SuccessNotification,
        link: `${chain?.blockExplorers?.default?.url}/tx/${data.hash}`
      });
      await data.wait();
      setInProgress(false);
      callback();
      popNotification({
        type: 'success',
        title: `Claim Confirmed!`,
        description: SuccessNotification,
        link: `${chain?.blockExplorers?.default?.url}/tx/${data.hash}`
      });
    },
    onError (e: ContractMethodRevertedError) {
      console.log(e);
      popNotification({
        type: 'error',
        title: 'Withdrawl Error',
        description: formatError(e.message),
      });
    }
  });

  return (
    <div className="grid grid-row-2 gap-10">
      <div className={`row-span-2 flex items-start`}>
        <div className="flex items-center">
        <span>Pending Rewards:</span> 
        <span className="mx-2 text-3xl text-accent">
          {/* {parseFloat(rewards?.toString()).toLocaleString([],{})} */}
          {parseFloat(pRewards?.toString() || '0').toFixed(2)}
        </span>
        <span>USDC</span>
        </div>
      </div>
      {showClaimBtn && (
        <button 
          className={`btn btn-block btn-primary ${isLoading || inProgress ? 'loading' : ''}`}
          onClick={() => write?.()}
          disabled={parseFloat(pRewards) <= 0}
        >
          Claim
        </button>
      )}
    </div>
  )
}

export default Claim;