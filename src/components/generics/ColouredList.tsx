import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useId, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
  View
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { colors, listColors } from "../../constants";
import { ClassNames } from "../../constants/ClassNames";
import { Text } from "../defaults";

interface Props<T> {
  keyPrefix?: string;
  startZIndex: number;
  items: {
    data: T;
    content: React.ReactNode;
  }[];
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  ListEmptyComponent?: React.FC;
  showMoreLength?: number;
  allowOverflow?: boolean;
  SwipeRightComponent?: (
    progress: any,
    dragX: any,
    item: any,
    index: number,
    onPressDelete: () => void
  ) => React.ReactNode;
}

interface itemIndex {
  item: React.ReactNode;
  index: number;
}

export default function ColouredList<T>({
  startZIndex = 1,
  items,
  onEndReached = () => {},
  keyPrefix = "",
  onEndReachedThreshold = 0.5,
  allowOverflow,
  SwipeRightComponent,
  ListEmptyComponent,
  showMoreLength = 3
}: Props<T>) {
  const [showMore, setShowMore] = useState(false);
  const [listData, setListData] = useState(items.map(val => val.content));
  let row: Array<any> = [];
  let prevOpenedRow: any;
  const updateList = useCallback(() => {
    setListData(items.map(val => val.content));
  }, [items]);

  useEffect(() => {
    updateList();
  }, [items]);
  const renderItem = (
    { item, index }: ListRenderItemInfo<React.ReactNode>,
    onPressDelete: () => void
  ) => {
    const closeRow = (index: number) => {
      console.log("closerow");
      if (prevOpenedRow && prevOpenedRow !== row[index]) {
        prevOpenedRow.close();
      }
      prevOpenedRow = row[index];
    };

    return (
      <View
        className={` ${
          index === 0 ? "pt-[125px]" : "pt-16"
        } -mt-12 shadow-lg elev  overflow-visible`}
        style={{
          zIndex: startZIndex - index,
          backgroundColor: listColors[index % listColors.length],
          borderBottomLeftRadius: 45
        }}
      >
        {SwipeRightComponent ? (
          <Swipeable
            renderRightActions={(progress, dragX) =>
              SwipeRightComponent(
                progress,
                dragX,
                items[index],
                index,
                onPressDelete
              )
            }
            onSwipeableOpen={() => closeRow(index)}
            renderLeftActions={() => (
              <View style={{ backgroundColor: "transparent" }} />
            )}
            ref={ref => (row[index] = ref)}
            rightThreshold={-100}
          >
            <View
              className={`${ClassNames.OVERLAP} ${
                allowOverflow ? "px-0 " : "px-cnt"
              } h-fit`}
              style={{
                zIndex: startZIndex - index,
                backgroundColor: listColors[index % listColors.length],
                borderBottomLeftRadius: 45
              }}
            >
              {item}
            </View>
          </Swipeable>
        ) : (
          <View
            className={`${ClassNames.OVERLAP} ${
              allowOverflow ? "px-0 " : "px-cnt"
            } h-fit`}
            style={{
              zIndex: startZIndex - index,
              backgroundColor: listColors[index % listColors.length],
              borderBottomLeftRadius: 45
            }}
          >
            {item}
          </View>
        )}
      </View>
    );
  };

  const deleteItem = ({ item, index }: itemIndex) => {
    console.log(item, index);
    let a = listData;
    a.splice(index, 1);
    console.log(a);
    setListData([...a]);
  };

  // Would much prefer to use FlashList here but it really doesn't like the zIndex overlapping
  return (
    <FlatList
      onEndReachedThreshold={onEndReachedThreshold}
      onEndReached={onEndReached}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 200 }}
      className="-mt-16"
      // This is neccessary for zIndex overlapping to work
      CellRendererComponent={({ children }) => children}
      // This is neccessary for Android otherwise it will crash
      removeClippedSubviews={false}
      data={listData.slice(0, showMore ? undefined : 3)}
      renderItem={v =>
        renderItem(v, () => {
          console.log("Pressed", v);
          deleteItem(v);
        })
      }
      ListEmptyComponent={
        ListEmptyComponent || (
          <View className="pt-20">
            <Text size="md" className="text-center">
              No results
            </Text>
          </View>
        )
      }
      ListFooterComponent={
        <>
          {
            // Show more button
            items.map(val => val.content).length > showMoreLength && (
              <TouchableOpacity
                onPress={() => setShowMore(!showMore)}
                className="self-center items-center mt-6 mb-24"
              >
                <Text
                  size="sm"
                  style={{
                    color: colors.blueText,
                    fontFamily: "Roboto_500Medium"
                  }}
                >
                  {showMore ? "Show less" : "Show more"}
                </Text>
                <Ionicons
                  name={showMore ? "chevron-up" : "chevron-down"}
                  color={colors.dim}
                  size={20}
                />
              </TouchableOpacity>
            )
          }
        </>
      }
    />
  );
}
