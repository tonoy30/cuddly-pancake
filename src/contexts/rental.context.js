import { createContext } from 'react';

const RentalContext = createContext({
	product: null,
	from: null,
	to: null,
	setProduct: () => {},
	setFrom: () => {},
	setTo: () => {},
});

export default RentalContext;
