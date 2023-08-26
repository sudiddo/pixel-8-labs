import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { WagmiConfig, createClient } from 'wagmi';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';

const client = createClient(
  getDefaultClient({
    appName: 'Project Name',
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
  }),
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
