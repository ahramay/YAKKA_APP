import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Alert, ViewStyle } from "react-native";
import { useSetRecoilState } from "recoil";
import { logout } from "../../api/auth/logout";
import { colors } from "../../constants";
import { loggedInAtom } from "../../recoil/loggedInAtom";
import { Button } from "../defaults";
import { ButtonProps } from "../defaults/Button/Button.props";

interface SmartBackButtonProps {
  dumb?: boolean;
  style?: ViewStyle;
  logout?: boolean;
  text?: string;
  btnProps?: ButtonProps;
  onPress?: () => void;
}

export const SmartBackButton = (props: SmartBackButtonProps) => {
  const {
    dumb = false,
    style,
    btnProps,
    logout: signout = false,
    text = "Back",
    onPress
  } = props;
  const navigation = useNavigation();

  const setLoggedIn = useSetRecoilState(loggedInAtom);
  const leaveLogin = async () => {
    setLoggedIn(false);
    await logout();
  };

  const alertLogout = () => {
    Alert.alert(
      "Going back will require you to login again, continue?",
      "Your phone number (if verified) & login method will be saved",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            leaveLogin();
          },
          style: "default"
        }
      ],
      {
        cancelable: true,
        onDismiss: () => {}
      }
    );
  };

  const goBack =
    signout || !navigation.canGoBack()
      ? alertLogout
      : () => navigation.goBack();

  useEffect(
    () =>
      navigation.addListener("beforeRemove", e => {
        e.preventDefault();

        signout || !navigation.canGoBack()
          ? alertLogout()
          : navigation.dispatch(e.data.action);

        // Prompt the user before leaving the screen
      }),
    [navigation]
  );

  return (
    <Button
      preset="link"
      style={style}
      text={
        dumb
          ? text
          : navigation.getState().routes.length > 1
          ? navigation
              .getState() //@ts-ignore
              .routes[navigation.getState().routes.length - 2].name.replace(
                /([A-Z])/g,
                " $1"
              )
              .trim()
          : text
      }
      textStyle={{ color: colors.background, bottom: 2 }}
      textWeight="700"
      childrenLeft={
        <Ionicons
          name="chevron-back"
          size={24}
          color={colors.background}
          style={{ paddingRight: 10 }}
        />
      }
      onPress={onPress || goBack}
      {...btnProps}
    />
  );
};
