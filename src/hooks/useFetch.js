import axios from 'axios';
import { axiosClient } from 'axiosClient';
import { useEffect, useState } from 'react';

function useFetch(url) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading('loading...');
		setData([]);
		setError(null);
		const source = axios.CancelToken.source();
		axiosClient
			.get(url, { cancelToken: source.token })
			.then((res) => {
				setLoading(false);
				setData(res.data);
			})
			.catch((err) => {
				setLoading(false);
				setError('An error occurred. Awkward..');
			});
		return () => {
			source.cancel();
		};
	}, [url]);

	return [data, loading, error];
}

export default useFetch;
