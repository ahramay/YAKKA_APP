import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
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
import GroupImageWithInvite from "../../generics/GroupImageWithInvite";
import { GroupPressable } from "../ViewGroup/GroupPressable";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
type FilterByGroupsResponse = any;

export default function FilterGroupLIst({
  filterQueryParams,
  openAddYakkaModal,
  filterData,
}: {
  filterQueryParams?: any;
  openAddYakkaModal?: boolean;
  filterData?:any;
}) {
  const FilterByQuery = useInfiniteQuery<FilterByGroupsResponse>(
    [QueryKeys.FILTER_GROUPS, filterQueryParams],

  );
  // const filterDatas = () =>{
  //   const parameter = {filterData};
  //   onChildMethod(parameter)
  // }


  const categoryData = filterData?.map(
    (cat: { id: any; name: any,date:any,profileImage:any, groupMiles:any}) => {
      return {
        id: cat.id,
        name: cat.name,
        profileImage:cat.profileImage,
        groupMiles:cat.groupMiles
      };
    }
  );

console.log("GP",filterData)
console.log("new dara",categoryData)

  return (
    <>
    {categoryData &&  (
      <ColouredList
        keyPrefix="filter"
        onEndReached={() => {
          if (categoryData.hasNextPage) categoryData.fetchNextPage();
        }}
        startZIndex={99}
        ListEmptyComponent={() => <EmptyList />}
        items={categoryData.flatMap(
          (          page: { categoryData: any[]; }) =>
            categoryData?.map(group => {
              return {
                data: group,
                content: (
                  <GroupPressable
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
                              {group.name}
                            </Text>

                            {/* {group.organiser.isVerified && (
                              <VerifiedBadge style={{ marginLeft: 5 }} />
                            )} */}
                          </View>
                        </View>
                        <View className="items-center flex-row left-2 gap-x-1">
                          <Ionicons name="location" size={18} color="white" />
                          <View>
                            <Text size="sm2" color="white">
                              {group?.groupMiles}
                              {" mile"}
                              {group?.groupMiles !== 1 && "s"}
                            </Text>
                          </View>
                        </View>
                      </View>
                      {/* TODO: Return user BIO from API */}
                      {/* TODO: Small preset is bigger than xs_white */}
                      {/* <Text
                        size="sm"
                        style={{ color: "white", opacity: 0.7 }}
                      >
                        {group.description.length > 100
                          ? group.description.slice(0, 100) + "..."
                          : group.description}
                      </Text> */}
                    </View>
                    <GroupPressable groupId={group.id} className="ml-6">
                      <GroupImageWithInvite
                        imageUrl={`${group?.profileImage ? group?.profileImage : require("../../../../assets/images/camera_icon.png")}`}
                        invited={false}
                      />
                    </GroupPressable>
                  </GroupPressable>
                )
              };
            })
        )}
      />
    )}
  </>
  );
}


