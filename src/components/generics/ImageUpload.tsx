import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
import { colors, Layout } from "../../constants";
import { MutationKeys } from "../../constants/queryKeys";
import usePhotos from "../../hooks/usePhotos";
import { photo } from "../../models/camera";
import { goFetchLite } from "../../utils/goFetchLite";

export default function ImageUpload(props: {
  photos: photo[];
  setPhotos: (photos: photo[]) => void;
  allowGallery?: boolean;
  allowEditing?: boolean;
  maxImages?: number;
  tall?: boolean;
  style?: ViewStyle;
  numColumns?: number;
}) {
  const {
    photos,
    setPhotos,
    allowGallery = true,
    allowEditing = false,
    maxImages = 2,
    tall = false,
    style,
    numColumns = 2
  } = props;
  const MaxImageArray = Array.from(Array(maxImages).keys());
  const [photoList, setPhotoList] = useState<(photo | number)[]>(MaxImageArray);
  const { start } = usePhotos({
    allowsMultipleSelection: true,
    uploadPhoto: async (b64, uri) => {
      console.log("upload photo called");
      // @ts-ignore
      setPhotos(photos => [...photos, { photo: uri, photoB64: b64 }]);
    },
    allowsGallery: allowGallery,
    allowsEditing: allowEditing
  });

  const deleteProfilePicMutation = useMutation(
    MutationKeys.DELETE_PROFILE_PIC,
    (imageId: number) =>
      goFetchLite(`users/me/images/${imageId}`, {
        method: "DELETE"
      }),
    {
      onSuccess: (data, variables) => {
        Toast.show({
          text1: `Image deleted`
        });

        let newPhotos = photos.filter(
          (p, i) => p.facebook && p.id !== variables
        );

        setPhotos(newPhotos);
      },
      onError: (error, context) => console.log(error, context)
    }
  );

  useEffect(() => {
    if (maxImages - photos.length > 0) {
      //Fills out the photo list with numbers
      setPhotoList([
        ...photos,
        ...MaxImageArray.slice(
          maxImages - (maxImages - photos.length),
          maxImages
        )
      ]);
    } else {
      setPhotoList(photos);
    }
  }, [photos]);

  // console.log("final photos", photoList);

  const renderItem = ({
    item,
    index,
    ...rest
  }: ListRenderItemInfo<photo | number>) => {
    if (typeof item === "number") {
      return <AddButton />;
    } else return <Photo item={item} index={index} />;
  };
  const Photo = ({ item, index }: { item: photo; index: number }) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Image
          // resizeMode='contain'
          style={
            tall
              ? styles.imageTall
              : [
                  styles.image,
                  {
                    width: styles.image.width * (2 / numColumns),
                    height: styles.image.height * (2 / numColumns)
                  }
                ]
          }
          source={{ uri: item.photo }}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 5
          }}
          disabled={deleteProfilePicMutation.isLoading}
          onPress={() => {
            let photo = photos[index];
            if (photo.facebook === true) {
              deleteProfilePicMutation.mutate(photo.id);
            } else {
              let newPhotos = photos.filter((p, i) => i !== index);

              setPhotos(newPhotos);
            }
          }}
        >
          <Feather name="x" size={24} color={colors.greenYakka} />
        </TouchableOpacity>
      </View>
    );
  };

  const AddButton = () => (
    <TouchableOpacity
      style={
        tall
          ? styles.buttonTall
          : [
              styles.button,
              {
                width: styles.button.width * (2 / numColumns),
                height: styles.button.height * (2 / numColumns)
              }
            ]
      }
      onPress={start}
    >
      <Feather name="plus" size={70} color={colors.greenYakka} />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={photoList}
      numColumns={numColumns}
      style={{
        width: tall ? undefined : "100%"
        // backgroundColor: numColumns % 2 == 1 ? 'red' : 'blue',
      }}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        width: tall ? undefined : "100%",
        paddingHorizontal: tall ? undefined : 18
      }}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ width: 10, height: 10 }} />}
      columnWrapperStyle={{ justifyContent: "space-between" }}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    width: 156,
    height: 156
  },
  buttonTall: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    width: Layout.window.width * 0.38,
    aspectRatio: 0.75
  },
  image: {
    width: 156,
    height: 156,
    borderRadius: 8
    // marginHorizontal: 20,
  },
  imageTall: {
    aspectRatio: 0.75,
    width: Layout.window.width * 0.38,
    borderRadius: 8
    // marginHorizontal: 20,
  }
});
