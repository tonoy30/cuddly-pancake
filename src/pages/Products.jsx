// material
import {
	Alert,
	AlertTitle,
	Box,
	Button,
	Card,
	Checkbox,
	Container,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TablePagination,
	TableRow,
	Typography,
} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { axiosClient } from 'axiosClient';
import Iconify from 'components/Iconify';
import Page from 'components/Page';
import ProductBookOrReturnDialog from 'components/ProductBookOrReturnDialog';
import Scrollbar from 'components/Scrollbar';
import SearchNotFound from 'components/SearchNotFound';
import { filter } from 'lodash';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useQuery } from 'react-query';
import {
	ProductListHead,
	ProductListToolbar,
	ProductMoreMenu,
} from 'sections/@dashboard/product';

const TABLE_HEAD = [
	{ id: 'name', label: 'Name', alignRight: false },
	{ id: 'code', label: 'Code', alignRight: false },
	{ id: 'type', label: 'Type', alignRight: false },
	{ id: 'availability', label: 'Availability', alignRight: false },
	{ id: 'needing_repair', label: 'Need To Repair', alignRight: false },
	{ id: 'durability', label: 'Durability', alignRight: false },
	{ id: 'mileage', label: 'Mileage', alignRight: false },
	{ id: 'price', label: 'Price', alignRight: false },
	{
		id: 'minimum_rent_period',
		label: 'Minimum Rent Period',
		alignRight: false,
	},
	{ id: '' },
];
const BOOK_STEPS = [
	{
		id: '1',
		title: 'Provide Product Booking Information',
		isOptional: false,
		component: 'ProductBooking',
	},
	{
		id: '2',
		title: 'Confirm Product Booking',
		isOptional: false,
		component: 'Confirmation',
	},
];

const RETURN_STEPS = [
	{
		id: '1',
		title: 'Provide Product Return Information',
		isOptional: false,
		component: 'Confirmation',
	},
	{
		id: '2',
		title: 'Confirm Product Return',
		isOptional: false,
		component: 'Confirmation',
	},
];

function unique(items, key) {
	const itemsMap = new Map();

	items.forEach((item) => {
		if (itemsMap.size === 0) {
			itemsMap.set(item[key], item);
		} else if (!itemsMap.has(item[key])) {
			itemsMap.set(item[key], item);
		}
	});

	return [...new Set(itemsMap.values())];
}

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	if (query) {
		return filter(
			array,
			(_product) =>
				_product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
		);
	}
	return stabilizedThis.map((el) => el[0]);
}

const Products = () => {
	const [openBooking, setOpenBooking] = useState(false);
	const [openReturn, setOpenReturn] = useState(false);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [count, setCount] = useState(5);

	const fetchProducts = (page, size) =>
		axiosClient
			.get(`products?page=${page + 1}&size=${size}`)
			.then((res) => ({
				data: res.data.results,
				count: res.data.count,
			}));

	const [order, setOrder] = useState('asc');

	const [selected, setSelected] = useState([]);

	const [orderBy, setOrderBy] = useState('_id');

	const [filterName, setFilterName] = useState('');

	const [products, setProducts] = useState([]);

	const { isLoading, isError } = useQuery(
		['products', page, rowsPerPage],
		() => {
			fetchProducts(page, rowsPerPage).then((res) => {
				const newProducts = unique([...products, ...res.data], '_id');
				setProducts(newProducts);
				setCount(res.count);
			});
		},
		{ keepPreviousData: true }
	);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = products.map((n) => n.name);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, name) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected = [];
		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}
		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleFilterByName = (event) => {
		setFilterName(event.target.value);
	};

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

	const filteredProducts = applySortFilter(
		products,
		getComparator(order, orderBy),
		filterName
	);

	const isProductNotFound = filteredProducts.length === 0;

	return (
		<Page title='Products'>
			<Container>
				<Stack
					direction='row'
					alignItems='center'
					justifyContent='space-between'
					mb={1}
				>
					<Typography variant='h4' gutterBottom>
						Products
					</Typography>
				</Stack>

				<Card>
					<ProductListToolbar
						numSelected={selected.length}
						filterName={filterName}
						onFilterName={handleFilterByName}
					/>
					{isError ? (
						<Alert severity='error'>
							<AlertTitle>List Loading Error</AlertTitle>
							{isError}
						</Alert>
					) : null}
					{isLoading ? (
						<Box sx={{ width: '100%' }}>
							<LinearProgress />
						</Box>
					) : null}

					<Scrollbar>
						<TableContainer sx={{ minWidth: 800 }}>
							<Table>
								<ProductListHead
									order={order}
									orderBy={orderBy}
									headLabel={TABLE_HEAD}
									rowCount={products.length}
									numSelected={selected.length}
									onRequestSort={handleRequestSort}
									onSelectAllClick={handleSelectAllClick}
								/>
								<TableBody>
									{filteredProducts
										.slice(
											page * rowsPerPage,
											page * rowsPerPage + rowsPerPage
										)
										.map((row) => {
											const {
												_id,
												name,
												code,
												availability,
												durability,
												max_durability,
												mileage,
												minimum_rent_period,
												needing_repair,
												price,
												type,
											} = row;
											const isItemSelected =
												selected.indexOf(name) !== -1;
											return (
												<TableRow
													hover
													key={nanoid()}
													id={_id}
													tabIndex={-1}
													role='checkbox'
													selected={isItemSelected}
													aria-checked={
														isItemSelected
													}
												>
													<TableCell padding='checkbox'>
														<Checkbox
															checked={
																isItemSelected
															}
															onChange={(event) =>
																handleClick(
																	event,
																	name
																)
															}
														/>
													</TableCell>
													<TableCell
														component='th'
														scope='row'
														padding='none'
													>
														<Stack
															direction='row'
															alignItems='center'
															spacing={2}
														>
															<Typography
																variant='subtitle2'
																noWrap
															>
																{name}
															</Typography>
														</Stack>
													</TableCell>
													<TableCell align='left'>
														{code}
													</TableCell>
													<TableCell align='left'>
														{type}
													</TableCell>
													<TableCell align='left'>
														{availability
															? 'True'
															: 'False'}
													</TableCell>
													<TableCell align='left'>
														{needing_repair
															? 'True'
															: 'False'}
													</TableCell>
													<TableCell align='left'>
														{durability +
															'/' +
															max_durability}
													</TableCell>
													<TableCell align='left'>
														{mileage === null ||
														mileage === 'undefined'
															? 'null'
															: mileage}
													</TableCell>
													<TableCell align='left'>
														{price}
													</TableCell>
													<TableCell align='left'>
														{minimum_rent_period}{' '}
														Day(s)
													</TableCell>
													<TableCell align='right'>
														<ProductMoreMenu />
													</TableCell>
												</TableRow>
											);
										})}
									{emptyRows > 0 && (
										<TableRow
											style={{ height: 53 * emptyRows }}
										>
											<TableCell colSpan={6} />
										</TableRow>
									)}
								</TableBody>

								{isProductNotFound && (
									<TableBody>
										<TableRow>
											<TableCell
												align='center'
												colSpan={12}
												sx={{ py: 3 }}
											>
												<SearchNotFound
													searchQuery={filterName}
												/>
											</TableCell>
										</TableRow>
									</TableBody>
								)}
							</Table>
						</TableContainer>
					</Scrollbar>

					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component='div'
						count={count}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Card>
				<Stack
					direction='row'
					alignItems='center'
					justifyContent='flex-end'
					mt={5}
					spacing={2}
				>
					<Button
						onClick={() => setOpenBooking(true)}
						variant='contained'
						startIcon={<Iconify icon='eva:lock-outline' />}
					>
						Book
					</Button>
					<Button
						onClick={() => setOpenReturn(true)}
						variant='contained'
						startIcon={<Iconify icon='eva:menu-arrow-outline' />}
					>
						Return
					</Button>
				</Stack>
			</Container>
			<ProductBookOrReturnDialog
				open={openBooking}
				handleClose={() => setOpenBooking(false)}
				title={'Book a Product'}
				steps={BOOK_STEPS}
				handleStepperNext={() => console.log('handleStepperNext')}
				handleStepperFinished={() => setOpenBooking(false)}
			/>
			<ProductBookOrReturnDialog
				open={openReturn}
				handleClose={() => setOpenReturn(false)}
				title={'Return a Product'}
				steps={RETURN_STEPS}
				handleStepperNext={() => console.log('handleStepperNext')}
				handleStepperFinished={() => setOpenReturn(false)}
			/>
		</Page>
	);
};
export default Products;
