import { FC, useState, useContext, useEffect, useMemo } from 'react';
import { Contract } from '../../types';
import Image from 'next/image';
import daylogo from '../../public/img/aviate_icon.png';
import { useContractRead, useAccount, erc20ABI, Chain } from 'wagmi';
import { ethers, BigNumberish } from 'ethers';
import AddLiquidityContext from '../../context/AddLiquidityContext';
import { LP_PROVIDER, TOKEN } from '../../constants';
import Approve from '../utils/Approve';

interface AddLiquidityFieldProps {
  token?: Contract;
  isTokenA: boolean;
  chain: Chain;
  tokenBalance: string;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/';
const COINGECKO_UNKNOWN_IMG = 'https://static.coingecko.com/s/missing_thumb_2x-38c6e63b2e37f3b16510adf55368db6d8d8e6385629f6e9d41557762b25a6eeb.png';

export const AddLiquidityField: FC<AddLiquidityFieldProps> = ({ token, tokenBalance, isTokenA, chain }) => {
  const { 
    amountA, 
    amountB, 
    setAmountA, 
    setAmountB, 
    setExactTokenIsA,
    exactTokenIsA,
    setSufficientAllowanceA,
    setSufficientAllowanceB,
  } = useContext(AddLiquidityContext);
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  // const [tokenBalance, setTokenBalance] = useState('');
  const [lpProviderAllowance, setLpProviderAllowance] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const tokenAddress = useMemo(() => {
    return token[chain?.id]?.address;
  }, [token, chain]);

  useMemo(async () => {
    const data = await fetch(COINGECKO_API + tokenAddress?.toLowerCase());
    const json = await data.json();
    if (json?.image?.thumb) {
      return setImgUrl(json?.image?.thumb);
    }
    if (tokenAddress?.toLowerCase() === TOKEN[chain?.id]?.address?.toLowerCase()) {
      return setImgUrl(daylogo.src);
    }
    return setImgUrl(COINGECKO_UNKNOWN_IMG);
  }, [tokenAddress, chain?.id]);
  
  const handleChangeAmount = (e) => {
    if (isNaN(Number(e.target.value))) return;
    if (isTokenA && exactTokenIsA) {
      setAmountA(ethers.utils.parseEther(e.target.value || '0')?.toString());
    } else if (!isTokenA && !exactTokenIsA) {
      setAmountB(ethers.utils.parseEther(e.target.value || '0')?.toString());
    }
    setAmount(e.target.value);
  }

  useEffect(() => {
    if (exactTokenIsA && isTokenA) return;
    if (!exactTokenIsA && !isTokenA) return;
    if (isTokenA) {
      setAmount(ethers.utils.formatEther(amountA));
    } else {
      setAmount(ethers.utils.formatEther(amountB));
    }
  }, [amountA, amountB, exactTokenIsA, isTokenA]);

  const { refetch: refetchAllowance } = useContractRead({
    address: token?.[chain?.id]?.address,
    abi: token?.abi,
    functionName: 'allowance',
    args: [address, LP_PROVIDER[chain?.id]?.address],
    onSuccess (data: BigNumberish) {
      setLpProviderAllowance(ethers.utils.formatEther(data));
    },
  })

  const maxDeposit = async () => {
    if (isTokenA) {
      setExactTokenIsA(true);
      setAmountA(ethers.utils.parseEther(tokenBalance)?.toString());
    } else {
      setExactTokenIsA(false);
      setAmountB(ethers.utils.parseEther(tokenBalance)?.toString());
    }
    setAmount(tokenBalance);
  }

  const sufficientAllowance = useMemo(() => {
    if (lpProviderAllowance === '' || lpProviderAllowance === '0') return false;
    if (isTokenA) {
      return ethers.utils.parseEther(lpProviderAllowance).gte(ethers.utils.parseEther(amountA));
    } else {
      return ethers.utils.parseEther(lpProviderAllowance).gte(ethers.utils.parseEther(amountB));
    }
  }, [lpProviderAllowance, isTokenA, amountA, amountB]);

  useEffect(() => {
    if (isTokenA) {
      setSufficientAllowanceA(sufficientAllowance);
    } else {
      setSufficientAllowanceB(sufficientAllowance);
    }
  }, [isTokenA, sufficientAllowance, setSufficientAllowanceA, setSufficientAllowanceB]);


  return (
    <>
      <div className="col-span-1">
        <label className="label">
          <span className="label-text">
            Balance: {parseFloat(tokenBalance?.toString()).toLocaleString([], {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </span>
        </label>
        <div className="relative rounded-sm shadow-sm">
          <div className="absolute inset-y-0 ml-3 flex items-center">
            {imgUrl && (
              <Image
                src={imgUrl}
                height={26}
                width={26}
                alt="AVIATE lp"
              />
            )}
          </div>
          <input 
            value={amount}
            onChange={handleChangeAmount} 
            onFocus={() => setExactTokenIsA(isTokenA)}
            className="input w-full pl-14" 
            placeholder="Enter Amount"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <div className="badge badge-primary py-2 rounded-sm mr-4 cursor-pointer text-sm pt-3" onClick={maxDeposit}>MAX</div>
          </div>
        </div>
        {!sufficientAllowance && (
          <Approve callback={refetchAllowance} chain={chain} token={token} spender={LP_PROVIDER} />
        )}
      </div>
    </>
  )
}

export default AddLiquidityField;