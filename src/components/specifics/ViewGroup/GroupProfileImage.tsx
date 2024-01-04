import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { colors } from "../../../constants";
import usePhotos from "../../../hooks/usePhotos";
import { ImageGalleryModal } from "../../defaults/ImageGalleryModal";
import { photo } from "../../../models";
import { Ionicons } from "@expo/vector-icons";
import { ClassNames } from "../../../constants/ClassNames";

type groupProfileInterface = {
  base64: (arg: string) => void;
};

const BOX_LENGTH = 100;

export const GroupProfileImageUploader = ({
  base64
}: groupProfileInterface) => {
  const basePhoto: photo | null = {
    photo: undefined,
    photoB64: undefined
  };

  const [photo, setPhoto] = useState<photo | null>(basePhoto);
  const [imageViewerVisible, setImageViewerVisible] = useState<boolean>(false);

  const { start } = usePhotos({
    uploadPhoto: async (b64, uri) => {
      setPhoto({
        photo: uri,
        photoB64: b64
      });
      base64(b64);
    },
    allowsGallery: true,
    allowsEditing: false
  });

  useEffect(() => {
    setPhoto(basePhoto);
  }, []);

  return (
    <>
      {basePhoto.photo ? (
        <View
          style={[
            styles.pic,
            {
              height: BOX_LENGTH + 66,
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: 18
            }
          ]}
        >
          <ActivityIndicator size={30} color={colors.greenYakka} />
        </View>
      ) : (
        <>
          <ImageGalleryModal
            images={[
              {
                images: { uri: photo?.photo },
                id: 0
              }
            ]}
            
            visible={imageViewerVisible}
            setVisible={visible => setImageViewerVisible(visible)}
          />
          <Pressable
            style={[
              styles.pic,
              { backgroundColor: colors.dim, marginBottom: 40, top: -20 }
            ]}
            className="items-center justify-center"
          >
            <>
              {photo?.photo && (
                <Image
                  source={{ uri: photo?.photo }}
                  className={`h-28 ${ClassNames.ROUND}`}
                  style={{marginTop: 20, position:"absolute"}}
                />
              )}
              <TouchableOpacity onPress={start} className="rounded-full">
                <Ionicons
                  name="camera-outline"
                  size={30}
                  color={colors.background}
                />
              </TouchableOpacity>
            </>
          </Pressable>
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
