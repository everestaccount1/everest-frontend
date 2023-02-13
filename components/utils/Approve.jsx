import { useContext, useState } from "react";
import { usePrepareContractWrite, useContractWrite, erc20ABI } from "wagmi";
import { constants } from 'ethers';
import NotificationContext from "../../context/NotificationContext";
import { ExternalLink } from "react-feather";
import formatError from "../../helpers/formatError";

const Approve = ({ chain, callback, spender, token }) => {
  const { popNotification } = useContext(NotificationContext);
  const [approvalInProgress, setApprovalInProgress] = useState(false);

  const SuccessNotificationDescription = () => (
    <div className="flex items-center">
      <span className="mt-1">{`View on ${chain?.blockExplorers?.default?.name}`}</span> 
      <ExternalLink className="ml-1 h-5 w-5" />
    </div>
  )

  const { config } = usePrepareContractWrite({
    address: token[chain?.id]?.address,
    abi: erc20ABI,
    functionName: "approve",
    args: [spender[chain?.id]?.address, constants.MaxUint256]
  });

  const { write, isLoading } = useContractWrite({
    ...config,
    async onSuccess (data) {
      setApprovalInProgress(true);
      popNotification({
        type: 'success',
        title: 'Approval Submitted',
        description: SuccessNotificationDescription,
        link: `${chain?.blockExplorers?.default?.url}/tx/${data.hash}`
      });
      await data.wait();
      popNotification({
        type: 'success',
        title: 'Approval Confirmed!',
        description: SuccessNotificationDescription,
        link: `${chain?.blockExplorers?.default?.url}/tx/${data.hash}`
      });
      await callback();
      setApprovalInProgress(false);
    },
    onError (e) {
      popNotification({
        type: 'error',
        title: 'Approval Error!',
        description: formatError(e),
      });
    }
  });

  return (
    <button 
      className={`btn btn-block btn-primary mt-2 ${isLoading || approvalInProgress ? 'loading' : ''}`}
      onClick={() => write?.()}
    >
      Approve
    </button>
  )
}

export default Approve;