import { ActivityIndicator, Image, View } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useQuery } from "react-query";
import { Text } from "../../../components";
import { ContinueButton } from "../../../components/generics/ContinueButton";
import { colors } from "../../../constants";
import { QueryKeys } from "../../../constants/queryKeys";

import usePhotos from "../../../hooks/usePhotos";
import { verifyImageResponseSchema } from "../../../models";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { goFetchLite } from "../../../utils/goFetchLite";

export default function VerifyAccountScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"VerifyAccount">) {
  const { data, isLoading } = useQuery<verifyImageResponseSchema>(
    QueryKeys.VERIFICATION_IMAGES,
    () =>
      goFetchLite("users/image-verification", {
        method: "GET"
      }),
    {
      onError: error =>
        Toast.show({
          type: "error",
          text1: "Failed to get verification image",
          //@ts-ignore
          text2: error?.response?.data?.message
        }),
      refetchOnWindowFocus: false
    }
  );

  const { start } = usePhotos({
    uploadPhoto: async (b64, uri) => {
      // console.log('photo in app', photo);
      if (data) {
        navigation.navigate("CheckPose", {
          posePic: {
            picture: data?.imageUrl,
            gestureiId: data?.id
          },
          photo: { photo: uri, photoB64: b64 }
        });
      }
    },
    allowsGallery: false,
    allowsEditing: false
  });

  return (
    <View className="flex-1 justify-center">
      <View className="items-center w-full space-y-6 px-4 py-12">
        {isLoading ? (
          <ActivityIndicator size={30} color={colors.black} />
        ) : (
          <Image
            resizeMode="contain"
            style={{
              overflow: "hidden",
              width: "76%",
              aspectRatio: 0.75,
              borderRadius: 8
            }}
            source={{ uri: data?.imageUrl }}
            accessibilityLabel={data?.description}
          />
        )}
        <Text size="lg" color={colors.text} style={{ textAlign: "center" }}>
          Copy the gesture in the photo above. We'll compare what you send to
          that photo above to verify you're real!
        </Text>
        <ContinueButton text="Strike a pose" onPress={start} />
      </View>
    </View>
  );
}
