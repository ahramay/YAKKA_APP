import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import Collapsible from "react-native-collapsible";
import { FlatList } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { categoriesSchema } from "../../../../models";

const handleSelect = (
  checked: boolean,
  id: number,
  chosenInterests: number[],
  setChosenInterests: (ids: number[]) => void
) => {
  console.log("[🐔] - here be checked and interests", checked, chosenInterests);
  !checked
    ? setChosenInterests(chosenInterests.filter(val => val !== id))
    : setChosenInterests([...chosenInterests, id]);
};

const Interest = (props: {
  item: categoriesSchema["categories"][number]["categories"][number];
  chosenInterests: number[];
  color: string;
  setChosenInterests: (ids: number[]) => void;
}) => {
  return (
    <></>
    // <CheckboxListItem
    //   variant="circle"
    //   item={props.item}
    //   labelProp={"name"}
    //   containerStyle={{ backgroundColor: props.color }}
    //   checked={props.chosenInterests.includes(props.item.id)}
    //   onPress={checked =>
    //     handleSelect(
    //       checked,
    //       props.item.id,
    //       props.chosenInterests,
    //       props.setChosenInterests
    //     )
    //   }
    // />
  );
};

export const CollapsibleInterests = (props: {
  interest: categoriesSchema["categories"][number];
  chosenCategories: number[];
  color: string;
  setChosenCategories: (categories: number[]) => void;
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const rotation = useSharedValue(0);
  if (!collapsed) {
    rotation.value = withTiming(180);
  } else {
    rotation.value = withTiming(0);
  }
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }]
    };
  });
  return (
    <>
      <TouchableOpacity
        style={{
          paddingVertical: 16,
          marginBottom: 8,
          backgroundColor: props.color,
          flexDirection: "row",
          borderRadius: 8,
          paddingLeft: 15
        }}
        onPress={() => {
          setCollapsed(!collapsed);
          console.log("we be pressing", props.interest.name);
        }}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              right: 15,
              alignSelf: "center"
            },
            animatedStyle
          ]}
        >
          <Ionicons name="chevron-down" size={24} />
        </Animated.View>
        {/* <Text size="md">{props.interest.name}</Text> */}
      </TouchableOpacity>
      {/*@ts-expect-error*/}
      {/* <Collapsible collapsed={collapsed} renderChildrenCollapsed={false}>
        <FlatList
          data={props.interest.interests}
          style={{
            height: collapsed ? 70 : props.interest.interests.length * 48.25
          }}
          scrollEnabled={false}
          contentContainerStyle={{ paddingLeft: 15 }}
          renderItem={({ item }) => (
            <Interest
              item={item}
              color={props.color}
              chosenInterests={props.chosenInterests}
              setChosenInterests={props.setChosenInterests}
            />
          )}
        />
      </Collapsible> */}
    </>
  );
};
