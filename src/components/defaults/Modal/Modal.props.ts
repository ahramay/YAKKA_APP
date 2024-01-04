import { ModalProps as DefaultModalProps } from "@euanmorgan/react-native-modal";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { TextPresets as TextPresetNames } from "../Text/Text.presets";
import { ModalPresetNames } from "./Modal.presets";
export interface ModalProps extends Partial<DefaultModalProps> {
  /**
   * Whether the modal is visible or not
   */
  isVisible: boolean;
  /**
   * Removes view from modal, so you can create your own custom modal without using presets
   */
  noWrapper?: boolean;
  /**
   * Function that set's the modal to be visible or not
   */
  setIsVisible: (trueFalse: boolean) => void;
  /**
   * Whether the modal is dismissed on backdrop press
   */
  hideOnBackdropPress?: boolean;
  /**
   * Ref of modal
   */
  ref?: any;
  /**
   * The title to display at the top of the modal.
   */
  title?: string;
  /**
   * An optional style override useful for padding & margin.
   */
  wrapperStyle?: StyleProp<ViewStyle>;
  /**
   * An optional style override for the title text.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * Choose a different one of the text presets for the title.
   */
  titleTextPreset?: TextPresetNames;
  /**
   * One of the different types of presets for the modal.
   */
  preset?: ModalPresetNames;
  /**
   * Have a cross appear in the top right.
   */
  cross?: boolean;
}
