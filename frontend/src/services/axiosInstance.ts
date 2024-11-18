import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import router from '@/router';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();
      authStore.isLoggedIn = false;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
