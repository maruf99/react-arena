import { type GameData, generateSeats, getCountryFlag, findGame, SeatType, type Game, BOX_SHADOW, useTickets } from '@/util/util';
import { Box, HStack, Text, VStack, Heading, Image } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Seat, { SeatKey } from '@/components/Seat';
import Loading from '@/components/Loading';
import PurchaseButton from '@/components/PurchaseButton';

function Country({ name }: { name: string }) {
	return (
		<HStack>
			<Image width={10} src={getCountryFlag(name)} />
			<Heading size="xl">{name}</Heading>
		</HStack>
	);
}

export default function SeatDisplay({ data }: { data: GameData[] }) {
	const router = useRouter();

	const [game, setGame] = useState<Game | null>(null);

	// Finds the game based on the current page.
	useEffect(() => {
		if (router.isReady) {
			const found = findGame(data, router.query.id as string);
			setGame(found);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady]);

	const ticketData = useTickets();

	// Generates the seat map and saves them to state.
	const [seats, setSeats] = useState(generateSeats(ticketData.filter(t => t.game_id === game?.id)));

	useEffect(() => {
		if (router.isReady) {
			setSeats(generateSeats(ticketData.filter(t => t.game_id === game?.id)));
		}
		
	}, [router.isReady, ticketData, game]);

	const seatRows = [];

	// Changes state of seat to selected/empty when clicked in the seat map.
	const handleSelect = (type: SeatType, row: string, index: number) => {
		switch (type) {
			case SeatType.Empty:
				seats[row][index] = SeatType.Selected;
				break;
			case SeatType.Selected:
				seats[row][index] = SeatType.Empty;
				break;
		}

		setSeats({ ...seats });
	};

	for (const [row, col] of Object.entries(seats)) {
		const seatRow = [];

		for (const [index, type] of col.entries()) {
			seatRow.push(
				<HStack spacing={3}>
					{index === 0 ? (
						<Box w={5}>
							<Text size="md" fontWeight="bold" userSelect="none">
								{row}
							</Text>
						</Box>
					) : null}
					<Seat type={type} text={type === SeatType.None ? '' : `${index + 1}`} onClick={() => handleSelect(type, row, index)} />
				</HStack>
			);
		}

		seatRows.push(seatRow);
	}

	return game ? (
		<Box my={3} py={6} px={10} bgColor="blue.200" rounded="xl" boxShadow={BOX_SHADOW}>
			<VStack spacing={6}>
				<VStack spacing={3}>
					<HStack spacing={3}>
						<Country name={game.teams[0]} />
						<Heading size="xl">vs.</Heading>
						<Country name={game.teams[1]} />
					</HStack>
					<Heading size="sm" color="gray.700">
						{game.venue}
					</Heading>
					<Heading size="sm" color="gray.700">
						{game.city}, {game.state}
					</Heading>
				</VStack>
				<HStack spacing={5}>
					{['empty', 'selected', 'reserved'].map((str, index) => {
						return (
							<HStack key={str}>
								<SeatKey type={index + 1} />
								<Text fontSize="sm" fontWeight="bold">
									{str.replace(/[A-Za-zÀ-ÖØ-öø-ÿ]\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())} Seat
								</Text>
							</HStack>
						);
					})}
				</HStack>
				<VStack spacing={4}>
					{seatRows.map((x, i) => (
						<HStack key={i} spacing={3}>
							{x}
						</HStack>
					))}
				</VStack>
				<PurchaseButton seats={seats} game={game} />
			</VStack>
			<Text fontSize="4xl" fontWeight="bold" textAlign="center" position="absolute" top="55.3%" left="47.8%" zIndex={999}>
				Field
			</Text>
		</Box>
	) : (
		<Loading color="white" />
	);
}
