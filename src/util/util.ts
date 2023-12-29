'use client';

import constate from 'constate';
import { useState } from 'react';

// The name for the Local Storage key where the current user session is stored.
const DATA_KEY = 'ticket_data';

export const BOX_SHADOW = '0 2px 5px rgb(0 0 0 / 0.49)';

export interface LoginData {
	username: string;
	password: string;
}

export interface UserData {
	id?: number;
	username: string;
	expires: number;
}

export interface GameData {
	name: string;
	games: {
		id: string;
		city: string;
		state: string;
		venue: string;
		teams: string[];
		price: number;
		country: string;
	}[];
}

export interface ErrorData {
	headers: Headers;
	ok: boolean;
	redirected: boolean;
	status: number;
	statusText: string;
	type: ResponseType;
	url: string;
}

// Custom Error Class that handles API errors.
export class APIError extends Error {
	public constructor(message: string, data: ErrorData) {
		super(message);
		Object.assign(this, data);
	}
}

export type Game = GameData['games'][number];

// Function used to find a specific game from an array of games based on its ID. Uses Binary Search.
export function findGame(data: GameData[], target: string): Game | null {
	let countryIndex = -1;
	let gameIndex = -1;

	for (const country of data) {
		// In order to use Binary Search, the array must already be sorted from 'low' to 'high'.
		// In this case, alphabetically, because we are using these algorithms for sorting an
		// array of objects by one of their string properties, rather than the base use case of
		// sorting an array of numbers. The quickSort() and binarySearch() functions, defined
		// below this function, are used for this.
		quickSort(country.games, 0, country.games.length - 1);

		gameIndex = binarySearch(country.games, target);

		if (gameIndex > -1) {
			countryIndex = data.indexOf(country);
			break;
		}
	}

	return gameIndex === -1 ? null : data[countryIndex].games[gameIndex];
}

// Binary Search algorithm used to search through an array of objects based on id property.
function binarySearch(list: GameData['games'], target: string) {
	let start = 0;
	let end = list.length - 1;

	while (start <= end) {
		// We need to use Math.floor here, as dividng by an integer
		// in JavaScript keeps the decimal point, unlike in Java.
		const mid = Math.floor((start + end) / 2);

		const current = list[mid].id;

		if (current === target) {
			return mid;
		} else if (current > target) {
			end = mid - 1;
		} else if (current < target) {
			start = mid + 1;
		}
	}

	return -1;
}

/* QUICK SORT FUNCTIONS */

// Quick Sort algorithm that sorts a list of game objects, based on city property, which
// is almost identical to id property.
function quickSort(list: GameData['games'], low: number, high: number) {
	if (low < high) {
		const partitioned = partition(list, low, high);

		quickSort(list, low, partitioned - 1);
		quickSort(list, partitioned + 1, high);
	}
}

function partition(list: GameData['games'], low: number, high: number) {
	const pivot = list[high].city.toLowerCase();

	let i = low - 1;

	for (let j = low; j <= high - 1; j++) {
		if (list[j].city.toLowerCase().localeCompare(pivot, 'en') === -1) {
			i++;
			swap(list, i, j);
		}
	}

	swap(list, i + 1, high);

	return i + 1;
}

function swap(list: any[], i: number, j: number) {
	const temp = list[i];
	list[i] = list[j];
	list[j] = temp;
}

/* QUICK SORT FUNCTIONS */

export interface SeatData {
	row: string;
	column: number;
}

export const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
export const columns = 20;

// Calculates the total price of a set of seats.
export function calcPrice(seats: SeatData[], game: Game) {
	let total = 0;

	for (const seat of seats) {
		total += calcSeatPrice(seat, game.price);
	}

	return `$${total.toFixed(2)}`;
}

// Calculates the seat price based on the location of the seat on the seat map, relative to the field.
export function calcSeatPrice(seat: SeatData, basePrice: Game['price']) {
	const first =
		([rows[1], rows[rows.length - 1]].includes(seat.row) && seat.column >= 3 && seat.column <= 16) || // check inner rows
		(![rows[0], rows[rows.length - 1]].includes(seat.row) && [3, 15].includes(seat.column)); // check inner columns

	const second = ([rows[0], rows[rows.length - 1]].includes(seat.row) && (seat.column >= 2 && seat.column <= 17)) || [2, 17].includes(seat.column);

	const third = [1, 18].includes(seat.column);

	let value = 0;

	if (first) {
		value = 0.4; // First ring of seats, tickets are 40% more expensive
	} else if (second) {
		value = 0.2; // Second ring of seats, tickets are 20% more expensive
	} else if (third) {
		value = 0.1; // Second ring of seats, tickets are 10% more expensive
	}

	return basePrice * (1 + value); // Remaining seats stay at base price.
}

export function getCountryFlag(name: string) {
	return `/assets/countries/${name.replaceAll(' ', '-').toLowerCase()}.svg`;
}

// Seat Type Enum. This will number each constant from 0 onwards, in increasing order.
// This is a TypeScript exclusive feature, that provides a similar API to Java enums.
// We use enum constants instead of raw numerical values for Seat Type to make the
// code more readable.
export enum SeatType {
	None,
	Empty,
	Selected,
	Reserved
}

export type Seats = Record<string, SeatType[]>;

// Generates an object that representes seat map, taking into account already purchased seats.
export function generateSeats(tickets: Ticket[]): Seats {
	const seats: Record<string, number[]> = {};

	for (const row of rows) {
		// To construct an array with an initial capacity, we call the constructor, similar to an ArrayList in Java.
		seats[row] = new Array(20);

		for (let i = 0; i < columns; i++) {
			if (checkSeat(tickets, row, i)) {
				seats[row][i] = SeatType.Reserved;
			} else {
				switch (row) {
					case rows[0]:
					case rows[1]:
					case rows[rows.length - 2]:
					case rows[rows.length - 1]:
						seats[row][i] = SeatType.Empty;
						break;
					default:
						if (i < 4 || i > 15) {
							seats[row][i] = SeatType.Empty;
						} else {
							seats[row][i] = SeatType.None;
						}

						break;
				}
			}
		}
	}

	return seats;
}

// Checks to see if a specific seat is already reserved, using an enhanced for loop.
function checkSeat(tickets: Ticket[], row: string, column: number) {
	if (tickets) {
		for (const ticket of tickets) {
			if (ticket.row === row && ticket.column === column) {
				return true;
			}
		}
	}

	return false;
}

// Utility function to make HTTP requests to the API backend, using JavaScript's native
// fetch() function.
export async function fetchAPI<T>(path: string, options: RequestInit = {}) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
		...options,
		credentials: 'include',
		headers: {
			...options.headers,
			'Content-Type': 'application/json'
		}
	});

	const json = await res.json();

	if (json.error) {
		throw new APIError(json.error, {
			headers: res.headers,
			ok: res.ok,
			redirected: res.redirected,
			status: res.status,
			statusText: res.statusText,
			type: res.type,
			url: res.url
		});
	} else {
		return json as T;
	}
}

/* LOCAL STORAGE TICKET FUNCTIONS */
export function getTicketState(): Ticket[] {
	if (typeof window !== 'undefined') {
		const data = localStorage.getItem(DATA_KEY);
		return data ? JSON.parse(data) : [];
	}

	return [];
}

const ticketState = getTicketState();

const useTicketState = () => {
	const [tickets, setTickets] = useState<Ticket[]>(ticketState);

	return { tickets, setTickets };
};

export const [TicketProvider, useTickets, setTickets] = constate(
	useTicketState,
	(value) => value.tickets,
	(value) => value.setTickets
);

export function addTickets(data: Ticket[], payload: TicketPayload[] = []): Ticket[] {
	let num = data.length + 1;

	for (const ticket of payload) {
		const newTicket: Ticket = {
			id: ++num,
			...ticket,
			created: Date.now()
		};

		data.push(newTicket);
	}

	return data;
}

export function deleteTicket(data: Ticket[], id: number): Ticket[] {
	const ticket = data.find(t => t.id === id);

	if (typeof ticket !== 'undefined') {
		data.splice(data.indexOf(ticket), 1);
	}

	return data;
}

export function saveTickets(data: Ticket[]) {
	try {
		if (typeof window !== 'undefined') {
			localStorage.setItem(DATA_KEY, JSON.stringify(data));
		}
	} catch (e) {
		console.log(e);
	}
}

/* LOCAL STORAGE TICKET FUNCTIONS */

export interface Ticket {
    id: number;
	created: number;
	row: string;
	column: number;
	price: number;
	country: string;
	city: string;
	game_id: string;
	state: string;
	venue: string;
	match: string;
}

export type TicketPayload = Omit<Ticket, 'id' | 'created'>;

// Waits for a certain amount in ms before continuing to run the program.
// eslint-disable-next-line @typescript-eslint/promise-function-async
export function wait(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
