import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useMutation, useQueryClient } from "react-query";
import { MottledGreenBackground } from "../../../components/specifics/LoggedOut/MottledGreenBackground";
import { colors } from "../../../constants";
import { MutationKeys, QueryKeys } from "../../../constants/queryKeys";
import useSignupProgress from "../../../hooks/ReactQuery/useSignupProgress";
import { createUserProfileInput } from "../../../models";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { goFetchLite } from "../../../utils/goFetchLite";
import { requestNotificationPermissions } from "../../../utils/notifications/requestNotificationPermissions";
import { storeData } from "../../../utils/localStorage";

export default function LoadingScreen({
  navigation
}: RootLoggedInScreenProps<"Loading">) {
  const updateProfileMutation = useMutation(
    MutationKeys.UPDATE_PROFILE,
    (props: createUserProfileInput) =>
      goFetchLite("users/me/profile", {
        method: "PATCH",
        body: props
      }),
    {
      onMutate: variables => {
        console.log("[🥙] - profile update variables here", variables);
      },
      onSuccess: (data: any) => {
        console.log("[🥙] - profile updated successfully", data);
      },
      onError: (error: any) => {
        console.log("[🍞] - Patch request error", error);
      }
    }
  );
  const getPushToken = async () => {
    const token = await requestNotificationPermissions();
    token &&
      updateProfileMutation.mutateAsync({ pushNotificationToken: token });
  };

  const { refetch } = useSignupProgress({
    onSuccess: data => {
      console.log("hello", data);
      if (
        data?.progress.phoneVerified == true &&
        data?.progress.profileCompleted == true &&
        data?.progress.profileImagesUploaded == true
      ) {
        getPushToken();
        navigation.navigate("HomeDrawer");
      }
    },
    enabled: true
  });

  const queryClient = useQueryClient();
  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        queryClient.prefetchQuery(QueryKeys.MY_PROFILE);
        refetch();
      }, 1000);
    }, [])
  );
  return (
    <MottledGreenBackground style={styles.container}>
      <ActivityIndicator size={30} color={colors.background} />
    </MottledGreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});
