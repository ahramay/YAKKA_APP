import {TextStyle, ViewStyle} from 'react-native';
import {colors} from '../../../constants';

// Poppins_100Thin,
// Poppins_200ExtraLight,
// Poppins_300Light,
// Poppins_400Regular,
// Poppins_500Medium,
// Poppins_600SemiBold,
// Poppins_700Bold,
// Poppins_800ExtraBold,
// Poppins_900Black,
/**
 * All inputs will start off looking like this.
 */
const BASE: TextStyle | ViewStyle = {
  width: '100%',
  height: 40,
  alignSelf: 'center',
  textAlign: 'left',
  paddingHorizontal: 10,
  borderRadius: 8,
};

/**
 * All the variations of text input styling within the app.
 *
 * You want to customize these to whatever you need in your app.
 */
export const presets = {
  /**
   * The default text styles.
   */
  base: {...BASE, backgroundColor: colors.background},
  /**
   * A smaller piece of secondary information.
   */
  baseSecondary: {
    ...BASE,
    fontSize: 13.5,
    top: 0.75,
    backgroundColor: colors.background,
  } as TextStyle | ViewStyle,
  /**
   * A bold version of the default text.
   */
  baseThin: {
    ...BASE,
    fontFamily: 'Roboto_500Medium',
    backgroundColor: colors.background,
  } as TextStyle | ViewStyle,

  baseBold: {
    ...BASE,
    fontFamily: 'Roboto_700Bold',
    backgroundColor: colors.background,
  } as TextStyle | ViewStyle,
  withIcon: {
    fontFamily: 'Roboto_500Medium',
    flex: 1,
    textAlign: 'left',
    color: colors.text,
  } as TextStyle | ViewStyle,
};

/**
 * A list of preset names.
 */
export type TextInputPresets = keyof typeof presets;
