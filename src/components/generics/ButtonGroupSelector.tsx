import React, { useEffect, useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Text } from "../defaults";

interface Props {
  buttons: {
    label: string;
    onPress: () => void;
  }[];
  grow?: boolean;
  defaultSelected?: number;
  // customSelect?: [number, (selected: number) => void];
}

export default function ButtonGroupSelector(props: Props) {
  const [selected, setSelected] = useState(props.defaultSelected || null);
  const onPress = (index: number) => {
    setSelected(index);
    props.buttons[index].onPress();
  };

  useEffect(() => {
    if (props.defaultSelected) {
      setSelected(props.defaultSelected);
    }
  }, [props.defaultSelected]);

  return (
    <View
      className={`flex-row items-center self-center  bg-gray-200 rounded-md p-[1px] shadow-sm ${
        props.grow && "w-full"
      }`}
    >
      {props.buttons.map((button, index) => {
        return (
          <TouchableOpacity
            key={"btn-" + index}
            className={`justify-center ${
              props.grow && "flex-grow"
            } items-center px-4 py-[8px] rounded-md  ${
              selected === index && "bg-white shadow-lg"
            }`}
            onPress={() => onPress(index)}
          >
            <Text
              style={selected === index && { fontFamily: "Roboto_900Black" }}
              size={"sm2"}
            >
              {button.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
