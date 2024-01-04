import { SignInResponse } from "../../models";
import { getData, storeTokens } from "../../utils/localStorage";
import { apiHeader, baseUrl } from "../config";
import { logout } from "./logout";

let refreshTokenPromise: Promise<SignInResponse> | null = null;

export const refreshToken = async () => {
  // If a token refresh is already underway, return the existing promise
  // this prevents a race condition where multiple requests are trying to refresh the token
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = new Promise(async (resolve, reject) => {
    try {
      let refreshToken = await getData("refreshToken");
      let body = JSON.stringify({ refreshToken: refreshToken });

      if (refreshToken == null || refreshToken == undefined) {
        throw new Error();
      }
      const response = await fetch(baseUrl + "auth/refresh", {
        method: "POST",
        headers: apiHeader,
        body: body
      });
      const data: SignInResponse = await response.json();
      if (response == undefined || response == null) {
        throw new Error();
      }
      if (response.status === 200 || response.status === 201) {
        // success

        await storeTokens(data);
        resolve(data);
      } else {
        throw new Error();
      }
    } catch (error) {
      await logout();
      reject(new Error());
    } finally {
      // Clear the refresh token promise so future invocations can create a new one
      refreshTokenPromise = null;
    }
  });

  return refreshTokenPromise;
};
