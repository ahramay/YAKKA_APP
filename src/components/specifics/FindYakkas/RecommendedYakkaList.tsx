import React from "react";
import { View } from "react-native";
import { Rating } from "react-native-ratings";
import { useInfiniteQuery } from "react-query";
import { listColors } from "../../../constants";
import { QueryKeys } from "../../../constants/queryKeys";
import { RecommendedUsersResponse } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
import { UserStatusObject } from "../../../utils/UserStatusToText";
import { Text } from "../../defaults";
import ColouredList from "../../generics/ColouredList";
import VerifiedBadge from "../../generics/Icons/VerifiedBadge";
import ImageWithStatus from "../../generics/ImageWithStatus";
import { UserPressable } from "../../generics/UserPressable";
import { YakkaPressable } from "../ViewYakka/YakkaPressable";
import EmptyList from "../../generics/Icons/EmptyList";
export default function RecommendedYakkasList({
  filterQueryParams,
  openAddYakkaModal
}: {
  filterQueryParams?: any;
  openAddYakkaModal?: boolean;
}) {
  const recommendedQuery = useInfiniteQuery<RecommendedUsersResponse>(
    [QueryKeys.RECOMMENDED_USERS, filterQueryParams],
    ({ pageParam }) => {
      return goFetchLite("users/find/recommended", {
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
      {recommendedQuery.data?.pages && (
        <ColouredList
          keyPrefix="nearby"
          onEndReached={() => {
            if (recommendedQuery.hasNextPage) recommendedQuery.fetchNextPage();
          }}
          startZIndex={99}
          ListEmptyComponent={() => <EmptyList />}
          items={recommendedQuery.data.pages.flatMap(
            page =>
              page?.recommended?.map((user, index) => ({
                data: user,
                content: (
                  <UserPressable
                    openAddYakkaModal={openAddYakkaModal}
                    userId={user.id}
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
                        <View className="items-end">
                          <Rating
                            readonly
                            startingValue={user.averageRating}
                            imageSize={16}
                            // Have to set the tint colour as the background colour of the list item
                            // It can't be set to transparent
                            tintColor={listColors[index % listColors.length]}
                            style={{ paddingBottom: 2, backgroundColor: "" }}
                          />
                          <Text size="xs" color="white">
                            {user.yakkaCount} YAKKAs
                          </Text>
                        </View>
                      </View>

                      <Text size="sm" style={{ color: "white", opacity: 0.7 }}>
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
              })) || []
          )}
        />
      )}
    </>
  );
}
