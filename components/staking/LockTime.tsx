import { FC, useState, useMemo } from 'react';
import { useContractRead } from 'wagmi';

interface LockTimeProps {
  poolAddress: string,
  poolAbi: any
}

export const LockTime: FC<LockTimeProps> = ({ poolAddress, poolAbi }) => {
  const [secsToUnlock, setSecsToUnlock] = useState<number>(0);
  useContractRead({
    address: poolAddress,
    abi: poolAbi,
    functionName: poolAddress === '0x77fCC833fbb6e1e39262B817466041c183424867' ? 'leaveEarlyFeeTimer' : 'lockTime',
    watch: true,
    onSuccess (data: number) {
      setSecsToUnlock(data * 3); // multiply by 3s for blocktime
    }
  });

  const lockTime = useMemo(() => {
    const d = Math.floor(secsToUnlock / (3600*24));
    const h = Math.floor(secsToUnlock % (3600*24) / 3600);
    const m = Math.floor(secsToUnlock % 3600 / 60);
    const s = Math.floor(secsToUnlock % 60);

    const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    if (d > 0 && h > 0) {
      return dDisplay + hDisplay.replace(',', '');
    }
    if (d > 0) {
      return dDisplay.replace(',', '');
    }
    if (h > 0) {
      return hDisplay + mDisplay.replace(',', '');
    }
    if (m > 0) {
      return mDisplay + sDisplay;
    }
    return sDisplay;
  }, [secsToUnlock]);

  return (
    <span>
      {secsToUnlock > 0 && (
        `Lock Time: ${lockTime}`
      )}
    </span>
  )
}

export default LockTime;