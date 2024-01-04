import { Entypo, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { useQuery } from "react-query";
import { colors } from "../../../constants";
import { ShadowStyle } from "../../../constants/CommonStyles";
import { QueryKeys } from "../../../constants/queryKeys";
import { goFetchLite } from "../../../utils/goFetchLite";
import { Text } from "../../defaults";
import { Tick } from "../../generics/Icons/Tick";

interface safetyInfo {
  title: string;
  content: string;
  icon: "do" | "don't";
  id: number;
}

interface SafetyInfoProps {
  moveScrollPositionDown: (number: number) => void;
}
export const SafetyInfoAccordion = ({
  moveScrollPositionDown
}: SafetyInfoProps) => {
  const [activeChosenSections, setActiveChosenSections] = useState<number[]>(
    []
  );

  const { data, isLoading } = useQuery<{ items: safetyInfo[] }>(
    QueryKeys.SAFETY_INFO,
    () => goFetchLite("content/safety", { method: "GET" }),
    {}
  );

  const Icon = (props: { icon: "do" | "don't" }) => {
    switch (props.icon) {
      case "don't":
        return (
          <View
            style={{
              position: "absolute",
              borderRadius: 100,
              left: 15,
              alignSelf: "center",
              width: 30,
              height: 30,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.red
            }}
          >
            <Entypo color={colors.background} name="cross" size={24} />
          </View>
        );
      case "do":
        return (
          <View
            style={{
              position: "absolute",
              borderRadius: 100,
              left: 15,
              alignSelf: "center",
              width: 30,
              height: 30,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.greenYakka
            }}
          >
            <Tick dimmed svgProps={{ height: 30, width: 30 }} />
          </View>
        );
    }
  };
  // const safetyInfoArray: safetyInfo[] = [
  //   {
  //     id: 0,
  //     title: "Always meet in a public place",
  //     icon: "do",
  //     content:
  //       "Meet in a café, restaurant or bar and somewhere where you feel safe. You can let someone who works there know you are meeting someone for the first time."
  //   },
  //   {
  //     id: 1,
  //     title: "Always tell someone where you are",
  //     icon: "do",
  //     content:
  //       "Let a friend or relative know what you are doing and who you are meeting. Let them know you are safe afterwards and how it went."
  //   },
  //   {
  //     id: 3,
  //     title: "Always trust your instinct and ask for help",
  //     icon: "do",
  //     content:
  //       "If something doesn’t seem right or you are feeling uncomfortable, its ok to leave. Asking for help from someone who works at the venue is always a good option."
  //   },
  //   {
  //     id: 4,
  //     title: "Don't leave food or drink unattended",
  //     icon: "don't",
  //     content:
  //       "Never leave a drink or food unattended. If you need to go the bathroom, try to do so between drinks or courses. If something doesn’t seem right or tastes different, trust your instinct and leave the item and report it to staff."
  //   },
  //   {
  //     id: 5,
  //     title: "Don't share too much personal information",
  //     icon: "don't",
  //     content:
  //       "Enjoy your YAKKA but don’t share too much intimate details. Don’t give out your address or place of work and don’t give the other person any money."
  //   },
  //   {
  //     id: 6,
  //     title: "Don't get intoxicated or use drugs",
  //     icon: "don't",
  //     content:
  //       "You can make poor decisions whilst under the influence of drink or drugs. If you suspect the person you are meeting is under the influence of alcohol or drugs, you should leave and let someone know when you are safe."
  //   }
  // ];

  const RenderHeader = (props: { section: safetyInfo; isActive: boolean }) => {
    const rotation = useSharedValue(0);
    if (props.isActive) {
      rotation.value = withTiming(180);
    }
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotateZ: `${rotation.value}deg` }]
      };
    });

    return (
      <View
        style={{
          ...ShadowStyle,
          paddingVertical: 15,
          marginBottom: 5,
          backgroundColor: colors.chatBoxBackground,
          flexDirection: "row",
          borderRadius: 9,
          justifyContent: "center"
        }}
      >
        <Icon icon={props.section.icon} />
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
          <Ionicons name="chevron-down" size={30} />
        </Animated.View>
        <Text style={styles.title} size="lg">
          {props.section.title}
        </Text>
      </View>
    );
  };
  const RenderContent = (props: { section: safetyInfo }) => (
    <View
      style={{
        paddingTop: 10,
        paddingLeft: 10,
        maxHeight: 200
      }}
    >
      <Text color={colors.greyText}>{props.section.content}</Text>
    </View>
  );

  return (
    <>
      {!isLoading && data !== undefined && (
        <Accordion
          sections={data.items}
          activeSections={activeChosenSections}
          onChange={indexes => {
            setActiveChosenSections(indexes);
            if (indexes.length > 0) {
              moveScrollPositionDown(indexes[0]);
            }
          }}
          underlayColor={colors.transparent}
          containerStyle={{
            width: "87.5%",
            paddingTop: 20
          }}
          sectionContainerStyle={{
            width: "100%",
            maxHeight: 200,
            marginBottom: 15
          }}
          renderContent={section => <RenderContent section={section} />}
          renderHeader={(section, _, isActive) => (
            <RenderHeader section={section} isActive={isActive} />
          )}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    textAlign: "center",
    width: "55%",
    textAlignVertical: "center"
  }
});
