import {
  StyleProp,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle
} from "react-native";
import { ButtonPresetNames } from "./Button.presets";
import { TextPresets as TextPresetNames } from "../Text/Text.presets";
import { colors } from "../../../constants";
import { sizeObj, weightObj } from "../Text/Text.presets";
export interface ButtonProps extends TouchableOpacityProps {
  ref?: any;
  /**
   * The text to display
   */
  text?: string;
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * An optional style override useful for the button text.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * One of the different types of button box style presets.
   */
  preset?: ButtonPresetNames;
  /**
   * Use to stop button from getting translucent when disabled
   */
  ignoreDisabledOpacity?: boolean;
  /**
   * One of the different types of text presets.
   */
  textPreset?: TextPresetNames;
  /**
   * Colour of the button text.
   */
  textColor?: string;

  textSize?: keyof typeof sizeObj;

  textWeight?: keyof typeof weightObj;

  /**
   * Place a component to the right of text inside the button (useful for icons).
   */
  childrenRight?: React.ReactNode;
  /**
   * Place a component to the left of text inside the button (useful for icons).
   */
  childrenLeft?: React.ReactNode;
}
