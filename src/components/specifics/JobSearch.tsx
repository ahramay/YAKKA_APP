import React, { useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
import {
  AutocompleteDropdown,
  AutocompleteDropdownProps,
  AutocompleteDropdownRef
} from "react-native-autocomplete-dropdown";
import { useQuery } from "react-query";
import { colors } from "../../constants";
import { QueryKeys } from "../../constants/queryKeys";
import { goFetchLite } from "../../utils/goFetchLite";
import { presets } from "../defaults/Text/Text.presets";

export default function JobSearch({
  jobTitle,
  setJobTitle,
  onSelectItem,
  options,
  onBlur
}: {
  jobTitle: string;
  onBlur: () => void;
  onSelectItem?: (item: any) => void;
  options?: AutocompleteDropdownProps;
  setJobTitle: (val: string) => void;
}) {
  const [searchText, setSearchText] = useState<string>(jobTitle);
  const dropdownController = useRef<AutocompleteDropdownRef>(null);

  const { data: jobData, isLoading } = useQuery<{
    jobTitles: string[];
  }>(
    [QueryKeys.JOBS, searchText],
    () =>
      goFetchLite("users/jobs", {
        method: "GET",
        params: { jobtitle: searchText }
      }),
    {
      enabled: searchText.length > 1
    }
  );

  const data = jobData?.jobTitles?.map((i: string, index: number) => ({
    id: index.toString(),
    title: i
  }));

  const onChangeText = (val: string) => {
    setJobTitle(val);
    setSearchText(val);
  };

  useEffect(() => {
    //@ts-ignore
    setTimeout(() => dropdownController.current.setInputText(jobTitle), 0);
  }, []);
  return (
    <View style={[Platform.select({ ios: {} })]}>
      <AutocompleteDropdown
        direction="down"
        controller={controller => {
          //@ts-ignore
          dropdownController.current = controller;
        }}
        containerStyle={{
          marginBottom: 10
        }}
        inputContainerStyle={{
          backgroundColor: colors.background,
          borderRadius: 0,
          borderBottomWidth: 1
        }}
        debounce={600}
        loading={isLoading}
        onChangeText={onChangeText}
        onBlur={onBlur}
        clearOnFocus={false}
        inputHeight={40}
        showChevron={false}
        suggestionsListContainerStyle={{ zIndex: 100 }}
        suggestionsListTextStyle={{ zIndex: 100 }}
        onSelectItem={(item: any) => {
          if (item === null) return;
          setJobTitle(item.title);
          setSearchText(item.title);
          onSelectItem && onSelectItem(item);
        }}
        dataSet={data}
        {...options}
      />
    </View>
  );
}
