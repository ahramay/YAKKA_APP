import { useState } from "react";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
import { MutationKeys } from "../../constants/queryKeys";
import { GetProfileResponse } from "../../types/types";
import { goFetchLite } from "../../utils/goFetchLite";
import { useMyProfile } from "./useMyProfile";
export const useInterestsMutation = (props: {
  newInterests: number[];
  originalInterests: number[];
}) => {
  const { newInterests, originalInterests } = props;

  const deletedInterests = originalInterests.filter(
    val => !newInterests.includes(val)
  );

  const addedInterests = newInterests.filter(
    val => !originalInterests.includes(val)
  );

  const { refetch } = useMyProfile();

  const deleteInterests = useMutation<GetProfileResponse>(
    MutationKeys.INTERESTS_HASHTAGS,
    () =>
      goFetchLite("users/me/interests", {
        method: "DELETE",
        body: { interests: deletedInterests }
      }),
    {
      onMutate: () => {
        console.log(deletedInterests);
      },
      onSuccess: () => {
        refetch();
        Toast.show({ text1: "Interests updated successfully" });
      },
      onError: (error: any) => {
        Toast.show({
          text1: `Interests failed to update`,
          text2: error?.response?.data?.message || "",
          type: "error"
        });
      }
    }
  );

  const addInterests = useMutation<GetProfileResponse>(
    MutationKeys.INTERESTS_HASHTAGS,
    () =>
      goFetchLite("users/me/interests", {
        method: "POST",
        body: { interests: addedInterests }
      }),

    {
      onMutate: () => {
        console.log(addedInterests);
      },
      onSuccess: () => {
        refetch();
        Toast.show({ text1: "Interests updated successfully" });
      },
      onError: (error: any) => {
        Toast.show({
          text1: `Interests failed to update`,
          text2: error?.response?.data?.message || "",
          type: "error"
        });
      }
    }
  );
  const updateNewInterests = () => {
    addInterests.mutate();
    deleteInterests.mutate();
  };
  return updateNewInterests;
};
