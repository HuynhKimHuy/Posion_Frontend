import api from "../lib/axios";

export const userService = {
  uploadAvatar: async (formData: FormData) => {
    // Let the browser set the correct multipart boundary
    const res = await api.post("/user/uploadAvatar", formData, { withCredentials: true });
    return res?.data?.metadata;
  },
};