import axios from 'axios';

const axiosClient = axios.create({
	baseURL: `https://rentalpotential-octo-garbanzo.herokuapp.com/`,
	withCredentials: true,
	headers: {
		'Access-Control-Allow-Origin': '*',
	},
});
export { axiosClient };
