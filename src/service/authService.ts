import api from "@/lib/axios"

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
    }
}
