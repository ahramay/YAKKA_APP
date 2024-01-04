import { Ionicons } from "@expo/vector-icons";
import React, { memo, useCallback, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  View,
  Platform,
  TouchableOpacity,
  TouchableOpacityBase
} from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { useQuery } from "react-query";
import { colors, listColors } from "../../constants";
import { QueryKeys } from "../../constants/queryKeys";
import { goFetchLite } from "../../utils/goFetchLite";
import { Text } from "../defaults";

export default function HashtagSearch({
  selectedItems,
  setSelectedItems
}: {
  selectedItems: any[];
  setSelectedItems: any;
}) {
  const [searchText, setSearchText] = useState<string>("");
  const { data, isError, isLoading } = useQuery(
    [QueryKeys.INTERESTS, searchText],
    () =>
      goFetchLite("users/hashtags/search", {
        method: "GET",
        params: { q: searchText }
      }),
    {
      enabled: searchText.length > 2
    }
  );

  return (
    <View>
      <AutocompleteDropdown
        direction="down"
        containerStyle={{
          marginBottom: 10
        }}
        inputContainerStyle={{
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.black
        }}
        debounce={600}
        loading={isLoading}
        onChangeText={setSearchText}
        textInputProps={{
          placeholder: "Search",
          allowFontScaling: false
        }}
        showChevron={false}
        onSelectItem={(item: any) => {
          if (item === null) return;
          setSelectedItems([...selectedItems, item]);
        }}
        dataSet={data?.hashtags?.map((i: any) => ({
          id: i.id,
          title: i.name
        }))}
      />
      {/* */}
      <View className=" flex-row gap-2 flex-wrap">
        {selectedItems
          .filter(allItems => allItems)
          .map((i: any, index) => (
            //  Pill component to remove
            <TouchableOpacity
              onPress={() => {
                setSelectedItems(
                  selectedItems
                    .filter(i => i)
                    .filter((item: any) => item.id !== i.id)
                );
              }}
              style={{ backgroundColor: colors.listPink }}
              className="flex-row w-20 items-center justify-center px-2 py-1 rounded-md"
            >
              <Text size="xs" color="white">
                {i?.title?.length > 10
                  ? i?.title?.slice(0, 10) + "..."
                  : i?.title}
              </Text>
              <Ionicons name="remove-circle" color={colors.red} />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}
