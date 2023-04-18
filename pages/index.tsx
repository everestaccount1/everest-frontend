import Enhance from '../components/enhance/ptx';
import { STAKINGLIST } from '../constants';
import { NextPage } from 'next';
import { useState } from 'react';
import { StakingListItem } from '../types';
import Head from 'next/head';

export const Home: NextPage = () => {
  const [activePoolIndex, setActivePoolIndex] = useState<number>(0);

  return (
    <>
      <Head>
        <title>Aviate - Staking</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c"></meta>
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>
      <main>
        <div className="max-w-5xl mx-auto mb-4">
          <div className="text-5xl text-accent text-center font-bold leading-4xl">Staking</div>
          <div className="text-center">Stake $AVI to receive weekly USDC trading profit payouts</div>
        </div>
        <div className="max-w-xl mx-auto flex flex-col gap-4">
          {/* <div className="btn-group mx-auto flex flex-nowrap overflow-x-auto">
            {STAKINGLIST.map((item: StakingListItem, index: number) => (
              <button 
                key={index}
                className={`btn ${index === activePoolIndex && 'btn-active'}`}
                onClick={() => setActivePoolIndex(index)}
              >
                <span className="sm:flex hidden">{item.name}</span>
                <span className="sm:hidden flex">{item.shortName}</span>
              </button>
            ))}
          </div> */}
          <Enhance 
            stakingListItem={STAKINGLIST[activePoolIndex ]}
            activePoolIndex={activePoolIndex}
          />
        </div>
      </main>
    </>
  )
}

export default Home;