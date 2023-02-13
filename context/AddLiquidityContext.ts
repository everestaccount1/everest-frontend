import React from "react";
import { IAddLiquidityContext } from "../types";

const defaultState = {
  amountA: '0',
  amountB: '0',
  setAmountA: () => {},
  setAmountB: () => {},
  setPairAddress: () => {},
  setSufficientAllowanceA: () => {},
  setSufficientAllowanceB: () => {},
  sufficientAllowanceA: true,
  sufficientAllowanceB: true,
  clearAmounts: () => {},
  exactTokenIsA: true,
  setExactTokenIsA: () => {},
  setLpBalanceA: () => {},
  setLpBalanceB: () => {},
}

const AddLiquidityContext = React.createContext<IAddLiquidityContext>(defaultState);

export default AddLiquidityContext;