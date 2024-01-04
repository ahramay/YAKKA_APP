import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import { View } from "react-native";
import { useQueryClient } from "react-query";
import FindYakkaControls from "../../../components/specifics/FindYakkas/FindYakkaControls";
import FriendYakkasList from "../../../components/specifics/FindYakkas/FriendYakkasList";
import NearYakkasList from "../../../components/specifics/FindYakkas/NearYakkasList";
import RecommendedYakkasList from "../../../components/specifics/FindYakkas/RecommendedYakkaList";
import { QueryKeys } from "../../../constants/queryKeys";
import { HomeTabScreenProps } from "../../../navigation/navigation.props";
import { FindGroupsListType, FindYakkaListType } from "../../../types/types";
import FindGroupControls from "../../../components/specifics/FindGroups/FindGroupControls";
import NearGroupsList from "../../../components/specifics/FindGroups/NearGroupsList";
import FilterGroupLIst from "../../../components/specifics/FindGroups/FilterGroupLIst";


export default function FindGroupsScreen({
  route,
}: HomeTabScreenProps<"FindGroups">) {
  const [selectedGroupListType, setSelectedGroupListType] =
    React.useState<FindGroupsListType>(route?.params?.tab || "nearby");
  const [filterQueryParams, setFilterQueryParams] = React.useState<any>();
  const [filterData, setFilterData] = React.useState<any[]>()

  useEffect(() => {
    // console.log("route params find yakkas", route?.params);
    if (route?.params?.tab) {
      // console.log("setting selected yakka list type", route?.params?.tab);
      setSelectedGroupListType(route?.params?.tab);
    }
  }, [route?.params]);

  const queryClient = useQueryClient();
  useFocusEffect(
    useCallback(() => {
      queryClient.refetchQueries([
        QueryKeys.NEARBY_USERS,
        QueryKeys.RECOMMENDED_USERS,
        QueryKeys.FRIENDS
      ]);
    }, [])
  );

  return (
    <View className="flex-1 z-0" style={{ elevation: 0 }}>
      <FindGroupControls
        selectedGroupListType={selectedGroupListType}
        setFilterQueryParams={setFilterQueryParams}
        setSelectedGroupListType={setSelectedGroupListType}
        setFilterData={setFilterData}
      />

      {/* TODO: All these lists are essentially the same, really would be better to refactor to one component and fetch the right data here
      this would also avoid the annoying flashing when you switch
    */}
 
      {selectedGroupListType === "nearby" && (
        <NearGroupsList
          openAddYakkaModal={route?.params?.openAddGroupModal}
          filterQueryParams={filterQueryParams}
        />
      )}
      {selectedGroupListType === "recommended" && (
        <NearGroupsList
          openAddYakkaModal={route?.params?.openAddGroupModal}
          filterQueryParams={filterQueryParams}
        />
      )}
      {selectedGroupListType === "personal" && (
        <NearGroupsList
          openAddYakkaModal={route?.params?.openAddGroupModal}
          filterQueryParams={filterQueryParams}
        />
      )}
      {selectedGroupListType === "filter" && (
        <FilterGroupLIst
          openAddYakkaModal={route?.params?.openAddGroupModal}
          filterQueryParams={filterQueryParams}
          filterData={filterData}
        />
      )}
    </View>
  );
}
