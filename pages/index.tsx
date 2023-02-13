import Enhance from '../components/enhance/ptx';
import { STAKINGLIST } from '../constants';
import { NextPage } from 'next';
import { useState } from 'react';
import { StakingListItem } from '../types';

export const Home: NextPage = () => {
  const [activePoolIndex, setActivePoolIndex] = useState<number>(0);

  return (
    <div>
      <main>
        <div className="max-w-5xl mx-auto mb-4">
          <div className="text-5xl text-accent text-center font-bold leading-4xl">Staking</div>
          <div className="text-center">Stake TRUTH to earn rewards</div>
        </div>
        <div className="max-w-xl mx-auto flex flex-col gap-4">
          <div className="btn-group mx-auto flex flex-nowrap overflow-x-auto">
            {STAKINGLIST.map((item: StakingListItem, index: number) => (
              <button 
                className={`btn ${index === activePoolIndex && 'btn-active'}`}
                onClick={() => setActivePoolIndex(index)}
              >
                <span className="sm:flex hidden">{item.name}</span>
                <span className="sm:hidden flex">{item.shortName}</span>
              </button>
            ))}
          </div>
          <Enhance 
            stakingListItem={STAKINGLIST[activePoolIndex ]}
            activePoolIndex={activePoolIndex}
          />
        </div>
      </main>
    </div>
  )
}

export default Home;