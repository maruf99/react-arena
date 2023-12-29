import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Head from 'next/head';
import { TicketProvider } from '@/util/util';

const theme = extendTheme({
	components: {
		Modal: {
			baseStyle: {
				dialog: {
					bg: 'blue.200'
				}
			}
		}
	}
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>React Arena</title>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0" />
				<link rel="icon" type="image/png" sizes="96x96" href="/favicon.png" />

				<meta name="theme-color" content="#002d4c" />
				<meta name="og:site_name" content="React Arena" />
				<meta property="og:title" content="React Arena" />
				<meta property="og:description" content="A demo seat booking interface in React." />
				<meta property="og:image" content="https://arena.marufdev.me/thumbnail.png" />
				<meta property="og:type" content="website" />
			</Head>
			<TicketProvider>
				<ChakraProvider theme={theme}>
					<Component {...pageProps} />
				</ChakraProvider>
			</TicketProvider>
		</>
	);
}
