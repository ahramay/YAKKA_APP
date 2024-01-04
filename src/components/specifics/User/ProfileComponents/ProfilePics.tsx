import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useMutation } from "react-query";
import { colors } from "../../../../constants";
import { MutationKeys } from "../../../../constants/queryKeys";
import { useMyProfile } from "../../../../hooks/ReactQuery/useMyProfile";
import { useProfile } from "../../../../hooks/ReactQuery/useProfile";
import usePhotos from "../../../../hooks/usePhotos";
import { GetProfileResponse } from "../../../../types/types";
import { goFetchLite } from "../../../../utils/goFetchLite";
import { Text } from "../../../defaults";
import { ImageGalleryModal } from "../../../defaults/ImageGalleryModal";
import Toast from "react-native-toast-message";

type ProfilePicsType = {
  profile: GetProfileResponse;
  isUser: boolean;
};
const SLIDER_WIDTH = Dimensions.get("window").width;
const BOX_LENGTH = 100;

export const ProfilePics = ({ profile, isUser }: ProfilePicsType) => {
  const { refetch: refetchUser } = isUser
    ? useMyProfile()
    : useProfile(profile.id);

  const newPhotoMutation = useMutation(
    MutationKeys.NEW_PROFILE_PIC,
    (images: string[]) =>
      goFetchLite("users/me/images", {
        method: "POST",
        body: { images }
      }),
    {
      onSuccess: () => {
        refetchUser();
      }
    }
  );

  const isCarousel = useRef(null);
  const [imgIndex, setImgIndex] = useState<number>(0);
  const [imageViewerVisible, setImageViewerVisible] = useState<boolean>(false);

  const myProfile = useMyProfile();

  const deletePhotoMutation = useMutation(
    MutationKeys.DELETE_PROFILE_PIC,
    (imageId: number) =>
      goFetchLite(`users/me/images/${imageId}`, {
        method: "DELETE"
      }),
    {
      onSuccess: (data, variables) => {
        //@ts-ignore
        setImageViewerVisible(false);
        Toast.show({
          text1: `Image deleted`
        });
        myProfile.refetch();
      }
    }
  );

  const { start } = usePhotos({
    uploadPhoto: async (b64, uri) => {
      newPhotoMutation.mutate([b64]);
    },
    allowsGallery: true,
    allowsEditing: false
  });

  const CarouselCardItem = ({ item, index }: any) => {
    return (
      <Pressable
        style={styles.pic}
        key={index}
        onPress={() => index === imgIndex && setImageViewerVisible(true)}
      >
        <Image source={{ uri: item.url }} style={styles.pic} />
      </Pressable>
    );
  };

  console.log("imagePro",profile.images)

  return (
    <>
      {newPhotoMutation.isLoading || deletePhotoMutation.isLoading ? (
        <View
          style={[
            styles.pic,
            {
              height: BOX_LENGTH + 66,
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: 15
            }
          ]}
        >
          <ActivityIndicator size={30} color={colors.greenYakka} />
        </View>
      ) : (
        <>
          <ImageGalleryModal
            images={profile?.images.map(val => ({
              images: { uri: val.url },
              id: val.id
            }))}
            imageIndex={imgIndex}
            onDelete={isUser ? deletePhotoMutation.mutate : undefined}
            visible={imageViewerVisible}
            setVisible={visible => setImageViewerVisible(visible)}
          />
          <Carousel
            ref={isCarousel}
            data={profile.images}
            vertical={false}
            renderItem={CarouselCardItem}
            sliderWidth={SLIDER_WIDTH}
            activeSlideAlignment="center"
            inactiveSlideScale={0.5}
            inactiveSlideShift={30}
            onScrollIndexChanged={index => setImgIndex(index)}
            itemWidth={BOX_LENGTH + 20}
          />
          {profile.images.length === 0 && (
            <Pressable
              style={[
                styles.pic,
                { backgroundColor: colors.dim, marginBottom: 40, top: -20 }
              ]}
            ></Pressable>
          )}
          {profile.images.length > 1 ? (
            <Pagination
              containerStyle={{ top: -20 }}
              activeDotIndex={imgIndex}
              dotStyle={{ height: 6, width: 6 }}
              inactiveDotScale={1}
              dotContainerStyle={{ marginHorizontal: 3 }}
              dotsLength={profile.images.length}
            />
          ) : (
            // if only one image, pagination disapears.
            // this will keep the layout consistent in that instance.
            <View style={{ height: 66 }}></View>
          )}

          {isUser && (
            <TouchableOpacity
              style={{ position: "absolute", right: 24, top: 105 }}
              onPress={() => {
                start();
              }}
            >
              <Text preset="blue">Add Photos</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  pic: {
    height: BOX_LENGTH,
    width: BOX_LENGTH,
    borderRadius: 20,
    marginHorizontal: 5
  }
});
