import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { useInfiniteQuery } from "react-query";
import { QueryKeys } from "../../../constants/queryKeys";
import { NearbyUsersResponse } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
import { UserStatusObject } from "../../../utils/UserStatusToText";
import { Text } from "../../defaults";
import ColouredList from "../../generics/ColouredList";
import VerifiedBadge from "../../generics/Icons/VerifiedBadge";
import ImageWithStatus from "../../generics/ImageWithStatus";
import { UserPressable } from "../../generics/UserPressable";
import EmptyList from "../../generics/Icons/EmptyList";
export default function NearYakkasList({
  filterQueryParams,
  openAddYakkaModal
}: {
  filterQueryParams?: any;
  openAddYakkaModal?: boolean;
}) {
  const nearbyQuery = useInfiniteQuery<NearbyUsersResponse>(
    [QueryKeys.NEARBY_USERS, filterQueryParams],
    ({ pageParam }) => {
      return goFetchLite("users/find/nearby", {
        method: "GET",
        params: { ...filterQueryParams, page: pageParam }
      });
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.nextPage ?? undefined,
      keepPreviousData: true
    }
  ); 

  return (
    <>
      {nearbyQuery.data?.pages && (
        <ColouredList
          keyPrefix="nearby"
          onEndReached={() => {
            if (nearbyQuery.hasNextPage) nearbyQuery.fetchNextPage();
          }}
          startZIndex={99}
          ListEmptyComponent={() => <EmptyList />}
          items={nearbyQuery.data.pages.flatMap(
            page =>
              page.nearby?.map(user => {
                return {
                  data: user,
                  content: (
                    <UserPressable
                      userId={user.id}
                      openAddYakkaModal={openAddYakkaModal}
                      className="flex-row justify-between items-center w-full"
                    >
                      <View className="gap-y-2 flex-1">
                        <View className="flex-row justify-between items-center">
                          <View>
                            <View className="flex-row items-center">
                              <Text
                                size="lg"
                                weight="500"
                                style={{ color: "white" }}
                              >
                                {user.firstName}
                              </Text>

                              {user.isVerified && (
                                <VerifiedBadge style={{ marginLeft: 5 }} />
                              )}
                            </View>
                            <Text
                              size="sm"
                              style={{ color: "white", opacity: 0.7 }}
                            >
                              {/* TODO: Return status label from API */}
                              {UserStatusObject[user.status]}
                            </Text>
                          </View>
                          <View className="items-center flex-row left-2 gap-x-1">
                            <Ionicons name="location" size={18} color="white" />
                            <View>
                              <Text size="sm2" color="white">
                                {user.distanceMiles}
                                {" mile"}
                                {user.distanceMiles !== 1 && "s"}
                              </Text>
                              <Text size="sm" color="white">
                                {user.yakkaCount} YAKKA
                                {user.yakkaCount !== 1 && "s"}
                              </Text>
                            </View>
                          </View>
                        </View>
                        {/* TODO: Return user BIO from API */}
                        {/* TODO: Small preset is bigger than xs_white */}
                        <Text
                          size="sm"
                          style={{ color: "white", opacity: 0.7 }}
                        >
                          {user.bio.length > 100
                            ? user.bio.slice(0, 100) + "..."
                            : user.bio}
                        </Text>
                      </View>
                      <View className="ml-6">
                        <ImageWithStatus
                          status={user.status}
                          imageUrl={user.image}
                          isVerified={user.isVerified}
                        />
                      </View>
                    </UserPressable>
                  )
                };
              }) || []
          )}
        />
      )}
    </>
  );
}
