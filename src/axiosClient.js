import axios from 'axios';

const axiosClient = axios.create({
	baseURL: `https://rentalpotential-octo-garbanzo.herokuapp.com/`,
	withCredentials: true,
});
export { axiosClient };
