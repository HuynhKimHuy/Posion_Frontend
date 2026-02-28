import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? "http://localhost:5000/api" : '/api',
    withCredentials: true
})

// gắn access token vào header của mỗi request
api.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// tự động gọi khi refreshtoken hết hạn 
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Không retry cho các endpoint auth
        if (originalRequest.url?.includes("auth/signin") ||
            originalRequest.url?.includes("auth/signup") ||
            originalRequest.url?.includes("auth/refreshToken")) {
            return Promise.reject(error);
        }

        // Nếu lỗi 401 và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const res = await axios.post("/api/auth/refreshToken", {}, { withCredentials: true });
                const newAccessToken = res.data.metadata.tokens.accessToken;

                // Cập nhật token mới vào store
                useAuthStore.setState({ accessToken: newAccessToken });

                // Retry request với token mới
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh token thất bại, đăng xuất user
                useAuthStore.getState().clearState();
                window.location.href = "/signin";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api