import type { SpinnerProps } from '@chakra-ui/react';
import { Flex, Spinner } from '@chakra-ui/react';

export default function Loading(props: SpinnerProps) {
	return (
		<Flex justifyContent="center" alignItems="center" h="100%">
			<Spinner size="xl" {...props} />
		</Flex>
	);
}