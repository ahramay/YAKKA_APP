import React, { useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useMutation, useQuery } from "react-query";
import { Text } from "../../../components";
import CurvedModal from "../../../components/generics/CurvedModal";
import { AreYouSure } from "../../../components/specifics/User/UserActions/AreYouSure";
import { colors } from "../../../constants";
import { QueryKeys } from "../../../constants/queryKeys";
import useCustomToast from "../../../hooks/useCustomToast";
import { BasicProfile } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";

interface emergencyContactInput {
  name: string;
  phoneNumber: string;
  phoneCountryCode: string;
  countryCode: string;
}
export default function BlockedContactsScreen() {
  const { toast, errorToast } = useCustomToast();
  const [unblockModalVisible, setUnblockModalVisible] = useState(false);
  const [user, setUser] = useState<BasicProfile>();
  const { data, isLoading, isError, refetch } = useQuery<{
    blockedUsers: BasicProfile[];
  }>(
    QueryKeys.GET_BLOCKED_USERS,
    () =>
      goFetchLite("users/blocked", {
        method: "GET"
      }),
    {
      onSuccess: data => {
        console.log(data);
        // setCountryCode(data.countryCode);
      },
      retry: 0,
      onError: (error: any) => {
        if (error?.request?.status !== 404) {
          errorToast("Error fetching emergency contact");
        }
      }
    }
  );

  const unblockMutation = useMutation(
    (userId: number) => {
      return goFetchLite(`users/blocked/${userId}`, {
        method: "DELETE"
      });
    },
    {
      onSuccess: () => {
        refetch();
        toast("Contact unblocked");
      }
    }
  );

  const renderItem = ({ item, index }: ListRenderItemInfo<BasicProfile>) => {
    return (
      <View className="flex-row bg-white rounded-lg items-center mb-2">
        <View className="flex-1 p-1 gap-y-3 flex-row items-center">
          <Image
            source={{ uri: item.image }}
            className="w-12 h-12 rounded-lg"
          />
          <Text className="mx-4">
            {item?.firstName} {item.lastName}
          </Text>
        </View>
        <TouchableOpacity
          className="pr-4"
          onPress={() => {
            setUser(item);
            setUnblockModalVisible(true);
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.dim} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 justify-center items-center px-4 pt-3">
      {isLoading ? (
        <ActivityIndicator size={30} color={colors.greenYakka} />
      ) : (
        <View className="flex-1 w-full">
          <FlashList
            ListEmptyComponent={
              <Text className="text-center w-full">
                Seems you haven't blocked anyone, good for you!
              </Text>
            }
            data={data?.blockedUsers}
            renderItem={renderItem}
          />
        </View>
      )}
      <CurvedModal
        title="Unblock Contact"
        isOpen={unblockModalVisible}
        setIsOpen={setUnblockModalVisible}
      >
        {user && (
          <AreYouSure
            submitText="Unblock"
            content={`Are you sure you want to unblock ${user.firstName} ${user.lastName}?`}
            onPressCancel={() => setUnblockModalVisible(false)}
            onPressSubmit={() => {
              setUnblockModalVisible(false);
              unblockMutation.mutate(user.id);
            }}
          />
        )}
      </CurvedModal>
    </View>
  );
}
