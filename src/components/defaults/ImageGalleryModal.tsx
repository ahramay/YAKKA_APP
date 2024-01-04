import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import ImageView from "react-native-image-viewing";
import { ImageSource } from "react-native-image-viewing/dist/@types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
import { colors, Layout } from "../../constants";
import { MutationKeys } from "../../constants/queryKeys";
import { useMyProfile } from "../../hooks/ReactQuery/useMyProfile";
import { goFetchLite } from "../../utils/goFetchLite";
import { Text } from "./Text/Text";

interface ImageGalleryModal {
  images: { images: ImageSource; id: number }[];
  imageIndex?: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onDelete?: (imageId: number) => void;
}

export const ImageGalleryModal = ({
  images,
  visible,
  setVisible,
  onDelete,
  imageIndex = 0
}: ImageGalleryModal) => {
  //   const ref = useRef(null);
  //   const {width, height} = Dimensions.get('window');
  const topInset = useSafeAreaInsets().top;

  return (
    <ImageView
      images={images.map(val => val.images)}
      imageIndex={imageIndex}
      visible={visible}
      onRequestClose={() => setVisible(false)}
      HeaderComponent={() => (
        <View
          style={{
            paddingTop: topInset,
            height:
              Layout.window.height > 667
                ? Layout.window.height * 0.18
                : Layout.window.height * 0.125
          }}
          className="flex-1 justify-between items-center flex-row px-4"
        >
          {onDelete ? (
            <TouchableOpacity
              onPress={() => onDelete(images?.[imageIndex]?.id)}
              className="flex-row items-center gap-x-2 pr-2"
            >
              <View className="items-center  bg-white h-8 w-8 justify-center rounded-full">
                <Ionicons name="ios-trash-bin" size={18} color={colors.dim} />
              </View>
              <Text color={colors.background} weight={"700"}>
                Delete
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          <TouchableOpacity
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10
            }}
            className="w-8 h-8 bg-white rounded-full items-center justify-center"
            onPress={() => setVisible(false)}
          >
            <Ionicons name="close" size={20} color={colors.dim} />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};
