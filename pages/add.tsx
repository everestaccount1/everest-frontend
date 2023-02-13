import { useRouter } from "next/router";
import { Contract } from "../types";
import AddLiquidityContext from "../context/AddLiquidityContext";
import useAddLiquidity from "../hooks/useAddLiquidity";
import { erc20ABI, useNetwork, Chain, useAccount } from "wagmi";
import AddLiquidity from "../components/liquidity/Add";
import { useState, useEffect } from "react";
import { validChains } from "../constants";

export const AddLiquidityPage = () => {
  const router = useRouter();
  const { tokenA, tokenB } = router.query;
  const { isConnected } = useAccount();
  const addLiquidity = useAddLiquidity();
  const addLiquidityState = { ...addLiquidity};
  const { chain: connectedChain } = useNetwork();
  const [chain, setChain] = useState<Chain>(validChains[0]);

  useEffect(() => {
    if (isConnected && connectedChain) {
      setChain(connectedChain);
    } else {
      setChain(validChains[0]);
    }
  }, [isConnected, connectedChain]);

  const tokenAContract = {
    [chain?.id]: {
      address: tokenA?.toString(),
    },
    abi: erc20ABI,
  } as Contract;

  const tokenBContract = {
    [chain?.id]: {
      address: tokenB?.toString(),
    },
    abi: erc20ABI,
  } as Contract;

  if (!tokenA || !tokenB) {
    return <div>Loading...</div>;
  }

  console.log({tokenAContract, tokenBContract})

  return (
    <div className="max-w-3xl mx-auto">
      <div className="w-full">
        <AddLiquidityContext.Provider value={addLiquidityState}>
          <AddLiquidity chain={chain} tokenA={tokenAContract} tokenB={tokenBContract} />
        </AddLiquidityContext.Provider>
      </div>
    </div>
  )
}

export default AddLiquidityPage;