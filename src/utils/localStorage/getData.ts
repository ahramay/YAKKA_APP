import * as SecureStore from 'expo-secure-store';

/**
 *
 * @param key the key under which a desired string is stored locally
 * @returns a string stored locally
 * @generic passing a specific string or union of strings as a generic will mean that the function will return null unless it matches the string or a string in the union.
 */
export const getData = async <T extends string>(
  key: string
): Promise<T | null> => {
  try {
    const value = await SecureStore.getItemAsync(key);

    function instanceOfT(string: string): string is T {
      if (typeof value === 'string') {
        return value.includes(string);
      } else {
        console.log('Not an instance of generic given to get data');
        return false;
      }
    }

    if (value && instanceOfT(value)) {
      return value as T;
    } else return null;
  } catch (e) {
    return null;
    // error reading value
  }
};
