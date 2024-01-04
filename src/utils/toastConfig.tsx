import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import Toast, { BaseToast, BaseToastProps } from "react-native-toast-message";

const toastConfig = {
  success: ({ text1, text2, ...rest }: BaseToastProps) => (
    <BaseToast
      {...rest}
      style={{
        backgroundColor: "rgba(0,0,0,0.85),",
        borderRadius: 15,
        paddingVertical: 10,
        paddingRight: 15,
        paddingLeft: 0,
        height: "auto",
        minHeight: 60,
        borderLeftWidth: 0,
        zIndex: 1000,
        maxWidth: "90%"
      }}
      contentContainerStyle={{
        justifyContent: "center"
      }}
      renderLeadingIcon={() => (
        <MaterialCommunityIcons
          name="check-circle-outline"
          color={"rgba(255,255,255,0.8)"}
          style={{ alignSelf: "center", marginLeft: 15 }}
          size={22}
        />
      )}
      text1Props={{
        numberOfLines: 250,
        style: {
          fontSize: 14,
          lineHeight: 20,
          color: "rgba(255,255,255,0.8)"
          // fontFamily: 'Poppins_600SemiBold',
        }
      }}
      text2Props={{
        numberOfLines: 250,
        style: {
          fontSize: 12,
          lineHeight: 13.5,
          color: "rgba(255,255,255,0.8)"
          // fontFamily: 'Poppins_400Regular',
        }
      }}
      text1={text1}
      text2={text2}
      renderTrailingIcon={() => (
        <TouchableOpacity
          onPress={() => Toast.hide()}
          style={{ alignSelf: "center" }}
        >
          <MaterialCommunityIcons
            name="close"
            color={"rgba(255,255,255,0.8)"}
            size={18}
          />
        </TouchableOpacity>
      )}
    />
  ),
  error: ({ text1, text2, ...rest }: BaseToastProps) => (
    <BaseToast
      {...rest}
      style={{
        backgroundColor: "rgba(0,0,0,0.85),",
        borderRadius: 15,
        paddingVertical: 10,
        paddingRight: 15,
        paddingLeft: 0,
        height: "auto",
        zIndex: 1000,
        minHeight: 60,
        borderLeftWidth: 0,
        maxWidth: "90%"
      }}
      contentContainerStyle={{
        justifyContent: "center"
      }}
      renderLeadingIcon={() => (
        <MaterialCommunityIcons
          name="alert-circle-outline"
          color={"rgba(255,255,255,0.8)"}
          style={{ alignSelf: "center", marginLeft: 15 }}
          size={22}
        />
      )}
      text1Props={{
        numberOfLines: 250,
        style: {
          fontSize: 14,
          lineHeight: 20,
          color: "rgba(255,255,255,0.8)",
          fontFamily: "Roboto_500Medium"
        }
      }}
      text2Props={{
        numberOfLines: 250,
        style: {
          fontSize: 12,
          lineHeight: 13.5,
          color: "rgba(255,255,255,0.8)",
          fontFamily: "Roboto_400Regular"
        }
      }}
      text1={text1}
      text2={text2}
      renderTrailingIcon={() => (
        <TouchableOpacity
          onPress={() => Toast.hide()}
          style={{ alignSelf: "center" }}
        >
          <MaterialCommunityIcons
            name="close"
            color={"rgba(255,255,255,0.8)"}
            size={18}
          />
        </TouchableOpacity>
      )}
    />
  )
};
export default toastConfig;
