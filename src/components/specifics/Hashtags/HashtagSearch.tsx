import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { useQuery } from "react-query";
import { colors } from "../../../constants";
import { QueryKeys } from "../../../constants/queryKeys";
import { goFetchLite } from "../../../utils/goFetchLite";
import { Text } from "../../defaults";

export default function HashtagSearch({
  selectedItems,
  searchText,
  setSearchText,
  setSelectedItems,
  zIndex
}: {
  selectedItems: any[];
  setSelectedItems: any;
  searchText: string;
  setSearchText: (string: string) => void;
  zIndex: number;
}) {
  const { data, isLoading } = useQuery(
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
    <View style={[Platform.select({ ios: {} })]}>
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
          .map((i: any) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedItems(
                  selectedItems
                    .filter(i => i)
                    .filter((item: any) => item.id !== i.id)
                );
              }}
              style={{ backgroundColor: colors.lightGreyBorder }}
              className="flex-row items-center justify-center pl-[10px] pr-2 py-1.5 rounded-md"
            >
              <Text size="md" className="mr-2" color={colors.dim}>
                {i?.title?.length > 16
                  ? i?.title?.slice(0, 16) + "..."
                  : i?.title}
              </Text>
              <View
                style={{ backgroundColor: colors.background }}
                className="rounded-full p-0.5 ml-1"
              >
                <Ionicons name="close" size={16} color={colors.greenYakka} />
              </View>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}
