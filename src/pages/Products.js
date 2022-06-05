// material
import {
	Alert,
	AlertTitle,
	Avatar,
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
import { sentenceCase } from 'change-case';
import Iconify from 'components/Iconify';
import Label from 'components/Label';
import Page from 'components/Page';
import Scrollbar from 'components/Scrollbar';
import SearchNotFound from 'components/SearchNotFound';
import { filter } from 'lodash';
import { useState } from 'react';
import {
	ProductListHead,
	ProductListToolbar,
	ProductMoreMenu,
} from 'sections/@dashboard/product';

const TABLE_HEAD = [
	{ id: 'name', label: 'Name', alignRight: false },
	{ id: 'company', label: 'Company', alignRight: false },
	{ id: 'role', label: 'Role', alignRight: false },
	{ id: 'isVerified', label: 'Verified', alignRight: false },
	{ id: 'status', label: 'Status', alignRight: false },
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
	const PRODUCTS = [];
	const error = null;
	const loading = true;
	const [page, setPage] = useState(0);

	const [order, setOrder] = useState('asc');

	const [selected, setSelected] = useState([]);

	const [orderBy, setOrderBy] = useState('name');

	const [filterName, setFilterName] = useState('');

	const [rowsPerPage, setRowsPerPage] = useState(5);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = PRODUCTS.map((n) => n.name);
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
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PRODUCTS.length) : 0;

	const filteredUsers = applySortFilter(
		PRODUCTS,
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
									rowCount={PRODUCTS.length}
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
												id,
												name,
												role,
												status,
												company,
												avatarUrl,
												isVerified,
											} = row;
											const isItemSelected =
												selected.indexOf(name) !== -1;

											return (
												<TableRow
													hover
													key={id}
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
															<Avatar
																alt={name}
																src={avatarUrl}
															/>
															<Typography
																variant='subtitle2'
																noWrap
															>
																{name}
															</Typography>
														</Stack>
													</TableCell>
													<TableCell align='left'>
														{company}
													</TableCell>
													<TableCell align='left'>
														{role}
													</TableCell>
													<TableCell align='left'>
														{isVerified
															? 'Yes'
															: 'No'}
													</TableCell>
													<TableCell align='left'>
														<Label
															variant='ghost'
															color={
																(status ===
																	'banned' &&
																	'error') ||
																'success'
															}
														>
															{sentenceCase(
																status
															)}
														</Label>
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
						count={PRODUCTS.length}
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
