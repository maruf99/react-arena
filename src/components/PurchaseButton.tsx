import { type Seats, type TicketPayload, SeatType, type Game, calcPrice, type SeatData, calcSeatPrice, addTickets, useTickets, setTickets, saveTickets } from '@/util/util';
import { Button, Heading, useDisclosure, useToast, VStack } from '@chakra-ui/react';
import PurchaseModal from '@/components/PurchaseModal';
import { useRouter } from 'next/router';

export default function PurchaseButton({ seats, game }: { seats: Seats; game: Game }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	// Request the API to add the purchased tickets to the database so they can be retrieved
	// for later use.
	const data = useTickets();
	const setUpdatedTickets = setTickets();

	const router = useRouter();

	// functions that creates the tickets when the purchase button is clicked.
    const handlePurchase = async (selected: SeatData[], game: Game) => {
		const payloads = selected.map(seat => {
			const payload: TicketPayload = {
				row: seat.row,
				column: seat.column,
				price: calcSeatPrice({ row: seat.row, column: seat.column }, game.price),
				country: game.country,
				city: game.city,
				game_id: game.id,
				state: game.state,
				venue: game.venue,
				match: game.teams.join(' vs. ')
			};

			return payload;
		});

		const ticketData = addTickets(data, payloads);

		setUpdatedTickets(ticketData);
		saveTickets(ticketData);

		toast({
			title: 'Congratulations!',
			description: `You have just bought ${selected.length} ticket${selected.length > 1 ? 's' : ''}.`,
			status: 'success',
			position: 'top',
			isClosable: true
		});

        onClose();

		await router.push('/tickets');
    };

	const total: SeatData[] = [];
	
	// Enhanced for loop that adds each selected seat to the total seats array.
	for (const [row, columns] of Object.entries(seats)) {
        for (const [column, seat] of columns.entries()) {
            if (seat === SeatType.Selected) {
                total.push({ row, column });
            }
        }
	}
	
	// Calculates the total price for all the selected seats. Each seat price
	// will vary based on its distance from the field.
    const price = calcPrice(total, game);

	return (
		<>
			<VStack spacing={3}>
				<Heading size="md">Total Price: {price}</Heading>
				<Button colorScheme="blue" onClick={onOpen} disabled={total.length < 1}>Purchase</Button>
			</VStack>
            <PurchaseModal isOpen={isOpen} onClose={onClose} amount={total.length} price={price} onClick={() => handlePurchase(total, game)}/>
		</>
	);
}
