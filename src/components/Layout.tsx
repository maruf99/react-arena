import { Center } from '@chakra-ui/react';
import { type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/styles/layout.module.css';

const NavBar = dynamic(() => import('./NavBar'), { ssr: false });

// This is the base layout component for the site, that every page uses, containing
// the background and the navigation bar at the top.
export default function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<NavBar />
			<Center className={styles.centerBody} bg="blue.200" minH="calc(100vh - 4rem)">
				{children}
			</Center>
		</>
	);
}