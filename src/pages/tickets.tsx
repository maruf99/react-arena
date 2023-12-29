import TicketDisplay from '@/components/TicketDisplay';
import { BOX_SHADOW, useTickets } from '@/util/util';
import { Heading, HStack, Image, VStack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const Layout = dynamic(() => import('@/components/Layout'), { ssr: false });

export default function TicketsPage() {
	const tickets = useTickets();

	return (
		<Layout>
			<VStack spacing={10} p={6}>
				<VStack spacing={6}>
					<VStack spacing={3} p={5} bgColor="blue.200" rounded="lg" boxShadow={BOX_SHADOW}>
						<HStack spacing={3}>
							<Image h="45px" src="/assets/misc/ticket.png" />
							<Heading size="2xl">Your Tickets</Heading>
						</HStack>
						<Heading size="md">Here, you can view and manage your tickets.</Heading>
					</VStack>
					{tickets && <TicketDisplay tickets={tickets} />}
				</VStack>
			</VStack>
		</Layout>
	);
}
