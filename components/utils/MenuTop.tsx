import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/img/aviate_logo.png';
import Connect from './Connect';
import { NAV_ITEMS } from '../../constants';

export default function MenuTop() {
  return (
    <div className="navbar max-w-6xl backdrop-blur-lg mx-auto mt-2 mb-4 z-10">
      <div className="sm:mr-20 md:mr-14 lg:mr-10 mr-4 z-10">
        <Link href="/">
          <Image src={logo} alt="logo" height={57} width={147} />
        </Link>
      </div>
      <div className="flex-1 text-lg z-10">
        {NAV_ITEMS.map((nav, index) => (
          <a className={`mx-4 ${nav.active && 'text-accent'}`} key={index} href={nav.link}>
            {nav.name}
          </a>
        ))}
      </div>
      <div className="flex-none z-10">
        {/* <div className="border border-white rounded-lg text-xs flex justify-around mr-4">
          <span className="border-r border-white">
            <a className="btn btn-ghost rounded-none" href="https://daylight-protocol.gitbook.io/litepaper/" target="_blank" rel="noopener noreferrer">
              Litepaper
            </a>
          </span>
          <a className="btn btn-ghost rounded-none" href="https://daylightprotocol.com" target="_blank" rel="noopener noreferrer">
            Website
          </a>
        </div> */}
        <div className="z-10">
          <Connect />
        </div>
      </div>
    </div>
  );
}