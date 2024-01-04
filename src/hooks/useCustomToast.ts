import Toast from "react-native-toast-message";

// Returns two functions for showing the 2 types of toasts

export default function useCustomToast() {
  const errorToastMessage = (
    message: string,
    subMessage?: string,
    duration = 5000
  ) => {
    Toast.show({
      type: "error",
      text1: message,
      text2: subMessage,
      visibilityTime: duration
    });
  };

  const toastMessage = (
    message: string,
    subMessage?: string,
    duration = 5000
  ) => {
    Toast.show({
      type: "success",
      text1: message,
      text2: subMessage,
      visibilityTime: duration
    });
  };

  return {
    errorToast: errorToastMessage,
    toast: toastMessage
  };
}
