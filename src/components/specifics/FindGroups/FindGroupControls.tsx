import Modal from "@euanmorgan/react-native-modal";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRecoilValue } from "recoil";
import { colors } from "../../../constants";
import { ClassNames } from "../../../constants/ClassNames";
import { headerHeightAtom } from "../../../recoil/headerHeightAtom";
import { FindGroupsListType } from "../../../types/types";
import { Button, Text } from "../../defaults";
import TextInputWithVoice from "../../defaults/TextInput/TextInputWithVoice";
import ButtonGroupSelector from "../../generics/ButtonGroupSelector";
import { Checkbox } from "../../generics/Checkbox";
import HashtagSearch from "../Hashtags/HashtagSearch";
import DateTimePicker from "@react-native-community/datetimepicker";
import { goFetchLite } from "../../../utils/goFetchLite";
import CustomDropdown from "../../generics/CustomDropDown";
import { useQuery } from "react-query";
import { categoriesSchema } from "../../../models";
import { QueryKeys } from "../../../constants/queryKeys";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const width = Dimensions.get("window").width;

interface FilterState {
  search: string;
  genders: Record<string, { label: string; value: boolean }>;
  minStarRating: Record<string, { label: string; value: boolean }>;
  maxDistanceMiles: Record<string, { label: string; value: boolean }>;
}

const TwoCols = ({ cols }: { cols: React.ReactNode[] }) => (
  <View
    className={` justify-between px-cnt mb-4 ${
      width < 300 ? "flex-col" : "flex-row"
    }`}
  >
    {cols.map((col, i) => (
      <View key={i} className="flex-1 gap-y-2">
        {col}
      </View>
    ))}
  </View>
);

const defaultFilterState = {
  search: "",
  genders: {
    Man: {
      label: "Man",
      value: false
    },
    Woman: {
      label: "Woman",
      value: false
    },
    Nonbinary: {
      label: "Non-binary",
      value: false
    },
    All: {
      label: "All",
      value: false
    }
  },
  minStarRating: {
    "5": {
      label: "5 stars",
      value: false
    },
    "4": {
      label: "4 stars",
      value: false
    },
    "3": {
      label: "3 stars",
      value: false
    }
  },
  maxDistanceMiles: {
    "5": {
      label: "Up to 5 miles",
      value: false
    },
    "10": {
      label: "5 - 10 miles",
      value: false
    },
    "200": {
      label: "10+ miles",
      value: false
    }
  }
};

export default function FindGroupControls({
  setSelectedGroupListType,
  setFilterQueryParams,
  selectedGroupListType,
  setFilterData
}: {
  setSelectedGroupListType: (type: FindGroupsListType) => void;
  setFilterQueryParams: (params?: string) => void;
  selectedGroupListType: FindGroupsListType;
  setFilterData?: any;
}) {
  const firstRender = useRef(true);
  const navigation = useNavigation();
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [searchBoxOpen, setSearchBoxOpen] = useState(false);
  const headerHeight = useRecoilValue(headerHeightAtom);
  const [hashtagsSearchText, setHashtagsSearchText] = useState<string>("");

  const [filterState, setFilterState] =
    useState<FilterState>(defaultFilterState);

  /* THESE ARE NEW LOGIC STATES */
  const [gender, setGender] = useState<string[]>([]);
  const [distance, setDistance] = useState<{
    max: number | undefined;
    min: number | undefined;
  }>({
    max: undefined,
    min: undefined
  });
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [date, setDate] = useState<Date>(new Date());
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const [selectedHashtags, setselectedHashtags] = useState<any[]>([]);
  const [isDate, setIsDate] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  /* =========== */

  const toggleSwitch = () => setIsFavourite(previousState => !previousState);

  /* FETCH CATEGORORIES FROM DB */

  useQuery<categoriesSchema>(
    QueryKeys.CATEGORIES,
    () =>
      goFetchLite("groups/categories", {
        method: "GET"
      }),
    {
      onSuccess: (data: any) => {
        const categoryData = data?.categories.map(
          (cat: { id: any; name: any }) => {
            return {
              id: cat.id,
              name: cat.name
            };
          }
        );
        setCategoryOptions(categoryData);
      },
      onError: (error: any) => {
        Toast.show({
          text1: `Something Went Wrong Try Again`,
          type: "error"
        });
      }
    }
  );

  const onChangeDateHandle = (value: number) => {
    if (value !== 0) {
      const date = new Date(value);
      setDate(date);
    } else {
      setDate(new Date());
    }
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // applyFiltersHandler();
  }, [filterState.search]);

  const applyFiltersHandler = () => {
    const dateISO = isDate? date?.toISOString() : undefined;
    console.log(
      "Check System",
      selectedHashtags,
      gender,
      selectedCategoryOption,
      distance,
      rating,
      isFavourite,
      dateISO
    );
    setIsLoading(true);
    return goFetchLite("groups/groupFilters", {
      method: "POST",
      body: {
        genders: gender,
        distance: distance,
        rating: rating,
        isFavourite,
        categories: selectedCategoryOption,
        date: isDate? date.toISOString() : undefined,
        hashTags: selectedHashtags
      }
    })
    .then(data => {
      console.log("Check Gender", data);
      setIsLoading(true);
      setFilterData(data.filteredGroups);
      if (data.message === "Filteration Successfull") {
        setIsFilter(true);
        setFilterModalOpen(false);
        setIsLoading(false);
        navigation.navigate("FindGroups");
      }else{

        setIsLoading(false);
        onClickClearAllHandler();
      
      }
    })
    .catch(error => {
      setIsLoading(false);
      
      error(error);
      });


  };

  /* Handler Functions for FilterLion Criteria */

  /* Handler For CheckList State Updater */ const upDatedFilterStateHandle = (
    cat: keyof FilterState,
    key: string
  ) => {
    const updatedFilterState: FilterState = { ...filterState };

    if (cat !== "genders") {
      Object.keys(updatedFilterState[cat]).forEach(checkboxKey => {
        if (checkboxKey !== key) {
          (
            updatedFilterState[cat] as Record<
              string,
              { label: string; value: boolean }
            >
          )[checkboxKey].value = false;
        }
      });
      // Toggle the value of the selected checkbox
      (
        updatedFilterState[cat] as Record<
          string,
          { label: string; value: boolean }
        >
      )[key].value = !(
        updatedFilterState[cat] as Record<
          string,
          { label: string; value: boolean }
        >
      )[key].value;
    } else {
      (
        updatedFilterState[cat] as Record<
          string,
          { label: string; value: boolean }
        >
      )[key].value = !(
        updatedFilterState[cat] as Record<
          string,
          { label: string; value: boolean }
        >
      )[key].value;
    }
    setFilterState(updatedFilterState);
  };

  /* Gender Handler  */

  const onClickGenderHandle = (
    value: string,
    key: string,
    isChecked: boolean,
    cat: keyof FilterState
  ) => {
    const currentList: string[] = gender;
    if (isChecked) {
      if (!currentList.includes(value)) {
        currentList.push(value);
        setGender(currentList);
      }
    } else {
      currentList.splice(currentList.indexOf(value), 1);
      setGender(currentList);
    }

    upDatedFilterStateHandle(cat, key);
  };

  /* Distance Handler  */

  const onClickDistancehandle = (
    value: string,
    key: string,
    isChecked: boolean,
    cat: keyof FilterState
  ) => {
    if (isChecked) {
      if (value === "Up to 5 miles") {
        setDistance({
          min: 0,
          max: 5
        });
      } else if (value === "5 - 10 miles") {
        setDistance({
          min: 5,
          max: 10
        });
      } else if (value === "10+ miles") {
        setDistance({
          min: 10,
          max: 3958.8
        });
      }
    } else {
      setDistance({
        min: undefined,
        max: undefined
      });
    }
    upDatedFilterStateHandle(cat, key);
  };

  /* Rating Handler  */

  const onClickRatingHandler = (
    value: string,
    key: string,
    isChecked: boolean,
    cat: keyof FilterState
  ) => {
    if (isChecked) {
      if (value === "5 stars") {
        setRating(5);
      } else if (value === "4 stars") {
        setRating(4);
      } else if (value === "3 starts") {
        setRating(3);
      }
    } else {
      setRating(undefined);
    }
    upDatedFilterStateHandle(cat, key);
  };

  /* ========================================= */

  /* Handle Clear All State */

  const onClickClearAllHandler = () => {
    // Clear UI States
    setFilterState(defaultFilterState);
    
    // Clear Set Data For API Body
    setGender([]);
    setDistance({
      max: undefined,
      min: undefined
    });
    setRating(undefined);
    setDate(new Date());
    setIsFavourite(false);
    setSelectedCategoryOption([]);
    setselectedHashtags([]);
    setIsFilter(false);
  };

  const searchFilterHandler = (search: string) => {
    setFilterState(filter => ({
      ...filter,
      search
    }));
  };

  const arrayWithoutFilter = [{
    label: "Near Me",
    onPress: () => {
      setSelectedGroupListType("nearby");
    }
  },
  {
    label: "Recommended",
    onPress: () => {
      setSelectedGroupListType("recommended");
    }
  },
  {
    label: "Personal",
    onPress: () => {
      setSelectedGroupListType("personal");
    }
  },]

  const arrayWithFilter = [{
    label: "Near Me",
    onPress: () => {
      setSelectedGroupListType("nearby");
    }
  },
  {
    label: "Recommended",
    onPress: () => {
      setSelectedGroupListType("recommended");
    }
  },
  {
    label: "Personal",
    onPress: () => {
      setSelectedGroupListType("personal");
    }
  },
  {
    label: "Filter",
    onPress: () => {
      setSelectedGroupListType("filter");
    }
  },]

  return (
    <>
      <View className={`gap-y-3 z-[1] px-cnt bg-white  ${ClassNames.OVERLAP} `}>
        <ButtonGroupSelector
           defaultSelected={
            selectedGroupListType === "nearby"
              ? 0
              : selectedGroupListType === "recommended"
              ? 1
              : selectedGroupListType === "filter"
              ? 2
              : 3
          }
          grow
          buttons={isFilter ? arrayWithFilter: arrayWithoutFilter}
        />

        <View className="h-9">
          {!searchBoxOpen && (
            <View className="flex flex-row items-center justify-between">
              <TouchableOpacity onPress={() => setSearchBoxOpen(true)}>
                <Ionicons
                  name="search"
                  size={Platform.OS === "ios" ? 28 : 24}
                  color={colors.greenYakka}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFilterModalOpen(true)}>
                <AntDesign
                  name="filter"
                  size={Platform.OS === "ios" ? 24 : 22}
                  color={colors.lightGrey}
                />
                <Text
                  size="sm"
                  style={{ color: colors.lightGrey, fontSize: 10 }}
                >
                  Filter
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TextInputWithVoice
            debounceTime={300}
            callbackDependencies={[filterState]}
            visible={searchBoxOpen}
            autoFocus
            onSearch={searchFilterHandler}
            onClosePress={() => setSearchBoxOpen(false)}
            placeholder="Search for a YAKKA"
          />
        </View>
      </View>
      <Modal
        animationIn={"slideInRight"}
        animationOut="slideOutRight"
        onBackdropPress={
          filterModalOpen ? () => setFilterModalOpen(false) : undefined
        }
        backdropOpacity={0}
        isVisible={filterModalOpen}
        style={{
          margin: 0
        }}
      >
        <View
          style={{ top: headerHeight }}
          className="bg-white pt-2 pb-2 w-full absolute self-end shadow-lg h-[100%]"
        >
          <View className="flex-row justify-between w-full px-cnt mb-3">
            {/* TODO:  A preset for white button with Shadow */}
            <View className="flex flex-row items-center gap-x-3">
              <TouchableOpacity onPress={() => onClickClearAllHandler()}>
                <Text preset="blue">Clear All</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.greyCircle}
              onPress={() => setFilterModalOpen(false)}
            >
              <Ionicons
                size={22}
                name="close"
                style={{ fontWeight: "bold" }}
                color={colors.dim}
              />
            </TouchableOpacity>
          </View>
          {isLoading ? (<View className="bg-white pt-2 pb-2 w-full absolute self-end shadow-lg h-[100%]"
        >
          <View className="flex-row align-middle justify-evenly">
            <ActivityIndicator size={100} color={colors.greenYakka} />
          </View>
        </View>) :(
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            className="w-full"
            extraScrollHeight={headerHeight + 20}
          >
            <TwoCols
              cols={[
                <>
                  <Text preset="blg">Gender</Text>
                  {Object.entries(filterState.genders).map(([key, gender]) => (
                    <Checkbox
                      key={key}
                      text={gender.label}
                      isChecked={gender.value}
                      onPress={isChecked =>
                        onClickGenderHandle(
                          gender.label,
                          key,
                          isChecked,
                          "genders"
                        )
                      }
                    />
                  ))}
                </>,
                <>
                  <Text preset="blg">Distance</Text>
                  {Object.entries(filterState.maxDistanceMiles).map(
                    ([key, distance]) => (
                      <Checkbox
                        key={key}
                        text={distance.label}
                        isChecked={distance.value}
                        onPress={isChecked =>
                          onClickDistancehandle(
                            distance.label,
                            key,
                            isChecked,
                            "maxDistanceMiles"
                          )
                        }
                      />
                    )
                  )}
                </>
              ]}
            />
            <TwoCols
              cols={[
                <>
                  <Text preset="blg">Rating</Text>
                  {Object.entries(filterState.minStarRating).map(
                    ([key, star]) => (
                      <Checkbox
                        key={key}
                        text={star.label}
                        isChecked={star.value}
                        onPress={isChecked =>
                          onClickRatingHandler(
                            star.label,
                            key,
                            isChecked,
                            "minStarRating"
                          )
                        }
                      />
                    )
                  )}
                </>
              ]}
            />
            <View className="px-cnt mt-4 mb-2">
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flex: 1
                }}
              >
                <Text className="mb-2 " preset="blg">
                  Date
                </Text>
                <DateTimePicker
                  disabled={!isDate}
                  value={date}
                  mode="date"
                  display="default"
                  onChange={value =>
                    onChangeDateHandle(
                      value?.nativeEvent?.timestamp
                        ? value.nativeEvent.timestamp
                        : 0
                    )
                  }
                />
                <Switch
                  className="ml-0.5"
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  trackColor={{ false: "#767577", true: "#03C04A" }}
                  thumbColor={isDate ? "#03C04A" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setIsDate(!isDate)}
                  value={isDate}
                />
              </View>
            </View>
            <View className="px-cnt mt-4 mb-2">
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flex: 1
                }}
              >
                <Text preset="blg">Favourites</Text>
                <Switch
                  className="ml-0.5"
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  trackColor={{ false: "#767577", true: "#03C04A" }}
                  thumbColor={isFavourite ? "#03C04A" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isFavourite}
                />
              </View>
            </View>
            <View className="px-cnt mt-2 z-[10]">
              <Text preset="blg">Categories</Text>

              <CustomDropdown
                options={categoryOptions}
                onSelect={value => setSelectedCategoryOption(value)}
                maximumSelect={10}
                placeHolder={"Select Categories"}
              />
            </View>
            <View className="px-cnt mt-4 z-[9]">
              <Text preset="blg">Hashtags</Text>
              <HashtagSearch
                zIndex={9}
                searchText={hashtagsSearchText}
                setSearchText={setHashtagsSearchText}
                selectedItems={selectedHashtags}
                setSelectedItems={setselectedHashtags}
              />
            </View>
            <View className="px-cnt mt-4 pb-10">
              <Button
                onPress={() => applyFiltersHandler()}
                preset="wide"
                text="Apply Selected"
              />
            </View>
            <View style={{ height: 80 }} />
          </KeyboardAwareScrollView>)}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  greyCircle: {
    backgroundColor: colors.lightGreyBorder,
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30
  }
});
