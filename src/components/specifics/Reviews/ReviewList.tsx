import React from "react";
import { View } from "react-native";
import { Rating } from "react-native-ratings";
import { useInfiniteQuery } from "react-query";
import { listColors } from "../../../constants";
import { QueryKeys } from "../../../constants/queryKeys";
import { ReviewsListResponse } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
import { Text } from "../../defaults";
import ColouredList from "../../generics/ColouredList";
import UserProfileImage from "../../generics/UserProfileImage";
export default function ReviewList({ userId }: { userId: number | "me" }) {
  const nearbyQuery = useInfiniteQuery<ReviewsListResponse>(
    [QueryKeys.reviews(userId)],
    ({ pageParam }) => {
      return goFetchLite(`users/${userId}/reviews`, {
        method: "GET",
        params: { page: pageParam }
      });
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.nextPage ?? undefined
    }
  );

  return (
    <>
      {nearbyQuery.data?.pages && (
        <ColouredList
          showMoreLength={8}
          keyPrefix="nearby"
          onEndReached={() => {
            if (nearbyQuery.hasNextPage) nearbyQuery.fetchNextPage();
          }}
          startZIndex={99}
          items={nearbyQuery.data.pages.flatMap(
            page =>
              page.reviews?.map((review, index) => ({
                data: review,
                content: (
                  <View className="flex-row justify-between items-center w-full">
                    <View className="gap-y-2 flex-1">
                      <View className="flex-row justify-between items-center">
                        <View className="w-full">
                          <View className="flex-row justify-between items-center">
                            <Text
                              size="lg"
                              weight="500"
                              style={{ color: "white" }}
                            >
                              {review.reviewer.firstName}
                            </Text>
                            <Rating
                              tintColor={listColors[index % listColors.length]}
                              startingValue={review.rating}
                              imageSize={14}
                              readonly
                            />
                          </View>
                          <Text className="mb-2 mt-1" size="sm" color="white">
                            {review.comment}
                          </Text>

                          <Text
                            size="sm"
                            style={{ color: "white", opacity: 0.7 }}
                          >
                            {review.createdAt}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="ml-6 ">
                      <UserProfileImage imageUrl={review.reviewer.image} />
                    </View>
                  </View>
                )
              })) || []
          )}
        />
      )}
    </>
  );
}
