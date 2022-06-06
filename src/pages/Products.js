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
import axios from 'axios';
import Iconify from 'components/Iconify';
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
import SearchNotFound from 'components/SearchNotFound';
import { filter } from 'lodash';
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
	const [page, setPage] = useState(1);

	const fetchProducts = (page) =>
		axios
			.get(`http://127.0.0.1:8000/products/?page=${page}`)
			.then((res) => res.data.results);

	const [order, setOrder] = useState('asc');

	const [selected, setSelected] = useState([]);

	const [orderBy, setOrderBy] = useState('_id');

	const [filterName, setFilterName] = useState('');

	const [rowsPerPage, setRowsPerPage] = useState(5);

	const [products, setProducts] = useState([]);

	const { loading, error } = useQuery(['products', page], () => {
		fetchProducts(page).then((res) => {
			console.log(res);
			setProducts(res);
		});
	});

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
		page > 1 ? Math.max(1, (1 + page) * rowsPerPage - products.length) : 1;

	const filteredUsers = applySortFilter(
		products,
		getComparator(order, orderBy),
		filterName
	);

	const isUserNotFound = filteredUsers.length === 0;

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
					{error ? (
						<Alert severity='error'>
							<AlertTitle>List Loading Error</AlertTitle>
							{error}
						</Alert>
					) : null}
					{loading ? (
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
									{filteredUsers
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
													key={_id}
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
														{mileage
															? mileage
															: 'null'}
													</TableCell>
													<TableCell align='left'>
														{price}
													</TableCell>
													<TableCell align='left'>
														{minimum_rent_period}{' '}
														Months
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

								{isUserNotFound && (
									<TableBody>
										<TableRow>
											<TableCell
												align='center'
												colSpan={6}
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
						count={products.length}
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
						onClick={() => alert('Book Clicked')}
						variant='contained'
						startIcon={<Iconify icon='eva:plus-fill' />}
					>
						Book
					</Button>
					<Button
						onClick={() => alert('Return Clicked')}
						variant='contained'
						startIcon={<Iconify icon='eva:plus-fill' />}
					>
						Return
					</Button>
				</Stack>
			</Container>
		</Page>
	);
};
export default Products;
