// import { Ionicons } from "@expo/vector-icons";
import React from "react";
// import { Pressable, View } from "react-native";
import { useInfiniteQuery } from "react-query";
import { QueryKeys } from "../../../constants/queryKeys";
// import { NearbyUsersResponse } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
// import { UserStatusObject } from "../../../utils/UserStatusToText";
import { Text } from "../../defaults";
import ColouredList from "../../generics/ColouredList";
import VerifiedBadge from "../../generics/Icons/VerifiedBadge";
// import ImageWithStatus from "../../generics/ImageWithStatus";
// import { UserPressable } from "../../generics/UserPressable";
import EmptyList from "../../generics/Icons/EmptyList";
import { listColors } from "../../../constants";
import GroupImage from "../../generics/GroupImage ";
// import GroupImageWithInvite from "../../generics/GroupImageWithInvite";
import { Rating } from "react-native-ratings";
import { GroupPressable } from "../ViewGroup/GroupPressable";
import { PersonalGroupsResponse } from "../../../types/types";

export default function NearGroupsList({
  filterQueryParams,
  openAddYakkaModal
}: {
  filterQueryParams?: any;
  openAddYakkaModal?: boolean;
}) {
  const personalQuery = useInfiniteQuery<PersonalGroupsResponse>(
    [QueryKeys.PERSONAL_GROUPS, filterQueryParams],
    ({ pageParam }) => {
      return goFetchLite("groups/planned", {
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
      {personalQuery.data?.pages && (
        <ColouredList
          keyPrefix="friends"
          ListEmptyComponent={() => <EmptyList />}
          onEndReached={() => {
            if (personalQuery.hasNextPage) personalQuery.fetchNextPage();
          }}
          startZIndex={99}
          items={personalQuery.data.pages.flatMap(
            page =>
              page?.friends?.map((group, index) => ({
                data: group,
                content: (
                  <GroupPressable
                    //@ts-ignore
                    key={group.id}
                    groupId={group.id}
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
                              {group.firstName}
                            </Text>

                            {group.organiser.isVerified && (
                              <VerifiedBadge style={{ marginLeft: 5 }} />
                            )}
                          </View>
                        </View>
                        <View className="items-end">
                          <Rating
                            readonly
                            startingValue={group.averageRating}
                            tintColor={listColors[index % listColors.length]}
                            imageSize={16}
                            style={{ paddingBottom: 2 }}
                          />

                          <Text size="xs" color="white">
                            {group.yakkaCount} YAKKAs
                          </Text>
                        </View>
                      </View>

                      <Text size="sm" style={{ color: "white", opacity: 0.7 }}>
                        {group.description.length > 100
                          ? group.description.slice(0, 100) + "..."
                          : group.description}
                      </Text>
                    </View>
                    <GroupPressable groupId={group.id} className="ml-6">
                      <GroupImageWithInvite
                        imageUrl={group.image}
                        invited={false}
                      />
                    </GroupPressable>
                  </GroupPressable>
                )
              })) || []
          )}
        />
      )}
    </>
  );
}
