import { BOX_SHADOW } from '@/util/util';
import { PlusSquareIcon, ViewIcon } from '@chakra-ui/icons';
import { Box, Heading, HStack, Image, Text, VStack, Link } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';

const Layout = dynamic(() => import('@/components/Layout'), { ssr: false });

const BOX_SIZE = '30px';

// Data for action buttons that appear on the home page.
const ActionItems = [
	{ name: 'View Your Tickets', path: '/tickets', icon: <ViewIcon boxSize={BOX_SIZE} /> },
	{ name: 'Book Tickets', path: '/games', icon: <PlusSquareIcon boxSize={BOX_SIZE} /> }
];

function ActionItem({ href, text, icon }: { href: string; text: string; icon: JSX.Element }) {
	return (
		<NextLink href={href} passHref legacyBehavior>
			<Link _hover={{ textDecoration: 'none' }}>
				<Box
					as="button"
					width="500px"
					p={6}
					bgColor="blue.300"
					transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
					_hover={{ bgColor: 'blue.200' }}
					rounded="xl"
					boxShadow={BOX_SHADOW}
					display="flex"
					justifyContent="center"
				>
					<HStack spacing={2}>
						{icon}
						<Text fontSize="2xl" fontWeight="bold">
							{text}
						</Text>
					</HStack>
				</Box>
			</Link>
		</NextLink>
	);
}

export default function Home() {
	return (
		<Layout>
			<VStack spacing={20}>
				<VStack spacing={10} bgColor="blue.300" rounded="xl" boxShadow={BOX_SHADOW} p={6}>
					<Heading size="4xl">Welcome to React Arena!</Heading>
					<Heading size="md">
						This app is themed around the 2026 World Cup. Here, you can view and purchase tickets for upcoming matches!
					</Heading>
				</VStack>
				<VStack spacing={6}>
					{ActionItems.map((item) => (
						<ActionItem key={item.name} text={item.name} href={item.path} icon={item.icon} />
					))}
				</VStack>
			</VStack>
		</Layout>
	);
}
