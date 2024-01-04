import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, TouchableHighlight } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors, Layout } from "../../../constants";
import { ClassNames } from "../../../constants/ClassNames";
import usePhotos from "../../../hooks/usePhotos";
import { photo } from "../../../models";
import { ImageGalleryModal } from "../../defaults/ImageGalleryModal";

interface groupCoverImage {
    base64: (arg: string) => void
  
  }
export const GroupCoverImage = ({ base64 } : groupCoverImage ) => {
  const basePhoto: photo | null = {
        photo: undefined,
        photoB64: undefined
      }

  const [photo, setPhoto] = useState<photo | null>(basePhoto);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  useEffect(() => {
    setPhoto(basePhoto);
  }, []);
  
  const { start } = usePhotos({
    uploadPhoto: async (b64, uri) => {
      setPhoto({ photo: uri, photoB64: b64 });
      base64(b64)
    //   console.log("BASE 64 =>", b64)
    },
    aspect: [Layout.window.width, 192],
    allowsGallery: true,
    allowsEditing: true
  });
  return (
    <>
      {photo?.photo && (
        <ImageGalleryModal
          images={[
            {
              images: { uri: photo.photo },
              id: 0
            }
          ]}
          visible={imageViewerVisible}
          setVisible={visible => setImageViewerVisible(visible)}
        />
      )}
      <TouchableHighlight
        style={{ elevation: 0 }}
        underlayColor={" bg-[#1A4356]"}
        disabled={photo === undefined}
        onPress={() => photo && setImageViewerVisible(!imageViewerVisible)}
        className={`w-full h-48 ${ClassNames.OVERLAP} justify-center -mb-4 items-center pt-[90px] bg-[#1A4391]`}
      >
        <>
          {photo?.photo && (
            <Image
            source={{ uri: photo?.photo }}
            className={`h-48 ${ClassNames.ROUND} absolute`}
          />
          )}
            <TouchableOpacity
              onPress={start}
              className="p-1.5 rounded-full  bg-[#00000080]"
            >
              <Ionicons
                name="camera-outline"
                size={30}
                color={colors.background}
              />
            </TouchableOpacity>
        </>
      </TouchableHighlight>
    </>
  );
};