import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useMutation, useQueryClient } from "react-query";
import { Text } from "../../../components";
import { ContinueButton } from "../../../components/generics/ContinueButton";
import ImageUpload from "../../../components/generics/ImageUpload";
import { SmartBackButton } from "../../../components/generics/SmartBackButton";
import { MottledGreenBackground } from "../../../components/specifics/LoggedOut/MottledGreenBackground";
import FacebookSignUp from "../../../components/specifics/LoggedOut/SocialSignUp/Facebook";
import { MutationKeys, QueryKeys } from "../../../constants/queryKeys";
import useCustomToast from "../../../hooks/useCustomToast";
import { checkSignupProgressSchema } from "../../../models";
import { photo } from "../../../models/camera";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { getFacebookPhotosResponse } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
import { signupNextNav } from "../../../utils/signupNextNav";

export default function PhotosScreen({
  navigation
}: RootLoggedInScreenProps<"Photos">) {
  const [photos, setPhotos] = useState<photo[]>([]);
  const [facebookBtnDisabled, setFacebookBtnDisabled] = useState(false);
  const [facebookPhotosGot, setFacebookPhotosGot] = useState(false);

  const onPress = async () => {
    console.log("[🥸] - photos here", photos);
    console.log(
      "[😁] - filtered photos here",
      photos
        .filter(p => !p.facebook)
        .map(val => val.photoB64)
        .filter(val => val !== undefined)
    );
    if (
      photos.filter(p => !p.facebook).length === 0 &&
      photos.filter(p => p.facebook).length > 0
    ) {
      signupNextNav({ navigation: navigation, routeName: route.name });
    }
    if (photos.filter(p => !p.facebook).length > 0) {
      await newPhotosMutation.mutateAsync(
        //@ts-ignore, because we filter out the undefined stuff
        photos
          .filter(p => !p.facebook)
          .map(val => val.photoB64)
          .filter(val => val !== undefined)
      );
    }
  };

  const queryClient = useQueryClient();

  const signUpProgress = queryClient.getQueryData<checkSignupProgressSchema>(
    QueryKeys.SIGNUP_PROGRESS
  );

  const { errorToast } = useCustomToast();
  const route = useRoute();
  const newPhotosMutation = useMutation(
    MutationKeys.NEW_PROFILE_PIC,
    (images: string[]) =>
      goFetchLite("users/me/images", {
        method: "POST",
        body: { images }
      }),

    {
      onMutate: variables => {
        console.log("images here", variables);
      },
      onSuccess: () => {
        signupNextNav({ navigation: navigation, routeName: route.name });
      },
      onError: error => {
        Toast.show({
          type: "error",
          //@ts-ignore
          text1: error?.response?.data?.message
        });
      }
    }
  );

  const getFacebookPhotos = async () => {
    try {
      const data = await goFetchLite("users/me/images/facebook", {
        method: "GET"
      });
      setPhotos(
        //@ts-ignore
        data.photos.map((val: any) => ({
          photo: val.image,
          facebook: true,
          id: val.id
        }))
      );
    } catch (err) {
      //@ts-ignore
      errorToast("Error getting photos");
      console.log("🤢 error getting photos here", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (signUpProgress?.authType === "FACEBOOK" && facebookPhotosGot) {
        getFacebookPhotos();
      }
    }, [])
  );

  return (
    <MottledGreenBackground>
      <ScrollView style={{ flex: 1 }}>
        <SafeAreaView style={styles.topContainer}>
          <SmartBackButton />
          <View style={styles.separator} />
          <Text preset="title" style={{ alignSelf: "center" }}>
            Add photos of yourself
          </Text>
          <View style={styles.separator} />
          <Text preset="b" style={{ textAlign: "center" }}>
            Your profile must have a minimum of one photo
          </Text>
          <View style={styles.separator} />
        </SafeAreaView>
        <View style={styles.container}>
          <ImageUpload
            allowGallery={true}
            photos={photos}
            setPhotos={setPhotos}
            numColumns={3}
            maxImages={9}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 15,
            paddingBottom: 30,
            alignItems: "center"
          }}
        >
          <View style={styles.separator} />

          {signUpProgress?.authType === "FACEBOOK" && (
            <FacebookSignUp
              disabled={facebookBtnDisabled}
              getPhotos={() => getFacebookPhotos()}
            />
          )}
          <View style={styles.separator} />
          <ContinueButton disabled={photos.length < 1} onPress={onPress} />
        </View>
      </ScrollView>
    </MottledGreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  topContainer: {
    paddingHorizontal: 15
  },
  separator: {
    height: 20,
    width: "80%"
  }
});
