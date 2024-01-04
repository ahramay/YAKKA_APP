import { useState } from "react";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
import { MutationKeys } from "../../constants/queryKeys";
import { hashtagSchema } from "../../models";
import { GetProfileResponse } from "../../types/types";
import { goFetchLite } from "../../utils/goFetchLite";
import { useMyProfile } from "./useMyProfile";
export const useHashtagsMutation = (props: {
  newHashtags: string[];
  originalHashtags: hashtagSchema[];
}) => {
  const { newHashtags, originalHashtags } = props;

  const deletedHashtags = originalHashtags
    .map(val => {
      if (!newHashtags.includes(val.name)) {
        return val.id;
      }
    })
    .filter(val => val !== undefined);

  const originalHastagsNames = originalHashtags.map(val => val.name);
  const addedHashtags = newHashtags.filter(
    val => !originalHastagsNames.includes(val)
  );

  const { refetch } = useMyProfile();

  //Didn't know what to name
  //Starts at false, becomes true if one of the api calls is successful, if the second api call is successful it does a success toast
  const [state, setState] = useState(false);

  const deleteHashtags = useMutation<GetProfileResponse>(
    MutationKeys.INTERESTS_HASHTAGS,
    () =>
      goFetchLite("users/me/hashtags", {
        method: "DELETE",
        body: { hashtags: deletedHashtags }
      }),
    {
      onSuccess: () => {
        if (state) {
          Toast.show({ text1: "Hashtags updated successfully" });
        } else {
          setState(true);
        }
        refetch();
      },
      onError: (error: any) => {
        Toast.show({
          text1: `Hashtags failed to update`,
          text2: error?.response?.data?.message || "",
          type: "error"
        });
      }
    }
  );

  const addHashtags = useMutation<GetProfileResponse>(
    MutationKeys.INTERESTS_HASHTAGS,
    () =>
      goFetchLite("users/me/hashtags", {
        method: "POST",
        body: { hashtags: addedHashtags }
      }),
    {
      onSuccess: () => {
        if (state) {
          Toast.show({ text1: "Hashtags updated successfully" });
        } else {
          setState(true);
        }
        refetch();
      },
      onError: (error: any) => {
        Toast.show({
          text1: `Hashtags failed to update`,
          text2: error?.response?.data?.message || "",
          type: "error"
        });
      }
    }
  );
  const updateNewHashtags = () => {
    addHashtags.mutate();
    deleteHashtags.mutate();
  };

  return updateNewHashtags;
};
