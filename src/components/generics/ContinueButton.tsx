import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { ViewStyle } from "react-native";
import { colors } from "../../constants";
import { signupNextNav } from "../../utils/signupNextNav";
import { Button } from "../defaults";
interface ContinueButtonProps {
  onPress?: () => Promise<boolean> | boolean | void | Promise<void>;
  text?: string;
  disabled?: boolean;
  style?: ViewStyle;
  noArrow?: boolean;
  signupNavigation?: any;
  signupNavParams?: any;
  ref?: any;
}

export const ContinueButton = (props: ContinueButtonProps) => {
  const {
    onPress: onContinue,
    text = "Continue",
    disabled = false,
    style,
    noArrow,
    signupNavParams,
    ref,
    signupNavigation
  } = props;

  const screenState = useRoute();
  const onPress = signupNavigation
    ? async () => {
        const result = await onContinue?.();
        if (result === true) {
          signupNextNav({
            navigation: signupNavigation,
            routeName: screenState.name,
            params: signupNavParams
          });
        }
      }
    : onContinue;
  return (
    <Button
      text={text}
      ref={ref}
      preset="iconPill"
      disabled={disabled}
      style={[
        {
          opacity: disabled ? 0.5 : 1,
          backgroundColor: disabled ? colors.background : colors.black,
          paddingRight: noArrow ? 18 : 8
        },
        style
      ]}
      textStyle={{ color: disabled ? colors.greenYakka : colors.background }}
      onPress={onPress}
      childrenRight={
        noArrow ? undefined : (
          <Ionicons
            name="chevron-forward"
            size={19}
            color={disabled ? colors.greenYakka : colors.background}
            style={{ paddingLeft: 6 }}
          />
        )
      }
    />
  );
};
