import DashboardLayout from 'layouts/dashboard';
import Products from 'pages/Products';
import { useRoutes } from 'react-router-dom';

export default function Router() {
	return useRoutes([
		{
			path: '/',
			element: <DashboardLayout />,
			children: [{ path: '', element: <Products /> }],
		},
	]);
}
