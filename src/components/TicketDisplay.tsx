import { BOX_SHADOW, deleteTicket, saveTickets, setTickets, type Ticket } from '@/util/util';
import {
	Button,
	Grid,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useBreakpointValue,
	useDisclosure,
	useToast,
	VStack
} from '@chakra-ui/react';
import { Fragment, type MouseEventHandler } from 'react';

export default function TicketDisplay({ tickets }: { tickets: Ticket[] }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const setUpdatedTickets = setTickets();

	const handleDelete = async (ticket: Ticket) => {
		const data = deleteTicket(tickets, ticket.id);

		setUpdatedTickets(data);
		saveTickets(data);

		toast({
			title: 'Success',
			description: `Cancelled the ticket for ${ticket.venue}, at seat ${ticket.row}${ticket.column}`,
			status: 'success',
			position: 'top',
			isClosable: true
		});

		onClose();
	};

	return (
		<Grid templateColumns={`repeat(${useBreakpointValue({ base: 1, md: 2 })}, 1fr)`} gap={6}>
			{tickets.map((ticket) => {
				return (
					<Fragment key={ticket.id}>
						<VStack spacing={3} width="300px" height="auto" p={6} rounded="xl" bgColor="blue.200" boxShadow={BOX_SHADOW}>
							<VStack spacing={1} alignItems="start">
								<Text fontSize="xl" fontWeight="bold">
									{ticket.match}
								</Text>
								<Text fontSize="sm">
									<span style={{ fontWeight: 'bold' }}>Venue:</span> {ticket.venue}
								</Text>
								<Text fontSize="sm">
									<span style={{ fontWeight: 'bold' }}>Location:</span> {ticket.city}, {ticket.state}, {ticket.country}
								</Text>
								<Text fontSize="sm">
									<span style={{ fontWeight: 'bold' }}>Seat:</span> {ticket.row}
									{ticket.column}
								</Text>
								<Text fontSize="sm">
									<span style={{ fontWeight: 'bold' }}>Booking Date:</span> {new Date(ticket.created).toLocaleString()}
								</Text>
								<Text fontSize="sm">
									<span style={{ fontWeight: 'bold' }}>Amount Paid:</span> ${ticket.price.toFixed(2)}
								</Text>
							</VStack>
							<Button marginTop="2px" size="sm" colorScheme="red" alignSelf="center" onClick={onOpen}>
								Cancel
							</Button>
						</VStack>
						<CancelModal isOpen={isOpen} onClose={onClose} onClick={() => handleDelete(ticket)} />
					</Fragment>
				);
			})}
		</Grid>
	);
}

// Modal prompting user to confirn that they want to delete the ticket.
function CancelModal({
	isOpen,
	onClose,
	onClick
}: {
	isOpen: boolean;
	onClose: () => void;
	onClick: MouseEventHandler<HTMLButtonElement>;
}) {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader fontSize="3xl" fontWeight="bold">
					Cancel Ticket
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>Are you sure you want to cancel this ticket?</ModalBody>

				<ModalFooter>
					<Button colorScheme="blue" _hover={{ bgColor: 'gray.300' }} variant="outline" mr={3} onClick={onClose}>
						Don't Cancel
					</Button>
					<Button colorScheme="red" onClick={onClick}>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
