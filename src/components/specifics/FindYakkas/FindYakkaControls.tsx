import Modal from "@euanmorgan/react-native-modal";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { scale } from "react-native-size-matters";
import { useRecoilValue } from "recoil";
import { colors } from "../../../constants";
import { ClassNames } from "../../../constants/ClassNames";
import useLocation from "../../../hooks/useLocation";
import { headerHeightAtom } from "../../../recoil/headerHeightAtom";
import { FindYakkaListType } from "../../../types/types";
import { Button, Text } from "../../defaults";
import TextInputWithVoice from "../../defaults/TextInput/TextInputWithVoice";
import ButtonGroupSelector from "../../generics/ButtonGroupSelector";
import { Checkbox } from "../../generics/Checkbox";
import HashtagSearch from "../Hashtags/HashtagSearch";
import InterestSearch from "../Interests/InterestSearch";

const width = Dimensions.get("window").width;

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
    Other: {
      label: "Other",
      value: false
    }
  },
  statuses: {
    AVAILABLE_TO_YAKKA: {
      label: "Available to YAKKA",
      value: false
    },
    AVAILABLE_TO_CHAT: {
      label: "Available to Chat",
      value: false
    },
    UNAVAILABLE: {
      label: "Unavailable",
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

export default function FindYakkaControls({
  setSelectedYakkaListType,
  setFilterQueryParams,
  selectedYakkaListType
}: {
  setSelectedYakkaListType: (type: FindYakkaListType) => void;
  setFilterQueryParams: (params?: string) => void;
  selectedYakkaListType: FindYakkaListType;
}) {
  const firstRender = useRef(true);

  const {
    getLocation,
    locationMutation,
    isLoading: isLocationLoading
  } = useLocation();

  const handleRefreshLocation = async () => {
    const location = await getLocation();
    if (location) {
      locationMutation.mutate(location);
    }
  };

  const [searchBoxOpen, setSearchBoxOpen] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const headerHeight = useRecoilValue(headerHeightAtom);

  const [filterState, setFilterState] = useState(defaultFilterState);

  const [interestsSearchText, setInterestsSearchText] = useState<string>("");
  const [hashtagsSearchText, setHashtagsSearchText] = useState<string>("");

  const [selectedInterests, setselectedInterests] = useState<any[]>([]);
  const [selectedHashtags, setselectedHashtags] = useState<any[]>([]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    applyFiltersHandler();
  }, [filterState.search]);

  const applyFiltersHandler = (search?: string) => {
    // Build up query string
    const query = Object.entries(filterState).reduce((acc, [key, value]) => {
      const checked = Object.entries(value).filter(
        ([_, { value }]) => value === true
      );
      if (checked.length > 0) {
        acc[key] = checked.map(([key]) => key);
      }
      console.log("ac",acc)
      return acc;
    }, {} as any);

    if (selectedInterests.length > 0) {
      query["interests"] = selectedInterests.map(({ id }) => id);
    }

    if (selectedHashtags.length > 0) {
      query["hashtags"] = selectedHashtags.map(({ id }) => id);
    }

    if (search || filterState.search) {
      query["search"] = search || filterState.search;
    }

    setFilterQueryParams(query);
    setFilterModalOpen(false);
  };

  const searchFilterHandler = (search: string) => {
    setFilterState(filter => ({
      ...filter,
      search
    }));
  };

  return (
    <>
      <View className={`gap-y-3 z-[1] px-cnt bg-white  ${ClassNames.OVERLAP} `}>
        <ButtonGroupSelector
          defaultSelected={
            selectedYakkaListType === "nearby"
              ? 0
              : selectedYakkaListType === "recommended"
              ? 1
              : 2
          }
          grow
          buttons={[
            {
              label: "Near Me",
              onPress: () => {
                setSelectedYakkaListType("nearby");
              }
            },
            {
              label: "Recommended",
              onPress: () => {
                setSelectedYakkaListType("recommended");
              }
            },
            {
              label: "Friends",
              onPress: () => {
                setSelectedYakkaListType("friends");
              }
            }
          ]}
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
          className="bg-white pt-4 w-full absolute self-end shadow-lg h-[100%]"
        >
          <View className="flex-row justify-between w-full px-cnt mb-5">
            {/* TODO:  A preset for white button with Shadow */}
            <View className="flex flex-row items-center gap-x-3">
              <TouchableOpacity
                onPress={() => {
                  setFilterState(defaultFilterState);
                  setselectedHashtags([]);
                  setselectedInterests([]);
                  setInterestsSearchText("");
                  setHashtagsSearchText("");
                  setFilterQueryParams(undefined);
                  // setFilterModalOpen(false);
                }}
              >
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
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            className="w-full"
            extraScrollHeight={headerHeight + 20}
          >
            <TwoCols
              cols={[
                <>
                  <Text preset="blg">Gender</Text>
                  {(
                    Object.keys(
                      defaultFilterState.genders
                    ) as (keyof typeof filterState.genders)[]
                  ).map(g => {
                    const gender = filterState.genders[g];
                    return (
                      <Checkbox
                        key={g}
                        text={gender.label}
                        isChecked={gender.value}
                        onPress={isChecked => {
                          setFilterState({
                            ...filterState,
                            genders: {
                              ...filterState.genders,
                              [g]: {
                                ...gender,
                                value: isChecked
                              }
                            }
                          });
                        }}
                      />
                    );
                  })}
                </>,
                <>
                  <Text preset="blg">Status</Text>

                  {(
                    Object.keys(
                      defaultFilterState.statuses
                    ) as (keyof typeof filterState.statuses)[]
                  ).map(s => {
                    const status = filterState.statuses[s];
                    return (
                      <Checkbox
                        key={s}
                        text={status.label}
                        isChecked={status.value}
                        onPress={isChecked => {
                          setFilterState({
                            ...filterState,

                            statuses: {
                              ...filterState.statuses,
                              [s]: {
                                ...status,
                                value: isChecked
                              }
                            }
                          });
                        }}
                      />
                    );
                  })}
                </>
              ]}
            />
            <TwoCols
              cols={[
                <>
                  <Text preset="blg">Rating</Text>
                  {(
                    Object.keys(
                      filterState.minStarRating
                    ) as (keyof typeof filterState.minStarRating)[]
                  )
                    .reverse()
                    .map(r => {
                      const rating = filterState.minStarRating[r];
                      return (
                        <Checkbox
                          key={r}
                          text={rating.label}
                          isChecked={rating.value}
                          onPress={isChecked => {
                            //  Set all other ratings to false
                            const newFilterState = {
                              ...filterState,
                              minStarRating: {
                                ...filterState.minStarRating,
                                [r]: {
                                  ...rating,
                                  value: isChecked
                                }
                              }
                            };
                            Object.keys(newFilterState.minStarRating).forEach(
                              key => {
                                if (key !== r) {
                                  // @ts-ignore
                                  newFilterState.minStarRating[key].value =
                                    false;
                                }
                              }
                            );
                            setFilterState(newFilterState);
                          }}
                        />
                      );
                    })}
                </>,
                <>
                  <Text preset="blg">Distance</Text>
                  {(
                    Object.keys(
                      filterState.maxDistanceMiles
                    ) as (keyof typeof filterState.maxDistanceMiles)[]
                  ).map(d => {
                    const distance = filterState.maxDistanceMiles[d];
                    return (
                      <Checkbox
                        key={d}
                        text={distance.label}
                        isChecked={distance.value}
                        onPress={isChecked => {
                          const newFilterState = {
                            ...filterState,
                            maxDistanceMiles: {
                              ...filterState.maxDistanceMiles,
                              [d]: {
                                ...distance,
                                value: isChecked
                              }
                            }
                          };
                          Object.keys(newFilterState.maxDistanceMiles).forEach(
                            key => {
                              if (key !== d) {
                                // @ts-ignore
                                newFilterState.maxDistanceMiles[key].value =
                                  false;
                              }
                            }
                          );
                          setFilterState(newFilterState);
                        }}
                      />
                    );
                  })}
                </>
              ]}
            />
            <View className="px-cnt mt-2 z-[10]">
              <Text preset="blg">Interests</Text>

              <InterestSearch
                zIndex={10}
                searchText={interestsSearchText}
                setSearchText={setInterestsSearchText}
                selectedItems={selectedInterests}
                setSelectedItems={setselectedInterests}
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
            <View className="px-cnt mt-12">
              <Button
                onPress={() => applyFiltersHandler()}
                preset="wide"
                text="Apply Selected"
              />
            </View>
            <View style={{ height: 80 }} />
          </KeyboardAwareScrollView>
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
