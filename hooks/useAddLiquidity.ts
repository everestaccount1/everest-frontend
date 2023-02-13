import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';

const useAddLiquidity = () => {
  const [amountA, setAmountA] = useState<string>('0');
  const [amountB, setAmountB] = useState<string>('0');
  const [lpBalanceA, setLpBalanceA] = useState<string>('0');
  const [lpBalanceB, setLpBalanceB] = useState<string>('0');
  const [exactTokenIsA, setExactTokenIsA] = useState<boolean>(true);
  const [sufficientAllowanceA, setSufficientAllowanceA] = useState<boolean>(true);
  const [sufficientAllowanceB, setSufficientAllowanceB] = useState<boolean>(true);

  useEffect(() => {
    if (BigNumber.from(amountA).isZero() && BigNumber.from(amountB).isZero()) return;
    if (BigNumber.from(lpBalanceA).isZero() || BigNumber.from(lpBalanceB).isZero()) return;

    if (exactTokenIsA) {
      setAmountB(BigNumber.from(amountA).mul(lpBalanceB).div(lpBalanceA).toString())
    } else {
      setAmountA(BigNumber.from(amountB).mul(lpBalanceA).div(lpBalanceB).toString());
    }
  }, [lpBalanceA, lpBalanceB, amountA, amountB, exactTokenIsA]);

  const clearAmounts = () => {
    setAmountA('0');
    setAmountB('0');
  }

  return {
    amountA,
    setAmountA,
    amountB,
    setAmountB,
    setLpBalanceA,
    setLpBalanceB,
    setExactTokenIsA,
    exactTokenIsA,
    sufficientAllowanceA,
    setSufficientAllowanceA,
    sufficientAllowanceB,
    setSufficientAllowanceB,
    clearAmounts,
  }
}

export default useAddLiquidity;