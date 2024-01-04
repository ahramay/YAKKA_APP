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
import { GroupType } from "../../../../types/types";
import { goFetchLite } from "../../../../utils/goFetchLite";
import { ImageGalleryModal } from "../../../../components/defaults/ImageGalleryModal";
// import { useGroup } from "../../../hooks/ReactQuery/useGroup";

type coverPhotoProps = {  group: GroupType };

export const GroupCoverImage = ({ group }: coverPhotoProps) => {
  const basePhoto: photo | null = group?.coverImage
    ? {
        photo: group?.coverImage,
        photoB64: undefined
      }
    : null;

  const [photo, setPhoto] = useState<photo | null>(basePhoto);
//   const [base64String, setBase64String] = useState<string | null >(null);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  useEffect(() => {
    setPhoto(basePhoto);
  }, [group]);
  const { start } = usePhotos({
    uploadPhoto: async (b64, uri) => {
      setPhoto({ photo: uri, photoB64: b64 });
    },
    aspect: [Layout.window.width, 192],
    allowsGallery: true,
    allowsEditing: true
  });
//   const { refetch: refetchUser } = isUser
//     ? useMyProfile()
//     : useGroup(group.id);

//   const newPhotoMutation = useMutation(
//     MutationKeys.GROUP_COVER_IMAGE,
//     (b64: string) => 
//     setBase64String(b64),
//     //   goFetchLite("users/me/images/cover", {
//     //     method: "POST",
//     //     body: { base64: b64 }
//     //   }),
//     {
//       onSuccess: () => {
//         Toast.show({ text1: "Cover Photo changed" });
//         refetchUser();
//       }
//     }
//   );

//   const deletePhotoMutation = useMutation(
//     MutationKeys.DELETE_COVER_PHOTO,
//     () =>
//       goFetchLite("users/me/images/cover", {
//         method: "DELETE"
//       }),
//     {
//       onSuccess: () => {
//         Toast.show({ text1: "Cover Photo deleted" });
//         setImageViewerVisible(false);
//         refetchUser();
//       },
//       onError: error => {
//         Toast.show({
//           text1: "Cover Photo failed to be deleted",
//           type: "error",
//           //@ts-ignore
//           text2: error?.response?.data?.message
//         });
//         setImageViewerVisible(false);
//         refetchUser();
//       }
//     }
//   );

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
          {group && (
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