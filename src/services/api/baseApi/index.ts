import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export type AxiosMethods =
  | "get"
  | "delete"
  | "head"
  | "options"
  | "post"
  | "put"
  | "patch";

export abstract class BaseApi {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8000", // @todo change to env variable
    });
  }

  protected async request<ResponseType = any, RequestType = any>(
    method: AxiosMethods,
    url: string,
    data?: RequestType,
    config?: AxiosRequestConfig<any>,
  ): Promise<AxiosResponse<ResponseType>> {
    const configWithHeaders = {
      ...config,
      headers: {
        ...config?.headers,
      },
    };

    try {
      switch (method) {
        case "get":
          return await this.api.get(url, configWithHeaders);
        case "post":
          return await this.api.post(url, data, configWithHeaders);
        case "put":
          return await this.api.put(url, data, configWithHeaders);
        case "patch":
          return await this.api.patch(url, data, configWithHeaders);
        case "delete":
          return await this.api.delete(url, { ...configWithHeaders, data });
        case "head":
          return await this.api.head(url, configWithHeaders);
        case "options":
          return await this.api.options(url, configWithHeaders);
        default:
          throw new Error(`Method ${method} is not supported`);
      }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  }
}