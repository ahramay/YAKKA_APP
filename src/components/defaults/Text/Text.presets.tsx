import { TextStyle } from "react-native";
import { colors } from "../../../constants";
import { scale } from "react-native-size-matters";
export const weightObj = {
  "100": "Roboto_100Thin",
  "100_italic": "Roboto_100Thin_Italic",
  "300": "Roboto_300Light",
  "300_italic": "Roboto_300Light_Italic",
  "400": "Roboto_400Regular",
  "400_italic": "Roboto_400Regular_Italic",
  "500": "Roboto_500Medium",
  "500_italic": "Roboto_500Medium_Italic",
  "700": "Roboto_700Bold",
  "700_italic": "Roboto_700Bold_Italic",
  "900": "Roboto_900Black",
  "900_italic": "Roboto_900Black_Italic"
};

// const scale = (num: number) => num;

export const sizeObj = {
  xs: scale(8),
  sm: scale(11),
  sm2: scale(12),
  md: scale(13),
  lg: scale(15),
  xl: scale(18),
  "2xl": scale(22),
  "3xl": scale(32)
};

/**
 *
 * You want to customize these to whatever you need in your app.
 */
export const presets = {
  /**
   * A smaller piece of secondary information.
   */

  p: {
    fontSize: sizeObj["md"],
    fontFamily: weightObj["400"]
  } as TextStyle,

  b: {
    fontSize: sizeObj["md"],
    fontFamily: weightObj["500"]
  } as TextStyle,

  blg: {
    fontSize: sizeObj["lg"],
    fontFamily: weightObj["500"]
  },

  strong: {
    fontSize: sizeObj["md"],
    fontFamily: weightObj["700"]
  } as TextStyle,

  title: {
    fontSize: sizeObj["3xl"],
    textAlign: "center",
    fontFamily: weightObj["700"]
  } as TextStyle,

  blue: {
    fontSize: sizeObj["md"],
    color: colors.blueText
  } as TextStyle,

  /**
   * Used in chat bubbles, for headers in the coloured lists, and content text in the sign up
   */
  lg: {
    fontSize: 17
  } as TextStyle,
  /**
   * A bold version of the default text.
   */
  xl: { fontSize: 20 } as TextStyle,

  "2xl": { fontSize: 34 } as TextStyle

  // p_thin: {
  //   ...BASE,
  //   fontFamily: 'Roboto_300Light',
  //   color: colors.text,
  // } as TextStyle,

  // b: {
  //   ...BASE,
  //   fontFamily: 'Roboto_500Medium',
  //   color: colors.text,
  // } as TextStyle,

  // b_big: {
  //   ...BASE,
  //   fontFamily: 'Roboto_500Medium',
  //   color: colors.text,
  //   fontSize: 18,
  // } as TextStyle,

  // strong: {
  //   ...BASE,
  //   fontFamily: 'Roboto_700Bold',
  //   fontSize: 15,
  // } as TextStyle,

  // title: {
  //   ...BASE,
  //   fontSize: 34,
  //   lineHeight: 40,
  //   width: '80%',
  //   fontFamily: 'Roboto_900Black',
  //   textAlign: 'center',
  //   color: colors.text,
  // } as TextStyle,
  // /**
  //  * Large headers.
  //  */
  // h1: {
  //   ...BASE,
  //   fontSize: 20,
  //   fontFamily: 'Roboto_700Bold',
  //   color: colors.primary,
  // } as TextStyle,

  // h2: {
  //   ...BASE,
  //   fontSize: 18,
  //   fontFamily: 'Roboto_500Medium',
  //   color: colors.text,
  // } as TextStyle,

  // /**
  //  * For small buttons
  //  */
  // btn_small: {
  //   ...BASEBUTTON,
  //   fontSize: 16,
  //   // fontWeight: 'bold',
  //   lineHeight: 16.5,
  // } as TextStyle,
  // /**
  //  * Default button
  //  */
  // btn: {
  //   ...BASEBUTTON,
  // } as TextStyle,
  // /**
  //  * Button that matches default non-button text size
  //  */

  // btn_regularText: {
  //   ...BASEBUTTON,
  //   ...BASE,
  // } as TextStyle,
  // /**
  //  * For big buttons
  //  */
  // btn_big: {
  //   ...BASEBUTTON,
  //   fontSize: 26,
  // } as TextStyle,
  // /**
  //  * For primary
  //  */
  // btn_thin: {
  //   ...BASEBUTTON,
  //   fontFamily: 'Roboto_300Light',
  // } as TextStyle,

  // /**
  //  * Date and items labels that appear above other components.
  //  */
  // small: {...BASE, fontSize: 12, color: colors.dim} as TextStyle,

  // small_white: {
  //   ...BASE,
  //   fontSize: 15,
  //   color: colors.background,
  //   fontFamily: 'Roboto_300Light',
  // } as TextStyle,

  // xs_white: {
  //   ...BASE,
  //   fontSize: 14,
  //   color: colors.background,
  //   fontFamily: 'Roboto_300Light',
  // } as TextStyle,

  // small_b: {
  //   ...BASE,
  //   fontSize: 12,
  //   fontFamily: 'Roboto_500Medium',
  // } as TextStyle,

  // /**
  //  * label with no color
  //  */
  // em: {
  //   ...BASE,
  //   fontFamily: 'Roboto_700SemiBold',
  //   color: colors.dim,
  // } as TextStyle,
  /**
   * For big labels.
   */

  /**
   * For checkbox labels.
   */
};

/**
 * A list of preset names.
 */
export type TextPresets = keyof typeof presets;
