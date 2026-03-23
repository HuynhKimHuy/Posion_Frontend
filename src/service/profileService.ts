import api from "@/lib/axios";

const withAuthConfig = (accessToken: string) => ({
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export const profileService = {
  updateProfile: async (accessToken: string, bio: string) => {
    const res = await api.patch("/user/me", { bio }, withAuthConfig(accessToken));
    return res.data.metadata;
  },

  updateCoverImage: async (accessToken: string, file: File) => {
    const formData = new FormData();
    formData.append("cover", file);

    const baseConfig = withAuthConfig(accessToken);
    const res = await api.patch("/user/me/cover", formData, {
      ...baseConfig,
      headers: {
        ...baseConfig.headers,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.metadata;
  },
};
