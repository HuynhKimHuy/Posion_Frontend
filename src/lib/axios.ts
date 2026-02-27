import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios'

const api = axios.create({
    baseURL : import.meta.env.MODE === 'development' ? "http://localhost:5000/api" : '/api',
    withCredentials:true
})
// gắn aceess token vào header của mỗi request
api.interceptors.request.use((config) => {
   const accessToken = useAuthStore.getState().accessToken;

   if(accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
   }
   return config;
});
export default api