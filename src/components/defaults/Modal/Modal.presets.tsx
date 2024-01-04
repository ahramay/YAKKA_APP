import { ModalProps } from "@euanmorgan/react-native-modal";
import { ViewStyle } from "react-native";
import { colors, Layout } from "../../../constants";

const BASE_MODAL: Partial<ModalProps> = {
  animationIn: "bounceInUp",
  animationInTiming: 650,
  animationOut: "slideOutDown",
  animationOutTiming: 650,
  avoidKeyboard: true,
  statusBarTranslucent: true
};

const BASE_VIEW: ViewStyle = {
  padding: 15,
  alignItems: "center"
};

export const modalPresets: Record<string, Partial<ModalProps>> = {
  bounceSquare: {
    ...BASE_MODAL
  } as Partial<ModalProps>,

  bounceBottom: {
    ...BASE_MODAL,
    style: { paddingTop: 50 }
  } as Partial<ModalProps>
};

export const boxPresets: Record<string, ViewStyle> = {
  /**
   * A smaller piece of secondard information.
   */
  bounceSquare: {
    ...BASE_VIEW,
    width: "100%",
    backgroundColor: colors.background,
    height: "50%"
  } as ViewStyle,

  bounceBottom: {
    ...BASE_VIEW,
    width: "100%",
    backgroundColor: colors.background,
    height: Layout.window.height
  } as ViewStyle
};

export type ModalPresetNames = keyof typeof modalPresets;
export type ModalBoxPresetNames = keyof typeof boxPresets;
