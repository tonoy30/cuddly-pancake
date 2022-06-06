import axios from 'axios';
import { useEffect, useState } from 'react';

function useFetch(url) {
	const [data, setData] = useState(null);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading('loading...');
		setData(null);
		setError(null);
		const source = axios.CancelToken.source();
		axios
			.get(url, { cancelToken: source.token })
			.then((res) => {
				setLoading(false);
				res.data.results && setData(res.data.results);
				res.data.count && setCount(res.data.count);
			})
			.catch((err) => {
				setLoading(false);
				setError('An error occurred. Awkward..');
			});
		return () => {
			source.cancel();
		};
	}, [url]);

	return { count, data, loading, error };
}
export default useFetch;
