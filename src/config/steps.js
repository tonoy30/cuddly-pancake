export const BOOK_STEPS = [
	{
		id: '1',
		title: 'Provide Product Booking Information',
		isOptional: false,
		prevComponent: '',
		component: 'ProductBooking',
	},
	{
		id: '2',
		title: 'Confirm Product Booking',
		isOptional: false,
		prevComponent: 'ProductBooking',
		component: 'Confirmation',
	},
];

export const RETURN_STEPS = [
	{
		id: '1',
		title: 'Provide Product Return Information',
		isOptional: false,
		prevComponent: '',
		component: 'ReturnProduct',
	},
	{
		id: '2',
		title: 'Confirm Product Return',
		isOptional: false,
		prevComponent: 'ReturnProduct',
		component: 'Confirmation',
	},
];
