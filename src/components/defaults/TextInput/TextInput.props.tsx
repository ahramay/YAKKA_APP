import { RefObject } from "react";
import {
  StyleProp,
  TextInput,
  TextInputProps as TextInputProperties,
  TextStyle,
  ViewStyle
} from "react-native";
import { sizeObj, TextPresets, weightObj } from "../Text/Text.presets";
import { TextInputPresets } from "./TextInput.presets";
export interface TextInputProps extends TextInputProperties {
  textColor?: string;
  textWeight?: keyof typeof weightObj;
  size?: keyof typeof sizeObj;

  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<TextStyle | ViewStyle>;
  /**
   * One of the different types of text presets.
   */
  preset?: TextInputPresets;
  /**
   * One of the different types of text presets.
   */
  textPreset?: TextPresets;
  /**
   * Use to replace ref
   */
  innerRef?: RefObject<TextInput>;
  /**
   * An optional function to determine if the text is of valid format.
   */
  validator?: (value: string) => boolean;
  /**
   * An optional style prop on the text input for validator = false
   */
  invalidText?: string;
  /**
   * An optional style prop on the text input for validator = false
   */
  invalidStyle?: StyleProp<TextStyle | ViewStyle>;
  /**
   * An optional style prop on the text input for validator = true.
   */
  validStyle?: StyleProp<TextStyle | ViewStyle>;
}
