import {
  StyleProp,
  TextInput as DefaultTextInput,
  TextStyle,
  ViewStyle
} from "react-native";
import { colors } from "../../../constants";
import { TextInputProps } from "./TextInput.props";
import { presets as textInputPresets } from "./TextInput.presets";
import {
  presets as textPresets,
  sizeObj,
  weightObj
} from "../Text/Text.presets";
import { useEffect, useState } from "react";
import { Text } from "../Text/Text";

export function TextInput(props: TextInputProps) {
  const {
    style: styleOverride,
    preset = "base",
    textPreset = "p",
    textColor = colors.text,
    textWeight = "400",
    size = "md",
    invalidStyle = { borderLeftWidth: 2, borderColor: colors.red },
    validStyle = { borderLeftWidth: 0 },
    innerRef,
    onFocus,
    onEndEditing,
    validator,
    invalidText,
    onChangeText,
    value,
    className,
    ...otherProps
  } = props;

  //This is the style derived from the preset, and what will be changed by the validator
  const [style, setStyle] = useState<StyleProp<TextStyle | ViewStyle>>({
    ...textPresets[textPreset],
    ...textInputPresets[preset]
  });
  //Style override is what is declared in the component, and will be place after the preset
  const styles = [style, styleOverride];
  const [string, setString] = useState<string>("");
  const onChange = (text: string) => {
    onChangeText && onChangeText(text);
    //Tracks value of output
    setString(text);
    //Sees if string matches validator
    validator !== undefined &&
      (validator(text)
        ? setStyle({ ...(style as object), ...(validStyle as object) })
        : setStyle({ ...(style as object), ...(invalidStyle as object) }));
  };

  return (
    <>
      {validator !== undefined &&
        validator(string) === false &&
        value &&
        invalidText && <Text size="sm">{invalidText}</Text>}
      <DefaultTextInput
        allowFontScaling={false}
        placeholderTextColor={colors.dim}
        style={[
          {
            color: textColor,
            fontSize: sizeObj[size],
            fontFamily: weightObj[textWeight],
            textAlign: "center"
          },
          styles
        ]}
        onChangeText={onChange}
        onFocus={e => {
          onFocus && onFocus(e);
          setStyle({ ...(style as object) });
        }}
        onEndEditing={e => {
          onEndEditing && onEndEditing(e);
          setStyle({ ...(style as object) });
        }}
        returnKeyType="done"
        ref={innerRef}
        value={value ? value : ""}
        className={className}
        {...otherProps}
      />
    </>
  );
}
