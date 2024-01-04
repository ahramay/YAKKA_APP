import Toast from 'react-native-toast-message';

export const parseJSON = (item: string | null | undefined, errMsg: string) => {
  if (item) {
    return JSON.parse(item);
  } else {
    Toast.show({
      type: 'Error parsing data',
      text1: errMsg,
      visibilityTime: 5000,
      position: 'bottom',
    });
  }
};
