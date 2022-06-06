import DashboardLayout from 'layouts/dashboard';
import Book from 'pages/Book';
import Products from 'pages/Products';
import { useRoutes } from 'react-router-dom';

export default function Router() {
	return useRoutes([
		{
			path: '/',
			element: <DashboardLayout />,
			children: [
				{ path: '', element: <Products /> },
				{ path: 'book-product', element: <Book /> },
			],
		},
	]);
}
