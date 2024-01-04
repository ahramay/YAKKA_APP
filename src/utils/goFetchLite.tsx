import axios, { AxiosRequestConfig } from "axios";
import QueryString from "qs";
import { refreshToken } from "../api/auth/refreshToken";
import { baseUrl, getApiHeader } from "../api/config";
import { getData } from "./localStorage";
import qs from "qs";
interface Options {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  params?: any;
}

// * Uses https://yakka-api-dev.dev-cloud.cc/api/
//  */
/* Uses https://yakka.deployo.cc/api/
 */
export const goFetchLite = async (url: string, options: Options) => {
  let header = await getApiHeader();

  const queryParams = options.params
    ? "?" + qs.stringify(options.params, { arrayFormat: "comma" })
    : "";

  const requestConfig: AxiosRequestConfig = {
    url: baseUrl + url + queryParams,
    data: options.body,
    method: options.method,
    headers: header,
    validateStatus: status => status === 401 || (status >= 200 && status < 300)
  };

  const res = await axios(requestConfig);

  if (res.status === 401) {
    await refreshToken();
    const headers = await getApiHeader();

    // Retry
    const res = await axios({ ...requestConfig, headers });
    return res.data;
  }

  return res.data;
};
