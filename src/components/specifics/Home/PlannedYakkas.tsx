import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, View , StyleSheet} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { QueryClient, useMutation, useQueryClient } from "react-query";
import { listColors } from "../../../constants";
import { MutationKeys, QueryKeys } from "../../../constants/queryKeys";
import { usePlannedYakkas } from "../../../hooks/ReactQuery/usePlannedYakkas";
import { DefaultResponse } from "../../../models";
import { BasicProfile, PlannedYakka } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
import ColouredList from "../../generics/ColouredList";
import CurvedModal from "../../generics/CurvedModal";
import AddYakkaModal from "../AddYakka/AddYakkaModal";
import { AreYouSure } from "../User/UserActions/AreYouSure";
import ViewYakkaModal from "../ViewYakka/ViewYakkaModal";
import YakkaListItem from "./YakkaListItem";
import EmptyList from "../../generics/Icons/EmptyList";


export default function PlannedYakkas() {
  const yakkaListQuery = usePlannedYakkas();
  const [editYakkaVisible, setEditYakkaVisible] = useState<boolean>(false);
  const [deleteYakkaVisible, setDeleteYakkaVisible] = useState<boolean>(false);
  const [yakka, setYakka] = useState<{
    data: PlannedYakka;
    onDelete: () => void;
  }>();




  function renderRightActions(
    progress: any,
    dragX: any,
    item: {
      data: PlannedYakka;
      content: React.ReactNode;
    },
    index: number,
    onPressDelete: () => void
  ) {
    return (
      <View className="pr-5 pl-1 pb-1 items-center content-center justify-center m-0 gap-x-3 flex-row">
        <TouchableOpacity
          onPress={() => {
            setYakka({ data: item.data, onDelete: onPressDelete });
            setEditYakkaVisible(true);
          }}
        >
          <Ionicons
            name="ellipsis-horizontal-circle-sharp"
            color={"white"}
            size={40}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setYakka({ data: item.data, onDelete: onPressDelete });
            // setDeleteItem(onPressDelete);
            setDeleteYakkaVisible(true);
          }}
        >
          <View className="h-[33px] w-[33px] items-center justify-center rounded-full bg-white">
            <Ionicons
              name="ios-trash-bin"
              color={listColors[index % listColors.length]}
              size={20}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      {yakkaListQuery.data?.planned && (
        <>
          <ColouredList
            startZIndex={99}
            SwipeRightComponent={renderRightActions}
            ListEmptyComponent={() => {
              return <EmptyList />
            }}
            items={yakkaListQuery.data.planned.map(yakka => ({
              data: yakka,
              content: <YakkaListItem yakka={yakka} type="planned" />
            }))}
          />
          {yakka && (
            <>
              <ViewYakkaModal
                visible={deleteYakkaVisible}
                setVisible={setDeleteYakkaVisible}
                yakkaId={yakka.data.id}
                onDelete={yakka.onDelete}
                deleteYakka
              />
              <AddYakkaModal
                isOpen={editYakkaVisible}
                setIsOpen={setEditYakkaVisible}
                userData={yakka.data.attendee}
                yakka={yakka.data}
              />
            </>
          )}
        </>
      )}
    </>
  );
}

