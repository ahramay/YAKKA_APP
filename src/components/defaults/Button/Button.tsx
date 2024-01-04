import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "../Text/Text";
import { viewPresets } from "./Button.presets";
import { ButtonProps } from "./Button.props";
import {
  presets as textPresets,
  TextPresets as TextPresetNames
} from "../Text/Text.presets";
import { colors } from "../../../constants";
/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Button(props: ButtonProps) {
  // grab the props
  const {
    ref,
    preset = "default",
    text,
    textPreset,
    textWeight = "500",
    textColor = colors.background,
    textSize = "md",
    style: styleOverride,
    textStyle: textStyleOverride,
    children,
    childrenLeft,
    ignoreDisabledOpacity = false,
    childrenRight,
    disabled,
    className,
    ...rest
  } = props;

  const viewStyle = viewPresets[preset] || viewPresets.primary;
  const viewStyles = [viewStyle, styleOverride];

  const content = children || (
    <Text
      size={textSize}
      weight={textPreset ? undefined : textWeight}
      color={textColor}
      preset={textPreset}
      style={textStyleOverride}
    >
      {text}
    </Text>
  );

  return (
    <TouchableOpacity
      style={[
        {
          opacity: disabled ? (ignoreDisabledOpacity ? 1 : 0.6) : 1
        },
        viewStyles
      ]}
      ref={ref}
      className={className}
      disabled={disabled}
      {...rest}
    >
      {childrenLeft}
      {content}
      {childrenRight}
    </TouchableOpacity>
  );
}
