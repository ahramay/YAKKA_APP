import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useRef, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { VolumeManager } from "react-native-volume-manager";
import { Text } from "../../../components";
import Alarm from "../../../components/generics/Icons/Alarm";
import { SafetyInfoAccordion } from "../../../components/specifics/Safety/SafetyInfoAccordion";
import { colors, Layout } from "../../../constants";
import { DarkShadowStyle } from "../../../constants/CommonStyles";
import { HomeTabScreenProps } from "../../../navigation/navigation.props";

const AlarmSound = require("../../../../assets/audio/Alarm.mp3");

export default function SafetyScreen({
  navigation,
  route
}: HomeTabScreenProps<"Safety">) {
  const [Loaded, SetLoaded] = React.useState(false);
  const [Loading, SetLoading] = React.useState(false);
  const sound = React.useRef(new Audio.Sound());

  React.useEffect(() => {
    VolumeManager.showNativeVolumeUI({ enabled: true });

    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true
    });
    LoadAudio();
  }, []);

  const PlayAudio = async () => {
    try {
      // TODO:
      await VolumeManager.setVolume(1, {
        showUI: true
      }); // float value between 0 and 1

      const result = await sound.current.getStatusAsync();
      sound.current.setIsLoopingAsync(true);
      if (result.isLoaded) {
        if (result.isPlaying === false) {
          sound.current.playAsync();
        }
      }
    } catch (error) {}
  };

  const PauseAudio = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === true) {
          sound.current.pauseAsync();
        }
      }
    } catch (error) {}
  };

  const LoadAudio = async () => {
    SetLoading(true);
    const checkLoading = await sound.current.getStatusAsync();
    if (checkLoading.isLoaded === false) {
      try {
        const result = await sound.current.loadAsync(AlarmSound, {}, true);
        if (result.isLoaded === false) {
          SetLoading(false);
        } else {
          SetLoading(false);
          SetLoaded(true);
        }
      } catch (error) {
        SetLoading(false);
      }
    } else {
      SetLoading(false);
    }
  };
  const scrollRef = useRef<ScrollView>(null);
  const [scrollPos, setScrollPos] = useState(0);

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center", paddingTop: 64 }}
      onMomentumScrollEnd={e => {
        setScrollPos(e.nativeEvent.contentOffset.y);
      }}
      showsVerticalScrollIndicator={false}
      ref={scrollRef}
      style={{
        flex: 1,
        backgroundColor: colors.background,
        marginTop: -64
      }}
    >
      <Pressable
        style={{
          position: "absolute",
          top: 76,
          right: 15
        }}
        onPress={PauseAudio}
      >
        <TouchableOpacity
          style={{ alignItems: "center", flexDirection: "row" }}
        >
          <Text
            size="sm"
            color={colors.greyText}
            weight="500"
            style={{ letterSpacing: 0.5 }}
          >
            STOP{" "}
          </Text>
          <Ionicons name="stop-circle" size={32} color={colors.dim} />
        </TouchableOpacity>
      </Pressable>
      <Pressable
        style={[DarkShadowStyle, { marginTop: 40 }]}
        onPress={PlayAudio}
      >
        <Alarm />
      </Pressable>
      <Text color={colors.greyText} weight="500">
        Press for Alarm
      </Text>
      <SafetyInfoAccordion
        moveScrollPositionDown={(index: number) => {
          setTimeout(
            () =>
              scrollRef.current?.scrollTo({
                y:
                  scrollPos +
                  50 +
                  Math.abs(index * Layout.window.height * 0.05 - scrollPos),
                animated: true
              }),
            400
          );
        }}
      />
    </ScrollView>
  );
}
