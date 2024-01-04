import { View, TouchableOpacity } from "react-native";
import React from "react";
import useAudioRecorder from "../../../hooks/useAudioRecorder";
import { Slider } from "@miblanchard/react-native-slider";
import { Ionicons } from "@expo/vector-icons";
import useAudioPlayer from "../../../hooks/useAudioPlayer";
import { Text } from "../../defaults";
import { colors } from "../../../constants";

export default function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const {
    playSound,
    currentPositionSeconds,
    totalDurationSeconds,
    isPlaying,
    stopSound,
    seekTo
  } = useAudioPlayer(audioUrl);

  return (
    <View className="w-full flex-row items-center gap-x-2">
      {isPlaying ? (
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => {
            stopSound();
          }}
        >
          <Ionicons name="pause" size={24} color="black" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => {
            playSound();
          }}
        >
          <Ionicons name="play" size={24} color="black" />
        </TouchableOpacity>
      )}

      <View className="flex-1">
        <Slider
          disabled={!isPlaying}
          value={currentPositionSeconds || 0}
          onSlidingComplete={value =>
            seekTo(typeof value === "number" ? value : value[0])
          }
          minimumValue={0}
          maximumValue={totalDurationSeconds ? totalDurationSeconds : 1}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
      </View>
    </View>
  );
}
