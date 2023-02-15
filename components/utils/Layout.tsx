import NextHead from 'next/head';
import Image from 'next/image';
import helix from '../../public/img/bg.svg';
import sphere from '../../public/img/bg2.svg';
// components
import MenuTop from './MenuTop';
// context
import NotificationContext from '../../context/NotificationContext';
// hooks
import useNotification from '../../hooks/useNotification';
import Notification from './Notification';
// images
import telegram from '../../public/img/social/telegram.svg';
import twitter from '../../public/img/social/twitter.svg';
import discord from '../../public/img/social/discord.svg';
import logo from '../../public/img/aviate_logo.png';
import { Menu } from 'react-feather';
import Connect from './Connect';
import { NAV_ITEMS } from '../../constants';

export default function Layout({children}) {
  const notification = useNotification();
  const notificationState = {
    ...notification
  }

  const socialLinks = [
    {
      link: 'https://t.me/truthsecurity',
      image: telegram
    },
    {
      link: 'https://twitter.com/TruthSeekersKYC',
      image: twitter
    },
    {
      link: 'https://discord.gg/PNb9ubvJD5',
      image: discord
    }
  ]

  return (
    <>
      <NextHead>
        <div>
          <title>Truthseekers - Staking</title>
          <link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png" />
          <link rel="manifest" href="favicon/site.webmanifest" />
          <link rel="mask-icon" href="favicon/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c"></meta>
          <meta name="theme-color" content="#ffffff"></meta>
        </div>
      </NextHead>
      <NotificationContext.Provider value={notificationState}>
        <div className="w-screen h-screen absolute overflow-y-hidden">
          <div className="absolute -right-96 -bottom-96">
            <Image src={helix} height={1282} width={1282} />
          </div>
          <div className="absolute -left-96 -top-96">
            <Image src={sphere} height={1024} width={1024} />
          </div>
        </div>
        <div className="h-full min-h-screen bg-brand-backdrop flex flex-col max-w-screen text-base">
          <div className="drawer">
            <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              <div className="lg:hidden flex mt-2 mb-4 items-center justify-between mx-4">
                <div className="flex items-center">
                  <label htmlFor="nav-drawer" className="btn btn-primary drawer-button mr-4">
                    <Menu />
                  </label>
                  <Image src={logo} alt="logo" height={57} width={147} /> {/* 85 x 220 - scaled down 2/3 */}
                </div>
                <Connect hideIcon={true} />
              </div>
              <div className="lg:flex hidden">
                <MenuTop />
              </div>
              <div className="h-full min-h-screen grow flex flex-col">
                <Notification />
                <div className="px-4">
                  {children}
                </div>
              </div>
              <div>
                <footer className="sm:py-8 py-2 mx-auto bg-black w-screen">
                  <div className="flex justify-center w-full mb-4">
                    <Image src={logo} alt="logo" height={57} width={147} />
                  </div>
                  <div className="flex justify-center w-full">
                    {socialLinks.map((social, index) => (
                      <a className="mx-2" key={index} href={social.link} target="_blank" rel="noreferrer">
                        <Image src={social.image} alt="social" height={32} width={32} />
                      </a>
                    ))}
                  </div>
                  <div className="flex justify-center w-full text-xs mt-4 font-light">
                    Aviate Copyright 2023. All rights reserved.
                  </div>
                </footer>
              </div>
            </div>
            <div className="drawer-side">
              <label htmlFor="nav-drawer" className="drawer-overlay"></label>
              <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
                <li className="py-5">
                  <Image src={logo} alt="logo" height={57} width={147} />
                </li>
                {NAV_ITEMS.map(nav => (
                  <li key={nav.name}>
                    <a className="mx-4" href={nav.link}>
                      {nav.name}
                    </a>
                  </li>
                ))}
                {/* <li>
                  <a className="mx-4" href="https://daylight-protocol.gitbook.io/litepaper/" target="_blank" rel="noopener noreferrer">
                    Litepaper
                  </a>
                </li>
                <li>
                  <a className="mx-4" href="https://daylightprotocol.com">
                    Website
                  </a>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </NotificationContext.Provider>
    </>
  );
}
