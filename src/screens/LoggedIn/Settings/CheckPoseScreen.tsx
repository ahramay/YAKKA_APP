import { useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
import { Text } from "../../../components";
import { ContinueButton } from "../../../components/generics/ContinueButton";
import ImageUpload from "../../../components/generics/ImageUpload";
import { colors, Layout } from "../../../constants";
import { MutationKeys } from "../../../constants/queryKeys";
import { useMyProfile } from "../../../hooks/ReactQuery/useMyProfile";
import { verifyImageInput } from "../../../models";
import { photo } from "../../../models/camera";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { goFetchLite } from "../../../utils/goFetchLite";

export default function CheckPoseScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"CheckPose">) {
  const [photos, setPhotos] = useState<photo[]>([route.params.photo]);
  const poseGot = route.params.posePic;
  const { refetch } = useMyProfile();

  const verificationMutation = useMutation(
    MutationKeys.VERIFICATION_IMAGE,
    ({ base64, gestureId }: verifyImageInput) =>
      goFetchLite("users/image-verification", {
        method: "POST",
        body: { base64, gestureId }
      }),
    {
      onSuccess(data, variables, context) {
        refetch();
        Toast.show({
          text1: "Image uploaded successfully!",
          text2: "A real human will verify you as soon as we can"
        });
        navigation.navigate("HomeDrawer", {
          screen: "Settings"
        });
      },
      onError: (error: any) => {
        navigation.navigate("HomeDrawer", {
          screen: "Settings"
        });
        Toast.show({
          type: "error",
          text1: "Failed to upload verification image",
          text2: error?.response?.data?.message
        });
      }
    }
  );

  const uploadPhoto = async () => {
    if (photos[0].photoB64) {
      await verificationMutation.mutateAsync({
        base64: photos[0].photoB64,
        gestureId: route.params.posePic.gestureiId
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 gap-y-6 justify-center -top-6 items-center pt-6 p-4">
      {verificationMutation.isLoading ? (
        <ActivityIndicator size={30} color={colors.black} />
      ) : (
        <>
          <Text weight="700" size="xl" style={{ textAlign: "center" }}>
            Happy with your photo?
          </Text>
          <View className={`flex-row justify-around items-center px-4`}>
            <ImageUpload
              tall
              maxImages={1}
              photos={photos}
              allowGallery={false}
              setPhotos={setPhotos}
            />
            <Image
              resizeMode="contain"
              style={{
                overflow: "hidden",
                aspectRatio: 0.75,
                borderRadius: 8,
                width: Layout.window.width * 0.38
              }}
              source={{ uri: poseGot.picture }}
            />
          </View>
          <Text size="xl" weight="700">
            Remember, to verify successfully
          </Text>
          <Text size="lg">1. You must copying the pose exactly</Text>
          <Text size="lg">2. Your face must be clearly visible</Text>
          <ContinueButton
            disabled={photos.length < 1}
            text={"Verify my profile!"}
            noArrow
            onPress={uploadPhoto}
          />
        </>
      )}
    </SafeAreaView>
  );
}
