import { MutationCache, QueryCache, QueryClient } from "react-query";
// import NetInfo from "@react-native-community/netinfo";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const defaultErrorHandler = (error: any) => {
  if (error?.response?.status === 400 && error?.response?.data?.errors) {
    const fieldErrors = Object.keys(error.response.data.errors);

    // toast error for each field
    fieldErrors.forEach((field: any) => {
      Toast.show({
        type: "error",
        text1:
          error.response.data.errors[field][0].message || "Something went wrong"
      });
    });
  } else {
    Toast.show({
      type: "error",
      text1: error?.response?.data?.message || "Something went wrong"
    });
  }
};

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: defaultErrorHandler
  }),
  queryCache: new QueryCache({
    onError: (error, query) => {
      // 🎉 only show error toasts if we already have data in the cache
      // which indicates a failed background update
      if (query.state.data !== undefined) {
        // toast.error(`Something went wrong: ${error.message}`);
        console.log("Error in react-query", error);
      }
    }
  })
});

// Refetch on reconnect to network

// onlineManager.setEventListener(setOnline => {
//   return NetInfo.addEventListener(state => {
//     setOnline(state.isConnected || false);
//   });
// });

// Refetch on app focus
