import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Rating } from "react-native-ratings";
import { listColors } from "../../../constants";
import { useFriends } from "../../../hooks/ReactQuery/useFriends";
import { UserStatusObject } from "../../../utils/UserStatusToText";
import { Text } from "../../defaults";
import ColouredList from "../../generics/ColouredList";
import VerifiedBadge from "../../generics/Icons/VerifiedBadge";
import ImageWithStatus from "../../generics/ImageWithStatus";
import { UserPressable } from "../../generics/UserPressable";
import EmptyList from "../../generics/Icons/EmptyList";
export default function FriendYakkasList({
  filterQueryParams,
  openAddYakkaModal
}: {
  filterQueryParams?: any;
  openAddYakkaModal?: boolean;
}) {
  const friendsQuery = useFriends(filterQueryParams);
  return (
    <>
      {friendsQuery.data?.pages && (
        <ColouredList
          keyPrefix="friends"
          ListEmptyComponent={() => <EmptyList />}
          onEndReached={() => {
            if (friendsQuery.hasNextPage) friendsQuery.fetchNextPage();
          }}
          startZIndex={99}
          items={friendsQuery.data.pages.flatMap(
            page =>
              page?.friends?.map((user, index) => ({
                data: user,
                content: (
                  <UserPressable
                    //@ts-ignore
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
                            tintColor={listColors[index % listColors.length]}
                            imageSize={16}
                            style={{ paddingBottom: 2 }}
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
                    <UserPressable
                      openAddYakkaModal={openAddYakkaModal}
                      userId={user.id}
                      className="ml-6"
                    >
                      <ImageWithStatus
                        status={user.status}
                        imageUrl={user.image}
                        isVerified={user.isVerified}
                      />
                    </UserPressable>
                  </UserPressable>
                )
              })) || []
          )}
        />
      )}
    </>
  );
}
