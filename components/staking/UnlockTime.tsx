import { FC, useState, useMemo } from 'react';
import { useAccount, useContractRead } from 'wagmi';

interface UnlockTimeProps {
  poolAddress: string,
  poolAbi: any
}

export const UnlockTime: FC<UnlockTimeProps> = ({ poolAddress, poolAbi }) => {
  const { address } = useAccount();
  const [secsToUnlock, setSecsToUnlock] = useState<number>(0);
  useContractRead({
    address: poolAddress,
    abi: poolAbi,
    functionName: poolAddress === '0x77fCC833fbb6e1e39262B817466041c183424867' ? 'remainingLockTime' : 'timeUntilUnlock',
    args: [address],
    watch: true,
    onSuccess (data: number) {
      setSecsToUnlock(data * 3); // mul by 3 for blocktime
    }
  });

  const countdown = useMemo(() => {
    const d = Math.floor(secsToUnlock / (3600*24));
    const h = Math.floor(secsToUnlock % (3600*24) / 3600);
    const m = Math.floor(secsToUnlock % 3600 / 60);
    const s = Math.floor(secsToUnlock % 60);

    const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    if (d > 0) {
      return dDisplay + hDisplay.replace(',', '');
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
      {secsToUnlock > 0 ? `Unlocks in: ${countdown}` : 'Unlocked'}
    </span>
  )
}

export default UnlockTime;