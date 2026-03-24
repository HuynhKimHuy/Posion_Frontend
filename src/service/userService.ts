import api from "../lib/axios";

export const userService = {
  uploadAvatar: async (formData: FormData) => {
    const res = await api.post("/user/uploadAvatar", formData);
    return res?.data?.metadata;
  },
};