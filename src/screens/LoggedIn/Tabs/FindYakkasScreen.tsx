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
import { FindYakkaListType } from "../../../types/types";

export default function FindYakkasScreen({
  route
}: HomeTabScreenProps<"FindYakkas">) {
  const [selectedYakkaListType, setSelectedYakkaListType] =
    React.useState<FindYakkaListType>(route?.params?.tab || "nearby");
  const [filterQueryParams, setFilterQueryParams] = React.useState<any>();
  useEffect(() => {
    // console.log("route params find yakkas", route?.params);
    if (route?.params?.tab) {
      // console.log("setting selected yakka list type", route?.params?.tab);
      setSelectedYakkaListType(route?.params?.tab);
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
      <FindYakkaControls
        selectedYakkaListType={selectedYakkaListType}
        setFilterQueryParams={setFilterQueryParams}
        setSelectedYakkaListType={setSelectedYakkaListType}
      />

      {/* TODO: All these lists are essentially the same, really would be better to refactor to one component and fetch the right data here
      this would also avoid the annoying flashing when you switch
    */}

      {selectedYakkaListType === "nearby" && (
        <NearYakkasList
          openAddYakkaModal={route?.params?.openAddYakkaModal}
          filterQueryParams={filterQueryParams}
        />
      )}
      {selectedYakkaListType === "recommended" && (
        <RecommendedYakkasList
          openAddYakkaModal={route?.params?.openAddYakkaModal}
          filterQueryParams={filterQueryParams}
        />
      )}
      {selectedYakkaListType === "friends" && (
        <FriendYakkasList
          openAddYakkaModal={route?.params?.openAddYakkaModal}
          filterQueryParams={filterQueryParams}
        />
      )}
    </View>
  );
}
