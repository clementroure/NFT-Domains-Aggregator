import MyRouter from "routers/index";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  connectorsForWallets,
  RainbowKitProvider,
  Theme,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';

import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  trustWallet,
  omniWallet,
  argentWallet,
  imTokenWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {
  configureChains,
  createClient,
  WagmiConfig,
} from "wagmi";
import { mainnet, polygon} from 'wagmi/chains'
import merge from 'lodash.merge';
import { publicProvider } from 'wagmi/providers/public';
import { useState } from "react";

function App() {

  const myDarkTheme = merge(darkTheme(), {
    colors: {
      connectButtonBackground: 'rgba(52, 52, 52, 0)',
      accentColor: '#2591b7',
      connectButtonText: '#cbd5e1',
      connectButtonBackgroundError: '#a40000',
    },
  } as Theme);

  const myLightTheme = merge(lightTheme(), {
    colors: {
      
    },
  } as Theme);

  const { chains, provider } = configureChains(
    [mainnet, polygon],
    [
      publicProvider()
    ]
  );

  const connectors = connectorsForWallets([
    {
      groupName: 'Popular',
      wallets: [
        injectedWallet({ chains }),
        metaMaskWallet({ chains }),
        coinbaseWallet({ chains, appName: 'Blockchain Domains' }),
        walletConnectWallet({ chains }),
      ],
    },
    {
      groupName: 'Others',
      wallets: [
        trustWallet({ chains }),
        argentWallet({ chains }),
        omniWallet({ chains }),
        imTokenWallet({ chains }),
        ledgerWallet({ chains }),
      ],
    },
  ]);

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  })

  const [rainbowTheme, setRainbowTheme] = useState(localStorage.getItem("theme") == "light" ? myLightTheme : myDarkTheme)
  window.addEventListener('theme_change', () => {
    if(localStorage.getItem("theme") == "dark" )
    setRainbowTheme(myDarkTheme)
    else
    setRainbowTheme(myLightTheme)
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={rainbowTheme}>
        <div className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
          <MyRouter />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
