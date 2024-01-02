import { CloseIcon, ExternalLinkIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack, IconButton, Image, Stack, useBreakpointValue, useDisclosure, Link } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import styles from '@/styles/NavBar.module.css';
import NextLink from 'next/link';

// Data for items on the navigation bar.
const NavPages = [
	{ name: 'Home', path: '/' },
	{ name: 'My Tickets', path: '/tickets' },
	{ name: 'Book Tickets', path: '/games' }
];

function NavTab({ page }: { page: { name: string; path: string } }) {
	return (
		<NextLink href={page.path} legacyBehavior>
			<Link
				px={2}
				py={3}
				rounded="md"
				_hover={{
					textDecoration: 'none',
					bg: 'blue.300'
				}}
			>
				{page.name}
			</Link>
		</NextLink>
	);
}

export default function NavBar() {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Box bg="blue.100" shadow="sm" px={4} className={styles.navBar}>
			<Flex h={16} alignItems="center" justifyContent="space-between">
				<IconButton
					size="md"
					icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
					aria-label="Open Menu"
					display={{ md: 'none' }}
					onClick={isOpen ? onClose : onOpen}
				/>

				<HStack spacing={8} alignItems="center">
					<Box>
						<Image h={12} src={useBreakpointValue({ base: '/icon.svg', md: '/logo.svg' })} />
					</Box>
					<HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
						{NavPages.map((page) => (
							<NavTab key={page.name} page={page} />
						))}
					</HStack>
				</HStack>

				<Flex alignItems="center">
					<NextLink href="https://github.com/maruf99/react-arena" passHref legacyBehavior>
						<Button as="a" target="_blank" rel="noopener noreferrer" variant="solid" colorScheme="gray" size="md" mr={4} leftIcon={<FaGithub />}>
							View on GitHub&nbsp;
							<ExternalLinkIcon />
						</Button>
					</NextLink>
				</Flex>
			</Flex>

			{isOpen ? (
				<Box pb={4} display={{ md: 'none' }}>
					<Stack as="nav" spacing={4}>
						{NavPages.map((page) => (
							<NavTab key={page.name} page={page} />
						))}
					</Stack>
				</Box>
			) : null}
		</Box>
	);
}
