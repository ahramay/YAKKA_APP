import { getRecoil, setRecoil } from "recoil-nexus";
import { signupScreensAtom } from "../recoil/signupAtoms";

interface signupNextNavProps {
  navigation: any;
  routeName: string;
  params?: any;
}

export const signupNextNav = ({
  routeName,
  params,
  navigation
}: signupNextNavProps) => {
  const signupScreens = getRecoil(signupScreensAtom);

  const index =
    signupScreens.findIndex(val => val.name === routeName) !== -1
      ? signupScreens.findIndex(val => val.name === routeName)
      : 0;

  if (index !== undefined && index >= 0) {
    //@ts-ignore
    if (index < signupScreens.length - 1) {
      return navigation.navigate(signupScreens[index + 1].name, params);
    }
    return setRecoil(signupScreensAtom, []);
  } else {
    console.log(
      "error index not met",
      routeName,
      index,
      index !== undefined && signupScreens[index + 1].name
    );
  }
};
