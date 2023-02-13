import React, { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Activity, ChevronDown } from 'react-feather';
import { useAccount, useConnect, useDisconnect, useEnsName, useNetwork, useSwitchNetwork } from 'wagmi';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
// constants
import { validChains } from '../../constants';
// helpers
import shortenAddress from '../../helpers/shortenAddress'

interface ConnectProps {
  hideIcon?: boolean;
}

export const Connect: FC<ConnectProps> = ({ hideIcon }) => {
  const { connector: activeConnector, address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { chain: connectedChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork()
  const { connect, connectors } = useConnect();
  const [hasAccount, setHasAccount] = useState(false);
  
  const [showMenu, setShowMenu] = useState(false);
  const showMenuHandler = () => setShowMenu((showMenu) => !showMenu);

  const { disconnect } = useDisconnect();

  const connectedToWrongNetwork = useMemo(() => {
    if (!connectedChain?.id || !isConnected) return false;
    const validChainIds = validChains?.map(c => c?.id);
    return !validChainIds?.includes(connectedChain?.id);
  }, [connectedChain, isConnected]);

  useEffect(() => {
    setHasAccount(isConnected && !!address);
  }, [address, isConnected]);

  if (hasAccount) return (
    <div className="top-16 text-right">
      <div className="dropdown dropdown-end">
        {
          connectedToWrongNetwork 
          ? 
            <div>
              <label tabIndex={0} className="btn btn-warning m-1">
                <Activity
                  className="mr-2 h-5 w-5"
                  aria-hidden="true"
                />
                <span className="mr-2">Wrong Network</span>
                <ChevronDown
                  className="ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 border rounded-box w-52">
                { !validChains ? <></> : validChains
                  ?.map(chain => (
                    <li key={chain.id}>
                      <a
                        className="hover:bg-neutral-focus hover:text-accent"
                        onClick={async () => {
                          switchNetwork?.(chain?.id);
                          setShowMenu(false);
                        }}
                      >
                        {chain?.name}
                      </a>
                    </li>
                ))}
              </ul>
            </div>
          :
            <div>
              <label tabIndex={0} className="btn btn-primary border border-white hover:border-white">
                <span className="mr-2">{ensName ?? shortenAddress(address)}</span>
                  { !hideIcon && (<Jazzicon diameter={20} seed={jsNumberForAddress(address || '0x0')} /> )}
                  <ChevronDown
                    className="ml-2 -mr-1 h-5 w-5"
                    aria-hidden="true"
                  />
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 border rounded-box w-52">
                <li>
                  <a onClick={() => { disconnect(); setShowMenu(false); }} className="hover:bg-neutral-focus hover:text-accent">
                    Disconnect
                  </a>
                </li>
              </ul>
            </div>
        }
      </div>
    </div>
  )

  return (
    <div className="top-16 text-right">
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-primary border border-white hover:border-white" onClick={showMenuHandler}>
          <span>Connect</span>
          <ChevronDown
            className="ml-2 -mr-1 h-5 w-5"
            aria-hidden="true"
          />
        </label>
        {showMenu && <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 border rounded-box w-52">
          { !connectors ? <></> : connectors
            .filter(connector => connector.ready && connector.id !== activeConnector?.id)
            ?.map(connector => (
              <li key={connector.id}>
                <a
                  className="hover:bg-neutral-focus hover:text-accent"
                  onClick={async () => {
                    await connect({ connector });
                    setShowMenu(false);
                  }}
                >
                  {connector.name}
                </a>
              </li>
            ))}
        </ul>}
      </div>
    </div>
  )
}

export default Connect;