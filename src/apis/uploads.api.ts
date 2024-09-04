import http from "~/utils/http";
const apiKey = import.meta.env.VITE_API_ACCESS_KEY as string;
export const URL_UPLOADS = "uploads";

const uploadFileApi = {
  postFiles(file: File) {
    return http.post(
      `${URL_UPLOADS}.json`,
      { file },
      {
        headers: {
          "Content-Type": "application/octet-stream",
          "X-Redmine-API-Key": apiKey,
        },
      },
    );
  },
};

export default uploadFileApi;
