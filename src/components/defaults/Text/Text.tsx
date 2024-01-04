import { Text as DefaultText } from "react-native";
import { colors } from "../../../constants";
import {
  StyleProp,
  TextProps as TextProperties,
  TextStyle
} from "react-native";
import { sizeObj, presets, TextPresets, weightObj } from "./Text.presets";

export interface BlankTextProps extends TextProperties {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<TextStyle>;
  /**
   * Colour value
   */
  color?: string;
  /**
   * Font weight, 200, 600, 800 and 1000+ not included
   */
  weight?: keyof typeof weightObj;

  /**
   * Font size accepted values: xs, sm, md, lh, xl,3xl
   */
  size?: keyof typeof sizeObj;
  /**
   * One of the different types of text presets, defaults to p
   */
}

export interface PresetTextProps {
  preset?: TextPresets;
}

interface TextProps extends PresetTextProps, BlankTextProps {}

export function Text(props: TextProps) {
  const {
    style: styleOverride,
    preset,
    className,
    weight = "400",
    size = "md",
    color = colors.text,
    ...otherProps
  } = props;
  const chosenPreset = preset ? presets[preset] : undefined;
  const style = preset ? [chosenPreset, styleOverride] : styleOverride;

  return (
    <DefaultText
      allowFontScaling={false}
      style={[
        {
          color,
          fontSize: sizeObj[size],
          fontFamily: weightObj[weight]
        },
        style
      ]}
      className={className}
      {...otherProps}
    />
  );
}
