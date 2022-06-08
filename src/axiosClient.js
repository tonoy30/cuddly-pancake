import axios from 'axios';

const axiosClient = axios.create({
	baseURL: `https://potential-octo-garbanzo.herokuapp.com/v1/`,
});
export { axiosClient };
