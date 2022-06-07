import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
const axiosClient = axios.create({
	baseURL: `https://rentalpotential-octo-garbanzo.herokuapp.com/`,
});
export { axiosClient };
