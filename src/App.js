import ScrollToTop from 'components/ScrollToTop';
import Router from 'routes';
import ThemeProvider from 'sections/theme';

export default function App() {
	return (
		<ThemeProvider>
			<ScrollToTop />
			<Router />
		</ThemeProvider>
	);
}
