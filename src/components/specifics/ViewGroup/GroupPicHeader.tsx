import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { useMutation } from "react-query";
import { colors } from "../../../constants";
import { MutationKeys } from "../../../constants/queryKeys";
import usePhotos from "../../../hooks/usePhotos";
import { GroupType } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
import { ImageGalleryModal } from "../../defaults/ImageGalleryModal";
import { Button, Text } from "../../defaults";
import { Rating } from "react-native-ratings";

type ProfilePicsType = {
  group: GroupType;
  isOrganiser: boolean;
  onUploadPhoto: () => void;
};
const BOX_LENGTH = 100;

export const GroupPicHeader = ({
  group,
  isOrganiser,
  onUploadPhoto
}: ProfilePicsType) => {
  const newPhotoMutation = useMutation(
    MutationKeys.NEW_GROUP_PIC,
    (images: string[]) =>
      goFetchLite(`groups/${group.id}/images`, {
        method: "PATCH",
        body: { images }
      }),
    {
      onSuccess: () => {
        onUploadPhoto();
      }
    }
  );

  const isCarousel = useRef(null);
  const [imageViewerVisible, setImageViewerVisible] = useState<boolean>(false);

  const { start } = usePhotos({
    uploadPhoto: async (b64, uri) => {
      newPhotoMutation.mutate([b64]);
    },
    allowsGallery: true,
    allowsEditing: false
  });

  return (
    <>
      {newPhotoMutation.isLoading ? (
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
        <View className="flex-row justify-between -mt-9">
          <TouchableOpacity className="flex-1 justify-center gap-y-2  pt-[72px]">
            <View className="flex-row items-center">
              <Button
                textSize="sm"
                preset="small"
                textColor="white"
                text="MEMBERS"
                className="mr-2"
              />
              <Text style={{ color: colors.greyText }}>
                {/* {group.totalMembers} */} {Math.ceil(Math.random() * 2)}
              </Text>
            </View>
            <Text preset="blue">View Members</Text>
          </TouchableOpacity>
          {/* <ImageGalleryModal
            images={[{ id: 0, images: { uri: group?.profileImage } }]}
            visible={imageViewerVisible}
            setVisible={visible => setImageViewerVisible(visible)}
          /> */}
          <View className="flex-1 items-center">
            <Pressable
              style={styles.pic}
              onPress={() => setImageViewerVisible(true)}
            >
              {group?.profileImage ? (
                <Image
                  source={{ uri: group?.profileImage }}
                  style={{ ...styles.pic, top: 0, position: "absolute" }}
                />
              ) : (
                <View
                  style={{
                    ...styles.pic,
                    top: 0,
                    position: "absolute",
                    borderColor: colors.lightGreyBorder,
                    backgroundColor: colors.background,
                    borderWidth: 2
                  }}
                />
              )}
            </Pressable>
          </View>
          <TouchableOpacity
            // disabled={group.reviews.total === 0}
            className="flex-1 items-end justify-center gap-y-2 pt-[72px]"
            onPress={() => {
              // navigation.navigate("GroupReviewList", { groupId: group.id });
            }}
          >
            <Rating
              // startingValue={group.reviews.average}
              startingValue={5}
              imageSize={16}
              readonly
            />
            {/* <Text preset="blue">{group.reviews.total} reviews</Text> */}
            <Text preset="blue" style={{ top: 2 }}>
              4 reviews
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  pic: {
    height: BOX_LENGTH,
    width: BOX_LENGTH,
    borderRadius: 20,
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center"
  }
});