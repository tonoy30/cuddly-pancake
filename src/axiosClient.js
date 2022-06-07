import axios from 'axios';

const axiosClient = axios.create({
	baseURL: `https://rentalpotential-octo-garbanzo.herokuapp.com/`,
});
export { axiosClient };
