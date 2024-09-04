import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import config from "~/constants/config";
import HttpStatusCode from "~/constants/httpStatusCode.enum";

const apiKey = import.meta.env.VITE_API_ACCESS_KEY as string;

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  retry?: boolean;
  __retryCount?: number;
  originalUrl?: string;
  headers: AxiosRequestHeaders;
}

class Http {
  instance: AxiosInstance;
  retryCount: number = 3;
  retryDelay: number = 200;

  constructor() {
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 1000,
      headers: {
        "Content-Type": "application/json",
        "X-Redmine-API-Key": apiKey,
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        const customConfig = config as CustomAxiosRequestConfig;
        if (!customConfig.originalUrl) {
          customConfig.originalUrl = customConfig.url;
        }
        return customConfig;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError<CustomAxiosRequestConfig>) => {
        if (![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          // const data: any | undefined = error.response?.data;
          // const message = data?.message || error.message;
          // toast.error(message);
        }

        const config = error.config as CustomAxiosRequestConfig;

        if (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK" || !error.response) {
          if (!config || config.retry === false) {
            return Promise.reject(error);
          }

          config.__retryCount = config.__retryCount || 0;

          if (config.__retryCount >= this.retryCount) {
            return Promise.reject(error);
          }

          config.__retryCount += 1;

          const backoff = new Promise<void>((resolve) => {
            setTimeout(
              () => {
                resolve();
              },
              this.retryDelay * (config.__retryCount ?? 1),
            );
          });

          const newConfig = {
            ...config,
            url: config.originalUrl,
            __retryCount: config.__retryCount,
            headers: { ...config.headers },
          };

          return backoff.then(() => {
            return this.instance(newConfig);
          });
        }

        return Promise.reject(error);
      },
    );
  }
}

const http = new Http().instance;
export default http;
