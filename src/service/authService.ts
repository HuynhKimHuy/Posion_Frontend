import api from "@/lib/axios"

const withAuthConfig = (accessToken: string) => ({
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${accessToken}`,
    },
})

export const authService = {
    signUp: async (
        userName: string,
        password: string,
        email: string,
        firstName: string,
        lastName: string,
    ) => {
        const res = await api.post('/auth/signup', { userName, password, email, firstName, lastName }, { withCredentials: true }
        )
        return res.data
    },

    signIn: async (
        email: string,
        password: string
    ) => {
        const res = await api.post(
            '/auth/signin',
            { email, password },
            { withCredentials: true }
        )
        return res.data

    },

    logOut: async () => {
        await api.post('/auth/logout', {}, { withCredentials: true })
    },

    fetchMe: async (accessToken: string) => {
        const res = await api.get("/user/me", withAuthConfig(accessToken))
        return res.data.metadata;
    },
    refresh: async () => {
        const fallbackRefreshToken = localStorage.getItem("refresh-token");
        const payload = fallbackRefreshToken
            ? { refreshToken: fallbackRefreshToken }
            : {};

        const res = await api.post("/auth/refreshToken", payload, { withCredentials: true });
        return res.data.metadata.tokens.accessToken;
    }

}
