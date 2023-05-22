import axios from 'axios';
import { baseURL } from './constants';



const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  (request) => {
    request.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    request.headers['Content-Type'] = 'application/json';
    return request;
  }
)



axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {

      localStorage.removeItem('token');
      window.location.href = '/signin';

    }
    return Promise.reject(error);
  }
);

export default axiosInstance;