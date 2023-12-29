import { SeatType } from '@/util/util';
import { Center, type ButtonProps, type CenterProps } from '@chakra-ui/react';

const BOX_WIDTH = 8;
const SELECTED_COLOR = 'blue.300';

// Seat component that assigns different colours to each type of seat.
export function SeatKey({ type }: { type: SeatType }) {
	let bgColor = '';

	switch (type) {
		case SeatType.Empty:
			bgColor = 'blue.100';
			break;
		case SeatType.Selected:
			bgColor = SELECTED_COLOR;
			break;
		case SeatType.Reserved:
			bgColor = 'gray.400';
			break;
	}


	return <Center w={BOX_WIDTH} h={BOX_WIDTH} userSelect="none" rounded="md" bgColor={bgColor} boxShadow="md"/>;
}

export default function Seat({ type, text, onClick = () => null }: { type: SeatType; text: string; onClick?: ButtonProps['onClick'] }) {
	const props: Omit<CenterProps, 'onClick'> & ButtonProps = {
		w: BOX_WIDTH,
		h: BOX_WIDTH,
		userSelect: 'none',
		rounded: 'md'
	};

	switch (type) {
		case SeatType.Empty:
			props.bgColor = 'blue.100';
			break;
		case SeatType.Selected:
			props.bgColor = SELECTED_COLOR;
			break;
		case SeatType.Reserved:
			props.bgColor = 'gray.400';
			break;
	}

	if (type !== SeatType.None) {
		props.boxShadow = 'md';

		if (type !== SeatType.Reserved) {
			props.as = 'button';
			props.onClick = onClick;
			props._hover = { bgColor: type === SeatType.Empty ? SELECTED_COLOR : 'blue.400' };
			props.transition = 'all 0.2s cubic-bezier(.08,.52,.52,1)';
		}
	}

	return <Center {...props}>{text}</Center>;
}
