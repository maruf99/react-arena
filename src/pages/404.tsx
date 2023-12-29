import { Heading, VStack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const Layout = dynamic(() => import('@/components/Layout'), { ssr: false });

// 404 Page that users are redirected to if page wasn't found.
export default function NotFoundPage() {
	return (
		<Layout>
			<VStack spacing={6}>
				<Heading size="4xl">404</Heading>
				<Heading size="lg">This page wasn't found.</Heading>
			</VStack>
		</Layout>
	);
}
