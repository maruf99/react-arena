import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react';
import type { MouseEventHandler } from 'react';

// Modal that appears requesting for the user to confirm that they want to purchase the tickets.
export default function PurchaseModal({
	isOpen,
	onClose,
	onClick,
	price,
	amount
}: {
	isOpen: boolean;
	onClose: () => void;
	onClick: MouseEventHandler<HTMLButtonElement>;
	price: string;
	amount: number;
}) {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader fontSize="3xl" fontWeight="bold">Purchase</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					Are you sure you want to purchase {amount > 1 ? 'these' : 'this'} {amount} ticket{amount > 1 ? 's' : ''}? The total price is <span style={{ fontWeight: 'bold' }}>{price}</span>.
				</ModalBody>

				<ModalFooter>
					<Button colorScheme="red" mr={3} onClick={onClose}>
						Cancel
					</Button>
					<Button colorScheme="green" onClick={onClick}>
						Purchase
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
