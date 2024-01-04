import { ViewStyle, TextStyle } from "react-native";
import { colors } from "../../../constants";
/**
 * All text will start off looking like this.
 */
const BASE_VIEW: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  paddingTop: 2
};

/**
 * All the variations of text styling within the app.
 *
 * You want to customize these to whatever you need in your app.
 */
export const viewPresets: Record<string, ViewStyle> = {
  /**
   * A smaller piece of secondard information.
   */

  pill: {
    ...BASE_VIEW,
    backgroundColor: colors.black,
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 30,
    minWidth: 100
  } as ViewStyle,

  default: {
    ...BASE_VIEW,
    backgroundColor: colors.greenYakka,
    width: 200,
    height: 48,
    borderRadius: 6
  } as ViewStyle,

  iconPill: {
    ...BASE_VIEW,
    paddingLeft: 18,
    paddingRight: 8,
    height: 40,
    backgroundColor: colors.background,
    borderRadius: 20
  } as ViewStyle,
  small: {
    ...BASE_VIEW,
    backgroundColor: colors.greenYakka,
    paddingHorizontal: 8,
    paddingTop: 0,
    height: 26,
    borderRadius: 6
  } as ViewStyle,

  wide: {
    ...BASE_VIEW,
    backgroundColor: colors.greenYakka,
    width: "100%",
    height: 48,
    borderRadius: 6
  } as ViewStyle,

  /**
   * A button without extras.
   */
  link: {
    flexDirection: "row",
    alignItems: "center"
  } as ViewStyle
};

viewPresets["redPill"] = {
  ...viewPresets.pill,
  backgroundColor: colors.red
};

/**
 * A list of preset names.
 */
export type ButtonPresetNames = keyof typeof viewPresets;
