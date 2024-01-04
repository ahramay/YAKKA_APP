import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, TouchableHighlight } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useMutation } from "react-query";
import { colors, Layout } from "../../../constants";
import { ClassNames } from "../../../constants/ClassNames";
import { MutationKeys } from "../../../constants/queryKeys";
import usePhotos from "../../../hooks/usePhotos";
import { photo } from "../../../models";
import { goFetchLite } from "../../../utils/goFetchLite";
import { ImageGalleryModal } from "../../defaults/ImageGalleryModal";
import { GetGroupResponse, GroupType } from "../../../types/types";
import { useViewGroup } from "../../../hooks/ReactQuery/useViewGroup";

type coverPhotoProps = { isOrganiser: boolean; group: GroupType };

export const GroupCoverPhoto = ({ isOrganiser, group }: coverPhotoProps) => {
  const basePhoto: photo | null = group?.coverImage!
    ? {
        photo: group?.coverImage!,
        photoB64: undefined
      }
    : null;

  const [photo, setPhoto] = useState<photo | null>(basePhoto);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  useEffect(() => {
    setPhoto(basePhoto);
  }, [group]);
  const { start } = usePhotos({
    uploadPhoto: async (b64, uri) => {
      setPhoto({ photo: uri, photoB64: b64 });
      newPhotoMutation.mutate(b64);
    },
    aspect: [Layout.window.width, 192],
    allowsGallery: true,
    allowsEditing: true
  });
  const { refetch: refetchGroup } = useViewGroup(group.id);

  const newPhotoMutation = useMutation(
    MutationKeys.GROUP_COVER_PHOTO,
    (b64: string) =>
      goFetchLite("groups/images/cover", {
        method: "POST",
        body: { base64: b64 }
      }),
    {
      onSuccess: () => {
        Toast.show({ text1: "Cover Photo changed" });
        refetchGroup();
      }
    }
  );

  const deletePhotoMutation = useMutation(
    MutationKeys.DELETE_GROUP_COVER_PHOTO,
    () =>
      goFetchLite("groups/images/cover", {
        method: "DELETE"
      }),
    {
      onSuccess: () => {
        Toast.show({ text1: "Cover Photo deleted" });
        setImageViewerVisible(false);
        refetchGroup();
      },
      onError: error => {
        Toast.show({
          text1: "Cover Photo failed to be deleted",
          type: "error",
          //@ts-ignore
          text2: error?.response?.data?.message
        });
        setImageViewerVisible(false);
        refetchGroup();
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
          onDelete={
            isOrganiser ? () => deletePhotoMutation.mutate() : undefined
          }
          setVisible={(visible: boolean) => setImageViewerVisible(visible)}
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
          {isOrganiser && (
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
