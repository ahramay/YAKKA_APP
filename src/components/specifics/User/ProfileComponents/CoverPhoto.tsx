import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, TouchableHighlight } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useMutation } from "react-query";
import { colors, Layout } from "../../../../constants";
import { ClassNames } from "../../../../constants/ClassNames";
import { MutationKeys } from "../../../../constants/queryKeys";
import { useMyProfile } from "../../../../hooks/ReactQuery/useMyProfile";
import { useProfile } from "../../../../hooks/ReactQuery/useProfile";
import usePhotos from "../../../../hooks/usePhotos";
import { photo } from "../../../../models";
import { GetProfileResponse } from "../../../../types/types";
import { goFetchLite } from "../../../../utils/goFetchLite";
import { ImageGalleryModal } from "../../../defaults/ImageGalleryModal";

type coverPhotoProps = { isUser: boolean; profile: GetProfileResponse };

export const CoverPhoto = ({ isUser, profile }: coverPhotoProps) => {
  const basePhoto: photo | null = profile?.coverPhoto
    ? {
        photo: profile?.coverPhoto,
        photoB64: undefined
      }
    : null;

  const [photo, setPhoto] = useState<photo | null>(basePhoto);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  useEffect(() => {
    setPhoto(basePhoto);
  }, [profile]);
  const { start } = usePhotos({
    uploadPhoto: async (b64, uri) => {
      setPhoto({ photo: uri, photoB64: b64 });
      newPhotoMutation.mutate(b64);
    },
    aspect: [Layout.window.width, 192],
    allowsGallery: true,
    allowsEditing: true
  });
  const { refetch: refetchUser } = isUser
    ? useMyProfile()
    : useProfile(profile.id);

  const newPhotoMutation = useMutation(
    MutationKeys.COVER_PHOTO,
    (b64: string) =>
      goFetchLite("users/me/images/cover", {
        method: "POST",
        body: { base64: b64 }
      }),
    {
      onSuccess: () => {
        Toast.show({ text1: "Cover Photo changed" });
        refetchUser();
      }
    }
  );

  const deletePhotoMutation = useMutation(
    MutationKeys.DELETE_COVER_PHOTO,
    () =>
      goFetchLite("users/me/images/cover", {
        method: "DELETE"
      }),
    {
      onSuccess: () => {
        Toast.show({ text1: "Cover Photo deleted" });
        setImageViewerVisible(false);
        refetchUser();
      },
      onError: error => {
        Toast.show({
          text1: "Cover Photo failed to be deleted",
          type: "error",
          //@ts-ignore
          text2: error?.response?.data?.message
        });
        setImageViewerVisible(false);
        refetchUser();
      }
    }
  );

  return (
    <>
      {photo && (
        <ImageGalleryModal
          images={[
            {
              images: { uri: photo.photo },
              id: 0
            }
          ]}
          visible={imageViewerVisible}
          onDelete={isUser ? () => deletePhotoMutation.mutate() : undefined}
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
          {photo && (
            <Image
            source={{ uri: photo?.photo }}
            className={`h-48 ${ClassNames.ROUND} absolute`}
          />
          )}
          {isUser && (
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
          )}
        </>
      </TouchableHighlight>
    </>
  );
};
