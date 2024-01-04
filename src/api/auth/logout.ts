import Toast from "react-native-toast-message";
import { setRecoil } from "recoil-nexus";
import { loadingAtom } from "../../recoil/loadingAtom";
import { loggedInAtom } from "../../recoil/loggedInAtom";
import { signupScreensAtom } from "../../recoil/signupAtoms";
import { deleteItem } from "../../utils/localStorage";
import { baseUrl } from "../config";

export const logout = async () => {
  try {
    const response = await fetch(baseUrl + "auth/logout", {
      method: "DELETE"
    });
    if (response == undefined || response == null) {
      throw new Error("Undefined response");
    }
    if (
      response.status === 401 ||
      (response.status >= 200 && response.status < 300)
    ) {
      console.log("success logging out");
      setRecoil(loadingAtom, true);
    } else {
      throw new Error(`Error logging out" ${response.status}`);
    }
  } catch (error) {
    console.log("error", error);
    // Toast.show({
    //   text1: "Error during logout",
    //   //@ts-ignore
    //   text2: error?.response?.data?.message
    // });
  } finally {
    setRecoil(signupScreensAtom, []);
    setRecoil(loggedInAtom, false);
    await deleteItem("accessToken");
    await deleteItem("refreshToken");
  }
};
