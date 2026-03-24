import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios'

const normalizeApiBaseUrl = (rawUrl?: string) => {
    const trimmed = (rawUrl || '').trim().replace(/\/+$/, '');
    if (!trimmed) return '/api';
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const apiBaseURL = import.meta.env.DEV ? '/api' : normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

const api = axios.create({
    baseURL: apiBaseURL,
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

        if (!originalRequest) {
            return Promise.reject(error);
        }

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
                const res = await api.post("/auth/refreshToken", {}, { withCredentials: true });
                const newAccessToken = res.data.metadata.tokens.accessToken;

                // Cập nhật token mới vào store
                useAuthStore.setState({ accessToken: newAccessToken });

                // Retry request với token mới
                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                const refreshStatus = axios.isAxiosError(refreshError)
                    ? refreshError.response?.status
                    : undefined;

                // Chỉ đăng xuất khi refresh token thực sự không hợp lệ/hết hạn
                if (refreshStatus === 401 || refreshStatus === 403) {
                    useAuthStore.getState().clearState();
                    window.location.href = "/signin";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api