import { getData } from "../utils/localStorage";

export const apiHeader: HeadersInit | undefined = {
  "Content-Type": "application/json"
};
let currentToken = "";
// export const baseUrl = "https://yakka.deployo.cc/api/";
// export const baseUrl = "https://yakka-api-dev.dev-cloud.cc/api/";
// export const baseUrl = "https://yakka-api-uat.dev-cloud.cc/api/"; 
// export const baseUrl = "http://192.168.1.15:4000/api/";
//  export const baseUrl = "http://192.168.100.6:4000/api/";
  export const baseUrl = "http://182.176.93.247:4000/api/";

export const getApiHeader = async () => {
  let token = await getToken();
  const headers = { ...apiHeader };
  if (token) {
    headers.Authorization = "Bearer " + token;
  }
  return headers;
};

export const fetchCatch = async (url: string, params: any) => {
  try {
    let response = await fetch(url, params);
    return response;
  } catch (error) {
    return -500;
  }
};
export const getToken = async () => {
  let token = await getData("accessToken");

  if (token !== currentToken) {
    token = token;
  }
  return token;
};
